import type { GlaifeConfig, GlaifeContext, LogEntry } from "./types";

const DEFAULT_BASE_URL = "https://glaife.com/api/ingest";

class GlaifeClient {
  private config: GlaifeConfig;
  private queue: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private flushInterval = 1000; // 1 second
  private maxBatchSize = 100;

  constructor(config: GlaifeConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
    };
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  log(entry: Omit<LogEntry, "id" | "timestamp">): void {
    const fullEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    if (this.config.debug) {
      console.log("[glaife]", fullEntry);
    }

    this.queue.push(fullEntry);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.maxBatchSize);

    try {
      const response = await fetch(this.config.baseUrl!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({ logs: batch }),
      });

      if (!response.ok) {
        console.error("[glaife] Failed to send logs:", response.status);
        // Re-queue failed logs
        this.queue.unshift(...batch);
      }
    } catch (error) {
      console.error("[glaife] Failed to send logs:", error);
      // Re-queue failed logs
      this.queue.unshift(...batch);
    }
  }

  logRequest(
    context: GlaifeContext,
    params: {
      model?: string;
      messagesCount?: number;
    }
  ): string {
    const requestId = this.generateId();
    this.log({
      ...context,
      type: "request",
      model: params.model,
      messagesCount: params.messagesCount,
    });
    return requestId;
  }

  logToolCall(
    context: GlaifeContext,
    params: {
      toolName: string;
      toolInput: unknown;
      toolOutput: unknown;
      latencyMs: number;
      error?: string;
    }
  ): void {
    this.log({
      ...context,
      type: "tool_call",
      toolName: params.toolName,
      toolInput: params.toolInput,
      toolOutput: params.toolOutput,
      latencyMs: params.latencyMs,
      error: params.error,
    });
  }

  logResponse(
    context: GlaifeContext,
    params: {
      model?: string;
      tokensIn?: number;
      tokensOut?: number;
      latencyMs: number;
    }
  ): void {
    this.log({
      ...context,
      type: "response",
      model: params.model,
      tokensIn: params.tokensIn,
      tokensOut: params.tokensOut,
      latencyMs: params.latencyMs,
    });
  }

  logError(context: GlaifeContext, error: string): void {
    this.log({
      ...context,
      type: "error",
      error,
    });
  }
}

let defaultClient: GlaifeClient | null = null;

export function createGlaife(config: GlaifeConfig): GlaifeClient {
  return new GlaifeClient(config);
}

export const glaife = {
  init(config: GlaifeConfig): void {
    defaultClient = new GlaifeClient(config);
  },

  getClient(): GlaifeClient {
    if (!defaultClient) {
      throw new Error(
        "[glaife] Client not initialized. Call glaife.init() first."
      );
    }
    return defaultClient;
  },

  log(entry: Omit<LogEntry, "id" | "timestamp">): void {
    this.getClient().log(entry);
  },

  flush(): Promise<void> {
    return this.getClient().flush();
  },
};
