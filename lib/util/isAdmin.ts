import { decodeJWT } from "./JWTUtil";
import type { CustomJWTPayload } from "@/types/JWT.types";
import type { Session } from "@supabase/supabase-js";

/**
 * Checks if a user is an admin based on their JWT token
 * @param token - The JWT access token
 * @returns true if the user is an admin, false otherwise
 */
export function isAdminByToken(token: string | null | undefined): boolean {
  if (!token) return false;

  const jwtPayload = decodeJWT(token);
  return jwtPayload?.user_role === "ADMIN";
}

/**
 * Checks if a user is an admin based on their session
 * @param session - The Supabase session object
 * @returns true if the user is an admin, false otherwise
 */
export function isAdminBySession(session: Session | null | undefined): boolean {
  if (!session?.access_token) return false;
  return isAdminByToken(session.access_token);
}

/**
 * Checks if a user is an admin based on their JWT payload
 * @param jwtPayload - The decoded JWT payload
 * @returns true if the user is an admin, false otherwise
 */
export function isAdminByPayload(
  jwtPayload: CustomJWTPayload | null | undefined
): boolean {
  if (!jwtPayload) return false;
  return jwtPayload.user_role === "ADMIN";
}
