"use client";

import Link from "next/link";
import { LogIn, LogOut, PackageSearch, Settings, ShoppingBag } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { useCart } from "@/features/cart/cart-provider";

export function SiteHeader() {
  const { session, hydrated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f6f3eb]/90 backdrop-blur-xl">
      <div className="page-shell flex min-h-18 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3" aria-label="RaizStore, página inicial">
          <span className="grid size-10 place-items-center rounded-[1rem] bg-[#1e4d3a] text-[#b7e36d]">
            <PackageSearch size={21} strokeWidth={2.4} />
          </span>
          <span>
            <strong className="block text-[1.02rem] leading-tight tracking-[-0.03em]">RaizStore</strong>
            <span className="block text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#68736d]">
              Escolhas com propósito
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="button-secondary !min-h-10 !px-3">
              <Settings size={17} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {session && (
            <Link href="/pedidos" className="button-secondary !min-h-10 !px-3">
              <span className="hidden sm:inline">Pedidos</span>
              <span className="sm:hidden">Meus</span>
            </Link>
          )}
          <Link href="/carrinho" className="button-secondary relative !min-h-10 !px-3">
            <ShoppingBag size={17} />
            <span className="hidden sm:inline">Carrinho</span>
            {itemCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-[#ef7b45] px-1 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
          {hydrated &&
            (session ? (
              <button onClick={logout} className="button-secondary !min-h-10 !px-3" type="button">
                <LogOut size={17} />
                <span className="hidden md:inline">{session.user.username}</span>
              </button>
            ) : (
              <Link href="/login" className="button-primary !min-h-10 !px-3">
                <LogIn size={17} />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}
