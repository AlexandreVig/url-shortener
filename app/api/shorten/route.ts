import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { CloudflareEnv } from "@/cloudflare-env"

function generateCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  // Rejection sampling: discard bytes >= threshold to avoid modulo bias
  // (256 % 62 === 8, so bytes 248–255 would over-represent chars 0–7)
  const threshold = 256 - (256 % chars.length)
  const result: string[] = []
  while (result.length < length) {
    const batch = new Uint8Array(length * 2)
    crypto.getRandomValues(batch)
    for (const byte of batch) {
      if (byte < threshold) result.push(chars[byte % chars.length])
      if (result.length === length) break
    }
  }
  return result.join("")
}

const PRIVATE_HOSTNAME = /^(localhost|.*\.local|.*\.internal)$|^(127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|::1$|\[::1\])/i

function normalizeAndValidateUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== "string") {
    throw new Error("Missing 'url' string")
  }

  const trimmed = rawUrl.trim()
  if (!trimmed) {
    throw new Error("Missing 'url' string")
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error("Invalid URL")
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL must start with http:// or https://")
  }

  if (PRIVATE_HOSTNAME.test(parsed.hostname)) {
    throw new Error("URL must point to a public host")
  }

  return parsed.toString()
}

function isUniqueConstraintError(error: unknown) {
  if (!(error instanceof Error)) return false
  return /unique\s+constraint/i.test(error.message)
}

function isMissingLinksTableError(error: unknown) {
  if (!(error instanceof Error)) return false
  return /no such table:\s*links/i.test(error.message)
}

export async function POST(request: Request) {
  let env: CloudflareEnv | undefined
  try {
    env = (getCloudflareContext() as { env: CloudflareEnv }).env
  } catch {
    // When running outside Wrangler/Cloudflare context.
  }

  const db = env?.DB
  if (!db) {
    return Response.json(
      {
        ok: false,
        error: "D1 binding not available (Cloudflare context missing)",
      },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { ok: false, error: "Request body must be valid JSON" },
      { status: 400 },
    )
  }

  let url: string
  try {
    url = normalizeAndValidateUrl((body as { url?: unknown }).url)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid input"
    return Response.json({ ok: false, error: message }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const createdAt = Date.now()

  const maxAttempts = 8
  let slug = ""

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    slug = generateCode(6)
    try {
      await db
        .prepare(
          "INSERT INTO links (id, slug, url, created_at) VALUES (?1, ?2, ?3, ?4)",
        )
        .bind(id, slug, url, createdAt)
        .run()

      const origin = new URL(request.url).origin
      const shortUrl = `${origin}/r/${slug}`

      return Response.json({
        ok: true,
        id,
        slug,
        url,
        createdAt: new Date(createdAt).toISOString(),
        shortUrl,
      })
    } catch (error) {
      if (isMissingLinksTableError(error)) {
        return Response.json(
          {
            ok: false,
            error: "Database schema not initialized (missing links table)",
            hint: "Apply D1 migrations locally (wrangler d1 migrations apply) and retry",
          },
          { status: 500 },
        )
      }

      if (isUniqueConstraintError(error) && attempt < maxAttempts) {
        continue
      }

      console.error("/api/shorten insert failed", {
        id,
        slug,
        url,
        createdAt,
        error: error instanceof Error ? error.message : String(error),
      })

      return Response.json(
        {
          ok: false,
          error:
            isUniqueConstraintError(error)
              ? "Failed to allocate unique slug"
              : "Failed to create short URL",
        },
        { status: 500 },
      )
    }
  }
}
