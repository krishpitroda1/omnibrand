export interface Touchpoint {
  channel: string;
  timestamp: number;
}

export function calculateAttributionCredit(
  touchpoints: Touchpoint[],
  model: "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "POSITION_BASED",
  totalConversionValue: number
): Record<string, number> {
  const result: Record<string, number> = {};
  if (touchpoints.length === 0) return result;

  touchpoints.forEach((t) => (result[t.channel] = 0));

  if (model === "FIRST_TOUCH") {
    const first = touchpoints[0];
    result[first.channel] = totalConversionValue;
    return result;
  }

  if (model === "LAST_TOUCH") {
    const last = touchpoints[touchpoints.length - 1];
    result[last.channel] = totalConversionValue;
    return result;
  }

  if (model === "LINEAR") {
    const split = totalConversionValue / touchpoints.length;
    touchpoints.forEach((t) => {
      result[t.channel] = (result[t.channel] || 0) + split;
    });
    return result;
  }

  if (model === "POSITION_BASED") {
    if (touchpoints.length === 1) {
      result[touchpoints[0].channel] = totalConversionValue;
      return result;
    }
    if (touchpoints.length === 2) {
      result[touchpoints[0].channel] = totalConversionValue * 0.5;
      result[touchpoints[1].channel] = totalConversionValue * 0.5;
      return result;
    }

    // 40% first, 40% last, 20% divided among middle touchpoints
    const first = touchpoints[0];
    const last = touchpoints[touchpoints.length - 1];
    const middleCount = touchpoints.length - 2;
    const middleSplit = (totalConversionValue * 0.2) / middleCount;

    result[first.channel] = (result[first.channel] || 0) + totalConversionValue * 0.4;
    result[last.channel] = (result[last.channel] || 0) + totalConversionValue * 0.4;

    for (let i = 1; i < touchpoints.length - 1; i++) {
      result[touchpoints[i].channel] = (result[touchpoints[i].channel] || 0) + middleSplit;
    }

    return result;
  }

  return result;
}

export async function runAttributionTest() {
  console.log("▶ Running Unit Test: Attribution Mathematical Models...");

  const journey: Touchpoint[] = [
    { channel: "Google Search", timestamp: 100 },
    { channel: "Instagram", timestamp: 200 },
    { channel: "Email", timestamp: 300 },
    { channel: "WhatsApp", timestamp: 400 },
  ];
  const value = 1000;

  // First Touch: 100% to Google Search
  const ft = calculateAttributionCredit(journey, "FIRST_TOUCH", value);
  if (ft["Google Search"] !== 1000 || ft["WhatsApp"] !== 0) {
    throw new Error("First Touch attribution math incorrect");
  }

  // Last Touch: 100% to WhatsApp
  const lt = calculateAttributionCredit(journey, "LAST_TOUCH", value);
  if (lt["WhatsApp"] !== 1000 || lt["Google Search"] !== 0) {
    throw new Error("Last Touch attribution math incorrect");
  }

  // Linear: 250 each across 4 channels
  const lin = calculateAttributionCredit(journey, "LINEAR", value);
  if (lin["Google Search"] !== 250 || lin["WhatsApp"] !== 250) {
    throw new Error("Linear attribution math incorrect");
  }

  // Position Based: 400 Google Search, 400 WhatsApp, 100 Instagram, 100 Email
  const pb = calculateAttributionCredit(journey, "POSITION_BASED", value);
  if (pb["Google Search"] !== 400 || pb["WhatsApp"] !== 400 || pb["Instagram"] !== 100 || pb["Email"] !== 100) {
    throw new Error("Position-Based attribution math incorrect");
  }

  console.log("  ✔ First Touch, Last Touch, Linear, and Position-Based models verified.");
  return true;
}
