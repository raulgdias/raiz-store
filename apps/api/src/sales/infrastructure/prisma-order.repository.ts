import type { CheckoutItemRequest, OrderDto } from "@raizstore/contracts";
import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { DomainError } from "../../shared/domain/domain.error";
import { Money } from "../../shared/domain/money";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { Order } from "../domain/order";
import type { OrderRepository } from "../domain/order.repository";

const orderInclude = { items: true } satisfies Prisma.OrderInclude;
type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const mapOrder = (order: OrderWithItems): OrderDto => ({
  id: order.id,
  status: "CONFIRMED",
  totalInCents: order.totalInCents,
  createdAt: order.createdAt.toISOString(),
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    unitPriceInCents: item.unitPriceInCents,
    quantity: item.quantity,
    subtotalInCents: item.subtotalInCents,
  })),
});

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(
    userId: string,
    items: CheckoutItemRequest[],
  ): Promise<OrderDto> {
    const quantities = new Map<string, number>();
    for (const item of items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    return this.prisma.$transaction(async (transaction) => {
      const now = new Date();
      const products = await transaction.product.findMany({
        where: { id: { in: [...quantities.keys()] } },
        include: {
          promotions: {
            where: {
              promotion: { startsAt: { lte: now }, endsAt: { gte: now } },
            },
            include: { promotion: true },
          },
        },
      });
      if (products.length !== quantities.size) {
        throw new DomainError(
          "Um ou mais produtos não foram encontrados.",
          "NOT_FOUND",
        );
      }

      const domainOrder = Order.create(
        products.map((product) => {
          const quantity = quantities.get(product.id) ?? 0;
          if (product.stock < quantity) {
            throw new DomainError(
              `Estoque insuficiente para ${product.name}.`,
              "CONFLICT",
            );
          }
          const discount = product.promotions
            .map(({ promotion }) => promotion.discountPercentage)
            .sort((a, b) => b - a)[0];
          const price = discount
            ? Money.fromCents(product.priceInCents).applyPercentageDiscount(
                discount,
              ).inCents
            : product.priceInCents;
          return {
            productId: product.id,
            productName: product.name,
            unitPriceInCents: price,
            quantity,
          };
        }),
      );

      for (const line of domainOrder.lines) {
        const updated = await transaction.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count !== 1) {
          throw new DomainError(
            `O estoque de ${line.productName} acabou de mudar.`,
            "CONFLICT",
          );
        }
      }

      const order = await transaction.order.create({
        data: {
          userId,
          totalInCents: domainOrder.totalInCents,
          items: {
            create: domainOrder.lines.map((line) => ({
              productId: line.productId,
              productName: line.productName,
              unitPriceInCents: line.unitPriceInCents,
              quantity: line.quantity,
              subtotalInCents: line.unitPriceInCents * line.quantity,
            })),
          },
        },
        include: orderInclude,
      });
      return mapOrder(order);
    });
  }

  async listByUser(userId: string): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return orders.map(mapOrder);
  }
}
