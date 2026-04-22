import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { CloudflareEnv } from "@/cloudflare-env"

export async function GET(
  _request: Request,
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

  const row = await db
    .prepare("SELECT url FROM links WHERE slug = ?1 LIMIT 1")
    .bind(slug)
    .first<{ url: string }>()

  if (!row) {
    return new Response("Not Found", { status: 404 })
  }

  return Response.redirect(row.url, 301)
}
