import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavBar from "./components/NavBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FirstPage HK — AI & Automation Portfolio",
  description:
    "Hong Kong AI & Automation Team led by Glass Chan. Production-ready systems delivering measurable ROI across SEO, Finance, Sales, and CX.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="FirstPage"
                    className="w-9 h-9 rounded-lg shadow-sm"
                  />
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">
                      FIRSTPAGE HK
                    </h1>
                    <p className="text-xs text-slate-500">
                      AI & Automation Toolbox
                    </p>
                  </div>
                </Link>
                <NavBar />
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
