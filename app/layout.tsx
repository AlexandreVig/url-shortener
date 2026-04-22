import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Archivo_Black, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/retroui/Sonner"

const SITE_URL = "https://url.avigneau.dev"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "URL Shortener",
  description: "Make your links shorter.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "URL Shortener",
    description: "Make your links shorter.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "URL Shortener — Make your links shorter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener",
    description: "Make your links shorter.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#ffdb33",
  },
}

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
})

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivoBlack.variable} ${space.variable} font-sans`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
