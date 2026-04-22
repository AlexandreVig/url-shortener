import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { CloudflareEnv } from "@/cloudflare-env"
import { notFound } from "next/navigation"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  let env: CloudflareEnv | undefined
  try {
    env = (getCloudflareContext() as { env: CloudflareEnv }).env
  } catch {
    // When running outside Wrangler/Cloudflare context.
  }

  const db = env?.DB
  if (!db) {
    return new Response("Service unavailable", { status: 503 })
  }

  const rateLimiter = env?.RATE_LIMITER
  if (rateLimiter) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown"
    const { success } = await rateLimiter.limit({ key: ip })
    if (!success) {
      return new Response("Too many requests", { status: 429 })
    }
  }

  const row = await db
    .prepare("SELECT url FROM links WHERE slug = ?1 LIMIT 1")
    .bind(slug)
    .first<{ url: string }>()

  if (!row) {
    notFound()
  }

  return Response.redirect(row.url, 301)
}
