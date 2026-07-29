import type {
  CategoryDto,
  ProductDto,
  PromotionDto,
} from "@raizstore/contracts";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateCategoryCommand,
  CreateProductCommand,
  CreatePromotionCommand,
  ListCategoriesQuery,
  ListProductsQuery,
  UpdateProductPriceCommand,
} from "../application/catalog.messages";
import { JwtAuthGuard } from "../../identity/presentation/jwt-auth.guard";
import { RolesGuard } from "../../identity/presentation/roles.guard";
import { Roles } from "../../identity/presentation/roles.decorator";
import {
  CreateCategoryDto,
  CreateProductDto,
  CreatePromotionDto,
  ProductFiltersDto,
  UpdateProductPriceDto,
} from "./catalog.dto";

@ApiTags("Catálogo")
@Controller("catalog")
export class CatalogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get("categories")
  @ApiOperation({ summary: "Listar categorias" })
  @ApiOkResponse()
  listCategories(): Promise<CategoryDto[]> {
    return this.queryBus.execute<ListCategoriesQuery, CategoryDto[]>(
      new ListCategoriesQuery(),
    );
  }

  @Get("products")
  @ApiOperation({ summary: "Listar e filtrar produtos" })
  @ApiOkResponse()
  listProducts(@Query() filters: ProductFiltersDto): Promise<ProductDto[]> {
    return this.queryBus.execute<ListProductsQuery, ProductDto[]>(
      new ListProductsQuery(filters),
    );
  }

  @Post("categories")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar categoria (admin)" })
  @ApiCreatedResponse()
  createCategory(@Body() body: CreateCategoryDto): Promise<CategoryDto> {
    return this.commandBus.execute<CreateCategoryCommand, CategoryDto>(
      new CreateCategoryCommand(body.name),
    );
  }

  @Post("products")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar produto (admin)" })
  @ApiCreatedResponse()
  createProduct(@Body() body: CreateProductDto): Promise<ProductDto> {
    return this.commandBus.execute<CreateProductCommand, ProductDto>(
      new CreateProductCommand(body),
    );
  }

  @Patch("products/:id/price")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Alterar preço de produto (admin)" })
  @ApiOkResponse()
  updatePrice(
    @Param("id") productId: string,
    @Body() body: UpdateProductPriceDto,
  ): Promise<ProductDto> {
    return this.commandBus.execute<UpdateProductPriceCommand, ProductDto>(
      new UpdateProductPriceCommand(productId, body.priceInCents),
    );
  }

  @Post("promotions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar promoção para produtos (admin)" })
  @ApiCreatedResponse()
  createPromotion(@Body() body: CreatePromotionDto): Promise<PromotionDto> {
    return this.commandBus.execute<CreatePromotionCommand, PromotionDto>(
      new CreatePromotionCommand(body),
    );
  }
}
