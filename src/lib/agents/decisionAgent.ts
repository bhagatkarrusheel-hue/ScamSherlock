import {
  ExtractedEntities,
  EvidenceItem,
  ImpersonationResult,
  MessageAnalysis,
  RiskScoreDetails,
  ScamCategory,
  UrlInvestigation,
} from "@/types";

export function determineScamVerdict(
  extracted: ExtractedEntities,
  urls: UrlInvestigation[],
  impersonations: ImpersonationResult[],
  message: MessageAnalysis,
  evidence: EvidenceItem[],
  riskDetails: RiskScoreDetails,
  rawText: string
): {
  scamCategory: ScamCategory;
  confidenceScore: number;
  aiExplanation: {
    summary: string;
    tacticsUsed: string[];
    threatsFound: string[];
    whyRiskScore: string;
  };
  recommendedActions: string[];
} {
  const text = rawText || "";

  // If risk score is low, classify as Legitimate
  if (riskDetails.riskLevel === "LOW") {
    return {
      scamCategory: "Legitimate",
      confidenceScore: 92,
      aiExplanation: {
        summary: "No significant scam indicators or deceptive tactics detected in this message. The content appears to be a normal informational or transactional update.",
        tacticsUsed: [],
        threatsFound: [],
        whyRiskScore: `Deterministic Risk Engine score is ${riskDetails.totalScore}/100 (LOW RISK). No suspicious URL, brand impersonation, or credential harvesting detected.`,
      },
      recommendedActions: [
        "Verify details through your official app or account if unsure.",
        "Always confirm sender details for high-value financial actions.",
      ],
    };
  }

  // Identify Scam Category based on evidence rules
  let scamCategory: ScamCategory = "Phishing";

  if (/\b(kbc|lottery|lucky draw|winner|cash prize|won|jackpot)\b/i.test(text)) {
    scamCategory = "Prize/Lottery Scam";
  } else if (/\b(job|work from home|like youtube|salary|hr|earning|part time|telegram channel)\b/i.test(text)) {
    scamCategory = "Job Scam";
  } else if (/\b(crypto|usdt|bitcoin|investment|roi|double your money|trading bot)\b/i.test(text)) {
    scamCategory = "Financial Scam";
  } else if (/\b(fedex|package|parcel|customs|delivery|courier|post)\b/i.test(text)) {
    scamCategory = "Delivery Scam";
  } else if (/\b(sbi|hdfc|icici|axis|pan|kyc|bank account|suspended|netbanking)\b/i.test(text)) {
    scamCategory = "Banking Scam";
  } else if (/\b(trai|jio|airtel|sim|telecom|biometric|deactivated in 1 hour)\b/i.test(text)) {
    scamCategory = "SIM/Telecom Scam";
  } else if (/\b(income tax|refund|tax refund|assessment year|efiling)\b/i.test(text)) {
    scamCategory = "Identity/KYC Scam";
  } else if (/\b(windows defender|microsoft|trojan|virus|infected|tech technician|call support)\b/i.test(text)) {
    scamCategory = "Tech Support Scam";
  } else if (/\b(dear|love|airport|stuck|customs clearance|emergency money)\b/i.test(text)) {
    scamCategory = "Romance Scam";
  } else if (urls.some((u) => u.typosquattingDetected || u.reputationScore < 50) || impersonations.some((i) => i.isImpersonated)) {
    scamCategory = "Phishing";
  }

  // Calculate AI Confidence score
  const confidenceScore = Math.min(
    98,
    75 + evidence.length * 4 + (riskDetails.totalScore > 70 ? 10 : 5)
  );

  const tacticsUsed = message.socialEngineeringTactics;
  const threatsFound = evidence.map((e) => e.indicator);

  const summary = `SCAMSHERLOCK Autonomous Investigation evaluated this case as ${riskDetails.riskLevel} RISK (${riskDetails.totalScore}/100) classified under '${scamCategory}'. Key threats include ${threatsFound.slice(0, 3).join(", ")}.`;

  const whyRiskScore = `The deterministic score of ${riskDetails.totalScore}/100 was computed from ${evidence.length} evidence indicators. Points were added for: ${riskDetails.breakdown.slice(0, 4).map((b) => `${b.category} (+${b.pointsAdded} pts)`).join(", ")}.`;

  const recommendedActions = [
    "🚨 Do NOT click any links, open attachments, or visit mentioned websites.",
    "🔒 Do NOT share OTP, Passwords, PINs, or UPI PIN under any circumstances.",
    "💸 Do NOT send money, security deposits, or processing fees.",
    "🏢 If an official entity (like SBI, HDFC, FedEx) was mentioned, contact them directly via their official public website or hotline.",
    "🛡️ Report this incident to your local National Cyber Crime Portal (e.g. 1930 in India / cybercrime.gov.in).",
  ];

  return {
    scamCategory,
    confidenceScore,
    aiExplanation: {
      summary,
      tacticsUsed,
      threatsFound,
      whyRiskScore,
    },
    recommendedActions,
  };
}
