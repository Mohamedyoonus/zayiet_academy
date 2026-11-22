"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StoreProduct } from "@/lib/store";

// The store's shopping bag, kept in this browser so it survives a reload.
// Items whose product was deleted, hidden or sold out drop out by themselves.

type Line = { id: string; qty: number };

const KEY = "zayit-bag";
export const MAX_QTY = 20;

const read = (): Line[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((l) => typeof l?.id === "string" && Number(l?.qty) > 0) : [];
  } catch {
    return [];
  }
};
const write = (lines: Line[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private browsing or storage turned off: the bag still works until the page is closed
  }
};

export const canOrder = (p: StoreProduct) => p.visible && p.stock !== "sold-out";

export function useBag(products: StoreProduct[]) {
  const [lines, setLines] = useState<Line[]>([]);
  // Read after loading, so the server's page and the browser's first paint match
  useEffect(() => setLines(read()), []);

  const change = useCallback((update: (lines: Line[]) => Line[]) => {
    setLines((current) => {
      const next = update(current)
        .map((l) => ({ ...l, qty: Math.min(MAX_QTY, Math.max(0, Math.round(l.qty))) }))
        .filter((l) => l.qty > 0);
      write(next);
      return next;
    });
  }, []);

  const items = useMemo(
    () =>
      lines.flatMap((l) => {
        const product = products.find((p) => p.id === l.id);
        return product && canOrder(product) ? [{ product, qty: l.qty }] : [];
      }),
    [lines, products]
  );

  return {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0),
    total: items.reduce((sum, i) => sum + i.qty * i.product.price, 0),
    qtyOf: (id: string) => items.find((i) => i.product.id === id)?.qty ?? 0,
    add: (id: string, qty = 1) =>
      change((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, qty }])),
    setQty: (id: string, qty: number) => change((ls) => ls.map((l) => (l.id === id ? { ...l, qty } : l))),
    remove: (id: string) => change((ls) => ls.filter((l) => l.id !== id)),
    clear: () => change(() => []),
  };
}
