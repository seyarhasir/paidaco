const retryableCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "P1001"
]);

const retryableMessageParts = [
  "can't reach database server",
  "fetch failed",
  "getaddrinfo",
  "connection terminated",
  "connection timed out",
  "connection refused"
];

export function isRetryableDependencyError(error: unknown) {
  const visited = new Set<unknown>();
  let current = error;

  while (current && typeof current === "object" && !visited.has(current)) {
    visited.add(current);
    const candidate = current as { code?: unknown; message?: unknown; cause?: unknown };
    const code = typeof candidate.code === "string" ? candidate.code : undefined;
    const message = typeof candidate.message === "string" ? candidate.message.toLowerCase() : "";

    if (code && retryableCodes.has(code)) return true;
    if (retryableMessageParts.some((part) => message.includes(part))) return true;

    current = candidate.cause;
  }

  return false;
}

export function logDependencyFallback(context: string, error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
  console.warn(`[paidaco] ${context}: dependency unavailable, rendering fallback. ${message}`);
}
