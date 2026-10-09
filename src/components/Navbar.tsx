"use client";

import React from "react";
import { ShieldAlert, Cpu, History, Settings, FileText, Share2, Sparkles, Activity } from "lucide-react";

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onScrollToGraph?: () => void;
  onScrollToPresets?: () => void;
  activeCaseId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenSettings,
  onScrollToGraph,
  onScrollToPresets,
  activeCaseId,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/30">
            <ShieldAlert className="h-6 w-6 animate-pulse text-cyan-300" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold tracking-wider text-white">
                SCAM<span className="text-cyan-400">SHERLOCK</span>
              </span>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-cyan-500/30">
                AI AGENT v2.0
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Autonomous Scam Investigation & Evidence Analysis Platform
            </p>
          </div>
        </div>

        {/* Status Indicator & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-400 md:flex">
            <Activity className="h-3.5 w-3.5 animate-spin text-emerald-400" />
            <span className="font-mono font-medium">MULTI-AGENT ENGINE ONLINE</span>
          </div>

          {onScrollToPresets && (
            <button
              onClick={onScrollToPresets}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Demo Presets</span>
            </button>
          )}

          {onScrollToGraph && (
            <button
              onClick={onScrollToGraph}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Investigation Graph</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
            title="Recent Case History"
          >
            <History className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Case History</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-700 hover:text-white transition"
            title="Settings & API Keys"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
