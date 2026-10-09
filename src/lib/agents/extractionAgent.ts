import { ExtractedEntities } from "@/types";

export function extractEntities(inputText: string): ExtractedEntities {
  const text = inputText || "";

  // 1. Phone numbers matching Indian and international formats
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,6}/g;
  const rawPhones = text.match(phoneRegex) || [];
  const phoneNumbers = Array.from(
    new Set(
      rawPhones
        .map((p) => p.trim())
        .filter((p) => p.replace(/\D/g, "").length >= 7 && p.replace(/\D/g, "").length <= 15)
    )
  );

  // 2. Email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailAddresses = Array.from(new Set((text.match(emailRegex) || []).map((e) => e.toLowerCase().trim())));

  // 3. URLs
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+)/gi;
  const rawUrls = text.match(urlRegex) || [];

  // Also catch un-prefixed suspicious domains like "sbi-kyc.xyz/claim" or "kbc-prize.club"
  const domainPattern = /\b([a-zA-Z0-9-]+\.(?:com|org|net|xyz|club|top|online|site|tech|trade|info|gov|in|co\.in|vip|cc|tk|ml|ga|cf|gq|co))\b(?:\/[^\s]*)?/gi;
  let matches;
  const extractedRawUrls = [...rawUrls];
  while ((matches = domainPattern.exec(text)) !== null) {
    const fullMatch = matches[0];
    if (!extractedRawUrls.some((u) => u.includes(fullMatch))) {
      extractedRawUrls.push(fullMatch.startsWith("http") ? fullMatch : `http://${fullMatch}`);
    }
  }
  const urls = Array.from(new Set(extractedRawUrls));

  // Extract domains
  const domains = Array.from(
    new Set(
      urls
        .map((u) => {
          try {
            const parsed = new URL(u.startsWith("http") ? u : `http://${u}`);
            return parsed.hostname.toLowerCase();
          } catch {
            return "";
          }
        })
        .filter((d) => d.length > 0)
    )
  );

  // 4. Payment Amounts (INR ₹ / Rs / USD $)
  const amountRegex = /(?:₹|Rs\.?|INR|\$|USD|EUR)\s?\d+(?:,\d+)*(?:\.\d{2})?/gi;
  const paymentAmounts = Array.from(new Set(text.match(amountRegex) || []));

  // 5. Urgency Keywords
  const urgencyTerms = [
    "immediately", "urgent", "urgently", "within 30 minutes", "within 1 hour", "within 24 hours",
    "expire", "expiring", "suspended", "suspension", "block", "blocked", "deactivated", "deactivation",
    "last chance", "act now", "action required", "time sensitive", "today only"
  ];
  const urgencyKeywords = urgencyTerms.filter((term) =>
    new RegExp(`\\b${term}\\b`, "i").test(text)
  );

  // 6. Threat Keywords
  const threatTerms = [
    "fine", "penalty", "police", "legal action", "arrest", "blocked", "deactivated", "suspended",
    "virus", "trojan", "infected", "lawsuit", "court", "trai", "customs", "seized", "deleted"
  ];
  const threatKeywords = threatTerms.filter((term) =>
    new RegExp(`\\b${term}\\b`, "i").test(text)
  );

  // 7. Reward / Financial Bait Keywords
  const rewardTerms = [
    "won", "winner", "congratulation", "congratulations", "lottery", "cash prize", "bonus",
    "roi", "guaranteed profit", "refund", "cashback", "free gift", "claim prize", "jackpot"
  ];
  const rewardKeywords = rewardTerms.filter((term) =>
    new RegExp(`\\b${term}\\b`, "i").test(text)
  );

  // 8. Organization names mentioned
  const knownOrgs = [
    "SBI", "State Bank of India", "HDFC", "ICICI", "Axis Bank", "Punjab National Bank", "PNB",
    "Google", "Microsoft", "Amazon", "Instagram", "WhatsApp", "Telegram", "FedEx", "India Post",
    "TRAI", "Jio", "Airtel", "Income Tax Department", "Income Tax", "KBC", "Kaun Banega Crorepati",
    "Binance", "USDT", "PayTM", "PhonePe", "Netflix"
  ];
  const organizationNames = knownOrgs.filter((org) =>
    new RegExp(`\\b${org.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i").test(text)
  );

  // 9. Names mentioned (e.g. "HR Priya", "Agent Rana Pratap")
  const nameRegex = /(?:Agent|HR|Officer|Executive|Manager|Dr\.|Sir|Madam)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;
  const names: string[] = [];
  let nameMatch;
  while ((nameMatch = nameRegex.exec(text)) !== null) {
    names.push(nameMatch[0]);
  }

  // 10. Specific Action Requests
  const requests = {
    otpOrPassword: /\b(otp|one time password|pin|passcode|password|cvv)\b/i.test(text),
    payment: /\b(fee|charge|deposit|pay|transfer|send money|processing fee|upi|wallet)\b/i.test(text),
    kycVerification: /\b(kyc|pan|aadhaar|verify|verification|update details|biometric)\b/i.test(text),
    credentials: /\b(login|netbanking|password|username|credential|account details)\b/i.test(text),
    personalData: /\b(bank account|card number|ssn|date of birth|dob|address)\b/i.test(text),
  };

  return {
    phoneNumbers,
    emailAddresses,
    urls,
    domains,
    names: Array.from(new Set(names)),
    organizationNames: Array.from(new Set(organizationNames)),
    paymentAmounts,
    urgencyKeywords,
    threatKeywords,
    rewardKeywords,
    requests,
  };
}
