"use client";

import React, { useState, useEffect } from "react";
import { Settings, X, Key, ShieldCheck, Cpu, Info, Save } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (vtKey: string, geminiKey: string) => void;
  initialVtKey?: string;
  initialGeminiKey?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveKeys,
  initialVtKey = "",
  initialGeminiKey = "",
}) => {
  const [vtKey, setVtKey] = useState(initialVtKey);
  const [geminiKey, setGeminiKey] = useState(initialGeminiKey);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setVtKey(initialVtKey);
    setGeminiKey(initialGeminiKey);
  }, [initialVtKey, initialGeminiKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys(vtKey, geminiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Agent Settings & API Integrations</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 my-4">
          {/* VirusTotal API Key */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-blue-400" />
                VirusTotal API Key (Optional)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Live Threat Intel</span>
            </label>
            <input
              type="password"
              placeholder="Enter VirusTotal Public/Premium API Key..."
              value={vtKey}
              onChange={(e) => setVtKey(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400">
              When left blank, SCAMSHERLOCK uses its high-accuracy built-in heuristic threat engine simulation.
            </p>
          </div>

          {/* Gemini / LLM API Key */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                Gemini API Key (Optional)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">AI Reasoning</span>
            </label>
            <input
              type="password"
              placeholder="Enter Gemini API Key..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
              <Info className="h-4 w-4" />
              <span>Offline Standalone Mode Supported</span>
            </div>
            SCAMSHERLOCK is engineered with zero hard external dependencies. It works at 100% functionality out of the box even without any external API keys!
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saved ? "Settings Saved!" : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
