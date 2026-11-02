import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { TermsContent } from "@/components/terms-content";
import { TERMS_UPDATED } from "@/lib/terms";
import { cn } from "@/lib/utils";
import { INK_BUTTON } from "./shared";

// The full Terms of Sale over step 1, so a buyer can read them without leaving
// the page. z-[110] matches the order pop-up: both sit above the cookie notice.
export function TermsDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: (event: Event) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[110] bg-[rgba(20,16,28,0.55)] backdrop-blur-[6px]" />
        <DialogPrimitive.Content
          onCloseAutoFocus={onCloseAutoFocus}
          className="fixed left-1/2 top-1/2 z-[110] max-h-[calc(100dvh-24px)] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-soft-lg bg-frame-card p-[clamp(22px,4vw,40px)] text-frame-ink shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-3.5 top-3.5 flex size-11 items-center justify-center rounded-full bg-frame-ink/[0.07] text-frame-ink transition-colors hover:bg-frame-ink/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame-plum"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
          <DialogTitle className="pr-12 font-display text-[clamp(1.8rem,1.4rem+1.4vw,2.4rem)] font-medium leading-tight tracking-normal">
            Terms of Sale
          </DialogTitle>
          <DialogDescription className="mt-2 mb-7 text-[0.95rem] text-frame-muted">
            Last updated {TERMS_UPDATED}
          </DialogDescription>
          <TermsContent />
          <DialogPrimitive.Close className={cn(INK_BUTTON, "mt-8")}>Close</DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
