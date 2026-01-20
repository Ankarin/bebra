import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { logs, projects } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = authHeader.substring(7);

    // Validate API key and get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const { logs: logEntries } = body;

    if (!Array.isArray(logEntries) || logEntries.length === 0) {
      return NextResponse.json({ error: "No logs provided" }, { status: 400 });
    }

    // Insert logs
    const logsToInsert = logEntries.map((entry: any) => ({
      id: entry.id,
      projectId: project.id,
      timestamp: new Date(entry.timestamp),
      type: entry.type,
      userId: entry.userId,
      userType: entry.userType,
      sessionId: entry.sessionId,
      model: entry.model,
      messagesCount: entry.messagesCount,
      toolName: entry.toolName,
      toolInput: entry.toolInput,
      toolOutput: entry.toolOutput,
      tokensIn: entry.tokensIn,
      tokensOut: entry.tokensOut,
      latencyMs: entry.latencyMs,
      error: entry.error,
      metadata: entry.metadata,
    }));

    await db.insert(logs).values(logsToInsert);

    return NextResponse.json({ success: true, count: logsToInsert.length });
  } catch (error) {
    console.error("[Ingest API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
