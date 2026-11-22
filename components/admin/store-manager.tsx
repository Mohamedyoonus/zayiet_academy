"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ChevronDown, CircleAlert, ImageOff, Plus, Star, Trash2 } from "lucide-react";
import { saveStore } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/image-upload";
import SaveBar from "@/components/admin/save-bar";
import { useConfirm } from "@/components/admin/confirm";
import { useToast } from "@/components/admin/toast";
import { Card, Field, Toggle, buttonClass, inputClass } from "@/components/admin/ui";
import {
  LIMITS,
  PRODUCT_CATEGORIES,
  STOCK_OPTIONS,
  normalizeStore,
  storeProblem,
  type StoreContent,
  type StoreProduct,
} from "@/lib/store";
import { cn, formatINR } from "@/lib/utils";

const newId = () => `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const blankProduct = (): StoreProduct => ({
  id: newId(),
  name: "",
  category: "materials",
  price: 0,
  oldPrice: null,
  image: "",
  summary: "",
  details: "",
  includes: [],
  stock: "in-stock",
  featured: false,
  visible: true,
});
/** Whole rupees from what's typed (digits only) */
const rupees = (value: string) => Number(value.replace(/\D/g, "").slice(0, 7)) || 0;

const iconButton =
  "grid h-9 w-9 place-items-center rounded-lg text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:pointer-events-none disabled:opacity-30";

function Problem({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {message}
    </p>
  );
}

export default function StoreManager({ initial }: { initial: StoreContent }) {
  const [store, setStore] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [problem, setProblem] = useState<{ id: string | null; message: string } | null>(null);
  const [saving, startSaving] = useTransition();
  const confirm = useConfirm();
  const toast = useToast();
  const dirty = JSON.stringify(store) !== JSON.stringify(saved);
  const { products } = store;

  const update = (id: string, patch: Partial<StoreProduct>) =>
    setStore((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const setKit = (patch: Partial<StoreContent["kit"]>) => setStore((s) => ({ ...s, kit: { ...s.kit, ...patch } }));
  const move = (index: number, dir: -1 | 1) =>
    setStore((s) => {
      const next = [...s.products];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];
      return { ...s, products: next };
    });

  const add = () => {
    const product = blankProduct();
    setStore((s) => ({ ...s, products: [product, ...s.products] }));
    setOpenId(product.id);
  };

  const remove = async (product: StoreProduct) => {
    const ok = await confirm({
      title: `Delete “${product.name || "this product"}”?`,
      message: "It disappears from the store once you save. Its photo is deleted too.",
    });
    if (!ok) return;
    setStore((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== product.id),
      kit: s.kit.productId === product.id ? { ...s.kit, productId: "" } : s.kit,
    }));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    // Check what was typed (tidying would quietly drop e.g. an old price below the price),
    // then the tidied version the server will get
    const clean = normalizeStore(store)!;
    const found = storeProblem(store) ?? storeProblem(clean);
    if (found) {
      const id = found.index === null ? null : clean.products[found.index].id;
      setProblem({ id, message: found.message });
      if (id) setOpenId(id);
      return toast.error(found.message);
    }
    setProblem(null);
    startSaving(async () => {
      const result = await saveStore(clean);
      if (!result.ok) return toast.error(result.error);
      setStore(clean);
      setSaved(clean);
      toast.success("Saved — the Store page is updated.");
    });
  };

  const shownCount = products.filter((p) => p.visible).length;

  return (
    <form onSubmit={save} className="mx-auto max-w-5xl space-y-5 pb-24">
      {/* ------------------------------------ Products ------------------------------------ */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-charcoal-100 pb-3">
          <div>
            <h2 className="font-display text-lg text-charcoal-900">Products</h2>
            <p className="mt-0.5 text-xs text-charcoal-500">
              {products.length} products · {shownCount} on the website. The order here is the order on the Store page.
            </p>
          </div>
          <button type="button" onClick={add} className={buttonClass.primary}>
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>

        {products.length === 0 && (
          <p className="rounded-xl border border-dashed border-charcoal-200 px-4 py-10 text-center text-sm text-charcoal-500">
            No products yet. Add your first one.
          </p>
        )}

        <ul className="space-y-3">
          {products.map((p, i) => {
            const open = openId === p.id;
            const category = PRODUCT_CATEGORIES.find((c) => c.id === p.category)?.label;
            const stock = STOCK_OPTIONS.find((s) => s.id === p.stock)?.label;
            return (
              <li
                key={p.id}
                className={cn("rounded-2xl border transition-colors", open ? "border-sage-300 bg-sage-50/40" : "border-charcoal-100")}
              >
                {/* Summary row */}
                <div className="flex items-center gap-3 p-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-charcoal-50">
                    {p.image ? (
                      <Image src={p.image} alt="" fill sizes="3rem" className="object-cover" />
                    ) : (
                      <ImageOff className="absolute inset-0 m-auto h-4 w-4 text-charcoal-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : p.id)}
                    aria-expanded={open}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-charcoal-900">
                      {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
                      <span className="truncate">{p.name || "Untitled product"}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-charcoal-500">
                      {category} · {p.price ? formatINR(p.price) : "No price"} · {stock}
                      {!p.visible && <span className="ml-1.5 rounded-full bg-charcoal-100 px-1.5 py-0.5 text-[10px] font-semibold text-charcoal-600">Hidden</span>}
                    </p>
                  </button>
                  <div className="hidden shrink-0 items-center sm:flex">
                    <button type="button" aria-label={`Move ${p.name || "product"} up`} disabled={i === 0} onClick={() => move(i, -1)} className={iconButton}>
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label={`Move ${p.name || "product"} down`} disabled={i === products.length - 1} onClick={() => move(i, 1)} className={iconButton}>
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={open ? "Close" : `Edit ${p.name || "product"}`}
                    onClick={() => setOpenId(open ? null : p.id)}
                    className={iconButton}
                  >
                    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                  </button>
                </div>

                {/* Editor */}
                {open && (
                  <div className="space-y-4 border-t border-charcoal-100 p-4">
                    {problem?.id === p.id && <Problem message={problem.message} />}

                    <ImageUpload
                      value={p.image}
                      onChange={(url) => update(p.id, { image: url })}
                      folder="store"
                      aspect="aspect-[4/5]"
                      compact
                      hint="A clear photo on a plain background works best. Shown in a 4:5 frame."
                    />

                    <Field label="Name">
                      <input value={p.name} maxLength={LIMITS.name} onChange={(e) => update(p.id, { name: e.target.value })} className={inputClass} />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Category">
                        <select
                          value={p.category}
                          onChange={(e) => update(p.id, { category: e.target.value as StoreProduct["category"] })}
                          className={inputClass}
                        >
                          {PRODUCT_CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Stock">
                        <select
                          value={p.stock}
                          onChange={(e) => update(p.id, { stock: e.target.value as StoreProduct["stock"] })}
                          className={inputClass}
                        >
                          {STOCK_OPTIONS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Price (₹)">
                        <input
                          inputMode="numeric"
                          value={p.price || ""}
                          onChange={(e) => update(p.id, { price: rupees(e.target.value) })}
                          placeholder="e.g. 1299"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Old price (₹)" hint="Optional. Higher than the price — shown crossed out with the % off.">
                        <input
                          inputMode="numeric"
                          value={p.oldPrice ?? ""}
                          onChange={(e) => update(p.id, { oldPrice: rupees(e.target.value) || null })}
                          placeholder="Leave empty for no discount"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label="Short summary" hint="One line on the product card.">
                      <input value={p.summary} maxLength={LIMITS.summary} onChange={(e) => update(p.id, { summary: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Description" hint="Shown when a customer opens the product. Leave an empty line between paragraphs.">
                      <textarea
                        value={p.details}
                        rows={4}
                        maxLength={LIMITS.details}
                        onChange={(e) => update(p.id, { details: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="What’s included" hint="Optional. One item per line.">
                      <textarea
                        value={p.includes.join("\n")}
                        rows={4}
                        onChange={(e) => update(p.id, { includes: e.target.value.split("\n") })}
                        className={inputClass}
                      />
                    </Field>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal-100 pt-3">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-700">
                        <label className="flex items-center gap-2">
                          <Toggle on={p.visible} onChange={(on) => update(p.id, { visible: on })} label="Show on the website" />
                          On the website
                        </label>
                        <label className="flex items-center gap-2">
                          <Toggle on={p.featured} onChange={(on) => update(p.id, { featured: on })} label="Featured" onText="Yes" offText="No" />
                          Featured
                        </label>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Phones: reorder from here (the arrows in the row are desktop-only) */}
                        <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={cn(iconButton, "sm:hidden")}>
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label="Move down" disabled={i === products.length - 1} onClick={() => move(i, 1)} className={cn(iconButton, "sm:hidden")}>
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => remove(p)} className={buttonClass.danger}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* --------------------------------- Store settings --------------------------------- */}
      <Card className="space-y-4">
        <div className="border-b border-charcoal-100 pb-3">
          <h2 className="font-display text-lg text-charcoal-900">Store settings</h2>
          <p className="mt-0.5 text-xs text-charcoal-500">Shown on the Store page around the products.</p>
        </div>
        {problem && problem.id === null && <Problem message={problem.message} />}

        <Field label="Delivery & pickup note" hint="Optional. Shown above the products, e.g. “Pick up from our Bangalore studio, or we deliver across India.”">
          <textarea
            value={store.note}
            rows={2}
            maxLength={LIMITS.note}
            onChange={(e) => setStore((s) => ({ ...s, note: e.target.value }))}
            className={inputClass}
          />
        </Field>

        <div className="space-y-4 rounded-2xl border border-charcoal-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-charcoal-900">Materials Kit section</p>
              <p className="text-xs text-charcoal-500">The highlighted kit below the products.</p>
            </div>
            <Toggle on={store.kit.show} onChange={(on) => setKit({ show: on })} label="Show the Materials Kit section" />
          </div>
          {store.kit.show && (
            <>
              <Field label="Title">
                <input value={store.kit.title} maxLength={LIMITS.name} onChange={(e) => setKit({ title: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Text">
                <textarea value={store.kit.description} rows={2} onChange={(e) => setKit({ description: e.target.value })} className={inputClass} />
              </Field>
              <Field label="What’s in the kit" hint="One item per line.">
                <textarea value={store.kit.items.join("\n")} rows={5} onChange={(e) => setKit({ items: e.target.value.split("\n") })} className={inputClass} />
              </Field>
              <Field label="Product the button adds to the bag" hint="Its price is shown on the button.">
                <select value={store.kit.productId} onChange={(e) => setKit({ productId: e.target.value })} className={inputClass}>
                  <option value="">No button</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || "Untitled product"}
                      {p.price ? ` — ${formatINR(p.price)}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
        </div>
      </Card>

      <SaveBar dirty={dirty} saving={saving} viewHref="/store" viewLabel="View Store page" />
    </form>
  );
}
