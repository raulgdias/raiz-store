"use client";

import type { CategoryDto } from "@raizstore/contracts";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api/client";
import { AdminFormShell } from "./admin-form-shell";

interface ProductFormProps {
  categories: CategoryDto[];
  token: string;
  onSaved(message: string): Promise<void>;
  onError(message: string): void;
}

export function ProductForm({
  categories,
  token,
  onSaved,
  onError
}: Readonly<ProductFormProps>) {
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    try {
      await api.createProduct(
        {
          name: String(data.get("name") ?? ""),
          description: String(data.get("description") ?? ""),
          priceInCents: Math.round(Number(data.get("price")) * 100),
          stock: Number(data.get("stock")),
          categoryId: String(data.get("categoryId") ?? ""),
          ...(data.get("imageUrl") ? { imageUrl: String(data.get("imageUrl")) } : {}),
          featured: data.get("featured") === "on"
        },
        token
      );
      form.reset();
      await onSaved("Produto criado e publicado na loja.");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Erro ao criar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell title="Novo produto" description="Cadastre informações, preço e disponibilidade.">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="label sm:col-span-2">
          Nome
          <input className="field" name="name" minLength={2} required />
        </label>
        <label className="label sm:col-span-2">
          Descrição
          <textarea className="field min-h-24 resize-y" name="description" minLength={10} required />
        </label>
        <label className="label">
          Preço (R$)
          <input className="field" name="price" type="number" min="0" step="0.01" required />
        </label>
        <label className="label">
          Estoque
          <input className="field" name="stock" type="number" min="0" step="1" required />
        </label>
        <label className="label">
          Categoria
          <select className="field" name="categoryId" required>
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="label">
          URL da imagem (opcional)
          <input className="field" name="imageUrl" type="url" placeholder="https://..." />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold sm:col-span-2">
          <input name="featured" type="checkbox" className="accent-[#1e4d3a]" />
          Destacar produto na vitrine
        </label>
        <button className="button-primary sm:col-span-2" disabled={loading || categories.length === 0} type="submit">
          {loading ? "Publicando..." : "Publicar produto"}
        </button>
      </form>
    </AdminFormShell>
  );
}
