import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Organization,
  Workspace,
  Brand,
  BrandKit,
  MemberRole,
  ApiCredential,
  AuditLogItem,
  IntegrationCard,
  User,
  Membership,
  Platform,
  AspectRatio,
  AiModel,
  ContentStatus,
  MediaAssetItem,
  SocialAccount,
} from "@/types";
import {
  MOCK_ORGANIZATION,
  MOCK_WORKSPACES,
  MOCK_BRANDS,
  MOCK_API_CREDENTIALS,
  MOCK_AUDIT_LOGS,
  MOCK_INTEGRATIONS,
  MOCK_USERS,
  MOCK_MEMBERSHIPS,
} from "@/lib/mock-data/tenancy";
import {
  MOCK_CAMPAIGNS,
  CampaignItem,
  PublishJobItem,
} from "@/lib/mock-data/campaigns";
import { MOCK_MEDIA_ASSETS } from "@/lib/mock-data/content-studio";
import {
  ComposerWizardState,
  ImageVariant,
  PlatformVariantData,
  RevisionHistoryEntry,
  ApprovalRecordData,
} from "@/features/composer/types";

export type SettingsTab =
  | "Organization"
  | "Workspace"
  | "Members & Roles"
  | "API Keys"
  | "Integrations"
  | "Billing & Usage"
  | "Audit Log"
  | "Appearance";

interface UIState {
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  settingsModalOpen: boolean;
  activeSettingsTab: SettingsTab;
  createModalOpen: boolean;
  calendarQueueDrawerOpen: boolean;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean, tab?: SettingsTab) => void;
  setCreateModalOpen: (open: boolean) => void;
  setCalendarQueueDrawerOpen: (open: boolean) => void;
}

interface BrandState {
  organization: Organization;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  brands: Brand[];
  activeBrandId: string;
  users: User[];
  memberships: Membership[];
  credentials: ApiCredential[];
  auditLogs: AuditLogItem[];
  integrations: IntegrationCard[];

  // Actions
  setActiveWorkspace: (workspaceId: string) => void;
  setActiveBrand: (brandId: string) => void;
  updateBrandKit: (brandId: string, updates: Partial<BrandKit>) => void;
  createBrand: (brand: Omit<Brand, "id" | "createdAt">) => void;
  createWorkspace: (name: string, timezone?: string) => Promise<Workspace | null>;
  updateOrganization: (updates: { name: string; billingEmail?: string; customDomain?: string }) => Promise<void>;
  fetchTenancyData: () => Promise<void>;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setBrands: (brands: Brand[]) => void;
  rotateApiKey: (credentialId: string) => void;
  inviteMember: (email: string, role: MemberRole) => void;
  updateMemberRole: (membershipId: string, role: MemberRole) => void;
  toggleIntegration: (integrationId: string) => void;
  applyBrandColorsToDom: (brand: Brand) => void;
  addSocialAccount: (brandId: string, account: SocialAccount) => void;
  connectSampleSocialAccounts: (brandId: string) => void;
}

interface CampaignQueueState {
  campaigns: CampaignItem[];
  publishJobs: PublishJobItem[];
  addCampaign: (campaign: CampaignItem) => void;
  updatePublishJobStatus: (
    jobId: string,
    status: ContentStatus,
    errorMessage?: string
  ) => void;
  retryPublishJob: (jobId: string) => void;
  simulateWorkerTick: () => void;
}

interface MediaAssetState {
  mediaAssets: MediaAssetItem[];
  addMediaAsset: (asset: MediaAssetItem) => void;
  setMediaAssets: (assets: MediaAssetItem[]) => void;
}

interface ComposerActions {
  setWizardStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setWizardBrand: (brandId: string) => void;
  togglePlatformSelection: (platform: Platform) => void;
  setPlatformAspectRatio: (platform: Platform, ratio: AspectRatio) => void;
  setMasterPrompt: (prompt: string) => void;
  setEnhancedPrompt: (prompt: string) => void;
  setIsEnhanceWithTone: (val: boolean) => void;
  setSelectedModel: (model: AiModel) => void;
  setIsGenerating: (val: boolean) => void;
  setGeneratedVariants: (variants: ImageVariant[]) => void;
  setSelectedVariantId: (id: string) => void;
  setRepurposedVariants: (
    variants: Partial<Record<Platform, PlatformVariantData>>
  ) => void;
  updateSinglePlatformVariant: (
    platform: Platform,
    updates: Partial<PlatformVariantData>
  ) => void;
  setSaveToMediaLibrary: (val: boolean) => void;
  setActivePreviewPlatform: (platform: Platform) => void;
  setApprovalRecord: (record: ApprovalRecordData | null) => void;
  addRevisionHistoryEntry: (entry: RevisionHistoryEntry) => void;
  setRevisionDrawerOpen: (open: boolean) => void;
  setComplianceAcknowledged: (val: boolean) => void;
  setScheduleMode: (mode: "IMMEDIATE" | "SCHEDULED") => void;
  setScheduledDate: (date: string) => void;
  setTimezone: (tz: string) => void;
  setPerChannelSchedule: (platform: Platform, date: string) => void;
  setUtmValues: (values: { source?: string; medium?: string; campaign?: string }) => void;
  setCtaConfig: (type: ComposerWizardState["ctaType"], url: string) => void;
  setCampaignName: (name: string) => void;
  resetComposerWizard: () => void;
}

export interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  currentUser: User | null;
  onboardingOpen: boolean;

  // Actions
  login: (data?: { email?: string; name?: string; role?: MemberRole }) => void;
  signUp: (data: { name: string; email: string; companyName?: string }) => void;
  logout: () => void;
  setOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (data: {
    companyName: string;
    workspaceName: string;
    brandName: string;
    industry: string;
    tagline?: string;
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    toneDirectives?: string;
  }) => void;
  resetWorkspaceData: () => void;
  seedSampleData: () => void;
}

interface AppStore
  extends UIState,
    AuthState,
    BrandState,
    CampaignQueueState,
    MediaAssetState,
    ComposerWizardState,
    ComposerActions {}

const EMPTY_ORGANIZATION: Organization = {
  id: "org-empty",
  name: "My Company",
  slug: "my-company",
  plan: "PRO",
  whiteLabel: false,
  billingEmail: "",
  aiCreditsLimit: 50000,
  aiCreditsUsed: 0,
  msgCreditsLimit: 10000,
  msgCreditsUsed: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialPublishJobs: PublishJobItem[] = [];

const initialWizardState: Omit<ComposerWizardState, "isOpen"> = {
  step: 1,
  selectedBrandId: "",
  selectedPlatforms: ["INSTAGRAM", "LINKEDIN"],
  platformAspectRatios: {
    INSTAGRAM: "PORTRAIT_4_5",
    LINKEDIN: "LANDSCAPE_16_9",
    X: "LANDSCAPE_16_9",
    FACEBOOK: "SQUARE_1_1",
    PINTEREST: "PORTRAIT_4_5",
    YOUTUBE: "LANDSCAPE_16_9",
    THREADS: "SQUARE_1_1",
    GOOGLE_BUSINESS: "LANDSCAPE_16_9",
    TIKTOK: "VERTICAL_9_16",
  },
  campaignName: "New Omnichannel Flight",
  masterPrompt: "Tactile architectural space flooded with warm editorial lighting and brutalist concrete forms.",
  enhancedPrompt: "Tactile architectural space flooded with warm editorial lighting and brutalist concrete forms. Aesthetic: Warm natural daylight, refined intentional craft, subtle golden hour reflections, 35mm lens framing, no synthetic noise.",
  isEnhanceWithTone: true,
  selectedModel: "FLUX_1_PRO",
  isGenerating: false,
  generatedVariants: [
    {
      id: "var-1",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      gradient: "from-amber-600/40 via-slate-900 to-black",
      seed: "88419",
      model: "FLUX_1_PRO",
      aspectRatio: "PORTRAIT_4_5",
      selected: true,
    },
    {
      id: "var-2",
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1080&auto=format&fit=crop&q=80",
      gradient: "from-blue-600/40 via-slate-900 to-black",
      seed: "99124",
      model: "FLUX_1_PRO",
      aspectRatio: "PORTRAIT_4_5",
      selected: false,
    },
    {
      id: "var-3",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80",
      gradient: "from-emerald-600/40 via-slate-900 to-black",
      seed: "44120",
      model: "FLUX_1_PRO",
      aspectRatio: "PORTRAIT_4_5",
      selected: false,
    },
    {
      id: "var-4",
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1080&auto=format&fit=crop&q=80",
      gradient: "from-purple-600/40 via-slate-900 to-black",
      seed: "77218",
      model: "FLUX_1_PRO",
      aspectRatio: "PORTRAIT_4_5",
      selected: false,
    },
  ],
  selectedVariantId: "var-1",
  repurposedVariants: {
    INSTAGRAM: {
      platform: "INSTAGRAM",
      caption: "Spaces sculpted by natural light. Our latest studio collection brings tactile materials and serene architectural perspective together.",
      hashtags: ["#EditorialDesign", "#LuminaLabs", "#SpatialAesthetics", "#ArchitecturalLight", "#Craftsmanship"],
      ctaText: "Explore Collection",
      ctaUrl: "https://luminacreative.studio/lookbook",
      aspectRatio: "PORTRAIT_4_5",
      brandCheckPass: true,
      brandCheckNotes: "Tone guidelines adhered to: sensory, artisanal vocabulary with zero hype terms.",
    },
    LINKEDIN: {
      platform: "LINKEDIN",
      caption: "Why spatial architecture and visual intentionality redefine how high-growth modern brands communicate craft.\n\nWe spent the last quarter examining how daylight direction transforms brutalist concrete environments into intimate narrative spaces.",
      hashtags: ["#BrandStrategy", "#DesignLeadership", "#CreativeOperations", "#SpatialDesign"],
      ctaText: "Read Design Case Study",
      ctaUrl: "https://luminacreative.studio/insights/spatial-branding",
      aspectRatio: "LANDSCAPE_16_9",
      brandCheckPass: true,
      brandCheckNotes: "Professional B2B narrative structure verified.",
    },
    X: {
      platform: "X",
      caption: "Light as structure. Exploring tactile brutalist spaces sculpted by intentional golden hour reflections. Full lookbook live today.",
      hashtags: ["#DesignSystems", "#Photography", "#CreativeOps"],
      ctaText: "View Lookbook",
      ctaUrl: "https://luminacreative.studio/lookbook",
      aspectRatio: "LANDSCAPE_16_9",
      brandCheckPass: true,
      brandCheckNotes: "Character count 184 / 280 (Pass).",
    },
  },
  saveToMediaLibrary: true,
  activePreviewPlatform: "INSTAGRAM",
  approvalRecord: null,
  revisionHistory: [
    {
      id: "rev-init",
      timestamp: "2026-11-13T10:15:00Z",
      prompt: "Brutalist architecture with concrete arches",
      feedback: "Initial concept generation",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      model: "FLUX_1_PRO",
    },
  ],
  revisionDrawerOpen: false,
  isRegenerating: false,
  complianceAcknowledged: false,
  scheduleMode: "SCHEDULED",
  scheduledDate: "2026-11-15T10:00",
  timezone: "UTC",
  perChannelSchedule: {},
  utmSource: "omnichannel",
  utmMedium: "social_organic",
  utmCampaign: "architectural_radiance",
  ctaType: "LINK",
  ctaUrl: "https://luminacreative.studio/lookbook",
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // UI Slice
      theme: "light",
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      settingsModalOpen: false,
      activeSettingsTab: "Organization",
      createModalOpen: false,
      calendarQueueDrawerOpen: false,

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
          } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
          }
        }
      },

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      setSettingsModalOpen: (settingsModalOpen, tab) =>
        set((state) => ({
          settingsModalOpen,
          activeSettingsTab: tab || state.activeSettingsTab,
        })),
      setCreateModalOpen: (createModalOpen) => set({ createModalOpen }),
      setCalendarQueueDrawerOpen: (calendarQueueDrawerOpen) =>
        set({ calendarQueueDrawerOpen }),

      // Auth Slice
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      currentUser: null,
      onboardingOpen: false,

      login: (data) => {
        const email = data?.email || "admin@company.com";
        const name = data?.name || email.split("@")[0] || "User";
        const user: User = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name,
          email,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        const hasBrands = get().brands.length > 0;
        set({
          isAuthenticated: true,
          currentUser: user,
          hasCompletedOnboarding: hasBrands,
          onboardingOpen: !hasBrands,
        });
      },

      signUp: ({ name, email, companyName }) => {
        const userId = `usr-${Date.now().toString().slice(-4)}`;
        const orgId = `org-${Date.now().toString().slice(-4)}`;
        const wsId = `ws-${Date.now().toString().slice(-4)}`;
        const cleanCompanyName = companyName?.trim() || "My Company";

        const newUser: User = {
          id: userId,
          name: name.trim(),
          email: email.trim(),
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        const newOrg: Organization = {
          id: orgId,
          name: cleanCompanyName,
          slug: cleanCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          plan: "PRO",
          whiteLabel: false,
          billingEmail: email.trim(),
          aiCreditsLimit: 50000,
          aiCreditsUsed: 0,
          msgCreditsLimit: 10000,
          msgCreditsUsed: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newWs: Workspace = {
          id: wsId,
          organizationId: orgId,
          name: "Main Marketing HQ",
          slug: "main-marketing-hq",
          timezone: "UTC",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newMembership: Membership = {
          id: `mem-${Date.now().toString().slice(-4)}`,
          userId,
          organizationId: orgId,
          workspaceId: wsId,
          role: "OWNER",
          user: newUser,
          createdAt: new Date().toISOString(),
        };

        set({
          isAuthenticated: true,
          currentUser: newUser,
          organization: newOrg,
          workspaces: [newWs],
          activeWorkspaceId: wsId,
          brands: [],
          activeBrandId: "",
          users: [newUser],
          memberships: [newMembership],
          campaigns: [],
          publishJobs: [],
          hasCompletedOnboarding: false,
          onboardingOpen: true,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          onboardingOpen: false,
        });
      },

      setOnboardingOpen: (onboardingOpen) => set({ onboardingOpen }),

      completeOnboarding: (data) => {
        const brandId = `brand-${Date.now().toString().slice(-4)}`;
        const org = get().organization;
        const currentWs = get().workspaces[0];
        const wsId = currentWs?.id || `ws-${Date.now().toString().slice(-4)}`;

        const updatedOrg: Organization = {
          ...org,
          name: data.companyName || org.name,
          slug: (data.companyName || org.name).toLowerCase().replace(/[^a-z0-9]/g, "-"),
        };

        const updatedWs: Workspace = {
          id: wsId,
          organizationId: updatedOrg.id,
          name: data.workspaceName || "Main Marketing HQ",
          slug: (data.workspaceName || "main-marketing-hq").toLowerCase().replace(/[^a-z0-9]/g, "-"),
          timezone: "UTC",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newBrand: Brand = {
          id: brandId,
          workspaceId: wsId,
          name: data.brandName,
          slug: data.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          tagline: data.tagline || "",
          description: `${data.brandName} - ${data.industry}`,
          industry: data.industry,
          website: "https://",
          isActive: true,
          createdAt: new Date().toISOString(),
          brandKit: {
            id: `bk-${brandId}`,
            brandId,
            primaryColor: data.primaryColor || "#3B82F6",
            secondaryColor: data.secondaryColor || "#0F172A",
            accentColor: data.accentColor || "#F43F5E",
            fontHeading: "Plus Jakarta Sans",
            fontBody: "Plus Jakarta Sans",
            toneKeywords: ["Modern", "Professional", "Authentic"],
            toneDirectives: data.toneDirectives || "Speak with clarity, confidence, and precision.",
            targetAudience: "Global enterprise customers and modern audiences.",
            doNotSay: [],
            mustInclude: [],
          },
          knowledgeBase: [],
          socialAccounts: [],
        };

        set({
          organization: updatedOrg,
          workspaces: [updatedWs],
          activeWorkspaceId: wsId,
          brands: [newBrand],
          activeBrandId: brandId,
          selectedBrandId: brandId,
          hasCompletedOnboarding: true,
          onboardingOpen: false,
        });

        get().applyBrandColorsToDom(newBrand);
      },

      resetWorkspaceData: () => {
        set({
          organization: EMPTY_ORGANIZATION,
          workspaces: [],
          activeWorkspaceId: "",
          brands: [],
          activeBrandId: "",
          campaigns: [],
          publishJobs: [],
          mediaAssets: [],
          hasCompletedOnboarding: false,
          onboardingOpen: false,
          isAuthenticated: false,
          currentUser: null,
        });
      },

      seedSampleData: () => {
        set({
          organization: MOCK_ORGANIZATION,
          workspaces: MOCK_WORKSPACES,
          activeWorkspaceId: MOCK_WORKSPACES[0].id,
          brands: MOCK_BRANDS,
          activeBrandId: MOCK_BRANDS[0].id,
          campaigns: MOCK_CAMPAIGNS,
          publishJobs: MOCK_CAMPAIGNS.flatMap((c) => c.publishJobs),
          mediaAssets: MOCK_MEDIA_ASSETS,
          users: MOCK_USERS,
          memberships: MOCK_MEMBERSHIPS,
          credentials: MOCK_API_CREDENTIALS,
          auditLogs: MOCK_AUDIT_LOGS,
          integrations: MOCK_INTEGRATIONS,
          hasCompletedOnboarding: true,
          isAuthenticated: true,
          currentUser: MOCK_USERS[0],
        });
        get().applyBrandColorsToDom(MOCK_BRANDS[0]);
      },

      // Brand & Tenancy Slice (Clean / Empty defaults)
      organization: EMPTY_ORGANIZATION,
      workspaces: [],
      activeWorkspaceId: "",
      brands: [],
      activeBrandId: "",
      users: [],
      memberships: [],
      credentials: [],
      auditLogs: [],
      integrations: [],

      setActiveWorkspace: (workspaceId) => {
        const currentBrands = get().brands;
        const workspaceBrands = currentBrands.filter(
          (b) => b.workspaceId === workspaceId
        );
        const nextBrand = workspaceBrands[0] || currentBrands[0];

        set({
          activeWorkspaceId: workspaceId,
          activeBrandId: nextBrand?.id || get().activeBrandId,
          selectedBrandId: nextBrand?.id || get().selectedBrandId,
        });

        if (nextBrand) {
          get().applyBrandColorsToDom(nextBrand);
        }
      },

      applyBrandColorsToDom: (brand: Brand) => {
        if (typeof document !== "undefined" && brand.brandKit) {
          const root = document.documentElement;
          root.style.setProperty("--brand-primary", brand.brandKit.primaryColor);
          root.style.setProperty("--brand-secondary", brand.brandKit.secondaryColor);
          root.style.setProperty("--brand-accent", brand.brandKit.accentColor);
        }
      },

      setActiveBrand: (brandId) => {
        const brand = get().brands.find((b) => b.id === brandId);
        if (brand) {
          set({ activeBrandId: brandId, selectedBrandId: brandId });
          get().applyBrandColorsToDom(brand);
        }
      },

      updateBrandKit: (brandId, updates) => {
        const brands = get().brands.map((b) => {
          if (b.id === brandId) {
            const updatedKit = { ...b.brandKit, ...updates };
            const updatedBrand = { ...b, brandKit: updatedKit };
            if (brandId === get().activeBrandId) {
              get().applyBrandColorsToDom(updatedBrand);
            }
            return updatedBrand;
          }
          return b;
        });

        const auditLog: AuditLogItem = {
          id: `aud-${Date.now()}`,
          organizationId: get().organization.id,
          workspaceId: get().activeWorkspaceId,
          actorName: "Elena Rostova",
          actorEmail: "elena.rostova@aivonholdings.com",
          action: "BRAND_KIT_UPDATED",
          entityType: "BrandKit",
          entityId: brandId,
          metadata: updates,
          createdAt: new Date().toISOString(),
        };

        set({ brands, auditLogs: [auditLog, ...get().auditLogs] });
      },

      fetchTenancyData: async () => {
        try {
          const res = await fetch("/api/tenancy");
          const data = await res.json();
          if (data) {
            if (data.organization?.name) {
              set({ organization: data.organization });
            }
            if (data.workspaces && data.workspaces.length > 0) {
              set((state) => ({
                workspaces: data.workspaces,
                activeWorkspaceId: state.activeWorkspaceId || data.workspaces[0].id,
              }));
            }
            if (data.brands && data.brands.length > 0) {
              set((state) => ({
                brands: data.brands,
                activeBrandId: state.activeBrandId || data.brands[0].id,
                selectedBrandId: state.selectedBrandId || data.brands[0].id,
              }));
            }
          }
        } catch (err) {
          console.warn("fetchTenancyData error:", err);
        }
      },

      setWorkspaces: (workspaces) => set({ workspaces }),
      setBrands: (brands) => set({ brands }),

      createWorkspace: async (name: string, timezone = "UTC") => {
        const tempId = `ws-${Date.now()}`;
        const newWs: Workspace = {
          id: tempId,
          organizationId: get().organization.id,
          name: name.trim(),
          slug: name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-"),
          timezone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Optimistically add to store
        set((state) => ({
          workspaces: [...state.workspaces, newWs],
          activeWorkspaceId: tempId,
        }));

        // Persist to Supabase DB via /api/tenancy
        try {
          const res = await fetch("/api/tenancy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              timezone,
              organizationId: get().organization.id,
            }),
          });
          const result = await res.json();
          if (result?.workspace?.id) {
            const realWs: Workspace = {
              ...newWs,
              id: result.workspace.id,
              organizationId: result.workspace.organization_id || newWs.organizationId,
              slug: result.workspace.slug || newWs.slug,
            };
            set((state) => ({
              workspaces: state.workspaces.map((w) => (w.id === tempId ? realWs : w)),
              activeWorkspaceId: realWs.id,
            }));
            get().fetchTenancyData();
            return realWs;
          }
        } catch (err) {
          console.error("createWorkspace API error:", err);
        }
        return newWs;
      },

      updateOrganization: async (updates) => {
        set((state) => ({
          organization: {
            ...state.organization,
            ...updates,
          },
        }));

        try {
          await fetch("/api/tenancy", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: updates.name,
              organizationId: get().organization.id,
            }),
          });
        } catch (err) {
          console.error("updateOrganization API error:", err);
        }
      },

      createBrand: (newBrandData) => {
        const tempId = `brand-${Date.now()}`;
        const newBrand: Brand = {
          ...newBrandData,
          id: tempId,
          createdAt: new Date().toISOString(),
          brandKit: {
            ...newBrandData.brandKit,
            id: `bk-${tempId}`,
            brandId: tempId,
          },
        };

        set((state) => ({
          brands: [...state.brands, newBrand],
          activeBrandId: tempId,
          selectedBrandId: tempId,
        }));
        get().applyBrandColorsToDom(newBrand);

        // Persist to Supabase DB via /api/brands
        fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId: get().activeWorkspaceId,
            name: newBrandData.name,
            tagline: newBrandData.tagline,
            description: newBrandData.description,
            industry: newBrandData.industry,
            website: newBrandData.website,
            primaryColor: newBrandData.brandKit?.primaryColor,
            secondaryColor: newBrandData.brandKit?.secondaryColor,
            accentColor: newBrandData.brandKit?.accentColor,
            toneKeywords: newBrandData.brandKit?.toneKeywords,
            toneDirectives: newBrandData.brandKit?.toneDirectives,
            targetAudience: newBrandData.brandKit?.targetAudience,
          }),
        })
          .then((res) => res.json())
          .then((resData) => {
            if (resData?.brand?.id) {
              const serverBrand = resData.brand;
              set((state) => ({
                brands: state.brands.map((b) => (b.id === tempId ? serverBrand : b)),
                activeBrandId: state.activeBrandId === tempId ? serverBrand.id : state.activeBrandId,
                selectedBrandId: state.selectedBrandId === tempId ? serverBrand.id : state.selectedBrandId,
              }));
            }
          })
          .catch((err) => console.warn("Failed to persist brand to Supabase:", err));
      },

      addSocialAccount: (brandId, account) => {
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === brandId
              ? {
                  ...b,
                  socialAccounts: [
                    ...(b.socialAccounts || []).filter((a) => a.platform !== account.platform),
                    account,
                  ],
                }
              : b
          ),
        }));
      },

      connectSampleSocialAccounts: (brandId) => {
        const targetBrand = get().brands.find((b) => b.id === brandId) || get().brands[0];
        if (!targetBrand) return;

        const slug = targetBrand.slug || "brand";
        const sampleAccounts: SocialAccount[] = [
          {
            id: `acc-${brandId}-ig`,
            brandId: targetBrand.id,
            workspaceId: get().activeWorkspaceId,
            platform: "INSTAGRAM",
            handle: `@${slug}.official`,
            displayName: `${targetBrand.name} Instagram`,
            avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
            profileUrl: `https://instagram.com/${slug}.official`,
            capabilities: ["PUBLISH", "READ"],
            followerCount: 24800,
            isConnected: true,
            health: {
              status: "HEALTHY",
              lastSyncAt: new Date().toISOString(),
              errorCount: 0,
              latencyMs: 142,
              rateLimitRemaining: 4800,
            },
          },
          {
            id: `acc-${brandId}-li`,
            brandId: targetBrand.id,
            workspaceId: get().activeWorkspaceId,
            platform: "LINKEDIN",
            handle: `${targetBrand.name} Enterprise`,
            displayName: `${targetBrand.name} LinkedIn`,
            avatarUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80",
            profileUrl: `https://linkedin.com/company/${slug}`,
            capabilities: ["PUBLISH", "READ"],
            followerCount: 41200,
            isConnected: true,
            health: {
              status: "HEALTHY",
              lastSyncAt: new Date().toISOString(),
              errorCount: 0,
              latencyMs: 89,
              rateLimitRemaining: 9500,
            },
          },
          {
            id: `acc-${brandId}-x`,
            brandId: targetBrand.id,
            workspaceId: get().activeWorkspaceId,
            platform: "X",
            handle: `@${slug}_hq`,
            displayName: `${targetBrand.name} on X`,
            avatarUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80",
            profileUrl: `https://x.com/${slug}_hq`,
            capabilities: ["PUBLISH", "READ"],
            followerCount: 16500,
            isConnected: true,
            health: {
              status: "HEALTHY",
              lastSyncAt: new Date().toISOString(),
              errorCount: 0,
              latencyMs: 110,
              rateLimitRemaining: 1400,
            },
          },
          {
            id: `acc-${brandId}-fb`,
            brandId: targetBrand.id,
            workspaceId: get().activeWorkspaceId,
            platform: "FACEBOOK",
            handle: `${targetBrand.name} Page`,
            displayName: `${targetBrand.name} Facebook`,
            avatarUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80",
            profileUrl: `https://facebook.com/${slug}`,
            capabilities: ["READ", "RESTRICTED"],
            followerCount: 8900,
            isConnected: true,
            health: {
              status: "DEGRADED",
              lastSyncAt: new Date().toISOString(),
              errorCount: 1,
              latencyMs: 240,
              rateLimitRemaining: 1800,
              lastErrorMessage: "Facebook Group direct posting restricted by Meta Platform Policy.",
            },
          },
        ];

        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === targetBrand.id ? { ...b, socialAccounts: sampleAccounts } : b
          ),
        }));
      },

      rotateApiKey: (credentialId) => {
        const credentials = get().credentials.map((cred) => {
          if (cred.id === credentialId) {
            return {
              ...cred,
              keyVersion: cred.keyVersion + 1,
              rotatedAt: new Date().toISOString(),
              maskedValue: `${cred.maskedValue.substring(0, 10)}••••••••${Math.floor(
                1000 + Math.random() * 9000
              )}`,
            };
          }
          return cred;
        });

        const target = get().credentials.find((c) => c.id === credentialId);

        const auditLog: AuditLogItem = {
          id: `aud-${Date.now()}`,
          organizationId: get().organization.id,
          workspaceId: get().activeWorkspaceId,
          actorName: "Elena Rostova",
          actorEmail: "elena.rostova@aivonholdings.com",
          action: "API_KEY_ROTATED",
          entityType: "ApiCredential",
          entityId: credentialId,
          metadata: {
            provider: target?.provider,
            newVersion: (target?.keyVersion || 1) + 1,
          },
          createdAt: new Date().toISOString(),
        };

        set({ credentials, auditLogs: [auditLog, ...get().auditLogs] });
      },

      inviteMember: (email, role) => {
        const newUserId = `usr-${Date.now()}`;
        const newUser: User = {
          id: newUserId,
          email,
          name: email.split("@")[0],
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        const newMembership: Membership = {
          id: `mem-${Date.now()}`,
          userId: newUserId,
          organizationId: get().organization.id,
          workspaceId: get().activeWorkspaceId,
          role,
          user: newUser,
          createdAt: new Date().toISOString(),
        };

        const auditLog: AuditLogItem = {
          id: `aud-${Date.now()}`,
          organizationId: get().organization.id,
          workspaceId: get().activeWorkspaceId,
          actorName: "Elena Rostova",
          actorEmail: "elena.rostova@aivonholdings.com",
          action: "MEMBER_INVITED",
          entityType: "Membership",
          entityId: newMembership.id,
          metadata: { invitedEmail: email, assignedRole: role },
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
          memberships: [...state.memberships, newMembership],
          auditLogs: [auditLog, ...state.auditLogs],
        }));
      },

      updateMemberRole: (membershipId, role) => {
        const memberships = get().memberships.map((m) =>
          m.id === membershipId ? { ...m, role } : m
        );
        const target = get().memberships.find((m) => m.id === membershipId);

        const auditLog: AuditLogItem = {
          id: `aud-${Date.now()}`,
          organizationId: get().organization.id,
          workspaceId: get().activeWorkspaceId,
          actorName: "Elena Rostova",
          actorEmail: "elena.rostova@aivonholdings.com",
          action: "MEMBER_ROLE_CHANGED",
          entityType: "Membership",
          entityId: membershipId,
          metadata: { targetUser: target?.user?.email, newRole: role },
          createdAt: new Date().toISOString(),
        };

        set({ memberships, auditLogs: [auditLog, ...get().auditLogs] });
      },

      toggleIntegration: (integrationId) => {
        const integrations = get().integrations.map((item) => {
          if (item.id === integrationId) {
            const nextStatus: "CONNECTED" | "NOT_CONNECTED" =
              item.status === "CONNECTED" ? "NOT_CONNECTED" : "CONNECTED";
            return {
              ...item,
              status: nextStatus,
              connectedAt:
                nextStatus === "CONNECTED" ? new Date().toISOString() : undefined,
            };
          }
          return item;
        });
        set({ integrations });
      },

      // Campaigns & Queue Slice (Empty default)
      campaigns: [],
      publishJobs: [],

      // Media Assets Slice
      mediaAssets: [],
      addMediaAsset: (asset) => {
        set((state) => ({
          mediaAssets: [asset, ...state.mediaAssets.filter((a) => a.id !== asset.id)],
        }));
      },
      setMediaAssets: (mediaAssets) => set({ mediaAssets }),

      addCampaign: (campaign) => {
        const campaignAsset: MediaAssetItem | null = campaign.mediaUrl
          ? {
              id: `ast-${campaign.id}`,
              workspaceId: campaign.workspaceId,
              brandId: campaign.brandId,
              brandName: campaign.brandName,
              url: campaign.mediaUrl,
              thumbnailUrl: campaign.mediaUrl,
              aspectRatio: (campaign.channels?.[0]?.aspectRatio as AspectRatio) || "SQUARE_1_1",
              width: 1080,
              height: 1080,
              dimensions: "1080×1080",
              format: "PNG",
              mimeType: "image/png",
              fileSize: 2048000,
              folderId: "fld-lumina-month-nov",
              tags: campaign.hashtags || ["#OmniBrand", "#Campaign"],
              promptUsed: campaign.caption,
              modelUsed: (campaign.aiModelUsed as any) || "FLUX_1_PRO",
              isFavorite: false,
              usageCount: 1,
              campaignsUsed: [campaign.id],
              status: "APPROVED",
              createdAt: campaign.startDate || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : null;

        set((state) => ({
          campaigns: [campaign, ...state.campaigns.filter((c) => c.id !== campaign.id)],
          publishJobs: [
            ...campaign.publishJobs,
            ...state.publishJobs.filter((j) => !campaign.publishJobs.some((cj) => cj.id === j.id)),
          ],
          mediaAssets: campaignAsset
            ? [campaignAsset, ...state.mediaAssets.filter((a) => a.id !== campaignAsset.id)]
            : state.mediaAssets,
        }));
      },

      updatePublishJobStatus: (jobId, status, errorMessage) => {
        set((state) => ({
          publishJobs: state.publishJobs.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status,
                  errorMessage: errorMessage || job.errorMessage,
                  publishedAt: status === "PUBLISHED" ? new Date().toISOString() : job.publishedAt,
                }
              : job
          ),
          campaigns: state.campaigns.map((camp) => ({
            ...camp,
            publishJobs: camp.publishJobs.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    status,
                    errorMessage: errorMessage || j.errorMessage,
                    publishedAt: status === "PUBLISHED" ? new Date().toISOString() : j.publishedAt,
                  }
                : j
            ),
          })),
        }));
      },

      retryPublishJob: (jobId) => {
        set((state) => ({
          publishJobs: state.publishJobs.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: "SCHEDULED" as ContentStatus,
                  errorMessage: undefined,
                  retryCount: 0,
                }
              : job
          ),
        }));
      },

      simulateWorkerTick: () => {
        const jobs = get().publishJobs;
        const scheduledJob = jobs.find((j) => j.status === "SCHEDULED");
        if (!scheduledJob) return;

        // Transition SCHEDULED -> PUBLISHING
        get().updatePublishJobStatus(scheduledJob.id, "PUBLISHING");

        // Transition PUBLISHING -> PUBLISHED after 3.5s
        setTimeout(() => {
          get().updatePublishJobStatus(scheduledJob.id, "PUBLISHED");
        }, 3500);
      },

      // Wizard State
      ...initialWizardState,
      isOpen: false,

      setWizardStep: (step) => set({ step }),
      setWizardBrand: (selectedBrandId) => {
        set({ selectedBrandId });
        const b = get().brands.find((item) => item.id === selectedBrandId);
        if (b) {
          get().applyBrandColorsToDom(b);
        }
      },
      togglePlatformSelection: (platform) => {
        const current = get().selectedPlatforms;
        if (current.includes(platform)) {
          if (current.length > 1) {
            set({ selectedPlatforms: current.filter((p) => p !== platform) });
          }
        } else {
          set({ selectedPlatforms: [...current, platform] });
        }
      },
      setPlatformAspectRatio: (platform, ratio) =>
        set((state) => ({
          platformAspectRatios: { ...state.platformAspectRatios, [platform]: ratio },
        })),
      setMasterPrompt: (masterPrompt) => set({ masterPrompt }),
      setEnhancedPrompt: (enhancedPrompt) => set({ enhancedPrompt }),
      setIsEnhanceWithTone: (isEnhanceWithTone) => set({ isEnhanceWithTone }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setGeneratedVariants: (generatedVariants) => set({ generatedVariants }),
      setSelectedVariantId: (selectedVariantId) => set({ selectedVariantId }),
      setRepurposedVariants: (repurposedVariants) => set({ repurposedVariants }),
      updateSinglePlatformVariant: (platform, updates) =>
        set((state) => {
          const current = state.repurposedVariants[platform];
          if (!current) return state;
          return {
            repurposedVariants: {
              ...state.repurposedVariants,
              [platform]: { ...current, ...updates },
            },
          };
        }),
      setSaveToMediaLibrary: (saveToMediaLibrary) => set({ saveToMediaLibrary }),
      setActivePreviewPlatform: (activePreviewPlatform) =>
        set({ activePreviewPlatform }),
      setApprovalRecord: (approvalRecord) => set({ approvalRecord }),
      addRevisionHistoryEntry: (entry) =>
        set((state) => ({
          revisionHistory: [entry, ...state.revisionHistory],
        })),
      setRevisionDrawerOpen: (revisionDrawerOpen) => set({ revisionDrawerOpen }),
      setComplianceAcknowledged: (complianceAcknowledged) =>
        set({ complianceAcknowledged }),
      setScheduleMode: (scheduleMode) => set({ scheduleMode }),
      setScheduledDate: (scheduledDate) => set({ scheduledDate }),
      setTimezone: (timezone) => set({ timezone }),
      setPerChannelSchedule: (platform, date) =>
        set((state) => ({
          perChannelSchedule: { ...state.perChannelSchedule, [platform]: date },
        })),
      setUtmValues: ({ source, medium, campaign }) =>
        set((state) => ({
          utmSource: source !== undefined ? source : state.utmSource,
          utmMedium: medium !== undefined ? medium : state.utmMedium,
          utmCampaign: campaign !== undefined ? campaign : state.utmCampaign,
        })),
      setCtaConfig: (ctaType, ctaUrl) => set({ ctaType, ctaUrl }),
      setCampaignName: (campaignName) => set({ campaignName }),
      resetComposerWizard: () =>
        set({
          ...initialWizardState,
          step: 1,
          isOpen: false,
        }),
    }),
    {
      name: "omnibrand-storage",
      partialize: (state) => ({
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        currentUser: state.currentUser,
        organization: state.organization,
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
        brands: state.brands,
        activeBrandId: state.activeBrandId,
        campaigns: state.campaigns,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
