"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CampaignComposerWizard } from "@/features/composer/components/CampaignComposerWizard";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { AuthPortal } from "@/components/auth/AuthPortal";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    sidebarCollapsed,
    theme,
    brands,
    activeBrandId,
    applyBrandColorsToDom,
    isAuthenticated,
    login,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Sync tenancy data (organizations, workspaces, brands) from Supabase
    const { fetchTenancyData } = useAppStore.getState();
    fetchTenancyData();

    // Sync session from Supabase/server cookies if available
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          login({
            email: data.user.email,
            name: data.user.name,
          });
        }
      })
      .catch(() => {});

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // Apply active brand colors
    const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
    if (activeBrand) {
      applyBrandColorsToDom(activeBrand);
    }
  }, [theme, brands, activeBrandId, applyBrandColorsToDom]);

  if (!mounted) {
    // Avoid hydration layout flash
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // User Journey Gate: if not authenticated, display enterprise Sign In / Sign Up portal
  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 dark:bg-[#060913] dark:text-slate-100 selection:bg-[var(--brand-primary)] selection:text-slate-950 transition-colors duration-200">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-[0.04] dark:opacity-[0.07] blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: "var(--brand-primary, #3B82F6)" }}
        />
        <div
          className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] rounded-full opacity-[0.03] dark:opacity-[0.05] blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: "var(--brand-accent, #F43F5E)" }}
        />
      </div>

      {/* Collapsible Left Rail */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out relative z-10",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CampaignComposerWizard />
      <SettingsModal />
      <OnboardingWizard />
    </div>
  );
}

