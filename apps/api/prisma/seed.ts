import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {
  const [adminHash, customerHash] = await Promise.all([
    bcrypt.hash("admin123", 12),
    bcrypt.hash("cliente123", 12)
  ]);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash: adminHash, role: Role.ADMIN },
    create: { username: "admin", passwordHash: adminHash, role: Role.ADMIN }
  });
  await prisma.user.upsert({
    where: { username: "cliente" },
    update: { passwordHash: customerHash, role: Role.CUSTOMER },
    create: { username: "cliente", passwordHash: customerHash, role: Role.CUSTOMER }
  });
}

async function seedCatalog(): Promise<void> {
  const technology = await prisma.category.upsert({
    where: { slug: "tecnologia" },
    update: {},
    create: { name: "Tecnologia", slug: "tecnologia" }
  });
  const home = await prisma.category.upsert({
    where: { slug: "casa" },
    update: {},
    create: { name: "Casa", slug: "casa" }
  });
  const books = await prisma.category.upsert({
    where: { slug: "livros" },
    update: {},
    create: { name: "Livros", slug: "livros" }
  });

  const products = [
    {
      name: "Fone Orbit",
      description: "Fone sem fio confortável, com som equilibrado para trabalho e estudo.",
      priceInCents: 24990,
      stock: 18,
      featured: true,
      categoryId: technology.id
    },
    {
      name: "Luminária Halo",
      description: "Luz regulável e acolhedora para mesa, leitura ou home office.",
      priceInCents: 15990,
      stock: 24,
      featured: true,
      categoryId: home.id
    },
    {
      name: "Clean Architecture",
      description: "Uma referência prática para estudar limites, dependências e design de software.",
      priceInCents: 11990,
      stock: 14,
      featured: false,
      categoryId: books.id
    },
    {
      name: "Teclado Pulse",
      description: "Teclado compacto silencioso, com conexão Bluetooth e bateria duradoura.",
      priceInCents: 32990,
      stock: 9,
      featured: true,
      categoryId: technology.id
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  const promotedProduct = await prisma.product.findFirst({ where: { name: "Fone Orbit" } });
  const existingPromotion = await prisma.promotion.findFirst({ where: { name: "Semana do estudo" } });
  if (promotedProduct && !existingPromotion) {
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(endsAt.getDate() + 30);
    await prisma.promotion.create({
      data: {
        name: "Semana do estudo",
        discountPercentage: 15,
        startsAt: now,
        endsAt,
        products: { create: [{ productId: promotedProduct.id }] }
      }
    });
  }
}

async function main(): Promise<void> {
  await seedUsers();
  await seedCatalog();
}

main()
  .then(() => console.info("Seed concluído."))
  .finally(async () => prisma.$disconnect());
