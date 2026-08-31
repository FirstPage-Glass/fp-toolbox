"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MeResponse {
  loggedIn: boolean;
  username: string | null;
  isAdmin: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/toolbox", label: "Toolbox" },
  { href: "/gateway", label: "Gateway" },
  { href: "/usage", label: "Usage" },
  { href: "/admin", label: "Lead Quality", adminOnly: true },
];

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [me, setMe] = useState<MeResponse>({ loggedIn: false, username: null, isAdmin: false });
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MeResponse | null) => {
        if (!cancelled && data) setMe(data);
      })
      .catch(() => {
        // Leave the placeholder state — auth degrades to logged-out.
      });
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const isLoggedIn = me.loggedIn;
  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || me.isAdmin);

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
          {visibleLinks.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          {me.username && (
            <span className="ml-1 px-3 py-2 text-[12.5px] font-semibold text-navy/70 truncate max-w-[180px]">
              {me.username}
            </span>
          )}
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