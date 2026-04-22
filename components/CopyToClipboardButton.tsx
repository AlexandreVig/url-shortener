"use client"

import * as React from "react"
import { ClipboardIcon } from "lucide-react"
import { toast } from "sonner"

type CopyToClipboardButtonProps = {
  value?: string | null
  className?: string
  ariaLabel?: string
  disabled?: boolean
}

async function copyTextToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "0"
  textarea.style.left = "0"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  textarea.remove()
}

export function CopyToClipboardButton({
  value,
  className,
  ariaLabel = "Copy url",
  disabled,
}: CopyToClipboardButtonProps) {
  const isDisabled = disabled ?? !value

  const onClick = React.useCallback(async () => {
    if (isDisabled || !value) return
    try {
      await copyTextToClipboard(value)
      toast.success("Copied to clipboard! 🎉")
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }, [isDisabled, value])

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={className}
      aria-label={ariaLabel}
    >
      <ClipboardIcon className="h-4 w-4" />
    </button>
  )
}
