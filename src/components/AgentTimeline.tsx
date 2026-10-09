"use client";

import React from "react";
import { AgentLogStep } from "@/types";
import { Bot, CheckCircle2, AlertTriangle, Loader2, Search, Link2, Shield, Cpu, Scale } from "lucide-react";

interface AgentTimelineProps {
  steps: AgentLogStep[];
  isAnalyzing: boolean;
}

const getAgentIcon = (agentName: string) => {
  if (agentName.includes("Extraction")) return <Search className="h-4 w-4 text-cyan-400" />;
  if (agentName.includes("URL")) return <Link2 className="h-4 w-4 text-blue-400" />;
  if (agentName.includes("Impersonation")) return <Shield className="h-4 w-4 text-amber-400" />;
  if (agentName.includes("Message")) return <Cpu className="h-4 w-4 text-purple-400" />;
  if (agentName.includes("Evidence")) return <Scale className="h-4 w-4 text-emerald-400" />;
  if (agentName.includes("Risk")) return <AlertTriangle className="h-4 w-4 text-red-400" />;
  return <Bot className="h-4 w-4 text-slate-300" />;
};

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ steps, isAnalyzing }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Autonomous Agent Execution Pipeline</h3>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>ORCHESTRATING AGENTS...</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => (
          <div
            key={step.id || idx}
            className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 transition hover:border-slate-700"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 border border-slate-800">
              {getAgentIcon(step.agentName)}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{step.agentName}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                    {step.agentRole}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300">{step.description}</p>

              {step.detail && (
                <p className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/60 mt-1">
                  {step.detail}
                </p>
              )}
            </div>

            <div className="shrink-0 pt-0.5">
              {step.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {step.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
              {step.status === "running" && <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
