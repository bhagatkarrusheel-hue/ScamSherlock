import { ExtractedEntities, MessageAnalysis } from "@/types";

export function analyzeMessage(
  rawText: string,
  extracted: ExtractedEntities
): MessageAnalysis {
  const text = rawText || "";

  // 1. Urgency Score (0 - 100)
  let urgencyScore = 0;
  if (extracted.urgencyKeywords.length > 0) {
    urgencyScore += extracted.urgencyKeywords.length * 25;
  }
  if (/\b(now|today|1 hour|30 minutes|immediately|instant)\b/i.test(text)) {
    urgencyScore += 30;
  }
  urgencyScore = Math.min(100, urgencyScore);

  // 2. Fear Score (0 - 100)
  let fearScore = 0;
  if (extracted.threatKeywords.length > 0) {
    fearScore += extracted.threatKeywords.length * 30;
  }
  if (/\b(blocked|suspended|fine|deactivated|police|virus|deleted)\b/i.test(text)) {
    fearScore += 35;
  }
  fearScore = Math.min(100, fearScore);

  // 3. Authority Impersonation Score (0 - 100)
  let authorityScore = 0;
  if (extracted.organizationNames.length > 0) {
    authorityScore += 50;
  }
  if (/\b(official|government|trai|court|customs|hdfr|sbi|kbc|microsoft|instagram|police)\b/i.test(text)) {
    authorityScore += 35;
  }
  authorityScore = Math.min(100, authorityScore);

  // 4. Financial Bait Score (0 - 100)
  let financialBaitScore = 0;
  if (extracted.rewardKeywords.length > 0) {
    financialBaitScore += extracted.rewardKeywords.length * 35;
  }
  if (extracted.paymentAmounts.length > 0 && extracted.rewardKeywords.length > 0) {
    financialBaitScore += 25;
  }
  if (/\b(guaranteed|roi|double your|lottery|prize|refund|jackpot|processing fee)\b/i.test(text)) {
    financialBaitScore += 30;
  }
  financialBaitScore = Math.min(100, financialBaitScore);

  // Identify social engineering tactics
  const tactics: string[] = [];
  if (urgencyScore >= 40) tactics.push("Artificial Urgency & Time Pressure");
  if (fearScore >= 40) tactics.push("Fear & Disciplinary Action Threat");
  if (authorityScore >= 50) tactics.push("Authority / Entity Impersonation");
  if (financialBaitScore >= 40) tactics.push("Unrealistic Financial Reward / Bait");
  if (extracted.requests.payment) tactics.push("Advance Fee / Upfront Payment Demand");
  if (extracted.requests.otpOrPassword || extracted.requests.credentials) tactics.push("Credential / Secret Harvesting");
  if (extracted.requests.kycVerification) tactics.push("Fake KYC / Identity Phishing");

  let detectedIntent = "General Information";
  if (extracted.requests.otpOrPassword || extracted.requests.credentials) {
    detectedIntent = "Credential Harvesting / Identity Phishing";
  } else if (extracted.requests.payment && financialBaitScore > 30) {
    detectedIntent = "Advance-Fee Lottery or Investment Scam";
  } else if (fearScore > 50 && urgencyScore > 40) {
    detectedIntent = "Coercive Impersonation Scam";
  } else if (financialBaitScore > 50) {
    detectedIntent = "High-Yield Investment / Reward Fraud";
  } else if (tactics.length === 0) {
    detectedIntent = "Legitimate Transaction or Communication Alert";
  }

  return {
    urgencyScore,
    fearScore,
    authorityScore,
    financialBaitScore,
    socialEngineeringTactics: tactics,
    detectedIntent,
  };
}
