import {
  AgentLogStep,
  ExtractedEntities,
  GraphEdgeData,
  GraphNodeData,
  InvestigationReport,
  ScamInvestigationGraph,
  UrlInvestigation,
} from "@/types";
import { extractEntities } from "./extractionAgent";
import { checkImpersonation } from "./impersonationAgent";
import { investigateUrl } from "./urlAgent";
import { analyzeMessage } from "./messageAgent";
import { collectEvidence } from "./evidenceEngine";
import { calculateDeterministicRiskScore } from "./riskEngine";
import { determineScamVerdict } from "./decisionAgent";

export async function runAutonomousInvestigation(
  rawInput: string,
  inputType: "text" | "email" | "url" | "phone" | "screenshot" = "text",
  screenshotUrl?: string,
  userApiKey?: string
): Promise<InvestigationReport> {
  const startTime = Date.now();
  const caseId = `SS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const logs: AgentLogStep[] = [];
  const addLog = (
    agentName: string,
    agentRole: string,
    description: string,
    status: AgentLogStep["status"] = "completed",
    detail?: string
  ) => {
    logs.push({
      id: `log-${logs.length + 1}`,
      agentName,
      agentRole,
      timestamp: new Date().toLocaleTimeString(),
      status,
      description,
      detail,
    });
  };

  // Step 1: Extraction Agent
  addLog("Extraction Agent", "Entity Parser", "Extracting indicators, URLs, phone numbers, org names, and payment requests...", "running");
  const extractedEntities = extractEntities(rawInput);
  addLog(
    "Extraction Agent",
    "Entity Parser",
    `Extracted ${extractedEntities.urls.length} URLs, ${extractedEntities.phoneNumbers.length} Phone Nos, ${extractedEntities.organizationNames.length} Orgs.`,
    "completed"
  );

  // Step 2: URL Agent
  addLog("URL Agent", "Domain Threat Intelligence", "Investigating URL reputation, SSL status, TLD risk, and VirusTotal threat data...", "running");
  const urlAnalysisList = [];
  for (const url of extractedEntities.urls) {
    const urlRes = await investigateUrl(url, userApiKey);
    urlAnalysisList.push(urlRes);
  }
  addLog(
    "URL Agent",
    "Domain Threat Intelligence",
    `Investigated ${urlAnalysisList.length} domains. Reputation scores computed.`,
    urlAnalysisList.some((u) => u.reputationScore < 50) ? "warning" : "completed"
  );

  // Step 3: Impersonation Agent
  addLog("Impersonation Agent", "Brand Protection", "Cross-checking claimed organizations against domain authenticity...", "running");
  const impersonations = checkImpersonation(extractedEntities.organizationNames, extractedEntities.domains);
  addLog(
    "Impersonation Agent",
    "Brand Protection",
    impersonations.some((i) => i.isImpersonated)
      ? "ALERT: Brand Impersonation mismatch detected!"
      : "Brand verification complete.",
    impersonations.some((i) => i.isImpersonated) ? "warning" : "completed"
  );

  // Step 4: Message Analysis Agent
  addLog("Message Agent", "NLP Social Engineering", "Analyzing urgency, panic tactics, fear factor, and financial bait...", "running");
  const messageAnalysis = analyzeMessage(rawInput, extractedEntities);
  addLog(
    "Message Agent",
    "NLP Social Engineering",
    `Urgency: ${messageAnalysis.urgencyScore}%, Fear: ${messageAnalysis.fearScore}%, Financial Bait: ${messageAnalysis.financialBaitScore}%.`,
    "completed"
  );

  // Step 5: Evidence Engine
  addLog("Evidence Engine", "Threat Correlation", "Aggregating and deduplicating cross-agent evidence items...", "running");
  const evidenceList = collectEvidence(extractedEntities, urlAnalysisList, impersonations, messageAnalysis, rawInput);
  addLog("Evidence Engine", "Threat Correlation", `Compiled ${evidenceList.length} weighted evidence indicators.`, "completed");

  // Step 6: Risk Engine (Deterministic)
  addLog("Risk Engine", "Deterministic Calculator", "Calculating transparent risk score & points breakdown...", "running");
  const riskScoreDetails = calculateDeterministicRiskScore(evidenceList);
  addLog(
    "Risk Engine",
    "Deterministic Calculator",
    `Calculated Deterministic Risk Score: ${riskScoreDetails.totalScore}/100 (${riskScoreDetails.riskLevel} RISK).`,
    riskScoreDetails.totalScore > 50 ? "warning" : "completed"
  );

  // Step 7: Decision Agent & Report Generator
  addLog("Decision Agent", "Scam Classifier", "Formulating final verdict, scam category, confidence, and safety guidelines...", "running");
  const verdict = determineScamVerdict(
    extractedEntities,
    urlAnalysisList,
    impersonations,
    messageAnalysis,
    evidenceList,
    riskScoreDetails,
    rawInput
  );
  addLog("Decision Agent", "Scam Classifier", `Final Verdict: ${verdict.scamCategory} (${verdict.confidenceScore}% Confidence).`, "completed");

  // Build Investigation Graph
  const graphData = buildInvestigationGraph(
    rawInput,
    extractedEntities,
    urlAnalysisList,
    impersonations,
    evidenceList,
    riskScoreDetails,
    verdict.scamCategory
  );

  return {
    caseId,
    createdAt: new Date().toISOString(),
    inputType,
    rawInput,
    screenshotUrl,
    extractedEntities,
    urlAnalysisList,
    messageAnalysis,
    evidenceList,
    riskScoreDetails,
    scamCategory: verdict.scamCategory,
    confidenceScore: verdict.confidenceScore,
    aiExplanation: verdict.aiExplanation,
    recommendedActions: verdict.recommendedActions,
    graphData,
    agentStepsLog: logs,
  };
}

function buildInvestigationGraph(
  rawInput: string,
  extracted: ExtractedEntities,
  urls: UrlInvestigation[],
  impersonations: any[],
  evidence: any[],
  riskDetails: any,
  scamCategory: string
): ScamInvestigationGraph {
  const nodes: GraphNodeData[] = [];
  const edges: GraphEdgeData[] = [];

  // Root Input Node
  nodes.push({
    id: "node-root",
    label: "SUSPECT INPUT",
    type: "input",
    subtext: rawInput.slice(0, 45) + (rawInput.length > 45 ? "..." : ""),
  });

  // Entity Nodes
  if (extracted.organizationNames.length > 0) {
    const orgLabel = extracted.organizationNames.join(", ");
    nodes.push({
      id: "node-org",
      label: `CLAIMED BRAND: ${orgLabel}`,
      type: "brand",
      subtext: impersonations.some((i) => i.isImpersonated) ? "⚠️ IMPERSONATION RISKS" : "Official Entity",
    });
    edges.push({ id: "edge-root-org", source: "node-root", target: "node-org", label: "Claims Entity" });
  }

  if (urls.length > 0) {
    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      const domainNodeId = `node-domain-${i}`;
      nodes.push({
        id: domainNodeId,
        label: `DOMAIN: ${u.domain}`,
        type: "domain",
        riskLevel: u.reputationScore < 50 ? "HIGH" : "LOW",
        subtext: u.hasSuspiciousTld ? `Suspicious TLD (${u.tld})` : "Domain Inspected",
      });
      edges.push({ id: `edge-root-domain-${i}`, source: "node-root", target: domainNodeId, label: "Contains URL" });

      // Domain -> Rep check edge
      const repNodeId = `node-rep-${i}`;
      nodes.push({
        id: repNodeId,
        label: `VIRUSTOTAL / INTEL`,
        type: "indicator",
        riskLevel: u.reputationScore < 50 ? "CRITICAL" : "LOW",
        subtext: `Reputation: ${u.reputationScore}/100`,
      });
      edges.push({ id: `edge-domain-rep-${i}`, source: domainNodeId, target: repNodeId, label: "Reputation Check" });
    }
  }

  if (extracted.phoneNumbers.length > 0) {
    nodes.push({
      id: "node-phone",
      label: `PHONE: ${extracted.phoneNumbers[0]}`,
      type: "entity",
      subtext: "Sender / Contact Phone",
    });
    edges.push({ id: "edge-root-phone", source: "node-root", target: "node-phone", label: "Extracted Contact" });
  }

  // Evidence Indicator Nodes
  evidence.slice(0, 3).forEach((ev, idx) => {
    const evNodeId = `node-ev-${idx}`;
    nodes.push({
      id: evNodeId,
      label: ev.indicator,
      type: "indicator",
      riskLevel: ev.severity,
      subtext: `${ev.category} (+${ev.riskContributionPoints} pts)`,
    });
    edges.push({ id: `edge-root-ev-${idx}`, source: "node-root", target: evNodeId, label: "Extracted Evidence" });
  });

  // Final Verdict Node
  nodes.push({
    id: "node-verdict",
    label: `${riskDetails.riskLevel} RISK (${riskDetails.totalScore}/100)`,
    type: "verdict",
    riskLevel: riskDetails.riskLevel,
    subtext: `Scam Type: ${scamCategory}`,
  });

  // Connect indicators / domain to verdict
  nodes.forEach((n) => {
    if (n.type === "indicator" || n.type === "domain" || n.type === "brand") {
      edges.push({
        id: `edge-${n.id}-verdict`,
        source: n.id,
        target: "node-verdict",
        style: n.riskLevel === "CRITICAL" || n.riskLevel === "HIGH" ? "danger" : "solid",
      });
    }
  });

  return { nodes, edges };
}
