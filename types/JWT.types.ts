export interface CustomJWTPayload {
  user_role?: string;
  user_metadata?: {
    role?: string;
  };
  [key: string]: any;
}
