"use client";

import React from "react";
import { EvidenceItem } from "@/types";
import { Scale, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface EvidenceGridProps {
  evidenceList: EvidenceItem[];
}

export const EvidenceGrid: React.FC<EvidenceGridProps> = ({ evidenceList }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-950 text-red-400 border-red-500/40";
      case "HIGH":
        return "bg-orange-950 text-orange-400 border-orange-500/40";
      case "MEDIUM":
        return "bg-amber-950 text-amber-400 border-amber-500/40";
      default:
        return "bg-emerald-950 text-emerald-400 border-emerald-500/40";
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Evidence-Based Extracted Indicators ({evidenceList.length})</h3>
        </div>
        <span className="text-xs text-slate-400">Cross-Agent Correlated Signals</span>
      </div>

      {evidenceList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle2 className="mb-2 h-10 w-10 text-emerald-400" />
          <p className="text-sm font-semibold text-slate-200">No Threat Indicators Extracted</p>
          <p className="text-xs text-slate-400">The message does not contain suspicious links, credential requests, or scam tactics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(item.severity)}`}>
                    {item.severity} SEVERITY
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                    {item.sourceAgent}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{item.indicator}</h4>
                <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                  "{item.quoteOrDetail}"
                </p>
                <p className="text-xs text-slate-400">{item.explanation}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    item.riskContributionPoints > 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {item.riskContributionPoints > 0 ? `+${item.riskContributionPoints}` : item.riskContributionPoints} Score Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
