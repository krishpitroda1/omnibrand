export interface PolicyGateContext {
  channel: string;
  hasExplicitConsent: boolean;
  isWithin24hWindow: boolean;
  isTemplateApproved: boolean;
}

export function evaluateDispatchPolicy(ctx: PolicyGateContext): { allowed: boolean; reason?: string } {
  // 1. Consent invariant
  if (!ctx.hasExplicitConsent) {
    return {
      allowed: false,
      reason: "POLICY_VIOLATION: Recipient lacks verified opt-in consent for this channel",
    };
  }

  // 2. WhatsApp 24-hour service window invariant
  if (ctx.channel === "WHATSAPP") {
    if (!ctx.isWithin24hWindow && !ctx.isTemplateApproved) {
      return {
        allowed: false,
        reason: "WHATSAPP_24H_VIOLATION: Non-template outbound messaging blocked outside 24h customer session",
      };
    }
  }

  return { allowed: true };
}

export async function runPolicyGateTest() {
  console.log("▶ Running Unit Test: Dispatch Policy Gate...");

  // Test 1: Blocked without consent
  const noConsent = evaluateDispatchPolicy({
    channel: "SMS",
    hasExplicitConsent: false,
    isWithin24hWindow: false,
    isTemplateApproved: false,
  });
  if (noConsent.allowed) {
    throw new Error("Policy gate failed: Allowed dispatch without opt-in consent");
  }

  // Test 2: Blocked outside WhatsApp 24h window without approved template
  const closedWindow = evaluateDispatchPolicy({
    channel: "WHATSAPP",
    hasExplicitConsent: true,
    isWithin24hWindow: false,
    isTemplateApproved: false,
  });
  if (closedWindow.allowed) {
    throw new Error("Policy gate failed: Allowed free-form WhatsApp outside 24h window");
  }

  // Test 3: Allowed within 24h window
  const activeWindow = evaluateDispatchPolicy({
    channel: "WHATSAPP",
    hasExplicitConsent: true,
    isWithin24hWindow: true,
    isTemplateApproved: false,
  });
  if (!activeWindow.allowed) {
    throw new Error("Policy gate failed: Blocked WhatsApp inside valid 24h window");
  }

  // Test 4: Allowed outside 24h window WITH approved template
  const approvedTemplate = evaluateDispatchPolicy({
    channel: "WHATSAPP",
    hasExplicitConsent: true,
    isWithin24hWindow: false,
    isTemplateApproved: true,
  });
  if (!approvedTemplate.allowed) {
    throw new Error("Policy gate failed: Blocked pre-approved Meta template");
  }

  console.log("  ✔ All 4 policy gate invariants (consent, 24h session, templates) verified.");
  return true;
}
