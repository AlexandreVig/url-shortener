"use client"

import { Text } from "@/components/retroui/Text"
import { Footer } from "@/components/Footer"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/retroui/Input"
import { Button } from "@/components/retroui/Button"
import { CopyToClipboardButton } from "@/components/CopyToClipboardButton"
import { useState } from "react"

const EXAMPLE_SHORT_URL = "https://url.avigneau.dev/r/short"

interface ShortenResponse {
  ok: boolean
  error?: string
  id?: string
  slug?: string
  url?: string
  createdAt?: string // ISO 8601
  shortUrl?: string
}

export default function Page() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleShorten() {
    if (!url.trim()) return
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json() as ShortenResponse
      if (!data.ok) {
        setError(data.error ?? "Something went wrong")
      } else {
        setShortUrl(data.shortUrl ?? "")
      }
    } catch {
      setError("Network error — please try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 pt-8 pb-4 text-center sm:pt-12 sm:pb-6 md:pt-16">
        <Text as="h1" className="text-3xl sm:text-4xl lg:text-5xl">
          <span>Make your links</span>
          <span className="mx-1 inline-block -rotate-3 bg-primary px-2 py-2">
            shorter
          </span>
          <span className="inline-block -rotate-12">🖐️</span>
        </Text>

        <Card className="my-8 text-left sm:my-12 md:my-16">
          <Card.Header>
            <Card.Title>Paste your url</Card.Title>
            <Card.Content className="flex w-2xl flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <Input
                    className="flex-1"
                    placeholder="https://example.com/very/long/url"
                    value={url}
                    aria-invalid={!!error}
                    disabled={isLoading}
                    onChange={(e) => { setUrl(e.target.value); setShortUrl(""); setError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                  />
                  <Button
                    className="w-fit"
                    disabled={isLoading || !url.trim()}
                    onClick={handleShorten}
                  >
                    {isLoading ? "Shortening…" : "Shorten URL"}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
              <div className="mx-auto w-full max-w-96 shadow shadow-primary">
                <div className="group text-md relative flex items-center bg-black/90 py-2 pl-4 font-mono">
                  <div className="flex-1 overflow-hidden whitespace-nowrap">
                    <div className="overflow-hidden text-ellipsis">
                      <span className={shortUrl === "" ? "text-gray-600" : "text-primary"}>{shortUrl === "" ? EXAMPLE_SHORT_URL : shortUrl}</span>
                    </div>
                  </div>
                  <CopyToClipboardButton
                    value={shortUrl || null}
                    disabled={shortUrl === ""}
                    className="mr-2 shrink-0 cursor-pointer disabled:cursor-not-allowed p-1 text-gray-400 disabled:text-gray-600 transition-colors hover:text-white"
                  />
                </div>
              </div>
            </Card.Content>
          </Card.Header>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
