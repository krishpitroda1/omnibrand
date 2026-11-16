"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Palette,
  Share2,
  Image as ImageIcon,
  Megaphone,
  Radio,
  Bot,
  Users2,
  BarChart3,
  Compass,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

export interface NavItem {
  number: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    variant: "brand" | "warning" | "success" | "default" | "danger";
  };
}

export const NAV_ITEMS: NavItem[] = [
  {
    number: "01",
    label: "Brand & Workspace",
    href: "/brand-workspace",
    icon: Palette,
    badge: { text: "Active", variant: "brand" },
  },
  {
    number: "02",
    label: "Social Media Hub",
    href: "/social-hub",
    icon: Share2,
    badge: { text: "4 Accts", variant: "default" },
  },
  {
    number: "03",
    label: "Content Studio",
    href: "/content-studio",
    icon: ImageIcon,
    badge: { text: "Studio", variant: "default" },
  },
  {
    number: "04",
    label: "Campaign Manager",
    href: "/campaign-manager",
    icon: Megaphone,
    badge: { text: "2 Live", variant: "success" },
  },
  {
    number: "05",
    label: "Omnichannel Hub",
    href: "/omnichannel-hub",
    icon: Radio,
    badge: { text: "24h Sync", variant: "warning" },
  },
  {
    number: "06",
    label: "AI Agent Centre",
    href: "/ai-agent-centre",
    icon: Bot,
    badge: { text: "3 Autonomous", variant: "brand" },
  },
  {
    number: "07",
    label: "Customer CRM",
    href: "/customer-crm",
    icon: Users2,
    badge: { text: "1.4k Leads", variant: "default" },
  },
  {
    number: "08",
    label: "Analytics & ROI",
    href: "/analytics-roi",
    icon: BarChart3,
    badge: { text: "MOCK", variant: "default" },
  },
  {
    number: "09",
    label: "SEO & GEO",
    href: "/seo-geo",
    icon: Compass,
    badge: { text: "Signals", variant: "default" },
  },
  {
    number: "10",
    label: "Automation Centre",
    href: "/automation-centre",
    icon: Workflow,
    badge: { text: "6 Flows", variant: "default" },
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    setMobileMenuOpen,
    setSettingsModalOpen,
  } = useAppStore();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 dark:border-white/10 glass-panel bg-white/95 dark:bg-slate-950/80 transition-all duration-300 ease-in-out",
          // Desktop collapsed/expanded
          sidebarCollapsed ? "w-20" : "w-64",
          // Mobile responsive slide-over
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand OS Logo Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-white/10">
          <Link
            href="/brand-workspace"
            className="flex items-center gap-2.5 overflow-hidden group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-amber-500/80 p-0.5 shadow-glow-brand flex-shrink-0 flex items-center justify-center">
              <div className="h-full w-full rounded-[10px] bg-white dark:bg-slate-950 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-5 w-5 text-[var(--brand-primary)]" />
              </div>
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  OmniBrand <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] font-mono font-semibold">OS</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  Unified Marketing Suite
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Modules (01 to 10) */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 select-none",
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5"
                )}
                title={sidebarCollapsed ? `${item.number} ${item.label}` : undefined}
              >
                {/* Active Brand Accent Bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110",
                    isActive ? "text-[var(--brand-primary)] font-semibold" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  )}
                />

                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {item.number}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium border flex-shrink-0",
                          item.badge.variant === "brand"
                            ? "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--brand-primary)]/30"
                            : item.badge.variant === "warning"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : item.badge.variant === "success"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60"
                        )}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Rail: Settings & Collapse Toggle */}
        <div className="p-2 border-t border-slate-200 dark:border-white/10 space-y-1">
          <button
            onClick={() => setSettingsModalOpen(true, "Organization")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors",
              sidebarCollapsed && !mobileMenuOpen && "justify-center"
            )}
            title="Tenancy & Platform Settings"
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Settings</span>}
          </button>

          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/5 transition-colors",
              sidebarCollapsed && "justify-center"
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Rail</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

