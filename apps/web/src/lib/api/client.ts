export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiRequestOptions = Omit<RequestInit, "body" | "credentials"> & {
  body?: unknown;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Builds an absolute backend API URL for the given path. */
export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL.replace(/\/$/, "")}${normalizedPath}`;
}

/** Sends a JSON API request with cookies included for session endpoints. */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    credentials: "include",
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.message ?? "Request failed", response.status, data);
  }

  return data as T;
}
