"use client";

import React, { useState } from "react";
import { RiskScoreDetails } from "@/types";
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, ChevronDown, ChevronUp, Calculator } from "lucide-react";

interface RiskGaugeProps {
  riskDetails: RiskScoreDetails;
  scamCategory: string;
  confidenceScore: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  riskDetails,
  scamCategory,
  confidenceScore,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  const { totalScore, riskLevel, breakdown } = riskDetails;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/80",
          border: "border-red-500/50",
          text: "text-red-400",
          badge: "bg-red-500 text-white",
          glow: "glow-red",
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/80",
          border: "border-orange-500/50",
          text: "text-orange-400",
          badge: "bg-orange-500 text-white",
          glow: "glow-orange",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/80",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          badge: "bg-yellow-500 text-slate-950",
          glow: "glow-yellow",
        };
      default:
        return {
          bg: "bg-emerald-950/80",
          border: "border-emerald-500/50",
          text: "text-emerald-400",
          badge: "bg-emerald-500 text-white",
          glow: "glow-green",
        };
    }
  };

  const style = getRiskColor(riskLevel);

  return (
    <div className={`relative flex flex-col gap-5 rounded-2xl border p-6 backdrop-blur-xl transition ${style.bg} ${style.border} ${style.glow}`}>
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.badge} font-black shadow-xl`}>
            {riskLevel === "LOW" ? <ShieldCheck className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black uppercase tracking-wider ${style.text}`}>
                {riskLevel} RISK THREAT
              </span>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-slate-300 border border-slate-700">
                {scamCategory}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Deterministic Engine Score: <strong className="font-mono text-white">{totalScore}/100</strong> • AI Confidence: <strong className="font-mono text-cyan-300">{confidenceScore}%</strong>
            </p>
          </div>
        </div>

        {/* Large Visual Score Gauge Number */}
        <div className="flex items-baseline gap-1 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-2">
          <span className={`font-mono text-4xl font-black ${style.text}`}>{totalScore}</span>
          <span className="font-mono text-xs text-slate-500">/ 100</span>
        </div>
      </div>

      {/* Risk Level Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>🟢 LOW (0-25)</span>
          <span>🟡 MEDIUM (26-50)</span>
          <span>🟠 HIGH (51-75)</span>
          <span>🔴 CRITICAL (76-100)</span>
        </div>
        <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              riskLevel === "CRITICAL"
                ? "bg-gradient-to-r from-orange-500 to-red-600"
                : riskLevel === "HIGH"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : riskLevel === "MEDIUM"
                ? "bg-gradient-to-r from-emerald-500 to-yellow-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${Math.max(5, totalScore)}%` }}
          />
        </div>
      </div>

      {/* Deterministic Scoring Point Breakdown Drawer Toggle */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/90 p-4">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-cyan-400" />
            <span>Deterministic Scoring Formula Breakdown ({breakdown.length} Factors)</span>
          </div>
          {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showBreakdown && (
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-800/80 pt-3">
            {breakdown.length === 0 ? (
              <p className="text-xs text-slate-400">No risk factors identified. Total points: 0.</p>
            ) : (
              breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-200">{item.category}</span>
                    <span className="text-[11px] text-slate-400">{item.reason}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      item.pointsAdded > 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {item.pointsAdded > 0 ? `+${item.pointsAdded}` : item.pointsAdded} pts
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
