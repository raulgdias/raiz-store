import { Order } from "./order";

describe("Order", () => {
  it("calcula o total usando preço e quantidade", () => {
    const order = Order.create([
      {
        productId: "p1",
        productName: "Produto",
        unitPriceInCents: 1250,
        quantity: 2,
      },
    ]);
    expect(order.totalInCents).toBe(2500);
  });

  it("não permite pedido vazio", () => {
    expect(() => Order.create([])).toThrow("carrinho está vazio");
  });
});
