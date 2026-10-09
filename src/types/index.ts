export type ScamCategory =
  | "Phishing"
  | "Financial Scam"
  | "Prize/Lottery Scam"
  | "Job Scam"
  | "Romance Scam"
  | "Banking Scam"
  | "Delivery Scam"
  | "Tech Support Scam"
  | "Identity/KYC Scam"
  | "SIM/Telecom Scam"
  | "Legitimate";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ExtractedEntities {
  phoneNumbers: string[];
  emailAddresses: string[];
  urls: string[];
  domains: string[];
  names: string[];
  organizationNames: string[];
  paymentAmounts: string[];
  urgencyKeywords: string[];
  threatKeywords: string[];
  rewardKeywords: string[];
  requests: {
    otpOrPassword: boolean;
    payment: boolean;
    kycVerification: boolean;
    credentials: boolean;
    personalData: boolean;
  };
}

export interface ImpersonationResult {
  claimedBrand?: string;
  actualDomain?: string;
  isImpersonated: boolean;
  confidence: number;
  reason: string;
  officialDomain?: string;
}

export interface UrlInvestigation {
  rawUrl: string;
  domain: string;
  isHttps: boolean;
  hasSuspiciousTld: boolean;
  tld: string;
  subdomains: string[];
  typosquattingDetected: boolean;
  impersonatedBrand?: string;
  similarityScore?: number;
  reputationScore: number; // 0 (malicious) to 100 (clean)
  knownThreats: string[];
  redirectChain: string[];
  domainAgeEstimatedDays?: number;
  sslValid: boolean;
  virustotalResult?: {
    scanned: boolean;
    maliciousCount: number;
    suspiciousCount: number;
    harmlessCount: number;
    undetectedCount: number;
    permalink?: string;
  };
  safeBrowsingResult?: {
    isMalicious: boolean;
    threatTypes: string[];
  };
}

export interface MessageAnalysis {
  urgencyScore: number; // 0 to 100
  fearScore: number; // 0 to 100
  authorityScore: number; // 0 to 100
  financialBaitScore: number; // 0 to 100
  socialEngineeringTactics: string[];
  detectedIntent: string;
}

export interface EvidenceItem {
  id: string;
  category: "URL Intelligence" | "Impersonation" | "Social Engineering" | "Credential Threat" | "Financial Demand" | "Brand Trust";
  indicator: string;
  quoteOrDetail: string;
  sourceAgent: "Extraction Agent" | "URL Agent" | "Message Agent" | "Impersonation Agent" | "Vision Agent";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskContributionPoints: number;
  explanation: string;
}

export interface RiskScoreDetails {
  totalScore: number; // 0 to 100
  riskLevel: RiskLevel;
  breakdown: {
    category: string;
    pointsAdded: number;
    reason: string;
  }[];
}

export interface AgentLogStep {
  id: string;
  agentName: string;
  agentRole: string;
  timestamp: string;
  status: "pending" | "running" | "completed" | "warning" | "error";
  description: string;
  detail?: string;
  durationMs?: number;
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: "input" | "entity" | "brand" | "domain" | "indicator" | "verdict";
  riskLevel?: RiskLevel;
  details?: string;
  subtext?: string;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: "solid" | "dashed" | "danger";
}

export interface ScamInvestigationGraph {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
}

export interface InvestigationReport {
  caseId: string;
  createdAt: string;
  inputType: "text" | "email" | "url" | "phone" | "screenshot";
  rawInput: string;
  screenshotUrl?: string;
  ocrTextExtracted?: string;
  extractedEntities: ExtractedEntities;
  urlAnalysisList: UrlInvestigation[];
  messageAnalysis: MessageAnalysis;
  evidenceList: EvidenceItem[];
  riskScoreDetails: RiskScoreDetails;
  scamCategory: ScamCategory;
  confidenceScore: number; // 0 to 100
  aiExplanation: {
    summary: string;
    tacticsUsed: string[];
    threatsFound: string[];
    whyRiskScore: string;
  };
  recommendedActions: string[];
  graphData: ScamInvestigationGraph;
  agentStepsLog: AgentLogStep[];
}

export interface SyntheticPresetCase {
  id: string;
  title: string;
  category: ScamCategory;
  expectedRiskLevel: RiskLevel;
  inputType: "text" | "email" | "url" | "phone" | "screenshot";
  rawInput: string;
  description: string;
  screenshotUrl?: string;
}
