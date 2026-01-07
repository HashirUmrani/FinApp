import arcjet, { detectBot, shield } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import { seedTransactions } from "@/actions/seed";

const aj = arcjet({
  key: process.env.ARCJET_KEY, // ✅ ensure defined
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // ✅ REQUIRED
    }),
  ],
});

export const runtime = "nodejs"; // ✅ REQUIRED for Arcjet

export async function POST(req: NextRequest) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const result = await seedTransactions();
  return NextResponse.json(result);
}
