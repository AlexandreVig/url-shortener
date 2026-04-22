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

### Cloudflare build logs: "Could not find compiled Open Next config"

If Cloudflare is configured to run `bun run build` (which only runs `next build`)
and then `wrangler deploy`, deploy will fail because OpenNext output in
`.open-next/` was never generated.

Fix by making your Cloudflare **build command** run OpenNext:

- Build command: `bun run cf:build`
- Deploy command: `bun run deploy` (or keep `npx wrangler deploy`)

Example API route:

- `GET /api/health`

## License

[MIT](./LICENSE) © Alexandre Vigneau
