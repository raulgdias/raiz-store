import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { IdentityController } from "./identity/presentation/identity.controller";
import { LoginHandler } from "./identity/application/login.handler";
import { CatalogController } from "./catalog/presentation/catalog.controller";
import {
  CreateCategoryHandler,
  CreateProductHandler,
  CreatePromotionHandler,
  ListCategoriesHandler,
  ListProductsHandler,
  UpdateProductPriceHandler,
} from "./catalog/application/catalog.handlers";
import { SalesController } from "./sales/presentation/sales.controller";
import {
  CheckoutHandler,
  ListMyOrdersHandler,
} from "./sales/application/sales.handlers";
import { PrismaService } from "./shared/infrastructure/prisma.service";
import {
  CATALOG_REPOSITORY,
  ORDER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_ISSUER,
  TOKEN_VERIFIER,
  USER_REPOSITORY,
} from "./shared/infrastructure/tokens";
import { PrismaUserRepository } from "./identity/infrastructure/prisma-user.repository";
import { BcryptPasswordHasher } from "./identity/infrastructure/bcrypt-password-hasher";
import { JwtTokenService } from "./identity/infrastructure/jwt-token.service";
import { PrismaCatalogRepository } from "./catalog/infrastructure/prisma-catalog.repository";
import { PrismaOrderRepository } from "./sales/infrastructure/prisma-order.repository";
import { JwtAuthGuard } from "./identity/presentation/jwt-auth.guard";
import { RolesGuard } from "./identity/presentation/roles.guard";

const commandAndQueryHandlers = [
  LoginHandler,
  ListCategoriesHandler,
  ListProductsHandler,
  CreateCategoryHandler,
  CreateProductHandler,
  UpdateProductPriceHandler,
  CreatePromotionHandler,
  CheckoutHandler,
  ListMyOrdersHandler,
];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "development-only-secret",
      signOptions: { expiresIn: "8h" },
    }),
  ],
  controllers: [IdentityController, CatalogController, SalesController],
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaCatalogRepository,
    PrismaOrderRepository,
    BcryptPasswordHasher,
    JwtTokenService,
    JwtAuthGuard,
    RolesGuard,
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    { provide: CATALOG_REPOSITORY, useExisting: PrismaCatalogRepository },
    { provide: ORDER_REPOSITORY, useExisting: PrismaOrderRepository },
    { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER, useExisting: JwtTokenService },
    { provide: TOKEN_VERIFIER, useExisting: JwtTokenService },
    ...commandAndQueryHandlers,
  ],
})
export class AppModule {}
