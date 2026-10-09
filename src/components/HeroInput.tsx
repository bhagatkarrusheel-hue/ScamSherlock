"use client";

import React, { useState } from "react";
import { Search, Upload, Link, MessageSquare, Phone, Mail, FileText, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { extractTextFromImage } from "@/lib/ocr/screenshotExtractor";

interface HeroInputProps {
  onInvestigate: (input: string, type: "text" | "email" | "url" | "phone" | "screenshot", screenshotUrl?: string) => void;
  isAnalyzing: boolean;
}

export const HeroInput: React.FC<HeroInputProps> = ({ onInvestigate, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<"text" | "email" | "url" | "phone" | "screenshot">("text");
  const [inputText, setInputText] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setOcrSuccess(false);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshotPreview(dataUrl);

      // Perform OCR Text Extraction
      const extracted = await extractTextFromImage(dataUrl);
      setInputText(extracted || "Screenshot uploaded. OCR text extraction completed.");
      setOcrLoading(false);
      setOcrSuccess(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !screenshotPreview) return;
    onInvestigate(inputText, activeTab, screenshotPreview || undefined);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
      {/* Decorative ambient background light */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-600/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400 self-center sm:self-start">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Intelligence Agent Platform</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
            Don't Just Classify. <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Investigate.</span>
          </h1>
          <p className="text-sm text-slate-400">
            Submit a suspicious SMS, email, URL, or screenshot. SCAMSHERLOCK extracts evidence, probes domain reputation, evaluates social engineering tactics, and generates an explainable investigation report.
          </p>
        </div>

        {/* Input Type Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              activeTab === "text"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>SMS / WhatsApp Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              activeTab === "url"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            <Link className="h-3.5 w-3.5" />
            <span>Suspicious URL / Domain</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              activeTab === "email"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("screenshot")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              activeTab === "screenshot"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Screenshot (OCR Vision)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTab === "screenshot" ? (
            <div className="flex flex-col gap-3">
              <div className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 text-center transition hover:border-blue-500 hover:bg-slate-950">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 z-20 cursor-pointer opacity-0"
                />
                <Upload className="mb-2 h-8 w-8 text-blue-400" />
                <p className="text-sm font-semibold text-slate-200">
                  Upload WhatsApp, SMS, or Email Screenshot
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, or WEBP up to 10MB. OCR Engine will extract message text & URLs automatically.
                </p>
              </div>

              {ocrLoading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>OCR Agent reading image text and extracting links...</span>
                </div>
              )}

              {ocrSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>OCR Text Extraction Successful! Review extracted text below:</span>
                </div>
              )}

              {screenshotPreview && (
                <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <img
                    src={screenshotPreview}
                    alt="Uploaded Screenshot"
                    className="h-24 w-24 rounded-lg object-cover border border-slate-800"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs font-bold text-slate-300">Extracted Text Preview:</span>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === "url"
                    ? "Paste suspicious link or domain (e.g. https://sbi-secure-login-kyc.xyz/verify)..."
                    : activeTab === "email"
                    ? "Paste suspicious email body text, headers, or sender address..."
                    : "Paste suspicious message or SMS (e.g. 'Congratulations! You won ₹25,00,000. Pay ₹5,999 processing fee. Click: https://example.com/claim')..."
                }
                rows={4}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 p-4 text-sm font-mono text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 hidden sm:inline">
              🔒 Controlled Sandbox Analysis Engine • Zero External Execution
            </span>
            <button
              type="submit"
              disabled={isAnalyzing || (!inputText.trim() && !screenshotPreview)}
              className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                isAnalyzing ? "animate-pulse" : ""
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{isAnalyzing ? "AUTONOMOUS AGENTS INVESTIGATING..." : "RUN AUTONOMOUS INVESTIGATION"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
