"use client";

import type { ProductDto } from "@raizstore/contracts";
import { ArrowRight, Leaf, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

const categoryColors: Record<string, string> = {
  tecnologia: "from-[#d8eaf0] to-[#a9cad4]",
  casa: "from-[#f1dfc4] to-[#dcbf94]",
  livros: "from-[#dfe5c4] to-[#bdcb8b]"
};

export function ProductCard({ product }: Readonly<{ product: ProductDto }>) {
  const { add } = useCart();
  const gradient = categoryColors[product.category.slug] ?? "from-[#e3ddd0] to-[#cbbda5]";

  return (
    <article className="card group overflow-hidden rounded-[1.65rem]">
      <div className={`relative grid aspect-[4/3] place-items-center bg-gradient-to-br ${gradient}`}>
        {product.imageUrl ? (
          // URLs são cadastradas pelo administrador e podem apontar para qualquer CDN de estudo.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <Leaf
            className="text-[#1e4d3a]/70 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            size={62}
            strokeWidth={1.3}
            aria-hidden
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-extrabold text-[#1e4d3a] backdrop-blur">
          {product.category.name}
        </span>
        {product.promotion && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#ef7b45] px-3 py-1 text-xs font-extrabold text-white">
            <Sparkles size={13} />
            -{product.promotion.discountPercentage}%
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-[-0.035em]">{product.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#68736d]">{product.description}</p>
          </div>
          <ArrowRight className="mt-1 shrink-0 text-[#1e4d3a]/40" size={19} />
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-black/8 pt-4">
          <div>
            {product.promotion && (
              <span className="block text-xs text-[#68736d] line-through">
                {formatCurrency(product.priceInCents)}
              </span>
            )}
            <strong className="text-lg text-[#1e4d3a]">{formatCurrency(product.finalPriceInCents)}</strong>
            <span className="ml-2 text-xs text-[#68736d]">{product.stock} em estoque</span>
          </div>
          <button
            type="button"
            className="button-primary !size-11 !p-0"
            onClick={() => add(product)}
            disabled={product.stock === 0}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
