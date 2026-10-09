"use client";

import React from "react";
import { SYNTHETIC_DEMO_CASES } from "@/lib/data/syntheticCases";
import { SyntheticPresetCase } from "@/types";
import { Sparkles, ShieldCheck, ShieldAlert, ArrowRight, Zap } from "lucide-react";

interface DemoPresetSelectorProps {
  onSelectPreset: (preset: SyntheticPresetCase) => void;
  selectedId?: string;
}

export const DemoPresetSelector: React.FC<DemoPresetSelectorProps> = ({
  onSelectPreset,
  selectedId,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Hackathon Synthetic Demo Cases</h3>
            <p className="text-xs text-slate-400">
              One-click preset examples to evaluate autonomous agent investigation accuracy
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-400 border border-slate-800">
          10 Presets Ready
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SYNTHETIC_DEMO_CASES.map((preset) => {
          const isLegit = preset.expectedRiskLevel === "LOW";
          const isCritical = preset.expectedRiskLevel === "CRITICAL";
          const isSelected = selectedId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition ${
                isSelected
                  ? "border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isLegit
                        ? "bg-emerald-950 text-emerald-400 ring-1 ring-emerald-500/30"
                        : isCritical
                        ? "bg-red-950 text-red-400 ring-1 ring-red-500/30"
                        : "bg-amber-950 text-amber-400 ring-1 ring-amber-500/30"
                    }`}
                  >
                    {preset.expectedRiskLevel}
                  </span>
                  {isLegit ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition line-clamp-1">
                  {preset.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-500">{preset.category}</span>
                <span className="flex items-center text-[10px] font-semibold text-blue-400 group-hover:translate-x-0.5 transition">
                  Test Case <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
