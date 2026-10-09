import { ImpersonationResult } from "@/types";

const BRAND_DICTIONARY: Record<string, { officialDomains: string[]; keywords: string[] }> = {
  "State Bank of India": { officialDomains: ["sbi.co.in", "onlinesbi.sbi", "bank.sbi"], keywords: ["sbi", "statebank", "onlinesbi"] },
  "SBI": { officialDomains: ["sbi.co.in", "onlinesbi.sbi", "bank.sbi"], keywords: ["sbi", "onlinesbi"] },
  "HDFC": { officialDomains: ["hdfcbank.com", "hdfc.com"], keywords: ["hdfc", "hdfcbank"] },
  "ICICI": { officialDomains: ["icicibank.com"], keywords: ["icici", "icicibank"] },
  "Axis Bank": { officialDomains: ["axisbank.com"], keywords: ["axis", "axisbank"] },
  "Google": { officialDomains: ["google.com", "accounts.google.com"], keywords: ["google", "g00gle", "gmail"] },
  "Microsoft": { officialDomains: ["microsoft.com", "support.microsoft.com"], keywords: ["microsoft", "m1crosoft", "windows"] },
  "Amazon": { officialDomains: ["amazon.com", "amazon.in"], keywords: ["amazon", "amzn"] },
  "Instagram": { officialDomains: ["instagram.com"], keywords: ["instagram", "insta"] },
  "WhatsApp": { officialDomains: ["whatsapp.com"], keywords: ["whatsapp"] },
  "FedEx": { officialDomains: ["fedex.com"], keywords: ["fedex"] },
  "India Post": { officialDomains: ["indiapost.gov.in"], keywords: ["indiapost", "post-office"] },
  "Income Tax Department": { officialDomains: ["incometax.gov.in", "incometaxindia.gov.in"], keywords: ["incometax", "efiling"] },
  "Jio": { officialDomains: ["jio.com"], keywords: ["jio"] },
  "Airtel": { officialDomains: ["airtel.in"], keywords: ["airtel"] },
  "Netflix": { officialDomains: ["netflix.com"], keywords: ["netflix"] },
  "Binance": { officialDomains: ["binance.com"], keywords: ["binance"] },
};

export function checkImpersonation(
  claimedOrgs: string[],
  domains: string[]
): ImpersonationResult[] {
  const results: ImpersonationResult[] = [];

  if (domains.length === 0 || claimedOrgs.length === 0) {
    return results;
  }

  for (const org of claimedOrgs) {
    // Find matching brand info
    const brandKey = Object.keys(BRAND_DICTIONARY).find(
      (b) => b.toLowerCase() === org.toLowerCase() || BRAND_DICTIONARY[b].keywords.includes(org.toLowerCase())
    );

    if (!brandKey) continue;
    const brandData = BRAND_DICTIONARY[brandKey];

    for (const domain of domains) {
      const lowerDomain = domain.toLowerCase();
      const isOfficial = brandData.officialDomains.some(
        (off) => lowerDomain === off || lowerDomain.endsWith("." + off)
      );

      if (isOfficial) {
        results.push({
          claimedBrand: brandKey,
          actualDomain: domain,
          isImpersonated: false,
          confidence: 95,
          reason: `Domain '${domain}' is an official domain for ${brandKey}.`,
          officialDomain: brandData.officialDomains[0],
        });
      } else {
        // Check if domain contains brand keyword (e.g. "sbi-secure-login-kyc.xyz" contains "sbi")
        const matchesKeyword = brandData.keywords.some((kw) => lowerDomain.includes(kw));

        if (matchesKeyword) {
          results.push({
            claimedBrand: brandKey,
            actualDomain: domain,
            isImpersonated: true,
            confidence: 90,
            reason: `Claimed organization is '${brandKey}', but domain '${domain}' is NOT official (Official domain: ${brandData.officialDomains[0]}). High probability of brand impersonation.`,
            officialDomain: brandData.officialDomains[0],
          });
        }
      }
    }
  }

  return results;
}
