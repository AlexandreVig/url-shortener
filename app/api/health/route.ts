import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { CloudflareEnv } from "@/cloudflare-env"

export async function GET(request: Request) {
  let hasCloudflareContext = false
  let hasD1Binding = false
  let d1QueryOk = null as null | boolean

  try {
    const { env } = getCloudflareContext() as { env: CloudflareEnv }
    hasCloudflareContext = true

    const db = env.DB
    hasD1Binding = !!db

    if (db) {
      await db.prepare("SELECT 1 as ok").first()
      d1QueryOk = true
    } else {
      d1QueryOk = false
    }
  } catch {
    // When running outside Wrangler/Cloudflare context.
  }

  return Response.json({
    ok: true,
    method: request.method,
    hasCloudflareContext,
    hasD1Binding,
    d1QueryOk,
  })
}
