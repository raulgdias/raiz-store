"use client";

import type { OrderDto } from "@raizstore/contracts";
import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { api } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/format";

export default function OrdersPage() {
  const { session, hydrated } = useAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !session) return;
    void api
      .listMyOrders(session.accessToken)
      .then(setOrders)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Erro ao carregar pedidos."))
      .finally(() => setLoading(false));
  }, [hydrated, session]);

  const isLoading = !hydrated || (Boolean(session) && loading);

  return (
    <section className="page-shell py-10">
      <span className="eyebrow">Histórico</span>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.055em]">Meus pedidos</h1>
      {isLoading && <p className="mt-8 text-[#68736d]">Carregando pedidos...</p>}
      {!isLoading && !session && (
        <div className="card mt-8 rounded-2xl p-8">
          <p>Entre na sua conta para consultar os pedidos.</p>
          <Link href="/login" className="button-primary mt-5">Entrar</Link>
        </div>
      )}
      {error && <p className="mt-8 text-[#a83f25]" role="alert">{error}</p>}
      {!isLoading && session && orders.length === 0 && !error && (
        <div className="card mt-8 rounded-2xl p-8 text-[#68736d]">Você ainda não fez nenhum pedido.</div>
      )}
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="card rounded-[1.5rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#dedcd2] pb-4">
              <div className="flex gap-3">
                <PackageCheck className="text-[#1e4d3a]" />
                <div>
                  <h2 className="font-black">Pedido #{order.id.slice(0, 8)}</h2>
                  <p className="text-sm text-[#68736d]">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <strong className="text-lg text-[#1e4d3a]">{formatCurrency(order.totalInCents)}</strong>
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.quantity}× {item.productName}</span>
                  <span className="text-[#68736d]">{formatCurrency(item.subtotalInCents)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
