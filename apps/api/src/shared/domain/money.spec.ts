import { Money } from "./money";

describe("Money", () => {
  it("aplica desconto percentual e arredonda em centavos", () => {
    expect(Money.fromCents(999).applyPercentageDiscount(15).inCents).toBe(849);
  });

  it("rejeita valores negativos", () => {
    expect(() => Money.fromCents(-1)).toThrow("inteiro não negativo");
  });
});
