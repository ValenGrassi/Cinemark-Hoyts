import type { Cinema } from "@/types/cinema";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const url = `${base}${path}`;
  const response = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });

  // manejo de error uniforme
  if (!response.ok) {
    const text = await response.text();
    let body: any;
    try { body = JSON.parse(text); } catch { body = text; }
    const err: any = new Error(`HTTP ${response.status} ${response.statusText}`);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  if (response.status === 204) return undefined as unknown as T;
  
  const data = await response.json();
  return data as T;
}

export const api = {
  // Cinemas
  getCinemas: () => request<Cinema[]>("/api/cinemas"),
  getCinema: (id: string) => request<Cinema>(`/api/cinemas/${id}`),
  updateCinema: (id: string, payload: Partial<Cinema>) =>
  request<Cinema>(`/api/cinemas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }),
  deleteCinema: (id: string) => request<void>(`/api/cinemas/${id}`, { method: "DELETE" }),

  // utilitarios (si los necesitas)
  raw: (path: string, opts?: RequestInit) => request<any>(path, opts),
};