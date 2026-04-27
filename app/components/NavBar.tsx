"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function getAuthCookie() {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("fp-auth="))
    ?.split("=")[1];
}

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = mounted && getAuthCookie() === "authenticated";

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-fp-500" : "text-slate-600 hover:text-fp-500"
    }`;

  if (!mounted) {
    return <nav className="hidden md:flex items-center gap-6" />;
  }

  return (
    <nav className="hidden md:flex items-center gap-6">
      {isLoggedIn ? (
        <>
          <Link href="/" className={linkClass("/")}>
            Overview
          </Link>
          <Link href="/toolbox" className={linkClass("/toolbox")}>
            Toolbox
          </Link>
          <Link href="/systems" className={linkClass("/systems")}>
            Our Systems
          </Link>
          <Link href="/architecture" className={linkClass("/architecture")}>
            Stack
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/toolbox";
            }}
            className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/toolbox" className={linkClass("/toolbox")}>
            Toolbox
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 bg-fp-500 hover:bg-fp-600 text-white rounded-lg transition-colors"
          >
            Login
          </Link>
        </>
      )}
    </nav>
  );
}
