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
