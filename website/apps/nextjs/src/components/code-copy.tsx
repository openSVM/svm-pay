"use client"

import { useState } from "react"
import * as Icons from "@saasfly/ui/icons";

export function CodeCopy() {
  const [copied, setCopied] = useState(false)
  const command = "npm install svm-pay"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="inline-flex items-center gap-3">
      <span className="font-mono text-slate-600">{command}</span>
      <button
        onClick={copyToClipboard}
        className="p-1.5 rounded hover:bg-slate-100 transition-colors duration-200"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Icons.Check className="w-4 h-4 text-green-600" />
        ) : (
          <Icons.Copy className="w-4 h-4 text-slate-500 hover:text-slate-700" />
        )}
      </button>
    </div>
  )
}
