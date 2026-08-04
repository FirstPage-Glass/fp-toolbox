export interface AuthUser {
  name: string;
  password: string;
}

/** Parse AUTH_USERS env: comma-separated name:password pairs. */
export function parseAuthUsers(env = process.env.AUTH_USERS || ""): AuthUser[] {
  return env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, ...rest] = part.split(":");
      return { name: name.trim(), password: rest.join(":").trim() };
    });
}

export function validateCredentials(username: string, password: string): boolean {
  return parseAuthUsers().some((u) => u.name === username && u.password === password);
}

/** Username from the fp-auth cookie (value IS the username). */
export function getUsernameFromCookie(cookie: string | undefined): string | null {
  return cookie || null;
}
