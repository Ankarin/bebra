export interface GlaifeConfig {
  apiKey: string;
  baseUrl?: string;
  debug?: boolean;
}

export interface GlaifeContext {
  projectId?: string;
  userId?: string;
  userType?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
  userType?: string;
  sessionId?: string;
  type: "request" | "tool_call" | "response" | "error";
  model?: string;
  messagesCount?: number;
  toolName?: string;
  toolInput?: unknown;
  toolOutput?: unknown;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolCallLog {
  name: string;
  input: unknown;
  output: unknown;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  error?: string;
}
