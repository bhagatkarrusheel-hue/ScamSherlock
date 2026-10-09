import { EvidenceItem, RiskLevel, RiskScoreDetails } from "@/types";

export function calculateDeterministicRiskScore(evidenceList: EvidenceItem[]): RiskScoreDetails {
  let score = 0;
  const breakdown: { category: string; pointsAdded: number; reason: string }[] = [];

  for (const item of evidenceList) {
    const pts = item.riskContributionPoints;
    score += pts;

    breakdown.push({
      category: item.category,
      pointsAdded: pts,
      reason: item.indicator + ": " + item.quoteOrDetail,
    });
  }

  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  let riskLevel: RiskLevel = "LOW";
  if (normalizedScore >= 76) {
    riskLevel = "CRITICAL";
  } else if (normalizedScore >= 51) {
    riskLevel = "HIGH";
  } else if (normalizedScore >= 26) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  return {
    totalScore: normalizedScore,
    riskLevel,
    breakdown,
  };
}
