import { NextRequest, NextResponse } from "next/server";
import { runAutonomousInvestigation } from "@/lib/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawInput, inputType = "text", screenshotUrl, userApiKey } = body;

    if (!rawInput && !screenshotUrl) {
      return NextResponse.json({ error: "Input text or screenshot is required." }, { status: 400 });
    }

    const report = await runAutonomousInvestigation(
      rawInput || "",
      inputType,
      screenshotUrl,
      userApiKey
    );

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Investigation API error:", error);
    return NextResponse.json(
      { error: "Investigation failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
