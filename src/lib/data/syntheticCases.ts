import { SyntheticPresetCase } from "@/types";

export const SYNTHETIC_DEMO_CASES: SyntheticPresetCase[] = [
  {
    id: "case-01-sbi-kyc",
    title: "Fake Bank KYC Block Threat",
    category: "Banking Scam",
    expectedRiskLevel: "CRITICAL",
    inputType: "text",
    description: "Urgent SMS claiming bank account block unless KYC link clicked within 30 mins.",
    rawInput: `Dear SBI User, Your State Bank of India account #9842 is suspended due to non-verification of PAN & KYC. Please update your details immediately to prevent permanent deactivation: https://sbi-secure-login-kyc.xyz/verify. Failure to do so will result in ₹5,000 fine.`
  },
  {
    id: "case-02-lottery-winner",
    title: "₹25,00,000 Kaun Banega Crorepati Lottery",
    category: "Prize/Lottery Scam",
    expectedRiskLevel: "CRITICAL",
    inputType: "text",
    description: "WhatsApp message announcing huge cash prize requiring small upfront processing fee.",
    rawInput: `CONGRATULATION! Dear Customer, You have won ₹25,00,000 in KBC Lucky Draw 2026! Your Lottery No is #7789. To claim your cash prize directly in your bank account, send processing fee of ₹5,999 to UPI ID kbc-manager@ybl or visit http://kbc-claim-prize2026.club immediately. Contact Agent Rana Pratap at +91-98765-43210.`
  },
  {
    id: "case-03-youtube-job",
    title: "Part-time YouTube Like & Earn Offer",
    category: "Job Scam",
    expectedRiskLevel: "HIGH",
    inputType: "text",
    description: "Telegram/WhatsApp job offer promising ₹5,000/day for trivial tasks, requiring deposit.",
    rawInput: `Hi! I am HR Priya from Global Media HR. We offer work from home job: earn ₹3,000 to ₹8,000 per day by just liking YouTube videos. No experience required! Interested candidates join our official Telegram channel: https://work-from-home-task.top or message HR via WhatsApp +91-91234-56789. Initial registration deposit of ₹1,000 required for task allocation.`
  },
  {
    id: "case-04-crypto-invest",
    title: "Guaranteed 300% Crypto Profit Scam",
    category: "Financial Scam",
    expectedRiskLevel: "CRITICAL",
    inputType: "text",
    description: "High-yield investment promise offering 3x return in 24 hours.",
    rawInput: `🚀 Exclusive VIP Investment Signal! Double your Bitcoin & USDT in 24 Hours with AI Trading Bot. Guaranteed 300% ROI back to your wallet. Over 10,000 satisfied investors! Transfer minimum $100 USDT to wallet address 0x71C7656EC7ab88b098defB751B7401B5f6d8976F or register at https://binance-yield-multiplier.trade now!`
  },
  {
    id: "case-05-courier-customs",
    title: "Unpaid Parcel Customs Payment Alert",
    category: "Delivery Scam",
    expectedRiskLevel: "HIGH",
    inputType: "text",
    description: "SMS impersonating FedEx / India Post demanding delivery fee for held parcel.",
    rawInput: `[FedEx Alert]: Your package #FX-982301 could not be delivered due to incomplete address & unpaid customs charge of ₹149. Delivery will be cancelled in 12 hours. Pay pending charge to reschedule delivery: https://fedex-parcel-tracking-update.xyz/pay`
  },
  {
    id: "case-06-tech-support",
    title: "Microsoft Windows Critical Virus Warning",
    category: "Tech Support Scam",
    expectedRiskLevel: "HIGH",
    inputType: "text",
    description: "Scareware alert warning of computer infection and urging to call fake toll-free support.",
    rawInput: `SYSTEM SECURITY ALERT: Windows Defender detected Trojan Virus (Bhoj.exe) on your computer! Your banking credentials and personal photos are at risk of leak. Do NOT restart your PC. Call Certified Microsoft Technician immediately at +1-888-555-0199 or visit https://microsoft-helpdesk-security.com for instant repair.`
  },
  {
    id: "case-07-sim-kyc",
    title: "Jio SIM Deactivation Emergency",
    category: "SIM/Telecom Scam",
    expectedRiskLevel: "CRITICAL",
    inputType: "text",
    description: "Fake telecom notice threatening SIM card deactivation in 1 hour.",
    rawInput: `Notice from TRAI / Telecom Dept: Your Jio 4G SIM card #987123XXXX will be blocked within 1 HOUR due to pending biometric e-KYC. To stop deactivation, call Telecom Executive immediately at +91-99887-76655 or verify at http://jio-sim-update-kyc.com.`
  },
  {
    id: "case-08-tax-refund",
    title: "Income Tax Department Approved Refund",
    category: "Identity/KYC Scam",
    expectedRiskLevel: "CRITICAL",
    inputType: "text",
    description: "Fake gov tax refund notification luring user to enter netbanking credentials.",
    rawInput: `Government of India - Income Tax Department: You have an approved refund of ₹14,250 for Assessment Year 2025-26. The amount will be credited to your account after bank account verification. Update your netbanking details at https://incometax-efiling-refund-gov.online/login.`
  },
  {
    id: "case-09-phishing-instagram",
    title: "Instagram Copyright Infringement Notice",
    category: "Phishing",
    expectedRiskLevel: "HIGH",
    inputType: "text",
    description: "Fake social media copyright violation notice threatening account deletion.",
    rawInput: `Instagram Copyright Center: We received multiple reports of copyright infringement on your account (@user). Your account will be permanently deleted within 24 hours. If you believe this is a mistake, file an appeal now at https://instagram-copyright-appeal-center.xyz/appeal.`
  },
  {
    id: "case-10-legitimate-bank",
    title: "Legitimate Bank Transaction Alert (Safe)",
    category: "Legitimate",
    expectedRiskLevel: "LOW",
    inputType: "text",
    description: "Real transaction SMS from HDFC Bank with official domain link.",
    rawInput: `Dear Customer, A/C *4321 credited by Rs 5,000.00 on 08-Oct-26 via UPI Ref 4291083921. Balance: Rs 42,390.20. For queries visit https://hdfcbank.com or call 18002664332 - HDFC Bank.`
  }
];
