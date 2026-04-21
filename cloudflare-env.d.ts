/// <reference types="@cloudflare/workers-types" />

export interface CloudflareEnv {
  ASSETS?: Fetcher
  DB?: D1Database
}
