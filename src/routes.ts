
/**
 *Array of routes that are accessible to the public
 * NOTE: DOES NOT REQUIRE AUTHENTICATION
 */
export const publicRoutes = [
  "/"
]

/**
 *Array of routes that are accessible when authenticated
 */

export const authRoutes = [
  "/auth/login"
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"