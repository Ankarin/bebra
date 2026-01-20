# Glaife

Open source security and observability for AI agents.

## Structure

```
glaife/
├── packages/
│   └── ai/           # @glaife/ai npm package
└── apps/
    └── web/          # glaife.com dashboard
```

## Quick Start

### Using the SDK

```bash
npm install @glaife/ai
```

```typescript
import { glaife, wrapTools } from '@glaife/ai';
import { streamText } from 'ai';

// Initialize
glaife.init({
  apiKey: process.env.GLAIFE_API_KEY!,
});

// Wrap your tools
const tools = wrapTools({
  searchKnowledgeBase,
  escalateToHuman,
}, {
  projectId: 'my-project',
  userId: user.id,
});

// Use as normal
const result = streamText({
  model: openai('gpt-4'),
  tools,
  messages,
});
```

### Self-Hosting

```bash
# Clone
git clone https://github.com/glaife/glaife
cd glaife

# Install
bun install

# Set up env
cp apps/web/.env.example apps/web/.env
# Add:
#   DATABASE_URL=your-neon-db-url
#   ADMIN_PASSWORD=your-secure-password

# Push DB schema
cd apps/web && bun run push

# Run
cd ../.. && bun run dev
```

## Development

```bash
# Run dashboard
bun run dev

# Run everything (dashboard + package watch)
bun run dev:all

# Build
bun run build
```

## Auth

Dashboard uses simple password auth (set via `ADMIN_PASSWORD` env var).
SDK uses API keys generated in the dashboard.

## License

MIT
