const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/v1";

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // Zod field errors
}

export class CustomApiError extends Error implements ApiError {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "CustomApiError";
    this.status = status;
    this.errors = errors;
  }
}

type UnauthorizedListener = () => void;
let unauthorizedListener: UnauthorizedListener | null = null;

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListener = listener;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("vaultpay_token");
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  }).catch(() => {
    throw new CustomApiError("Network connection failure. Please check your connection.");
  });

  if (!response.ok) {
    let message = "An error occurred while communicating with the server.";
    let errors: Record<string, string[]> | undefined = undefined;

    try {
      const data = await response.json();
      message = data.message || message;
      if (data.errors && data.errors.fieldErrors) {
        errors = data.errors.fieldErrors;
      }
    } catch {
      // JSON parsing failed
    }

    if (response.status === 401) {
      if (unauthorizedListener) {
        unauthorizedListener();
      }
    }

    throw new CustomApiError(message, response.status, errors);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return null as unknown as T;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "DELETE" }),
};
