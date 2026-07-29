"use client";

import type { CategoryDto, ProductDto } from "@raizstore/contracts";
import { Boxes, CircleDollarSign, FolderTree, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { CategoryForm } from "./category-form";
import { PriceForm } from "./price-form";
import { ProductForm } from "./product-form";
import { PromotionForm } from "./promotion-form";

export function AdminDashboard({ token }: Readonly<{ token: string }>) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const [nextCategories, nextProducts] = await Promise.all([
      api.listCategories(),
      api.listProducts()
    ]);
    setCategories(nextCategories);
    setProducts(nextProducts);
  }, []);

  useEffect(() => {
    void Promise.all([api.listCategories(), api.listProducts()])
      .then(([nextCategories, nextProducts]) => {
        setCategories(nextCategories);
        setProducts(nextProducts);
      })
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Erro ao carregar dados.")
      );
  }, []);

  const handleSaved = async (message: string) => {
    setError("");
    setNotice(message);
    await refresh();
  };

  const handleError = (message: string) => {
    setNotice("");
    setError(message);
  };

  const activePromotions = products.filter((product) => product.promotion).length;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Produtos", value: products.length, icon: Boxes },
          { label: "Categorias", value: categories.length, icon: FolderTree },
          { label: "Em promoção", value: activePromotions, icon: CircleDollarSign }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4 rounded-[1.3rem] p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-[#dfe5c4] text-[#1e4d3a]">
              <Icon size={20} />
            </span>
            <div>
              <strong className="block text-2xl">{value}</strong>
              <span className="text-sm text-[#68736d]">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {(notice || error) && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm font-bold ${
            error ? "bg-[#ef7b45]/10 text-[#a83f25]" : "bg-[#b7e36d]/20 text-[#1e4d3a]"
          }`}
          role="status"
        >
          {error || notice}
        </div>
      )}

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
        <ProductForm categories={categories} token={token} onSaved={handleSaved} onError={handleError} />
        <div className="grid gap-5">
          <CategoryForm token={token} onSaved={handleSaved} onError={handleError} />
          <PriceForm products={products} token={token} onSaved={handleSaved} onError={handleError} />
        </div>
        <div className="lg:col-span-2">
          <PromotionForm products={products} token={token} onSaved={handleSaved} onError={handleError} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#1e4d3a] p-4 text-sm text-white/75">
        <Sparkles size={16} className="text-[#b7e36d]" />
        Toda alteração passa pela API, por Commands CQRS e pelos repositórios abstraídos.
      </div>
    </>
  );
}
