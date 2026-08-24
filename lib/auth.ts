/** Username/password from AUTH_USERS env: comma-separated name:password pairs. */
export function validateCredentials(username: string, password: string): boolean {
  return (process.env.AUTH_USERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .some((part) => {
      const [name, ...rest] = part.split(":");
      return name.trim() === username && rest.join(":").trim() === password;
    });
}

/**
 * True when the username is listed in ADMIN_USERS (comma-separated usernames).
 * Gateway central admins can manage every team's keys + create teams; ordinary
 * logged-in users see nothing (only champions and admins use the gateway pages).
 */
export function isAdminUser(username: string): boolean {
  return (process.env.ADMIN_USERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(username);
}
