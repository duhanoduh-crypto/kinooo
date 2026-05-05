// API клиент для фронтенда — реальные запросы к бэкенду.
// Базовый URL берётся из переменной окружения VITE_API_BASE_URL
// (см. frontend/.env.example). При локальной разработке достаточно оставить
// пустую строку — Vite-прокси из frontend/vite.config.ts перенаправит /api
// на http://localhost:8000 (Django dev-server).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const request = async <T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    const text = await response.text().catch(() => "");
    throw new Error(`API ${response.status} ${response.statusText}: ${text}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
};

export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    request("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    request("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  adminLogin: (credentials: { email: string; password: string }) =>
    request("/api/auth/admin-login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request("/api/auth/logout/", {
      method: "POST",
    }),

  getProfile: () => request("/api/auth/profile/"),
};

export const moviesAPI = {
  getAll: () => request("/api/movies/"),
  getById: (id: number) => request(`/api/movies/${id}/`),
  create: (movie: unknown) =>
    request("/api/movies/", { method: "POST", body: JSON.stringify(movie) }),
  update: (id: number, movie: unknown) =>
    request(`/api/movies/${id}/`, { method: "PUT", body: JSON.stringify(movie) }),
  delete: (id: number) =>
    request(`/api/movies/${id}/`, { method: "DELETE" }),
};

export const genresAPI = {
  getAll: () => request("/api/genres/"),
};

export const cinemasAPI = {
  getAll: () => request("/api/cinemas/"),
  getById: (id: number) => request(`/api/cinemas/${id}/`),
  create: (cinema: unknown) =>
    request("/api/cinemas/", { method: "POST", body: JSON.stringify(cinema) }),
  update: (id: number, cinema: unknown) =>
    request(`/api/cinemas/${id}/`, {
      method: "PUT",
      body: JSON.stringify(cinema),
    }),
  delete: (id: number) =>
    request(`/api/cinemas/${id}/`, { method: "DELETE" }),
};

export const screeningsAPI = {
  getAll: (params?: { cinema?: number; date?: string }) => {
    const query = new URLSearchParams();
    if (params?.cinema) query.set("cinema", String(params.cinema));
    if (params?.date) query.set("date", params.date);
    const qs = query.toString();
    return request(`/api/screenings/${qs ? `?${qs}` : ""}`);
  },
  create: (screening: unknown) =>
    request("/api/screenings/", {
      method: "POST",
      body: JSON.stringify(screening),
    }),
  delete: (id: number) =>
    request(`/api/screenings/${id}/`, { method: "DELETE" }),
};

export const userMoviesAPI = {
  list: () => request("/api/user-movies/"),
  upsert: (payload: {
    movie: number;
    status: "planned" | "watching" | "completed" | "dropped";
    rating?: number | null;
  }) =>
    request("/api/user-movies/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    request(`/api/user-movies/${id}/`, { method: "DELETE" }),
};

export const recommendationsAPI = {
  list: () => request("/api/recommendations/"),
};
