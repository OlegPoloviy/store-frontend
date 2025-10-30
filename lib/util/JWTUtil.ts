import { CustomJWTPayload } from "@/types/JWT.types";

export function decodeJWT(token: string): CustomJWTPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64").toString());
  } catch {
    return null;
  }
}
