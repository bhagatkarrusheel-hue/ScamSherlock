"use client";

import React, { useState } from "react";
import { InvestigationReport } from "@/types";
import { History, X, Search, ShieldAlert, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";

interface CaseHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: InvestigationReport[];
  onSelectCase: (report: InvestigationReport) => void;
  onClearHistory: () => void;
}

export const CaseHistoryDrawer: React.FC<CaseHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCase,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scamCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawInput.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterLevel === "ALL" || item.riskScoreDetails.riskLevel === filterLevel;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="flex h-full w-full max-w-md flex-col bg-slate-950 border-l border-slate-800 p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Investigation Case History</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Risk Filter */}
        <div className="flex flex-col gap-3 my-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search case ID, domain, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                  filterLevel === level
                    ? "bg-blue-600 text-white"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Case List */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <p className="text-xs">No investigation history found matching your filters.</p>
            </div>
          ) : (
            filteredHistory.map((caseItem) => {
              const { riskLevel, totalScore } = caseItem.riskScoreDetails;
              const isSafe = riskLevel === "LOW";

              return (
                <div
                  key={caseItem.caseId}
                  onClick={() => {
                    onSelectCase(caseItem);
                    onClose();
                  }}
                  className="flex cursor-pointer flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-300">{caseItem.caseId}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        isSafe ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                      }`}
                    >
                      {riskLevel} ({totalScore}/100)
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white line-clamp-1">{caseItem.scamCategory}</p>
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-2">{caseItem.rawInput}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-400">
                      Open Report <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Clear History */}
        {history.length > 0 && (
          <div className="mt-4 border-t border-slate-800 pt-3">
            <button
              onClick={onClearHistory}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 py-2 text-xs font-semibold text-red-400 hover:bg-red-950 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History ({history.length} Cases)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
