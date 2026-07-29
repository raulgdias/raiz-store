"use client";

import type { ProductDto } from "@raizstore/contracts";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api/client";
import { AdminFormShell } from "./admin-form-shell";

interface PromotionFormProps {
  products: ProductDto[];
  token: string;
  onSaved(message: string): Promise<void>;
  onError(message: string): void;
}

export function PromotionForm({
  products,
  token,
  onSaved,
  onError
}: Readonly<PromotionFormProps>) {
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    try {
      await api.createPromotion(
        {
          name: String(data.get("name") ?? ""),
          discountPercentage: Number(data.get("discount")),
          startsAt: new Date(String(data.get("startsAt"))).toISOString(),
          endsAt: new Date(String(data.get("endsAt"))).toISOString(),
          productIds: data.getAll("productIds").map(String)
        },
        token
      );
      form.reset();
      await onSaved("Promoção criada e aplicada aos produtos.");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Erro ao criar promoção.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell title="Nova promoção" description="Aplique um desconto temporário a um ou mais produtos.">
      <form onSubmit={submit} className="grid gap-4">
        <label className="label">
          Nome da campanha
          <input className="field" name="name" minLength={2} required />
        </label>
        <label className="label">
          Desconto (%)
          <input className="field" name="discount" type="number" min="1" max="99" step="1" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="label">
            Início
            <input className="field" name="startsAt" type="datetime-local" required />
          </label>
          <label className="label">
            Término
            <input className="field" name="endsAt" type="datetime-local" required />
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-[#435049]">Produtos</legend>
          <div className="max-h-44 space-y-2 overflow-auto rounded-xl border border-[#dedcd2] bg-white p-3">
            {products.map((product) => (
              <label key={product.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="productIds" value={product.id} className="accent-[#1e4d3a]" />
                {product.name}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button-primary" disabled={loading || products.length === 0} type="submit">
          {loading ? "Criando..." : "Criar promoção"}
        </button>
      </form>
    </AdminFormShell>
  );
}
