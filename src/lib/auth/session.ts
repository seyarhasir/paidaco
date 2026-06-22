import type { User } from "@supabase/supabase-js";
import { isRetryableDependencyError, logDependencyFallback } from "@/lib/dependency-errors";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser(context = "Supabase auth"): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    if (isRetryableDependencyError(error)) {
      logDependencyFallback(context, error);
      return null;
    }

    throw error;
  }
}
