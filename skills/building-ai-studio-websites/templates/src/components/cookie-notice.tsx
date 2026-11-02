import { useEffect, useState } from "react";
import { NewTabNote } from "@/components/site/arrow-label";
import { COOKIE_NOTICE_COPY, markNoticeSeen, noticeSeen } from "@/lib/cookie-notice";

function browserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

// A small note in the corner on a visitor's first visit. Rendered once from
// __root. z-[100] keeps it under the order and terms pop-ups (z-[110]).
export function CookieNotice() {
  const [open, setOpen] = useState(false);

  // Read after hydration so the server renders nothing (avoids a mismatch).
  useEffect(() => {
    setOpen(!noticeSeen(browserStorage()));
  }, []);

  if (!open) return null;

  return (
    <aside
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[100] flex flex-wrap items-center gap-x-4 gap-y-2 rounded-soft bg-frame-card p-4 text-[0.92rem] leading-snug text-frame-ink shadow-[0_20px_50px_-20px_rgba(31,26,38,0.55)] ring-1 ring-inset ring-frame-line sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-[440px]"
    >
      <p className="min-w-0 flex-1 basis-[200px]">
        {COOKIE_NOTICE_COPY} {/* A new tab, so reading it never loses a half-filled checkout. */}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm font-semibold text-frame-plum underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame-plum"
        >
          Privacy
          <NewTabNote />
        </a>
      </p>
      <button
        type="button"
        onClick={() => {
          markNoticeSeen(browserStorage());
          setOpen(false);
        }}
        className="min-h-11 rounded-full bg-frame-ink px-6 font-semibold text-white transition-colors hover:bg-frame-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame-plum"
      >
        OK
      </button>
    </aside>
  );
}
