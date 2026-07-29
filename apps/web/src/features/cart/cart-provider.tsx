"use client";

import type { ProductDto } from "@raizstore/contracts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "raizstore-cart";

export interface CartItem {
  product: ProductDto;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalInCents: number;
  add(product: ProductDto): void;
  update(productId: string, quantity: number): void;
  remove(productId: string): void;
  clear(): void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (value) {
        try {
          setItems(JSON.parse(value) as CartItem[]);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    };
    queueMicrotask(hydrate);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((product: ProductDto) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) return [...current, { product, quantity: 1 }];
      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.product.stock) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalInCents = items.reduce(
    (total, item) => total + item.product.finalPriceInCents * item.quantity,
    0
  );
  const contextValue = useMemo(
    () => ({ items, itemCount, totalInCents, add, update, remove, clear }),
    [items, itemCount, totalInCents, add, update, remove, clear]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider.");
  return context;
}
