"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? "text-fp-500"
        : "text-slate-600 hover:text-fp-500"
    }`;

  return (
    <nav className="hidden md:flex items-center gap-6">
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
    </nav>
  );
}
