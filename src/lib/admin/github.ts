import { Octokit } from "@octokit/rest"

export interface GithubFile {
  path: string
  sha: string
  content: string
}

export interface RepoEntry {
  name: string
  path: string
  sha: string
}

let cached: Octokit | null = null

function client(): Octokit {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set. The admin panel cannot read or write content.")
  }
  if (!cached) cached = new Octokit({ auth: token })
  return cached
}

function repoInfo(): { owner: string; repo: string } {
  const value = process.env.GITHUB_REPO
  const [owner, repo] = (value ?? "").split("/")
  if (!owner || !repo) {
    throw new Error("GITHUB_REPO must be set in 'owner/name' form.")
  }
  return { owner, repo }
}

function branch(): string {
  return process.env.GITHUB_BRANCH ?? "main"
}

function isNotFound(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { status?: number }).status === 404
}

function isServerError(error: unknown): boolean {
  return typeof error === "object" && error !== null
    && typeof (error as { status?: number }).status === "number"
    && (error as { status: number }).status >= 500
}

const GITHUB_TIMEOUT_MS = 10000

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("تجاوزت مدة الاتصال بـ GitHub")), GITHUB_TIMEOUT_MS)
  })
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  })
}

export async function readFile(path: string): Promise<GithubFile | null> {
  try {
    const response = await withTimeout(client().repos.getContent({ ...repoInfo(), path, ref: branch() }))
    const data = response.data
    if (Array.isArray(data) || data.type !== "file" || !data.content) return null
    const content = Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf-8")
    return { path, sha: data.sha, content }
  } catch (error) {
    if (isNotFound(error)) return null
    if (isServerError(error)) return null
    throw error
  }
}

export async function readBinaryFile(path: string): Promise<{ path: string; sha: string; base64: string } | null> {
  try {
    const response = await withTimeout(client().repos.getContent({ ...repoInfo(), path, ref: branch() }))
    const data = response.data
    if (Array.isArray(data) || data.type !== "file" || !data.content) return null
    return { path, sha: data.sha, base64: data.content.replace(/\n/g, "") }
  } catch (error) {
    if (isNotFound(error)) return null
    if (isServerError(error)) return null
    throw error
  }
}

export async function writeFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  await withTimeout(client().repos.createOrUpdateFileContents({
    ...repoInfo(),
    path,
    message,
    branch: branch(),
    content: Buffer.from(content, "utf-8").toString("base64"),
    ...(sha ? { sha } : {}),
  }))
}

export async function writeBinaryFile(
  path: string,
  base64: string,
  message: string,
  sha?: string
): Promise<void> {
  await withTimeout(client().repos.createOrUpdateFileContents({
    ...repoInfo(),
    path,
    message,
    branch: branch(),
    content: base64,
    ...(sha ? { sha } : {}),
  }))
}

export async function deleteFile(path: string, message: string, sha: string): Promise<void> {
  await withTimeout(client().repos.deleteFile({
    ...repoInfo(),
    path,
    message,
    branch: branch(),
    sha,
  }))
}

export async function listDirectory(path: string): Promise<RepoEntry[]> {
  try {
    const response = await withTimeout(client().repos.getContent({ ...repoInfo(), path, ref: branch() }))
    if (!Array.isArray(response.data)) return []
    return response.data
      .filter((entry) => entry.type === "file")
      .map((entry) => ({ name: entry.name, path: entry.path, sha: entry.sha }))
  } catch (error) {
    if (isNotFound(error)) return []
    if (isServerError(error)) return []
    throw error
  }
}
