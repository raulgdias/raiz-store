"use client";

import type { CategoryDto, ProductDto, ProductFilters } from "@raizstore/contracts";
import { Search, SlidersHorizontal, Sparkles, Sprout } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { ProductCard } from "./product-card";

const parseReais = (value: string): number | undefined => {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : undefined;
};

export function Storefront() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async (activeFilters: ProductFilters) => {
    setLoading(true);
    setError("");
    try {
      setProducts(await api.listProducts(activeFilters));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void api.listCategories().then(setCategories).catch(() => setCategories([]));
    void api
      .listProducts({})
      .then(setProducts)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Não foi possível carregar os produtos.")
      )
      .finally(() => setLoading(false));
  }, [loadProducts]);

  const applyFilters = () => {
    const minPriceInCents = parseReais(minPrice);
    const maxPriceInCents = parseReais(maxPrice);
    const nextFilters: ProductFilters = {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(minPriceInCents !== undefined ? { minPriceInCents } : {}),
      ...(maxPriceInCents !== undefined ? { maxPriceInCents } : {}),
      ...(filters.onPromotion ? { onPromotion: true } : {})
    };
    setFilters(nextFilters);
    void loadProducts(nextFilters);
  };

  const selectCategory = (category?: string) => {
    const nextFilters: ProductFilters = {
      ...filters,
      ...(category ? { category } : {})
    };
    if (!category) delete nextFilters.category;
    setFilters(nextFilters);
    void loadProducts(nextFilters);
  };

  return (
    <>
      <section className="page-shell pt-8 sm:pt-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1e4d3a] px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="absolute -right-14 -top-24 size-80 rounded-full border-[54px] border-[#b7e36d]/15" />
          <Sprout className="absolute bottom-5 right-8 text-[#b7e36d]/25" size={150} strokeWidth={1} />
          <div className="relative max-w-2xl">
            <span className="eyebrow !text-[#b7e36d]">Coleção essencial</span>
            <h1 className="mt-4 text-4xl font-black leading-[1.04] tracking-[-0.055em] sm:text-6xl">
              Objetos para viver e aprender melhor.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Uma curadoria enxuta de tecnologia, casa e leitura. Este é um laboratório completo de
              e-commerce, mas as boas escolhas são bem reais.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell mt-8" aria-label="Filtros do catálogo">
        <div className="card rounded-[1.4rem] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
            <label className="relative">
              <span className="sr-only">Buscar produtos</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#68736d]" size={17} />
              <input
                className="field !pl-11"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && applyFilters()}
                placeholder="O que você procura?"
              />
            </label>
            <label>
              <span className="sr-only">Preço mínimo em reais</span>
              <input
                className="field lg:w-36"
                inputMode="decimal"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="Mín. R$"
              />
            </label>
            <label>
              <span className="sr-only">Preço máximo em reais</span>
              <input
                className="field lg:w-36"
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Máx. R$"
              />
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#dedcd2] bg-white px-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={filters.onPromotion ?? false}
                onChange={(event) => setFilters((current) => ({ ...current, onPromotion: event.target.checked }))}
                className="accent-[#1e4d3a]"
              />
              <Sparkles size={15} className="text-[#ef7b45]" />
              Promoções
            </label>
            <button className="button-primary" type="button" onClick={applyFilters}>
              <SlidersHorizontal size={17} />
              Filtrar
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            className={filters.category ? "button-secondary whitespace-nowrap" : "button-primary whitespace-nowrap"}
            onClick={() => selectCategory()}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                filters.category === category.slug
                  ? "button-primary whitespace-nowrap"
                  : "button-secondary whitespace-nowrap"
              }
              onClick={() => selectCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="page-shell mt-8" aria-live="polite">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Feitos para o seu ritmo</h2>
          </div>
          {!loading && <span className="text-sm text-[#68736d]">{products.length} produtos</span>}
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-[1.65rem] bg-white/65" />
            ))}
          </div>
        )}
        {error && <div className="card rounded-2xl p-6 text-[#a83f25]">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="card rounded-[1.5rem] p-10 text-center">
            <Sprout className="mx-auto mb-3 text-[#1e4d3a]" />
            <h3 className="font-black">Nenhum produto por aqui</h3>
            <p className="mt-1 text-sm text-[#68736d]">Ajuste os filtros e tente novamente.</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
