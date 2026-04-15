import { NextRequest, NextResponse } from "next/server";
import http from "http";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const orchestratorUrl =
    process.env.ORCHESTRATOR_URL || "http://localhost:9000";
  const url = new URL("/pipeline/run", orchestratorUrl);
  const body = JSON.stringify(await request.json());

  const data = await new Promise<{ status: number; body: unknown }>(
    (resolve, reject) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port || 80,
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
        },
        (res) => {
          let raw = "";
          res.on("data", (chunk) => (raw += chunk));
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode ?? 200, body: JSON.parse(raw) });
            } catch {
              resolve({ status: res.statusCode ?? 200, body: raw });
            }
          });
        }
      );
      req.on("error", reject);
      req.write(body);
      req.end();
    }
  );

  return NextResponse.json(data.body, { status: data.status });
}
