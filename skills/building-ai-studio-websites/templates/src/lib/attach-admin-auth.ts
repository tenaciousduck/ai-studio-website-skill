import { createMiddleware } from "@tanstack/react-start";
import { hasSavedSession } from "./saved-session";

// Takes the place of the generated attachSupabaseAuth, which loads the sign-in
// toolkit for every visitor. This one sends the editor's token just the same but
// only loads the toolkit when a session is saved in the browser.
export const attachAdminAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  if (!hasSavedSession()) return next();
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
});
