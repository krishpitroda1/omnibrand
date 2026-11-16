import { ayrshareAdapter } from "@/lib/adapters/ayrshare";
import { smsCloudHubAdapter } from "@/lib/adapters/smscloud-hub";
import { aiGatewayAdapter } from "@/lib/adapters/ai-gateway";
import { instagramAdapter } from "@/lib/adapters/direct-social";

export async function runAdaptersTest() {
  console.log("▶ Running Unit Test: Integration Adapters...");

  // 1. Ayrshare Adapter test
  const ayrConnect = await ayrshareAdapter.connect({ apiKey: "test_key" });
  if (!ayrConnect.success || !ayrConnect.accountId) {
    throw new Error("AyrshareAdapter connect failed");
  }
  const ayrPub = await ayrshareAdapter.publish({ content: "Hello OmniBrand" });
  if (!ayrPub.success || !ayrPub.postId) {
    throw new Error("AyrshareAdapter publish failed");
  }

  // 2. SMSCloud Hub Adapter test
  const smsConnect = await smsCloudHubAdapter.connect({ accountId: "acc_123", authToken: "tok_456" });
  if (!smsConnect.success) {
    throw new Error("SMSCloudHubAdapter connect failed");
  }
  const smsPub = await smsCloudHubAdapter.publish({ content: "WhatsApp test", metadata: { channel: "WHATSAPP" } });
  if (!smsPub.success || !smsPub.postId) {
    throw new Error("SMSCloudHubAdapter publish failed");
  }

  // 3. AI Gateway Adapter test
  const aiCreative = await aiGatewayAdapter.generateCreative({
    prompt: "Futuristic luxury athletic sneaker studio product shot",
    model: "FLUX_1_PRO",
    aspectRatio: "1:1",
  });
  if (!aiCreative.imageUrl || aiCreative.modelUsed !== "FLUX_1_PRO") {
    throw new Error("AiGatewayAdapter creative generation failed");
  }

  // 4. Direct Social Adapter capability declaration test
  if (!instagramAdapter.capabilities.includes("PUBLISH") || !instagramAdapter.capabilities.includes("ANALYTICS")) {
    throw new Error("InstagramAdapter missing declared capabilities");
  }

  console.log("  ✔ AyrshareAdapter, SMSCloudHubAdapter, and AiGatewayAdapter passed successfully.");
  return true;
}
