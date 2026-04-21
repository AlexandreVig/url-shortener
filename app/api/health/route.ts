import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function GET(request: Request) {
  let cloudflare = null as null | {
    env: unknown
    cf: unknown
  }

  try {
    const { env, cf } = getCloudflareContext()
    cloudflare = { env, cf }
  } catch {
    // When running outside Wrangler/Cloudflare context.
  }

  return Response.json({
    ok: true,
    method: request.method,
    hasCloudflareContext: cloudflare !== null,
  })
}
