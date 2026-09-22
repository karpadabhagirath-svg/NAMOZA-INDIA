"use client";

const TOKEN_KEY = "namoza_admin_token";
const ADMIN_KEY = "namoza_admin_profile";

export function saveAdminSession(token: string, admin: { id: string; name: string; email: string }) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  } catch {
    // localStorage may be unavailable (private browsing) — session just won't persist
  }
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAdminProfile(): { id: string; name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  } catch {
    // ignore
  }
}
