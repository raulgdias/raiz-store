import { DomainError } from "../../shared/domain/domain.error";
import { Money } from "../../shared/domain/money";

export class Product {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: Money,
    public readonly stock: number,
  ) {}

  static create(input: {
    name: string;
    description: string;
    priceInCents: number;
    stock: number;
  }): Product {
    const name = input.name.trim();
    const description = input.description.trim();
    if (name.length < 2)
      throw new DomainError("Informe um nome de produto válido.", "VALIDATION");
    if (description.length < 10) {
      throw new DomainError(
        "A descrição deve ter pelo menos 10 caracteres.",
        "VALIDATION",
      );
    }
    if (!Number.isInteger(input.stock) || input.stock < 0) {
      throw new DomainError(
        "O estoque deve ser um inteiro não negativo.",
        "VALIDATION",
      );
    }
    return new Product(
      name,
      description,
      Money.fromCents(input.priceInCents),
      input.stock,
    );
  }
}
