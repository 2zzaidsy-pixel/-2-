"use client"

import * as React from "react"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-white px-6 text-center text-neutral-900">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">Something broke on my side</h1>
          <p className="mt-3 text-neutral-600">
            An unexpected error happened while rendering this page.
          </p>
          <button
            onClick={reset}
            className="mt-8 h-11 rounded-lg bg-neutral-900 px-6 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
