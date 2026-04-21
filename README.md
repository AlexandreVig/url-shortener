# Next.js template

This is a Next.js template using RetroUI components via the shadcn registry.

## Cloudflare (Workers)

This project is set up to run on Cloudflare Workers using the OpenNext adapter.

Local development:

```bash
bun dev
```

Local preview in the Workers runtime:

```bash
bun run preview
```

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

Example API route:

- `GET /api/health`

### Note about Cloudflare Pages

Cloudflare's current recommended approach for full-stack Next.js (SSR + API
routes) is deploying to **Workers** via OpenNext. Pages is great for static
sites, but for this setup you should deploy the app as a Worker.

## Adding RetroUI components

```bash
bunx shadcn@latest add @retroui/button
```

## Using RetroUI components

```tsx
import { Button } from "@/components/retroui/Button"
```
