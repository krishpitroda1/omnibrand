import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "OmniBrand OS — The Unified AI-Powered Marketing & Customer Engagement Platform",
  description:
    "Create once. Publish everywhere. Engage intelligently. Measure everything. Multi-tenant enterprise platform for modern brands and agencies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

