import { ZodError } from "zod"

export function errorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: "validation",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    )
  }

  console.error("[admin]", error)
  const message = error instanceof Error ? error.message : "unknown error"
  return Response.json({ error: "server", message }, { status: 500 })
}
