/**
 *Array of routes that are accessible to the public
 * NOTE: DOES NOT REQUIRE AUTHENTICATION
 */
export const publicRoutes = [
  "/",
  "/critical-infrastructure",
  "/evacuation-centers",
];

/**
 *Array of routes that are accessible when authenticated
 */

export const authRoutes = ["/auth/login", "/auth/register"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";
