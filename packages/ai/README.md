# @glaife/ai

Security and observability for AI agents. Drop-in wrapper for Vercel AI SDK.

## Installation

```bash
npm install @glaife/ai
# or
bun add @glaife/ai
```

## Quick Start

```typescript
import { glaife, wrapTools } from '@glaife/ai';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Initialize once at app startup
glaife.init({
  apiKey: process.env.GLAIFE_API_KEY!,
  debug: process.env.NODE_ENV === 'development',
});

// Wrap your tools to enable logging
const tools = wrapTools({
  searchKnowledgeBase,
  escalateToHuman,
}, {
  projectId: 'my-project',
  userId: user.id,
  userType: 'member',
});

// Use as normal
const result = streamText({
  model: openai('gpt-4'),
  tools,
  messages,
});
```

## What Gets Logged

- **Tool calls**: Every tool execution with input, output, and latency
- **User context**: Who made the request (userId, userType)
- **Errors**: Any failures during tool execution
- **Metadata**: Custom data you attach

## Configuration

```typescript
glaife.init({
  apiKey: 'your-api-key',        // Required: Get from glaife.com
  baseUrl: 'https://...',         // Optional: Self-hosted endpoint
  debug: true,                    // Optional: Log to console
});
```

## Context Options

```typescript
wrapTools(tools, {
  projectId: 'femcare',           // Your project identifier
  userId: 'user_123',             // Current user ID
  userType: 'premium',            // User tier/role
  sessionId: 'sess_abc',          // Session identifier
  metadata: {                     // Any custom data
    feature: 'chat',
    version: '2.0',
  },
});
```

## Self-Hosting

Glaife is open source. Run your own instance:

```bash
git clone https://github.com/glaife/glaife
cd glaife/apps/web
cp .env.example .env
bun install
bun run dev
```

## License

MIT
