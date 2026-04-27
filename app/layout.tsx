import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FirstPage HK — AI & Automation Portfolio",
  description:
    "Hong Kong AI & Automation Team led by Glass Chan. Production-ready systems delivering measurable ROI across SEO, Finance, Sales, and CX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-fp-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">FP</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">
                      FirstPage Hong Kong
                    </h1>
                    <p className="text-xs text-slate-500">
                      AI & Automation — by Glass Chan
                    </p>
                  </div>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/"
                    className="text-sm font-medium text-slate-600 hover:text-fp-500 transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/toolbox"
                    className="text-sm font-medium text-slate-600 hover:text-fp-500 transition-colors"
                  >
                    Toolbox
                  </Link>
                  <Link
                    href="/systems"
                    className="text-sm font-medium text-slate-600 hover:text-fp-500 transition-colors"
                  >
                    Our Systems
                  </Link>
                  <Link
                    href="/architecture"
                    className="text-sm font-medium text-slate-600 hover:text-fp-500 transition-colors"
                  >
                    Stack
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  FirstPage Hong Kong — AI & Automation Team
                </p>
                <p className="text-sm text-slate-400">
                  Led by Glass Chan · All systems production-ready
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
