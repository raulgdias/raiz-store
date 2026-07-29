"use client";

import type { ProductDto } from "@raizstore/contracts";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import { AdminFormShell } from "./admin-form-shell";

interface PriceFormProps {
  products: ProductDto[];
  token: string;
  onSaved(message: string): Promise<void>;
  onError(message: string): void;
}

export function PriceForm({ products, token, onSaved, onError }: Readonly<PriceFormProps>) {
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    try {
      await api.updateProductPrice(
        String(data.get("productId")),
        { priceInCents: Math.round(Number(data.get("price")) * 100) },
        token
      );
      form.reset();
      await onSaved("Preço alterado com sucesso.");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Erro ao alterar preço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell title="Alterar preço" description="Atualize o preço-base; promoções continuam calculadas à parte.">
      <form onSubmit={submit} className="grid gap-4">
        <label className="label">
          Produto
          <select className="field" name="productId" required>
            <option value="">Selecione</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · {formatCurrency(product.priceInCents)}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          Novo preço (R$)
          <input className="field" name="price" type="number" min="0" step="0.01" required />
        </label>
        <button className="button-primary" disabled={loading || products.length === 0} type="submit">
          {loading ? "Atualizando..." : "Atualizar preço"}
        </button>
      </form>
    </AdminFormShell>
  );
}
