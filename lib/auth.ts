import { supabase } from "./supabase.client";

export async function registerUser({
  email,
  password,
  ...meta
}: {
  email: string;
  password: string;
  [key: string]: any;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: meta.firstName,
        lastName: meta.lastName,
        phone: meta.phone,
        address: meta.address,
        city: meta.city,
        postalCode: meta.postalCode,
        country: meta.country,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function updateUserProfile(profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}) {
  const { data, error } = await supabase.auth.updateUser({
    data: profileData,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
