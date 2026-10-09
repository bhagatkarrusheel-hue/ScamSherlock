import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCAMSHERLOCK — Autonomous AI Agent for Scam Detection & Evidence Investigation",
  description:
    "An autonomous AI multi-agent system that investigates suspicious messages, emails, URLs, and payment requests, gathers multi-source evidence, determines scam pattern and risk score, and generates explainable investigation reports.",
  keywords: ["ScamSherlock", "Scam Detection", "AI Agent", "Phishing Investigation", "Cybersecurity", "VirusTotal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060911] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
