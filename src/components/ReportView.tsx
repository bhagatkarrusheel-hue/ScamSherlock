"use client";

import React, { useState } from "react";
import { InvestigationReport } from "@/types";
import { FileText, Copy, Download, Printer, Check, ShieldAlert, ShieldCheck, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";

interface ReportViewProps {
  report: InvestigationReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const {
    caseId,
    createdAt,
    scamCategory,
    riskScoreDetails,
    confidenceScore,
    aiExplanation,
    evidenceList,
    recommendedActions,
    rawInput,
  } = report;

  const { totalScore, riskLevel } = riskScoreDetails;

  const handleCopyReport = () => {
    const textToCopy = `SCAMSHERLOCK AUTONOMOUS INVESTIGATION REPORT
Case ID: ${caseId}
Timestamp: ${new Date(createdAt).toLocaleString()}
Threat Level: ${riskLevel} (${totalScore}/100)
Scam Type: ${scamCategory}
AI Confidence: ${confidenceScore}%

SUMMARY:
${aiExplanation.summary}

EXTRACTED EVIDENCE INDICATORS:
${evidenceList.map((e) => `- [${e.severity}] ${e.indicator}: "${e.quoteOrDetail}" (${e.explanation})`).join("\n")}

RECOMMENDED ACTIONS:
${recommendedActions.map((a) => `- ${a}`).join("\n")}

Reported by SCAMSHERLOCK AI Agent System`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${caseId}-scamsherlock-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="investigation-report-section" className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-lg font-bold text-white">SCAMSHERLOCK INVESTIGATION REPORT</h2>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                {caseId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generated at {new Date(createdAt).toLocaleString()} • Autonomous Analysis Engine
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Report"}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="text-[11px] font-mono font-semibold text-slate-400">THREAT RISK LEVEL</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-extrabold uppercase ${
                riskLevel === "CRITICAL"
                  ? "text-red-400"
                  : riskLevel === "HIGH"
                  ? "text-orange-400"
                  : riskLevel === "MEDIUM"
                  ? "text-yellow-400"
                  : "text-emerald-400"
              }`}
            >
              {riskLevel}
            </span>
            <span className="font-mono text-sm font-bold text-slate-300">({totalScore}/100)</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="text-[11px] font-mono font-semibold text-slate-400">DETECTED SCAM CATEGORY</span>
          <span className="text-lg font-bold text-cyan-300">{scamCategory}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="text-[11px] font-mono font-semibold text-slate-400">AGENT CONFIDENCE SCORE</span>
          <span className="text-lg font-bold text-emerald-400">{confidenceScore}% Confidence</span>
        </div>
      </div>

      {/* AI Explanation & Tactics */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5">
        <h3 className="text-sm font-bold text-white">AI Autonomous Explanation</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{aiExplanation.summary}</p>

        <div className="mt-2 flex flex-col gap-2 border-t border-slate-800/60 pt-3">
          <span className="text-xs font-bold text-slate-400">Why this score was assigned:</span>
          <p className="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
            {aiExplanation.whyRiskScore}
          </p>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white">Correlated Evidence Breakdown</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Severity</th>
                <th className="p-3">Indicator</th>
                <th className="p-3">Extracted Snippet</th>
                <th className="p-3">Source Agent</th>
                <th className="p-3">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              {evidenceList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50">
                  <td className="p-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        item.severity === "CRITICAL"
                          ? "bg-red-950 text-red-400"
                          : item.severity === "HIGH"
                          ? "bg-orange-950 text-orange-400"
                          : "bg-amber-950 text-amber-400"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-white">{item.indicator}</td>
                  <td className="p-3 text-cyan-300">"{item.quoteOrDetail}"</td>
                  <td className="p-3 text-slate-400">{item.sourceAgent}</td>
                  <td className="p-3 text-slate-300">{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Safety Actions */}
      <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-300">Recommended Safety Actions</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {recommendedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
              <span className="text-emerald-400 font-bold">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
