"use client";

import { useEffect, useRef, useState } from "react";
import { Brush, Download, Eraser, Rainbow, Stamp, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Palette, { PALETTE } from "./palette";
import ToolButton from "./tool-button";

// Fixed internal resolution; the canvas is scaled to fit its container with CSS
const W = 1200;
const H = 900;
const PAPER = "#FFFFFF";

type Tool = "brush" | "rainbow" | "eraser" | "stamp";
type Point = { x: number; y: number };
type Stroke = { tool: Tool; color: string; size: number; hue0: number; stamp: string; points: Point[] };
type Action = Stroke | "clear";

const SIZES = [
  { label: "Small", px: 6 },
  { label: "Medium", px: 14 },
  { label: "Large", px: 28 },
  { label: "Huge", px: 48 },
];

const STAMPS = ["⭐", "❤️", "🌸", "🦋", "🌈", "☀️", "🐟", "🎨"];

function strokeColor(s: Stroke, i: number) {
  if (s.tool === "eraser") return PAPER;
  if (s.tool === "rainbow") return `hsl(${(s.hue0 + i * 6) % 360} 85% 58%)`;
  return s.color;
}

function drawDot(ctx: CanvasRenderingContext2D, s: Stroke) {
  const p = s.points[0];
  if (s.tool === "stamp") {
    ctx.font = `${s.size * 3}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.stamp, p.x, p.y);
    return;
  }
  ctx.fillStyle = strokeColor(s, 0);
  ctx.beginPath();
  ctx.arc(p.x, p.y, s.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSegment(ctx: CanvasRenderingContext2D, s: Stroke, i: number) {
  const a = s.points[i - 1];
  const b = s.points[i];
  ctx.strokeStyle = strokeColor(s, i);
  ctx.lineWidth = s.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
  drawDot(ctx, s);
  if (s.tool === "stamp") return;
  for (let i = 1; i < s.points.length; i++) drawSegment(ctx, s, i);
}

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const actions = useRef<Action[]>([]);
  const current = useRef<Stroke | null>(null);
  const hue = useRef(0);

  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState(PALETTE[6]);
  const [size, setSize] = useState(SIZES[1].px);
  const [stamp, setStamp] = useState(STAMPS[0]);
  const [actionCount, setActionCount] = useState(0);

  const ctx = () => canvasRef.current!.getContext("2d")!;

  const clearPaper = (c: CanvasRenderingContext2D) => {
    c.fillStyle = PAPER;
    c.fillRect(0, 0, W, H);
  };

  const redraw = () => {
    const c = ctx();
    clearPaper(c);
    for (const a of actions.current) {
      if (a === "clear") clearPaper(c);
      else drawStroke(c, a);
    }
  };

  useEffect(() => {
    clearPaper(ctx());
  }, []);

  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const commit = (action: Action) => {
    actions.current.push(action);
    setActionCount(actions.current.length);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const stroke: Stroke = { tool, color, size, hue0: hue.current, stamp, points: [toCanvas(e)] };
    drawDot(ctx(), stroke);
    if (tool === "stamp") {
      commit(stroke);
      return;
    }
    current.current = stroke;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = current.current;
    if (!s) return;
    s.points.push(toCanvas(e));
    drawSegment(ctx(), s, s.points.length - 1);
  };

  const handlePointerUp = () => {
    const s = current.current;
    if (!s) return;
    current.current = null;
    // Next rainbow stroke continues where this one's colors left off
    hue.current = (s.hue0 + s.points.length * 6) % 360;
    commit(s);
  };

  const undo = () => {
    actions.current.pop();
    setActionCount(actions.current.length);
    redraw();
  };

  const clearAll = () => {
    commit("clear");
    clearPaper(ctx());
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = "zayit-my-drawing.png";
    a.href = canvasRef.current!.toDataURL("image/png");
    a.click();
  };

  const lastIsClear = actions.current[actions.current.length - 1] === "clear";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8">
      <div className="min-w-0">
        <div className="overflow-hidden rounded-4xl border border-sage-200/60 bg-white p-2 shadow-md sm:p-3">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "block aspect-[4/3] h-auto w-full touch-none rounded-3xl",
              tool === "stamp" ? "cursor-copy" : "cursor-crosshair"
            )}
            aria-label="Drawing canvas"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          <ToolButton onClick={undo} disabled={!actionCount} icon={Undo2} label="Undo" />
          <ToolButton onClick={clearAll} disabled={!actionCount || lastIsClear} icon={Trash2} label="Clear" />
          <ToolButton onClick={download} icon={Download} label="Download" primary />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tools */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <ToolButton onClick={() => setTool("brush")} active={tool === "brush"} icon={Brush} label="Brush" />
            <ToolButton onClick={() => setTool("rainbow")} active={tool === "rainbow"} icon={Rainbow} label="Rainbow" />
            <ToolButton onClick={() => setTool("stamp")} active={tool === "stamp"} icon={Stamp} label="Stamps" />
            <ToolButton onClick={() => setTool("eraser")} active={tool === "eraser"} icon={Eraser} label="Eraser" />
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Size</h3>
          <div className="mt-3 flex items-center gap-2">
            {SIZES.map((s) => (
              <button
                key={s.px}
                type="button"
                onClick={() => setSize(s.px)}
                aria-label={s.label}
                aria-pressed={size === s.px}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                  size === s.px ? "border-sage-500 bg-sage-100" : "border-charcoal-800/15 hover:border-sage-400"
                )}
              >
                <span
                  className="rounded-full bg-charcoal-800"
                  style={{ width: 4 + s.px / 2.4, height: 4 + s.px / 2.4 }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Colors or stamps, depending on the tool */}
        {tool === "stamp" ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Pick a stamp</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {STAMPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStamp(s)}
                  aria-pressed={stamp === s}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl border bg-white text-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                    stamp === s ? "border-sage-500 bg-sage-100 scale-110" : "border-charcoal-800/15 hover:border-sage-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-charcoal-500">Tap the paper to stamp. Size changes the stamp too.</p>
          </div>
        ) : (
          <div className={cn(tool !== "brush" && "pointer-events-none opacity-40")}>
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">Pick a color</h3>
            <Palette value={color} onChange={setColor} className="mt-3" />
            {tool === "rainbow" && (
              <p className="mt-3 text-sm text-charcoal-500">Rainbow brush picks the colors for you!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
