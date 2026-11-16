import crypto from "crypto";

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  redirectUri: string;
  scope: string;
}

export interface OAuthUserProfile {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export class OAuthProvider {
  name: string;
  config: OAuthConfig;

  constructor(name: string, config: OAuthConfig) {
    this.name = name;
    this.config = config;
  }

  // Generate OAuth authorization redirect URL with state & PKCE challenge
  createAuthorizationUrl(): { url: string; state: string; codeVerifier: string } {
    const state = crypto.randomBytes(16).toString("hex");
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return {
      url: `${this.config.authorizationUrl}?${params.toString()}`,
      state,
      codeVerifier,
    };
  }

  // Mock / Real Token Exchange & Profile Fetch
  async exchangeCodeForProfile(code: string, codeVerifier?: string): Promise<OAuthUserProfile> {
    if (code === "mock_oauth_code" || !this.config.clientSecret) {
      // Deterministic mock profile for tests & sandbox
      return {
        providerId: "google-10928374921",
        email: "alex.chen@omnibrand.io",
        name: "Alex Chen",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      };
    }

    // Real HTTP exchange
    const tokenRes = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier || "",
      }).toString(),
    });

    if (!tokenRes.ok) {
      throw new Error(`OAuth token exchange failed: ${tokenRes.statusText}`);
    }

    const tokenData = await tokenRes.json();
    const userRes = await fetch(this.config.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      throw new Error(`OAuth userInfo fetch failed: ${userRes.statusText}`);
    }

    const userData = await userRes.json();
    return {
      providerId: userData.sub || userData.id,
      email: userData.email,
      name: userData.name || userData.login,
      avatarUrl: userData.picture || userData.avatar_url,
    };
  }
}

export const googleOAuth = new OAuthProvider("google", {
  clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
  redirectUri: process.env.OAUTH_REDIRECT_URI || "http://localhost:3000/api/auth/callback?provider=google",
  scope: "openid email profile",
});
