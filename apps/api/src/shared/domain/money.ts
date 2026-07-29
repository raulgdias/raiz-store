import { DomainError } from "./domain.error";

export class Money {
  private constructor(public readonly inCents: number) {}

  static fromCents(value: number): Money {
    if (!Number.isInteger(value) || value < 0) {
      throw new DomainError(
        "O valor monetário deve ser um inteiro não negativo.",
        "VALIDATION",
      );
    }
    return new Money(value);
  }

  applyPercentageDiscount(percentage: number): Money {
    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 99) {
      throw new DomainError(
        "O desconto deve estar entre 1 e 99.",
        "VALIDATION",
      );
    }
    return Money.fromCents(Math.round(this.inCents * (1 - percentage / 100)));
  }
}
