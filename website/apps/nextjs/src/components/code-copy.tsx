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
    <div className="group relative flex items-center justify-between w-full max-w-lg bg-gray-900 dark:bg-gray-950 rounded-xl border border-gray-700 dark:border-gray-800 p-4 transition-all duration-300 hover:border-gray-600 dark:hover:border-gray-700">
      <div className="flex items-center space-x-3 font-mono text-gray-300 dark:text-gray-200">
        <span className="text-green-400">$</span>
        <span className="text-gray-100 dark:text-gray-100">{command}</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group/button border border-gray-600 dark:border-gray-700"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <div className="flex items-center justify-center">
            <Icons.Check className="w-4 h-4 text-green-400" />
          </div>
        ) : (
          <div className="flex items-center justify-center group-hover/button:scale-110 transition-transform">
            <Icons.Copy className="w-4 h-4 text-gray-400 group-hover/button:text-gray-300" />
          </div>
        )}
      </button>
      
      {/* Subtle animation effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
