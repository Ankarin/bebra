import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  apiKey: text("api_key").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const logs = pgTable(
  "logs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(() => projects.id),
    timestamp: timestamp("timestamp").notNull(),
    type: text("type").notNull(), // request, tool_call, response, error
    userId: text("user_id"),
    userType: text("user_type"),
    sessionId: text("session_id"),
    model: text("model"),
    messagesCount: integer("messages_count"),
    toolName: text("tool_name"),
    toolInput: jsonb("tool_input"),
    toolOutput: jsonb("tool_output"),
    tokensIn: integer("tokens_in"),
    tokensOut: integer("tokens_out"),
    latencyMs: integer("latency_ms"),
    error: text("error"),
    metadata: jsonb("metadata"),
  },
  (table) => [
    index("logs_project_id_idx").on(table.projectId),
    index("logs_timestamp_idx").on(table.timestamp),
    index("logs_type_idx").on(table.type),
    index("logs_tool_name_idx").on(table.toolName),
    index("logs_user_id_idx").on(table.userId),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
