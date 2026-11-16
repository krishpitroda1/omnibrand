"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useAppStore, SettingsTab } from "@/store";
import { MemberRole } from "@/types";
import { formatNumber, formatDate, formatTime } from "@/lib/utils";
import {
  Building2,
  Layers,
  Users,
  KeyRound,
  Plug,
  CreditCard,
  History,
  Paintbrush,
  RotateCw,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Check,
  Sun,
  Moon,
  Search,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  Database,
} from "lucide-react";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "Organization", label: "Organization", icon: Building2 },
  { id: "Workspace", label: "Workspace", icon: Layers },
  { id: "Members & Roles", label: "Members & Roles", icon: Users },
  { id: "API Keys", label: "API Keys", icon: KeyRound },
  { id: "Integrations", label: "Integrations", icon: Plug },
  { id: "Billing & Usage", label: "Billing & Usage", icon: CreditCard },
  { id: "Audit Log", label: "Audit Log", icon: History },
  { id: "Appearance", label: "Appearance", icon: Paintbrush },
];

export function SettingsModal() {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    activeSettingsTab,
    organization,
    updateOrganization,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    createWorkspace,
    memberships,
    inviteMember,
    updateMemberRole,
    credentials,
    rotateApiKey,
    integrations,
    toggleIntegration,
    auditLogs,
    theme,
    toggleTheme,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>(activeSettingsTab || "Organization");

  // Organization form state
  const [orgName, setOrgName] = useState(organization.name);
  const [orgBillingEmail, setOrgBillingEmail] = useState(organization.billingEmail || "");
  const [orgCustomDomain, setOrgCustomDomain] = useState(organization.customDomain || "hub.aivonholdings.com");
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [orgSaveMessage, setOrgSaveMessage] = useState<string | null>(null);

  // Sub-company / Workspace creation state
  const [newWsName, setNewWsName] = useState("");
  const [newWsTimezone, setNewWsTimezone] = useState("UTC");
  const [isCreatingWs, setIsCreatingWs] = useState(false);
  const [wsSuccessMsg, setWsSuccessMsg] = useState<string | null>(null);

  // Keep synced with store
  React.useEffect(() => {
    if (activeSettingsTab) {
      setActiveTab(activeSettingsTab);
    }
  }, [activeSettingsTab]);

  // Invite Member State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("CREATOR");
  const [inviteError, setInviteError] = useState("");

  // Key rotation confirmation modal state
  const [keyToRotate, setKeyToRotate] = useState<string | null>(null);

  // Reveal Key re-auth state
  const [keyToReveal, setKeyToReveal] = useState<string | null>(null);
  const [revealPassword, setRevealPassword] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [revealError, setRevealError] = useState("");

  // Audit log filter
  const [auditSearch, setAuditSearch] = useState("");

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setInviteError("Please provide a valid business email address.");
      return;
    }
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail("");
    setInviteError("");
  };

  const handleConfirmRotate = () => {
    if (keyToRotate) {
      rotateApiKey(keyToRotate);
      setKeyToRotate(null);
    }
  };

  const handleConfirmReveal = () => {
    if (!revealPassword) {
      setRevealError("Password confirmation is required to inspect credentials.");
      return;
    }
    if (keyToReveal) {
      // Simulate verified reveal
      setRevealedKeys((prev) => ({
        ...prev,
        [keyToReveal]: "sk_live_enterprise_9984_verified_key_unmasked",
      }));
      setKeyToReveal(null);
      setRevealPassword("");
      setRevealError("");
    }
  };

  const handleSaveOrg = async () => {
    setIsSavingOrg(true);
    await updateOrganization({
      name: orgName,
      billingEmail: orgBillingEmail,
      customDomain: orgCustomDomain,
    });
    setIsSavingOrg(false);
    setOrgSaveMessage("✓ Organization profile saved to Supabase database.");
    setTimeout(() => setOrgSaveMessage(null), 4000);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreatingWs(true);
    await createWorkspace(newWsName.trim(), newWsTimezone);
    setIsCreatingWs(false);
    setNewWsName("");
    setWsSuccessMsg(`✓ Sub-company "${newWsName.trim()}" successfully created and saved to database!`);
    setTimeout(() => setWsSuccessMsg(null), 5000);
  };

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.entityType.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <>
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        maxWidth="5xl"
        className="max-h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        <div className="flex h-[82vh] flex-col md:flex-row">
          {/* Settings Left Navigation */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto flex-shrink-0">
            {/* PROMINENT BACK TO DASHBOARD BUTTON */}
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 mb-2 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-200/90 hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-all w-full border border-slate-300/80 dark:border-white/10 shadow-sm shrink-0"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Back to Dashboard</span>
            </button>

            <div className="hidden md:block px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              System Settings
            </div>

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--brand-primary)]/15 text-blue-700 dark:text-[var(--brand-primary)] border border-blue-300 dark:border-[var(--brand-primary)]/30 font-semibold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white dark:bg-slate-900/40 relative">
            {/* Header with Back button & Close X icon */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/10"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">&bull;</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
                  {activeTab} Settings
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                title="Close Settings (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* TAB: Organization */}
            {activeTab === "Organization" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Organization Profile</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Parent holding entity managing global billing, security governance, and sub-company workspaces.
                    </p>
                  </div>

                  {orgSaveMessage && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{orgSaveMessage}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. techbridge Holdings"
                  />
                  <Input label="Slug / Identifier" defaultValue={organization.slug} disabled />
                  <Input
                    label="Billing Contact"
                    value={orgBillingEmail}
                    onChange={(e) => setOrgBillingEmail(e.target.value)}
                    placeholder="user1@gmail.com"
                  />
                  <Input
                    label="Custom Domain"
                    value={orgCustomDomain}
                    onChange={(e) => setOrgCustomDomain(e.target.value)}
                    placeholder="hub.aivonholdings.com"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">White-Label Branding</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Remove OmniBrand branding and serve client portals under custom CNAME domain.
                      </p>
                    </div>
                    <Badge variant={organization.plan === "ENTERPRISE" ? "brand" : "outline"}>
                      {organization.plan === "ENTERPRISE" ? "Unlocked (Enterprise)" : "Requires Enterprise"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Active: Powered by Custom Domain SSL</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="brand" size="sm" onClick={handleSaveOrg} isLoading={isSavingOrg} className="shadow-glow-brand">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Workspace */}
            {activeTab === "Workspace" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[var(--brand-primary)]" />
                      <span>Sub-Companies & Operating Workspaces</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage sub-companies, operating divisions, and client workspaces. All campaigns and assets are saved to Supabase.
                    </p>
                  </div>
                  <Badge variant="brand">{activeWorkspace?.name || "Active Workspace"}</Badge>
                </div>

                {wsSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{wsSuccessMsg}</span>
                  </div>
                )}

                {/* CREATE NEW SUB-COMPANY / WORKSPACE FORM */}
                <form
                  onSubmit={handleCreateWorkspace}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-[var(--brand-primary)] stroke-[2.5]" />
                    <span>Add New Sub-Company / Operating Workspace</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creates an isolated workspace and core brand in the Supabase PostgreSQL database.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    <div className="sm:col-span-7">
                      <input
                        type="text"
                        value={newWsName}
                        onChange={(e) => setNewWsName(e.target.value)}
                        placeholder="e.g. Techbridge UK, Apex Media, etc."
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={newWsTimezone}
                        onChange={(e) => setNewWsTimezone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-primary)]"
                      >
                        <option value="UTC">UTC (+00:00)</option>
                        <option value="America/New_York">US Eastern (EST)</option>
                        <option value="America/Los_Angeles">US Pacific (PST)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Kolkata">India (IST +05:30)</option>
                        <option value="Asia/Tokyo">Tokyo (JST +09:00)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        variant="brand"
                        size="sm"
                        isLoading={isCreatingWs}
                        className="w-full h-full text-xs font-bold shadow-glow-brand"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>Create in DB</span>
                      </Button>
                    </div>
                  </div>
                </form>

                {/* CURRENT ACTIVE WORKSPACE SETTINGS */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Active Workspace Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Workspace Name" defaultValue={activeWorkspace?.name || ""} />
                    <Input label="Workspace Slug" defaultValue={activeWorkspace?.slug || ""} disabled />
                    <Input label="Operating Timezone" defaultValue={activeWorkspace?.timezone || "UTC"} />
                    <Input label="Workspace ID" defaultValue={activeWorkspace?.id || ""} disabled />
                  </div>
                </div>

                {/* AVAILABLE WORKSPACES LIST */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Available Sub-Companies & Workspaces ({workspaces.length})</span>
                    <span className="text-[10px] text-slate-400 lowercase font-mono">click to switch active scope</span>
                  </h4>

                  <div className="space-y-2">
                    {workspaces.map((ws) => {
                      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ws.id);
                      const isSelected = ws.id === activeWorkspaceId;

                      return (
                        <div
                          key={ws.id}
                          onClick={() => setActiveWorkspace(ws.id)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-slate-900 dark:text-white ring-1 ring-[var(--brand-primary)]/40 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-white/10 text-blue-700 dark:text-[var(--brand-primary)]">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{ws.name}</p>
                                {isUuid ? (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-semibold">
                                    Supabase DB
                                  </span>
                                ) : (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono">
                                    Workspace
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Timezone: {ws.timezone} &bull; ID: {ws.id.slice(0, 8)}...</p>
                            </div>
                          </div>

                          {isSelected ? (
                            <Badge variant="brand" size="sm">Active</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-xs">Switch</Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Members & Roles */}
            {activeTab === "Members & Roles" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Team Members & Governance</h3>
                  <p className="text-xs text-slate-400">
                    Invite collaborators, assign MemberRole permissions, and audit access boundaries.
                  </p>
                </div>

                {/* Invite Form */}
                <form
                  onSubmit={handleInviteSubmit}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3"
                >
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite Workspace Member
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        error={inviteError}
                      />
                    </div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                      className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[var(--brand-primary)] focus:outline-none"
                    >
                      <option value="VIEWER">VIEWER</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="CREATOR">CREATOR</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="OWNER">OWNER</option>
                    </select>
                    <Button type="submit" variant="brand" size="sm">
                      Send Invitation
                    </Button>
                  </div>
                </form>

                {/* Members List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active Members ({memberships.length})
                  </h4>
                  <div className="space-y-2">
                    {memberships.map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl bg-slate-950/40 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.user?.avatarUrl || "https://api.dicebear.com/7.x/identicon/svg?seed=user"}
                            alt={m.user?.name || "User"}
                            className="h-8 w-8 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <p className="text-xs font-semibold text-white">{m.user?.name}</p>
                            <p className="text-[11px] text-slate-400">{m.user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={m.role}
                            onChange={(e) => updateMemberRole(m.id, e.target.value as MemberRole)}
                            className="rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-[var(--brand-primary)] focus:outline-none"
                          >
                            <option value="OWNER">OWNER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="CREATOR">CREATOR</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permission Matrix Table */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Role Permission Matrix
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
                    <table className="w-full text-[11px] text-left text-slate-300">
                      <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Module Capability</th>
                          <th className="p-2.5 text-center">OWNER</th>
                          <th className="p-2.5 text-center">ADMIN</th>
                          <th className="p-2.5 text-center">MANAGER</th>
                          <th className="p-2.5 text-center">CREATOR</th>
                          <th className="p-2.5 text-center">ANALYST</th>
                          <th className="p-2.5 text-center">VIEWER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-2.5 font-medium">Publish to Live Social Queue</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">Outbound CRM Messaging (Consent Gated)</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">Rotate API Credentials</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">Export Analytics & Reports</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-emerald-400">✓</td>
                          <td className="p-2.5 text-center text-slate-600">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: API Keys */}
            {activeTab === "API Keys" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">API Credentials & Key Vault</h3>
                  <p className="text-xs text-slate-400">
                    Non-negotiable security: Credentials are encrypted at rest with key versioning and audit logged.
                  </p>
                </div>

                <div className="space-y-3">
                  {credentials.map((cred) => {
                    const isRevealed = Boolean(revealedKeys[cred.id]);

                    return (
                      <div
                        key={cred.id}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-semibold text-white">{cred.keyName}</h4>
                              <Badge variant="brand" size="sm">v{cred.keyVersion}</Badge>
                              <Badge variant="success" size="sm">{cred.status}</Badge>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Provider: {cred.provider} &bull; Rotated: {formatDate(cred.rotatedAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (isRevealed) {
                                  setRevealedKeys((prev) => {
                                    const next = { ...prev };
                                    delete next[cred.id];
                                    return next;
                                  });
                                } else {
                                  setKeyToReveal(cred.id);
                                }
                              }}
                              className="text-xs"
                            >
                              {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              <span>{isRevealed ? "Hide" : "Reveal"}</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setKeyToRotate(cred.id)}
                              className="text-xs"
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                              <span>Rotate</span>
                            </Button>
                          </div>
                        </div>

                        {/* Masked / Revealed string */}
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-xs text-slate-300 break-all select-all">
                          {isRevealed ? revealedKeys[cred.id] : cred.maskedValue}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: Integrations */}
            {activeTab === "Integrations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Platform Integrations</h3>
                  <p className="text-xs text-slate-400">
                    Connect social dispatchers, omnichannel telephony (SMSCloud Hub), SEO signals, and ad platforms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map((item) => {
                    const isConnected = item.status === "CONNECTED";

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isConnected
                            ? "bg-slate-950/60 border-white/10"
                            : "bg-slate-950/20 border-white/5 opacity-80"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                              {item.category}
                            </span>
                            <Badge variant={isConnected ? "success" : "default"} size="sm">
                              {isConnected ? "Connected" : "Not Connected"}
                            </Badge>
                          </div>

                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                            {item.description}
                          </p>

                          {item.accountName && (
                            <p className="mt-2 text-[10px] text-slate-400 font-mono truncate">
                              Account: {item.accountName}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.badges.map((b) => (
                              <span
                                key={b}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400"
                              >
                                {b}
                              </span>
                            ))}
                          </div>

                          <Button
                            variant={isConnected ? "outline" : "brand"}
                            size="sm"
                            onClick={() => toggleIntegration(item.id)}
                            className="text-xs"
                          >
                            {isConnected ? "Disconnect" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: Billing & Usage */}
            {activeTab === "Billing & Usage" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Subscription & Capacity Meters</h3>
                  <p className="text-xs text-slate-400">
                    Monitor enterprise token budgets, WhatsApp/RCS message allowances, and seats.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]/15 via-slate-900 to-slate-950 border border-[var(--brand-primary)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white">Enterprise Global Plan</h4>
                      <Badge variant="brand">ENTERPRISE</Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Includes 25 team seats, dedicated multi-brand knowledge base, and priority queue dispatch.
                    </p>
                  </div>
                  <Button variant="glass" size="sm" onClick={() => alert("Enterprise account managed by sales contract.")}>
                    Manage Contract
                  </Button>
                </div>

                {/* Usage Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* AI Credits */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">AI LLM Credits</span>
                      <span className="font-semibold text-white">
                        {Math.round((organization.aiCreditsUsed / organization.aiCreditsLimit) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${(organization.aiCreditsUsed / organization.aiCreditsLimit) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {formatNumber(organization.aiCreditsUsed)} / {formatNumber(organization.aiCreditsLimit)} credits used
                    </p>
                  </div>

                  {/* Messaging Credits */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Messaging Credits (SMS/WABA)</span>
                      <span className="font-semibold text-white">
                        {Math.round((organization.msgCreditsUsed / organization.msgCreditsLimit) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{
                          width: `${(organization.msgCreditsUsed / organization.msgCreditsLimit) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {formatNumber(organization.msgCreditsUsed)} / {formatNumber(organization.msgCreditsLimit)} messages sent
                    </p>
                  </div>

                  {/* Seat count */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Allocated Seats</span>
                      <span className="font-semibold text-white">5 / 25</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full w-[20%]" />
                    </div>
                    <p className="text-[11px] text-slate-400">20 available seats remaining</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Audit Log */}
            {activeTab === "Audit Log" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">Workspace Audit Trail</h3>
                    <p className="text-xs text-slate-400">
                      Immutable forensic log of security, team, and credential operations.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filter audit actions..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950/50 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white font-mono">{log.action}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({log.entityType})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          By <strong className="text-slate-300">{log.actorName}</strong> ({log.actorEmail}) &bull; IP: {log.ipAddress || "Internal"}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono sm:text-right">
                        {formatDate(log.createdAt)} {formatTime(log.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Appearance */}
            {activeTab === "Appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Interface Customization</h3>
                  <p className="text-xs text-slate-400">
                    Switch between dark glassmorphism and light high-contrast modes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => theme !== "dark" && toggleTheme()}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      theme === "dark"
                        ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]"
                        : "bg-slate-950/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Moon className="h-5 w-5 text-indigo-400" />
                        <div>
                          <p className="text-xs font-semibold text-white">Dark Glassmorphism</p>
                          <p className="text-[11px] text-slate-400">Default high-depth enterprise styling</p>
                        </div>
                      </div>
                      {theme === "dark" && <Check className="h-4 w-4 text-[var(--brand-primary)]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => theme !== "light" && toggleTheme()}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      theme === "light"
                        ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]"
                        : "bg-slate-950/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sun className="h-5 w-5 text-amber-400" />
                        <div>
                          <p className="text-xs font-semibold text-white">Light Mode</p>
                          <p className="text-[11px] text-slate-400">Daylight studio high-contrast mode</p>
                        </div>
                      </div>
                      {theme === "light" && <Check className="h-4 w-4 text-[var(--brand-primary)]" />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for API Key Rotation */}
      <ConfirmationModal
        isOpen={Boolean(keyToRotate)}
        onClose={() => setKeyToRotate(null)}
        onConfirm={handleConfirmRotate}
        title="Confirm API Key Rotation"
        description="Rotating this credential will immediately invalidate the active secret and issue version increment. Connected microservices and webhooks must be updated."
        confirmLabel="Rotate Secret"
        variant="warning"
      />

      {/* Re-Auth Confirmation Dialog for Key Reveal */}
      <Modal
        isOpen={Boolean(keyToReveal)}
        onClose={() => {
          setKeyToReveal(null);
          setRevealPassword("");
          setRevealError("");
        }}
        maxWidth="md"
        title="Security Re-Authentication Required"
        description="To inspect raw production API keys, please re-enter your administrator credentials."
      >
        <div className="space-y-4">
          <Input
            type="password"
            label="Master Password"
            placeholder="••••••••••••"
            value={revealPassword}
            onChange={(e) => setRevealPassword(e.target.value)}
            error={revealError}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKeyToReveal(null);
                setRevealPassword("");
                setRevealError("");
              }}
            >
              Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={handleConfirmReveal}>
              Verify & Reveal
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

