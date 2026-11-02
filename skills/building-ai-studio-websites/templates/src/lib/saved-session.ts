// The sign-in toolkit is large and only the site's editor ever uses it, so public
// pages check for a saved session first and skip loading it when there is none.

// Supabase saves a session in the browser under "sb-<project>-auth-token".
const SESSION_KEY = /^sb-.+-auth-token/;

// Email links, such as a sign-up confirmation or account recovery, arrive with
// the session in the address. Only the toolkit can read it, and only as it starts.
export function hasSessionInUrl(hash: string): boolean {
  return hash.includes("access_token=");
}

type KeyedStorage = Pick<Storage, "length" | "key">;

export function hasSavedSession(storage?: KeyedStorage): boolean {
  try {
    const store = storage ?? window.localStorage;
    for (let i = 0; i < store.length; i++) {
      if (SESSION_KEY.test(store.key(i) ?? "")) return true;
    }
  } catch {
    // No window on the server, or the browser has blocked storage. Either way
    // nothing can be saved, so there's no session.
  }
  return false;
}
