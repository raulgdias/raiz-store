import { DomainError } from "../../shared/domain/domain.error";

export interface OrderLine {
  productId: string;
  productName: string;
  unitPriceInCents: number;
  quantity: number;
}

export class Order {
  readonly totalInCents: number;

  private constructor(public readonly lines: OrderLine[]) {
    this.totalInCents = lines.reduce(
      (total, line) => total + line.unitPriceInCents * line.quantity,
      0,
    );
  }

  static create(lines: OrderLine[]): Order {
    if (lines.length === 0) {
      throw new DomainError("O carrinho está vazio.", "VALIDATION");
    }
    if (
      lines.some(
        (line) => !Number.isInteger(line.quantity) || line.quantity < 1,
      )
    ) {
      throw new DomainError(
        "As quantidades do pedido são inválidas.",
        "VALIDATION",
      );
    }
    return new Order(lines);
  }
}
