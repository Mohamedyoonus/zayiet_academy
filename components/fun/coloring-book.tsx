"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Shuffle, Undo2 } from "lucide-react";
import { coloringPages, type ColoringPage } from "@/lib/coloring-pages";
import { cn } from "@/lib/utils";
import Palette, { PALETTE } from "./palette";
import ToolButton from "./tool-button";

type Fills = Record<string, string>;
type HistoryEntry = { regionId: string; prev?: string } | { reset: Fills };

const OUTLINE = "#2A2E28";
const BLANK = "#FFFFFF";

function Picture({
  page,
  fills,
  onFill,
  svgRef,
  className,
}: {
  page: ColoringPage;
  fills: Fills;
  onFill?: (regionId: string) => void;
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
}) {
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 300"
      className={className}
      role={onFill ? "img" : undefined}
      aria-label={onFill ? `${page.title} coloring page` : undefined}
      aria-hidden={onFill ? undefined : true}
    >
      {page.regions.map((r) => (
        <motion.path
          key={r.id}
          d={r.d}
          initial={false}
          animate={{ fill: fills[r.id] ?? BLANK }}
          transition={{ duration: 0.25 }}
          stroke={OUTLINE}
          strokeWidth={3}
          strokeLinejoin="round"
          onClick={onFill ? () => onFill(r.id) : undefined}
          className={onFill ? "cursor-pointer transition-opacity hover:opacity-85" : undefined}
        />
      ))}
      {page.details.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={OUTLINE}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="none"
        />
      ))}
      {page.ink?.map((d, i) => <path key={i} d={d} fill={OUTLINE} pointerEvents="none" />)}
    </svg>
  );
}

async function downloadSvgAsPng(svg: SVGSVGElement, filename: string) {
  const markup = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.src = url;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = BLANK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  const a = document.createElement("a");
  a.download = filename;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

export default function ColoringBook() {
  const [pageId, setPageId] = useState(coloringPages[0].id);
  const [color, setColor] = useState(PALETTE[0]);
  // Fills and undo history are kept per picture, so switching pictures keeps progress
  const [fills, setFills] = useState<Record<string, Fills>>({});
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  const page = coloringPages.find((p) => p.id === pageId)!;
  const pageFills = fills[pageId] ?? {};
  const pageHistory = history[pageId] ?? [];

  const pushHistory = (entry: HistoryEntry) =>
    setHistory((h) => ({ ...h, [pageId]: [...(h[pageId] ?? []), entry].slice(-50) }));

  const fillRegion = (regionId: string) => {
    if (pageFills[regionId] === color) return;
    pushHistory({ regionId, prev: pageFills[regionId] });
    setFills((f) => ({ ...f, [pageId]: { ...pageFills, [regionId]: color } }));
  };

  const undo = () => {
    const last = pageHistory[pageHistory.length - 1];
    if (!last) return;
    setHistory((h) => ({ ...h, [pageId]: pageHistory.slice(0, -1) }));
    if ("reset" in last) {
      setFills((f) => ({ ...f, [pageId]: last.reset }));
      return;
    }
    const next = { ...pageFills };
    if (last.prev) next[last.regionId] = last.prev;
    else delete next[last.regionId];
    setFills((f) => ({ ...f, [pageId]: next }));
  };

  const replaceAll = (next: Fills) => {
    pushHistory({ reset: pageFills });
    setFills((f) => ({ ...f, [pageId]: next }));
  };

  const surprise = () => {
    const colors = PALETTE.slice(0, 12);
    replaceAll(
      Object.fromEntries(page.regions.map((r) => [r.id, colors[Math.floor(Math.random() * colors.length)]]))
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8">
      <div className="min-w-0">
        {/* Canvas */}
        <div className="overflow-hidden rounded-4xl border border-sage-200/60 bg-white p-2 shadow-md sm:p-3">
          <Picture page={page} fills={pageFills} onFill={fillRegion} svgRef={svgRef} className="h-auto w-full" />
        </div>

        {/* Tools */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          <ToolButton onClick={undo} disabled={!pageHistory.length} icon={Undo2} label="Undo" />
          <ToolButton onClick={surprise} icon={Shuffle} label="Surprise me" />
          <ToolButton
            onClick={() => replaceAll({})}
            disabled={!Object.keys(pageFills).length}
            icon={RotateCcw}
            label="Start over"
          />
          <ToolButton
            onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current, `zayit-${page.id}.png`)}
            icon={Download}
            label="Download"
            primary
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Picture chooser */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Choose a picture</h3>
          <div className="mt-3 grid grid-cols-4 gap-2 lg:grid-cols-2">
            {coloringPages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPageId(p.id)}
                aria-pressed={p.id === pageId}
                className={cn(
                  "overflow-hidden rounded-2xl border-2 bg-white p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                  p.id === pageId ? "border-sage-500 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                )}
              >
                <Picture page={p} fills={fills[p.id] ?? {}} className="h-auto w-full" />
                <span className="mt-1 block truncate text-[11px] font-medium text-charcoal-600">{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Pick a color</h3>
          <Palette value={color} onChange={setColor} className="mt-3" />
          <p className="mt-3 text-sm text-charcoal-500">Tap any part of the picture to fill it.</p>
        </div>
      </div>
    </div>
  );
}
