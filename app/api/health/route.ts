import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function GET(request: Request) {
  let cloudflare = null as null | {
    env: unknown
    cf: unknown
  }

  let hasD1Binding = false
  let d1QueryOk = null as null | boolean

  try {
    const { env, cf } = getCloudflareContext()
    cloudflare = { env, cf }

    const db = (env as any)?.DB
    hasD1Binding = !!db && typeof db.prepare === "function"

    if (hasD1Binding) {
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
    hasCloudflareContext: cloudflare !== null,
    hasD1Binding,
    d1QueryOk,
  })
}
