// The small cookie notice: its words and whether this browser has seen it. Pure,
// so bun can test it. It offers no choice on purpose: the website host's visit
// counter runs for everyone, and a choice that changes nothing would mislead.

/** A new key, so people who answered the old banner see the honest wording once. */
export const COOKIE_NOTICE_KEY = "site-cookie-notice-v1";

export const COOKIE_NOTICE_COPY =
  "We use a cookie that lasts 30 minutes to count visits, and others that help protect the site.";

// Private windows and blocked site data can make the storage missing or
// throwing, so each call is guarded and falls back to "not seen".
export function noticeSeen(storage: Storage | undefined): boolean {
  try {
    return storage?.getItem(COOKIE_NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNoticeSeen(storage: Storage | undefined): void {
  try {
    storage?.setItem(COOKIE_NOTICE_KEY, "1");
  } catch {
    // storage blocked: the notice closes for this visit and returns on the next
  }
}
