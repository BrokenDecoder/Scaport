"use client";

import React, { useState } from "react";
import FallingRays from "@/components/ui/FallingRays";
import { Sliders, Eye, EyeOff, RotateCcw, Copy, Check } from "lucide-react";

interface Preset {
  name: string;
  color1: string;
  color2: string;
  rayCount: number;
  rayWidth: number;
  pulseSpeed: number;
  pulseWidth: number;
  trailLength: number;
  motionBlur: number;
  bgGlow: number;
}

const PRESETS: Preset[] = [
  {
    name: "Reference Violet",
    color1: "#8B5CF6",
    color2: "#E879F9",
    rayCount: 20,
    rayWidth: 0.0035,
    pulseSpeed: 0.16,
    pulseWidth: 0.015,
    trailLength: 0.4,
    motionBlur: 0.3,
    bgGlow: 0.3,
  },
  {
    name: "Aurora Deep",
    color1: "#5227FF",
    color2: "#FF9FFC",
    rayCount: 22,
    rayWidth: 0.0035,
    pulseSpeed: 0.12,
    pulseWidth: 0.015,
    trailLength: 0.35,
    motionBlur: 0.4,
    bgGlow: 0.25,
  },
  {
    name: "Electric Cyan",
    color1: "#0040FF",
    color2: "#00F0FF",
    rayCount: 26,
    rayWidth: 0.004,
    pulseSpeed: 0.18,
    pulseWidth: 0.02,
    trailLength: 0.4,
    motionBlur: 0.5,
    bgGlow: 0.4,
  },
  {
    name: "Solar Ember",
    color1: "#FF2A00",
    color2: "#FFB020",
    rayCount: 20,
    rayWidth: 0.0045,
    pulseSpeed: 0.14,
    pulseWidth: 0.018,
    trailLength: 0.45,
    motionBlur: 0.3,
    bgGlow: 0.3,
  },
  {
    name: "Emerald Stream",
    color1: "#007A4D",
    color2: "#39FF88",
    rayCount: 24,
    rayWidth: 0.0035,
    pulseSpeed: 0.15,
    pulseWidth: 0.015,
    trailLength: 0.35,
    motionBlur: 0.4,
    bgGlow: 0.2,
  },
  {
    name: "Monochrome Minimal",
    color1: "#404040",
    color2: "#E0E0E0",
    rayCount: 18,
    rayWidth: 0.003,
    pulseSpeed: 0.1,
    pulseWidth: 0.015,
    trailLength: 0.3,
    motionBlur: 0.2,
    bgGlow: 0.15,
  },
];

export function BackgroundPlayground() {
  const [params, setParams] = useState<Preset>(PRESETS[0]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [bgDark, setBgDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const updateParam = <K extends keyof Preset>(key: K, val: Preset[K]) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = () => {
    const code = `<FallingRays
  color1="${params.color1}"
  color2="${params.color2}"
  rayCount={${params.rayCount}}
  rayWidth={${params.rayWidth}}
  pulseSpeed={${params.pulseSpeed}}
  pulseWidth={${params.pulseWidth}}
  trailLength={${params.trailLength}}
  motionBlur={${params.motionBlur}}
  bgGlow={${params.bgGlow}}
/>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden transition-colors duration-300 ${
        bgDark ? "bg-[#09090b]" : "bg-white"
      }`}
    >
      {/* Full viewport Falling Rays Canvas */}
      <div className="absolute inset-0">
        <FallingRays
          color1={params.color1}
          color2={params.color2}
          rayCount={params.rayCount}
          rayWidth={params.rayWidth}
          pulseSpeed={params.pulseSpeed}
          pulseWidth={params.pulseWidth}
          trailLength={params.trailLength}
          motionBlur={params.motionBlur}
          bgGlow={params.bgGlow}
          className="w-full h-full"
        />
      </div>

      {/* Floating Header Badge */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-xs font-mono text-zinc-300 shadow-xl flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Background Studio Active</span>
        </div>
      </div>

      {/* Floating Toggle Buttons */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setBgDark((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-black/70 backdrop-blur-md text-xs font-medium text-white shadow-xl hover:bg-white/10 transition-colors"
        >
          <span>{bgDark ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
        </button>
        <button
          onClick={() => setPanelOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-black/70 backdrop-blur-md text-xs font-medium text-white shadow-xl hover:bg-white/10 transition-colors"
        >
          {panelOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          <span>{panelOpen ? "Hide Controls" : "Show Controls"}</span>
        </button>
      </div>

      {/* Floating Studio Controls Drawer */}
      {panelOpen && (
        <aside
          role="region"
          aria-label="Background Controls"
          className="absolute bottom-6 right-6 z-20 w-[92vw] max-w-[420px] max-h-[82vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c10]/85 backdrop-blur-xl p-5 shadow-2xl text-white flex flex-col gap-5 scrollbar-thin"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-violet-400" />
              <h2 className="text-sm font-semibold tracking-wide">Ray Controls</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setParams(PRESETS[0])}
                title="Reset to default"
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-violet-500/40 bg-violet-500/20 hover:bg-violet-500/30 text-xs font-medium text-violet-200 transition-colors"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setParams(preset)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    params.name === preset.name
                      ? "border-violet-500 bg-violet-500/25 text-white"
                      : "border-white/5 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})` }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-zinc-400">Color 1 (Primary)</label>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 p-1.5 rounded-lg">
                <input
                  type="color"
                  value={params.color1}
                  onChange={(e) => updateParam("color1", e.target.value)}
                  className="size-6 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono uppercase text-zinc-300">{params.color1}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-zinc-400">Color 2 (Accent)</label>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 p-1.5 rounded-lg">
                <input
                  type="color"
                  value={params.color2}
                  onChange={(e) => updateParam("color2", e.target.value)}
                  className="size-6 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono uppercase text-zinc-300">{params.color2}</span>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-3.5">
            {/* Ray Count */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Ray Count</span>
                <span className="font-mono text-zinc-400">{params.rayCount}</span>
              </div>
              <input
                type="range"
                min={8}
                max={45}
                step={1}
                value={params.rayCount}
                onChange={(e) => updateParam("rayCount", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Ray Width */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Ray Width</span>
                <span className="font-mono text-zinc-400">{params.rayWidth.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.012}
                step={0.0005}
                value={params.rayWidth}
                onChange={(e) => updateParam("rayWidth", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Pulse Speed */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Pulse Speed</span>
                <span className="font-mono text-zinc-400">{params.pulseSpeed.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.03}
                max={0.5}
                step={0.01}
                value={params.pulseSpeed}
                onChange={(e) => updateParam("pulseSpeed", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Pulse Width */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Pulse Width</span>
                <span className="font-mono text-zinc-400">{params.pulseWidth.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min={0.005}
                max={0.06}
                step={0.002}
                value={params.pulseWidth}
                onChange={(e) => updateParam("pulseWidth", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Trail Length */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Trail Length</span>
                <span className="font-mono text-zinc-400">{params.trailLength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={params.trailLength}
                onChange={(e) => updateParam("trailLength", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Motion Blur */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Motion Blur</span>
                <span className="font-mono text-zinc-400">{params.motionBlur.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.0}
                step={0.05}
                value={params.motionBlur}
                onChange={(e) => updateParam("motionBlur", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Background Glow */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Ambient Glow</span>
                <span className="font-mono text-zinc-400">{params.bgGlow.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={params.bgGlow}
                onChange={(e) => updateParam("bgGlow", Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
