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

const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/toolbox", label: "Toolbox" },
  { href: "/usage", label: "Usage" },
  { href: "/admin", label: "Lead Quality" },
];

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = mounted && Boolean(getAuthCookie());

  const linkClass = (href: string) =>
    `px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors ${
      pathname === href
        ? "bg-fp-500/10 text-fp-600"
        : "text-navy hover:bg-surface"
    }`;

  if (!mounted) {
    return <nav className="flex items-center gap-1 ml-auto" aria-hidden="true" />;
  }

  return (
    <nav className="flex items-center gap-1 ml-auto">
      {isLoggedIn ? (
        <>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/toolbox";
            }}
            className="ml-2 px-4 py-2 rounded-lg text-[13.5px] font-bold text-white bg-grad-cta shadow-sm hover:brightness-105 cursor-pointer transition-all"
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
            className="ml-2 px-4 py-2 rounded-lg text-[13.5px] font-bold text-white bg-grad-cta shadow-sm hover:brightness-105 transition-all"
          >
            Login
          </Link>
        </>
      )}
    </nav>
  );
}
