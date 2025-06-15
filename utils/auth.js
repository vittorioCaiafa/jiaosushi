// Google OAuth Configuration
const GOOGLE_CLIENT_ID =
  "328175434715-ak21d2likhuph5gk4unnrumcj4l6ekmq.apps.googleusercontent.com"; // You'll need to replace this with your actual Google Client ID

// Get the current origin and pathname
const currentOrigin = window.location.origin;
const currentPath = window.location.pathname;
const basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

// Construct the redirect URI
const GOOGLE_REDIRECT_URI = `${getBasePath()}auth-callback.html`;

// OAuth endpoints
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

// Scopes for Google OAuth
const SCOPES = ["profile", "email"].join(" ");

// Initialize Google OAuth
export function initGoogleAuth() {
  // Load Google API client
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = resolve;
  });
}

// Start Google OAuth flow
export function startGoogleAuth() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "token",
    scope: SCOPES,
    include_granted_scopes: "true",
    prompt: "select_account",
  });

  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function getGoogleRedirectUri() {
  const origin = window.location.origin;

  if (origin.includes("github.io")) {
    return `${origin}/jiaosushi/auth-callback.html`;
  } else {
    return `${origin}/auth-callback.html`; // assuming flat structure locally
  }
}

// Handle OAuth callback
export function handleAuthCallback() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");

  if (accessToken) {
    // Store the token
    localStorage.setItem("accessToken", accessToken);

    // Get user info
    return fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((userInfo) => {
        // Store user info
        localStorage.setItem("user", JSON.stringify(userInfo));
        return userInfo;
      });
  }

  return Promise.reject("No access token found");
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}

//function that
export function getBasePath() {
  const origin = window.location.origin;
  const path = window.location.pathname;

  if (origin.includes("github.io")) {
    return `${origin}/jiaosushi/`;
  } else {
    const base = path.split("/").slice(0, -1).join("/") + "/";
    return `${origin}${base}`;
  }
}

// Get current user
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Logout
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = getBasePath();
}

// Protect routes that require authentication
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = `${getBasePath()}login.html`;
    return false;
  }
  return true;
}
