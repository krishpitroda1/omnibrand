import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "HEALTHY",
    service: "omnibrand-os-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: "1.0.0-commercial",
  });
}
