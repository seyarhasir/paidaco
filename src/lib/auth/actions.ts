"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { isLocale, type Locale } from "@/lib/i18n";

function getLocale(formData: FormData): Locale {
  const locale = String(formData.get("locale") ?? "fa");
  return isLocale(locale) ? locale : "fa";
}

function authErrorUrl(locale: Locale, path: "login" | "register", message: string) {
  const params = new URLSearchParams({
    error: message
  });

  return `/${locale}/${path}?${params.toString()}`;
}

export async function loginAction(formData: FormData) {
  const locale = getLocale(formData);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    redirect(authErrorUrl(locale, "login", error?.message ?? "Invalid credentials"));
  }

  await syncAuthUser(data.user);
  redirect(`/${locale}/dashboard`);
}

export async function registerAction(formData: FormData) {
  const locale = getLocale(formData);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (error || !data.user) {
    redirect(authErrorUrl(locale, "register", error?.message ?? "Registration failed"));
  }

  await syncAuthUser(data.user);
  redirect(`/${locale}/dashboard`);
}

export async function logoutAction(formData: FormData) {
  const locale = getLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
