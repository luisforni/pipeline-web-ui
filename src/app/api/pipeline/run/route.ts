import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const orchestratorUrl =
    process.env.ORCHESTRATOR_URL || "http://localhost:9000";

  const body = await request.json();

  const upstream = await fetch(`${orchestratorUrl}/pipeline/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
