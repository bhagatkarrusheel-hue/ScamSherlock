"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { HeroInput } from "@/components/HeroInput";
import { DemoPresetSelector } from "@/components/DemoPresetSelector";
import { AgentTimeline } from "@/components/AgentTimeline";
import { RiskGauge } from "@/components/RiskGauge";
import { EvidenceGrid } from "@/components/EvidenceGrid";
import { InteractiveGraph } from "@/components/InteractiveGraph";
import { ReportView } from "@/components/ReportView";
import { CaseHistoryDrawer } from "@/components/CaseHistoryDrawer";
import { SettingsModal } from "@/components/SettingsModal";
import { AgentLogStep, InvestigationReport, SyntheticPresetCase } from "@/types";
import { runAutonomousInvestigation } from "@/lib/agents/orchestrator";
import { ShieldCheck, ShieldAlert, Cpu, Sparkles, Activity, FileText } from "lucide-react";

export default function DashboardPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<InvestigationReport | null>(null);
  const [liveSteps, setLiveSteps] = useState<AgentLogStep[]>([]);
  const [caseHistory, setCaseHistory] = useState<InvestigationReport[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();

  // Modals / Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings
  const [vtApiKey, setVtApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  // Load history & keys from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("scamsherlock_case_history");
      if (savedHistory) {
        setCaseHistory(JSON.parse(savedHistory));
      }
      const vt = localStorage.getItem("scamsherlock_vt_key");
      const gemini = localStorage.getItem("scamsherlock_gemini_key");
      if (vt) setVtApiKey(vt);
      if (gemini) setGeminiApiKey(gemini);
    } catch {
      // Ignore SSR / localStorage errors
    }
  }, []);

  // Save history helper
  const saveToHistory = (newReport: InvestigationReport) => {
    setCaseHistory((prev) => {
      const updated = [newReport, ...prev.filter((r) => r.caseId !== newReport.caseId)].slice(0, 30);
      try {
        localStorage.setItem("scamsherlock_case_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSaveSettings = (vt: string, gemini: string) => {
    setVtApiKey(vt);
    setGeminiApiKey(gemini);
    try {
      localStorage.setItem("scamsherlock_vt_key", vt);
      localStorage.setItem("scamsherlock_gemini_key", gemini);
    } catch {}
  };

  const handleClearHistory = () => {
    setCaseHistory([]);
    try {
      localStorage.removeItem("scamsherlock_case_history");
    } catch {}
  };

  // Main Investigation Execution Handler with step streaming simulation
  const handleInvestigate = async (
    inputText: string,
    inputType: "text" | "email" | "url" | "phone" | "screenshot",
    screenshotUrl?: string
  ) => {
    setIsAnalyzing(true);
    setLiveSteps([]);
    setActiveReport(null);

    // Initial log steps simulation for smooth UX
    const simulatedSteps: AgentLogStep[] = [
      {
        id: "step-1",
        agentName: "Extraction Agent",
        agentRole: "NLP Entity Parser",
        timestamp: new Date().toLocaleTimeString(),
        status: "running",
        description: "Scanning raw message text, extracting URLs, phone numbers, org names, and payment demands...",
      },
    ];
    setLiveSteps([...simulatedSteps]);

    try {
      // Run full autonomous investigation orchestrator
      const report = await runAutonomousInvestigation(inputText, inputType, screenshotUrl, vtApiKey);

      // Stream live agent steps for realistic visual feedback
      for (let i = 0; i < report.agentStepsLog.length; i++) {
        await new Promise((res) => setTimeout(res, 250));
        setLiveSteps(report.agentStepsLog.slice(0, i + 1));
      }

      setActiveReport(report);
      saveToHistory(report);

      // Trigger celebratory confetti if Legitimate safe message!
      if (report.riskScoreDetails.riskLevel === "LOW") {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Smooth scroll to report
      setTimeout(() => {
        const reportEl = document.getElementById("investigation-result-anchor");
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } catch (error) {
      console.error("Investigation error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: SyntheticPresetCase) => {
    setSelectedPresetId(preset.id);
    handleInvestigate(preset.rawInput, preset.inputType, preset.screenshotUrl);
  };

  return (
    <div className="cyber-bg min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToGraph={() => {
          const el = document.getElementById("investigation-graph");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onScrollToPresets={() => {
          const el = document.getElementById("hackathon-demo-presets");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        activeCaseId={activeReport?.caseId}
      />

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        {/* Hero Input Portal */}
        <HeroInput onInvestigate={handleInvestigate} isAnalyzing={isAnalyzing} />

        {/* Hackathon Preset Test Cases Carousel */}
        <div id="hackathon-demo-presets">
          <DemoPresetSelector onSelectPreset={handleSelectPreset} selectedId={selectedPresetId} />
        </div>

        {/* Live Agent Execution Pipeline Timeline */}
        {liveSteps.length > 0 && (
          <AgentTimeline steps={liveSteps} isAnalyzing={isAnalyzing} />
        )}

        {/* Investigation Results Anchor */}
        <div id="investigation-result-anchor" />

        {/* Active Investigation Results Section */}
        {activeReport && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Deterministic Risk Score Gauge */}
            <RiskGauge
              riskDetails={activeReport.riskScoreDetails}
              scamCategory={activeReport.scamCategory}
              confidenceScore={activeReport.confidenceScore}
            />

            {/* Evidence Cards Grid */}
            <EvidenceGrid evidenceList={activeReport.evidenceList} />

            {/* Scam Investigation Graph */}
            <InteractiveGraph graphData={activeReport.graphData} />

            {/* Complete Investigation Report */}
            <ReportView report={activeReport} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-300">SCAMSHERLOCK</span>
            <span>• Autonomous Multi-Agent Cybersecurity Platform</span>
          </div>
          <p>Built for Hackathon Demo • Autonomous Agent Architecture</p>
        </div>
      </footer>

      {/* History Drawer */}
      <CaseHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={caseHistory}
        onSelectCase={(report) => {
          setActiveReport(report);
          setLiveSteps(report.agentStepsLog || []);
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKeys={handleSaveSettings}
        initialVtKey={vtApiKey}
        initialGeminiKey={geminiApiKey}
      />
    </div>
  );
}
