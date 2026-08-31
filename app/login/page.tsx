import { MCP_DEFAULT_URL } from "@/lib/auth";
import LoginForm from "./LoginForm";

/**
 * Server wrapper for the login page: computes the MCP admin register URL from
 * the server environment (never exposed to the client bundle) and passes it to
 * the client form. Registration lives on the MCP admin panel.
 */
export default function LoginPage() {
  const mcpUrl = (process.env.FP_MCP_URL || MCP_DEFAULT_URL).replace(/\/+$/, "");
  return <LoginForm registerUrl={`${mcpUrl}/admin/register`} />;
}