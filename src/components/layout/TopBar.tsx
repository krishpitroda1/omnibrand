"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ChevronDown,
  Layers,
  Sparkles,
  Plus,
  Sun,
  Moon,
  Settings,
  LogOut,
  Shield,
  Menu,
  Check,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function TopBar() {
  const {
    organization,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    brands,
    activeBrandId,
    setActiveBrand,
    theme,
    toggleTheme,
    setCreateModalOpen,
    setSettingsModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentUser,
    logout,
    setOnboardingOpen,
    resetWorkspaceData,
    seedSampleData,
  } = useAppStore();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const wsRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) {
        setWorkspaceOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const aiPercentage = Math.round(
    (organization.aiCreditsUsed / organization.aiCreditsLimit) * 100
  );

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 dark:border-white/10 glass-panel bg-white/95 dark:bg-slate-950/80 px-4 lg:px-6">
      <div className="flex h-full items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Org & Tenancy Switchers */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Organization Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Building2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span className="truncate max-w-[130px] font-semibold text-slate-900 dark:text-white">
              {organization.name}
            </span>
            <Badge variant="brand" size="sm" className="font-semibold text-[10px] tracking-wide">
              {organization.plan}
            </Badge>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/15 hidden sm:block" />

          {/* Workspace Switcher */}
          <div className="relative" ref={wsRef}>
            <button
              onClick={() => {
                setWorkspaceOpen(!workspaceOpen);
                setBrandOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all shadow-sm"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <div className="text-left hidden md:block">
                <span className="block text-[10px] uppercase text-slate-500 font-semibold leading-tight">
                  Workspace
                </span>
                <span className="truncate max-w-[140px] block font-semibold text-slate-900 dark:text-slate-200">
                  {activeWorkspace?.name || "Select Workspace"}
                </span>
              </div>
              <span className="md:hidden truncate max-w-[90px] font-semibold text-slate-900 dark:text-slate-200">{activeWorkspace?.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 ml-1" />
            </button>

            {workspaceOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl p-1.5 glass-dropdown z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                  Select Workspace
                </div>
                <div className="mt-1 space-y-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspace(ws.id);
                        setWorkspaceOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        ws.id === activeWorkspaceId
                          ? "bg-slate-100 text-slate-900 font-semibold dark:bg-white/10 dark:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {ws.id === activeWorkspaceId && (
                        <Check className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brand Switcher */}
          <div className="relative" ref={brandRef}>
            <button
              onClick={() => {
                setBrandOpen(!brandOpen);
                setWorkspaceOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all shadow-sm"
            >
              <div
                className="h-3.5 w-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm flex-shrink-0"
                style={{ backgroundColor: activeBrand?.brandKit?.primaryColor || "#3b82f6" }}
              />
              <div className="text-left hidden md:block">
                <span className="block text-[10px] uppercase text-slate-500 font-semibold leading-tight">
                  Active Brand
                </span>
                <span className="truncate max-w-[150px] block font-semibold text-slate-900 dark:text-white">
                  {activeBrand?.name || "Select Brand"}
                </span>
              </div>
              <span className="md:hidden truncate max-w-[100px] font-semibold text-slate-900 dark:text-white">
                {activeBrand?.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 ml-1" />
            </button>

            {brandOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl p-1.5 glass-dropdown z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                  Switch Active Brand
                </div>
                <div className="mt-1 space-y-1">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBrand(b.id);
                        setBrandOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left ${
                        b.id === activeBrandId
                          ? "bg-slate-100 text-slate-900 font-semibold dark:bg-white/10 dark:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="h-4 w-4 rounded-full border border-black/10 dark:border-white/20 flex-shrink-0"
                          style={{ backgroundColor: b.brandKit?.primaryColor }}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">{b.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{b.industry}</p>
                        </div>
                      </div>
                      {b.id === activeBrandId && (
                        <Check className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: + Create Button, AI Credit Meter, Theme Toggle, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global + Create Button */}
          <Button
            variant="brand"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 font-semibold shadow-glow-brand"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* AI Credit Meter */}
          <div
            className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs cursor-pointer hover:bg-slate-200/80 dark:hover:bg-white/10 transition-colors shadow-sm"
            onClick={() => setSettingsModalOpen(true, "Billing & Usage")}
            title="Click to view Billing & Usage limits"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">AI Credits</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatNumber(organization.aiCreditsUsed)} / {formatNumber(organization.aiCreditsLimit)}
                </span>
              </div>
              <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[var(--brand-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(aiPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            aria-label="Toggle theme mode"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* User Avatar Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setWorkspaceOpen(false);
                setBrandOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {currentUser?.role || "Owner"}
                </p>
              </div>
              <div className="h-7 w-7 rounded-lg bg-[var(--brand-primary)] text-white font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-white/20 shadow-sm">
                {(currentUser?.name || "AD").substring(0, 2).toUpperCase()}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl p-2 glass-dropdown z-50 animate-in fade-in zoom-in-95 shadow-xl">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {currentUser?.name || "Admin User"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email || "admin@omnibrand.io"}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="brand" size="sm">
                      {currentUser?.role || "Owner"} &bull; {organization.plan}
                    </Badge>
                  </div>
                </div>

                <div className="mt-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setOnboardingOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Company Onboarding Wizard</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSettingsModalOpen(true, "Organization");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Settings & Tenancy</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSettingsModalOpen(true, "API Keys");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>API Credentials</span>
                  </button>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-white/10 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (confirm("Reset workspace back to a clean blank state? All current sample data will be cleared.")) {
                        resetWorkspaceData();
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Clear All to Blank Slate</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      seedSampleData();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Load Sample Data</span>
                  </button>
                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      try {
                        await fetch("/api/auth/signout", { method: "POST" });
                      } catch (err) {}
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

