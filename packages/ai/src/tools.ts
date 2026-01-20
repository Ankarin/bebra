import type { Tool } from "ai";
import { glaife } from "./client";
import type { GlaifeContext } from "./types";

type ToolsRecord = Record<string, Tool>;

/**
 * Wraps tools to add logging for every tool call
 *
 * @example
 * ```ts
 * import { wrapTools } from '@glaife/ai';
 *
 * const tools = wrapTools({
 *   searchKnowledgeBase,
 *   escalateToHuman,
 * }, { projectId: 'femcare', userId: user.id });
 *
 * const result = streamText({
 *   model,
 *   tools,
 *   messages,
 * });
 * ```
 */
export function wrapTools<T extends ToolsRecord>(
  tools: T,
  context: GlaifeContext
): T {
  const wrappedTools: ToolsRecord = {};

  for (const [name, tool] of Object.entries(tools)) {
    const originalExecute = tool.execute;

    if (!originalExecute) {
      wrappedTools[name] = tool;
      continue;
    }

    wrappedTools[name] = {
      ...tool,
      execute: async (input: unknown, options: unknown) => {
        const startTime = Date.now();
        let output: unknown;
        let error: string | undefined;

        try {
          output = await originalExecute(input, options);
          return output;
        } catch (err) {
          error = err instanceof Error ? err.message : String(err);
          throw err;
        } finally {
          const latencyMs = Date.now() - startTime;

          glaife.log({
            ...context,
            type: "tool_call",
            toolName: name,
            toolInput: input,
            toolOutput: output,
            latencyMs,
            error,
          });
        }
      },
    };
  }

  return wrappedTools as T;
}
