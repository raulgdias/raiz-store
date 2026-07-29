"use client";

import Link from "next/link";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { useCart } from "@/features/cart/cart-provider";
import { api } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { session } = useAuth();
  const { items, totalInCents, update, remove, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const checkout = async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const order = await api.checkout(
        { items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })) },
        session.accessToken
      );
      setOrderId(order.id);
      clear();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível finalizar a compra.");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <section className="page-shell grid min-h-[60vh] place-items-center py-14">
        <div className="card max-w-lg rounded-[2rem] p-10 text-center">
          <CheckCircle2 className="mx-auto text-[#1e4d3a]" size={54} />
          <h1 className="mt-5 text-3xl font-black tracking-[-0.05em]">Compra confirmada!</h1>
          <p className="mt-3 text-[#68736d]">
            Pedido <strong className="text-[#16211b]">#{orderId.slice(0, 8)}</strong> criado com
            sucesso. O estoque já foi atualizado.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link className="button-secondary" href="/pedidos">Ver pedidos</Link>
            <Link className="button-primary" href="/">Continuar comprando</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell py-10">
      <span className="eyebrow">Sua seleção</span>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.055em]">Carrinho</h1>

      {items.length === 0 ? (
        <div className="card mt-8 rounded-[2rem] p-12 text-center">
          <ShoppingBag className="mx-auto text-[#1e4d3a]/45" size={52} />
          <h2 className="mt-5 text-xl font-black">Seu carrinho está leve</h2>
          <p className="mt-2 text-[#68736d]">Explore o catálogo e encontre algo útil para você.</p>
          <Link href="/" className="button-primary mt-6">Ver produtos</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="grid gap-3">
            {items.map(({ product, quantity }) => (
              <article key={product.id} className="card flex flex-col gap-4 rounded-[1.4rem] p-5 sm:flex-row sm:items-center">
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#dfe5c4] text-[#1e4d3a]">
                  <ShoppingBag size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black">{product.name}</h2>
                  <p className="mt-1 text-sm text-[#68736d]">
                    {formatCurrency(product.finalPriceInCents)} cada
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border border-[#dedcd2] bg-white p-1">
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full hover:bg-[#f6f3eb]"
                      onClick={() => update(product.id, quantity - 1)}
                      aria-label={`Diminuir quantidade de ${product.name}`}
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center text-sm font-black">{quantity}</span>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full hover:bg-[#f6f3eb]"
                      onClick={() => update(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      aria-label={`Aumentar quantidade de ${product.name}`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong className="w-28 text-right">
                    {formatCurrency(product.finalPriceInCents * quantity)}
                  </strong>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full text-[#a83f25] hover:bg-[#ef7b45]/10"
                    onClick={() => remove(product.id)}
                    aria-label={`Remover ${product.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="card h-fit rounded-[1.6rem] p-6">
            <h2 className="text-xl font-black">Resumo</h2>
            <div className="mt-6 flex justify-between border-b border-[#dedcd2] pb-5 text-sm text-[#68736d]">
              <span>{items.length} tipos de produto</span>
              <span>Frete grátis</span>
            </div>
            <div className="flex items-end justify-between py-6">
              <span className="font-bold">Total</span>
              <strong className="text-2xl text-[#1e4d3a]">{formatCurrency(totalInCents)}</strong>
            </div>
            {error && <p className="mb-4 text-sm font-semibold text-[#a83f25]" role="alert">{error}</p>}
            {session ? (
              <button className="button-primary w-full" onClick={checkout} disabled={loading} type="button">
                {loading ? "Confirmando..." : "Finalizar compra"}
              </button>
            ) : (
              <Link href="/login" className="button-primary w-full">Entre para finalizar</Link>
            )}
            <button className="mt-3 w-full text-sm font-bold text-[#68736d]" onClick={clear} type="button">
              Limpar carrinho
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
