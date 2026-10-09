"use client";

import React, { useState } from "react";
import { ScamInvestigationGraph, GraphNodeData } from "@/types";
import { Cpu, Zap, Info, ShieldAlert, ShieldCheck, Link, Globe, Phone, FileText } from "lucide-react";

interface InteractiveGraphProps {
  graphData: ScamInvestigationGraph;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);

  const { nodes, edges } = graphData;

  // Simple layout calculation algorithm for clean grid visualization
  const getNodePos = (idx: number, total: number, type: string) => {
    if (type === "input") return { x: 80, y: 150 };
    if (type === "verdict") return { x: 720, y: 150 };
    if (type === "brand" || type === "domain" || type === "entity") {
      const colIdx = idx % 2;
      return { x: 260 + colIdx * 60, y: 70 + idx * 75 };
    }
    // Indicators / Threat nodes
    return { x: 480, y: 60 + idx * 80 };
  };

  const getRiskBorder = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return "border-red-500 bg-red-950/80 text-red-300 shadow-red-500/30";
      case "HIGH":
        return "border-orange-500 bg-orange-950/80 text-orange-300 shadow-orange-500/30";
      case "MEDIUM":
        return "border-yellow-500 bg-yellow-950/80 text-yellow-300 shadow-yellow-500/30";
      default:
        return "border-blue-500/60 bg-slate-900/90 text-cyan-300 shadow-blue-500/20";
    }
  };

  return (
    <div id="investigation-graph" className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Interactive Scam Investigation Graph</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {nodes.length} Nodes • {edges.length} Relational Edges
        </span>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative min-h-[340px] w-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 p-4 cyber-bg">
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead-danger"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
            <marker
              id="arrowhead-normal"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Render Connections */}
          {edges.map((edge) => {
            const srcIdx = nodes.findIndex((n) => n.id === edge.source);
            const tgtIdx = nodes.findIndex((n) => n.id === edge.target);
            if (srcIdx === -1 || tgtIdx === -1) return null;

            const srcPos = getNodePos(srcIdx, nodes.length, nodes[srcIdx].type);
            const tgtPos = getNodePos(tgtIdx, nodes.length, nodes[tgtIdx].type);

            const isDanger = edge.style === "danger";

            return (
              <g key={edge.id}>
                <line
                  x1={srcPos.x + 80}
                  y1={srcPos.y + 20}
                  x2={tgtPos.x}
                  y2={tgtPos.y + 20}
                  stroke={isDanger ? "#ef4444" : "#3b82f6"}
                  strokeWidth={isDanger ? "2" : "1.5"}
                  strokeDasharray={edge.style === "dashed" ? "5 5" : "none"}
                  markerEnd={isDanger ? "url(#arrowhead-danger)" : "url(#arrowhead-normal)"}
                  className="opacity-75 transition-all"
                />
                {edge.label && (
                  <text
                    x={(srcPos.x + tgtPos.x) / 2 + 40}
                    y={(srcPos.y + tgtPos.y) / 2 + 15}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render Graph Nodes */}
        <div className="relative z-10 flex min-h-[300px] w-full flex-wrap gap-6 p-4">
          {nodes.map((node, idx) => {
            const pos = getNodePos(idx, nodes.length, node.type);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ position: "absolute", left: `${pos.x}px`, top: `${pos.y}px` }}
                className={`flex w-44 cursor-pointer flex-col gap-1 rounded-xl border p-2.5 shadow-lg backdrop-blur-md transition hover:scale-105 ${getRiskBorder(
                  node.riskLevel
                )} ${isSelected ? "ring-2 ring-cyan-400" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                    {node.type}
                  </span>
                  {node.riskLevel === "CRITICAL" || node.riskLevel === "HIGH" ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                  ) : node.type === "verdict" ? (
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </div>

                <p className="text-xs font-bold leading-tight line-clamp-2">{node.label}</p>
                {node.subtext && <p className="text-[10px] opacity-70 line-clamp-1">{node.subtext}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-white">Node Details: {selectedNode.label}</span>
            <span className="font-mono text-slate-400">({selectedNode.subtext})</span>
          </div>
          <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
            Close
          </button>
        </div>
      )}
    </div>
  );
};
