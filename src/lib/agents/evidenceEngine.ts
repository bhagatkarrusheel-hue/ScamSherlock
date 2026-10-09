import { ExtractedEntities, EvidenceItem, ImpersonationResult, MessageAnalysis, UrlInvestigation } from "@/types";

export function collectEvidence(
  extracted: ExtractedEntities,
  urls: UrlInvestigation[],
  impersonations: ImpersonationResult[],
  message: MessageAnalysis,
  rawText: string
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];
  let idCounter = 1;

  // 1. URL Threats
  for (const urlInfo of urls) {
    if (urlInfo.hasSuspiciousTld) {
      evidence.push({
        id: `ev-${idCounter++}`,
        category: "URL Intelligence",
        indicator: "Suspicious Top-Level Domain (TLD)",
        quoteOrDetail: urlInfo.domain,
        sourceAgent: "URL Agent",
        severity: "HIGH",
        riskContributionPoints: 20,
        explanation: `Domain '${urlInfo.domain}' uses TLD '${urlInfo.tld}' which is frequently registered for cheap, disposable phishing sites.`,
      });
    }

    if (!urlInfo.isHttps) {
      evidence.push({
        id: `ev-${idCounter++}`,
        category: "URL Intelligence",
        indicator: "Insecure HTTP Protocol",
        quoteOrDetail: urlInfo.rawUrl,
        sourceAgent: "URL Agent",
        severity: "MEDIUM",
        riskContributionPoints: 15,
        explanation: "The provided URL lacks HTTPS encryption, creating data security and eavesdropping vulnerabilities.",
      });
    }

    if (urlInfo.reputationScore < 50) {
      evidence.push({
        id: `ev-${idCounter++}`,
        category: "URL Intelligence",
        indicator: "Low Reputation / Threat Flag",
        quoteOrDetail: `VirusTotal: ${urlInfo.virustotalResult?.maliciousCount || 0} malicious detections`,
        sourceAgent: "URL Agent",
        severity: "CRITICAL",
        riskContributionPoints: 30,
        explanation: `Security intelligence engines flagged this domain as malicious or suspicious.`,
      });
    }
  }

  // 2. Impersonation Findings
  for (const imp of impersonations) {
    if (imp.isImpersonated) {
      evidence.push({
        id: `ev-${idCounter++}`,
        category: "Impersonation",
        indicator: "Brand & Entity Mismatch",
        quoteOrDetail: `Claimed: ${imp.claimedBrand} | Domain: ${imp.actualDomain}`,
        sourceAgent: "Impersonation Agent",
        severity: "CRITICAL",
        riskContributionPoints: 25,
        explanation: imp.reason,
      });
    } else {
      // Whitelisted match
      evidence.push({
        id: `ev-${idCounter++}`,
        category: "Brand Trust",
        indicator: "Official Domain Verified",
        quoteOrDetail: `Official site: ${imp.actualDomain}`,
        sourceAgent: "Impersonation Agent",
        severity: "LOW",
        riskContributionPoints: -35,
        explanation: `Domain '${imp.actualDomain}' is verified as an official brand domain.`,
      });
    }
  }

  // 3. Social Engineering / Urgency
  if (message.urgencyScore >= 40) {
    evidence.push({
      id: `ev-${idCounter++}`,
      category: "Social Engineering",
      indicator: "Artificial Urgency Tactic",
      quoteOrDetail: extracted.urgencyKeywords.length > 0 ? extracted.urgencyKeywords.join(", ") : "Urgent action requested",
      sourceAgent: "Message Agent",
      severity: "HIGH",
      riskContributionPoints: 15,
      explanation: "Scammers use panic and tight deadlines (e.g. 30 mins / 1 hour) to force victims into acting before thinking.",
    });
  }

  if (message.fearScore >= 40) {
    evidence.push({
      id: `ev-${idCounter++}`,
      category: "Social Engineering",
      indicator: "Threat / Coercion Pattern",
      quoteOrDetail: extracted.threatKeywords.length > 0 ? extracted.threatKeywords.join(", ") : "Account suspension threat",
      sourceAgent: "Message Agent",
      severity: "HIGH",
      riskContributionPoints: 20,
      explanation: "Threatening account suspension, fines, or legal action is a classic scareware tactic.",
    });
  }

  // 4. Financial / Credential Requests
  const hasSuspiciousContext = urls.some(u => u.reputationScore < 60 || u.hasSuspiciousTld) || impersonations.some(i => i.isImpersonated) || message.urgencyScore >= 30 || message.financialBaitScore >= 30;

  if (extracted.requests.payment && hasSuspiciousContext) {
    evidence.push({
      id: `ev-${idCounter++}`,
      category: "Financial Demand",
      indicator: "Unsolicited Fee / Payment Request",
      quoteOrDetail: extracted.paymentAmounts.length > 0 ? `Amount: ${extracted.paymentAmounts.join(", ")}` : "Payment / UPI requested",
      sourceAgent: "Extraction Agent",
      severity: "CRITICAL",
      riskContributionPoints: 20,
      explanation: "Demanding upfront fees, UPI transfers, or processing charges is the hallmark of financial and lottery scams.",
    });
  }

  if (extracted.requests.otpOrPassword || extracted.requests.credentials) {
    evidence.push({
      id: `ev-${idCounter++}`,
      category: "Credential Threat",
      indicator: "OTP / Credential Harvesting Request",
      quoteOrDetail: "Requests OTP, Password, PIN, or Netbanking login",
      sourceAgent: "Extraction Agent",
      severity: "CRITICAL",
      riskContributionPoints: 25,
      explanation: "Legitimate organizations NEVER request your OTP, PIN, or password via SMS/WhatsApp or unsecured links.",
    });
  }

  if (extracted.requests.kycVerification) {
    evidence.push({
      id: `ev-${idCounter++}`,
      category: "Credential Threat",
      indicator: "Unsolicited KYC / Account Verification",
      quoteOrDetail: "Demands PAN / Aadhaar / Bank account verification link",
      sourceAgent: "Extraction Agent",
      severity: "HIGH",
      riskContributionPoints: 15,
      explanation: "Phishing links impersonate bank KYC portals to steal identity documents.",
    });
  }

  return evidence;
}
