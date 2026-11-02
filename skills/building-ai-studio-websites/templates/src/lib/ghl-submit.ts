// Server-side form submissions to the CRM. Builds the event the browser helper
// in tracking.ts builds (buildTrackingPayload + postTrackingEvent), so every
// form on the site (newsletter, contact, order details) is sent
// from the server, not the browser. (A tab closed mid-send is not guaranteed to finish; the GHL
// follow-up workflow covers lost details.)
// Pure functions only (bar postEvent's failure log): no window, document or env,
// so bun can test them.

import { z } from "zod";
import { GHL_FIELD_IDS } from "./ghl-fields";

// Copied from src/lib/tracking.ts (form-tracking integration), which stays
// untouched. Keep these in step with that file.
const TRACKING_ID = "REPLACE_FROM_src_lib_tracking_ts";
const LOCATION_ID = "REPLACE_FROM_src_lib_tracking_ts";
const PROJECT_ID = "REPLACE_FROM_src_lib_tracking_ts";

export const GHL_ENDPOINT = "https://backend.leadconnectorhq.com/external-tracking/events";

export type Submission = {
  formId: string;
  formName: string;
  fields: {
    key: string;
    value: string | boolean;
    label: string;
    // A registered custom field: goes in under its CRM id, or under `key`
    // while that id is still blank.
    custom?: keyof typeof GHL_FIELD_IDS | undefined;
  }[];
  // The browser-only bits arrive as inputs; userAgent is optional.
  page: { url: string; title: string; path: string; userAgent?: string | undefined };
};

type FieldName = keyof typeof GHL_FIELD_IDS;

// The identifying strings (keys, ids) are rejected when over 500 characters;
// values get 5000, room for a contact message. Page metadata and labels are
// only context, so they are cut to 500 instead: a long ad-tagged URL or
// in-app-browser userAgent must never stop an order's details from being sent.
const strict = z.string().max(500);
const value = z.string().max(5000);
const clipped = z.string().transform((s) => s.slice(0, 500));

export const submissionSchema = z.object({
  formId: strict,
  formName: clipped,
  fields: z
    .array(
      z.object({
        key: strict,
        value: z.union([value, z.boolean()]),
        label: clipped,
        custom: z.enum(Object.keys(GHL_FIELD_IDS) as [FieldName, ...FieldName[]]).optional(),
      }),
    )
    .max(12),
  page: z.object({
    url: clipped,
    title: clipped,
    path: clipped,
    userAgent: clipped.optional(),
  }),
  sessionId: strict,
});

export function buildTrackingEvent(
  s: Submission,
  sessionId: string,
  now: number,
  ids: typeof GHL_FIELD_IDS = GHL_FIELD_IDS,
): Record<string, unknown> {
  const formData: Record<string, unknown> = {};
  const formLabels: Record<string, string> = {};
  for (const f of s.fields) {
    const id = f.custom ? ids[f.custom] || f.key : f.key;
    formData[id] = f.value;
    formLabels[id] = f.label;
  }
  // Same as postTrackingEvent: a blank label falls back to the key.
  for (const key of Object.keys(formData)) {
    formLabels[key] ||= key;
  }
  const userAgent = s.page.userAgent ?? "";
  return {
    // tracking.ts says "external form_submission" (with a space). GHL answers
    // "ok" to that but never makes a contact from it; the underscore does
    // (tested live, 2026-10-28).
    type: "external_form_submission",
    timestamp: now,
    formId: s.formId,
    formData,
    formLabels,
    url: s.page.url,
    title: s.page.title,
    path: s.page.path,
    userAgent,
    trackingId: TRACKING_ID,
    locationId: LOCATION_ID,
    projectId: PROJECT_ID,
    sessionId,
    properties: {
      deviceType: /Mobile|Android|iPhone/i.test(userAgent) ? "mobile" : "desktop",
      source: "ai_studio",
      projectId: PROJECT_ID,
      formName: s.formName,
    },
  };
}

// POST the event, retrying once on a network error, timeout or 5xx. A 4xx is
// the CRM refusing the event itself, so a second try can't help and is skipped.
// Resolves true on success and false after the final failure; never throws.
// The failure is logged for the server's operator (form id, last status or
// error name, attempt count): never the email, the name or other personal details.
export async function postEvent(
  event: Record<string, unknown>,
  endpoint: string,
  fetchImpl: typeof fetch,
): Promise<boolean> {
  let last = "unknown";
  let attempts = 0;
  for (let attempt = 0; attempt < 2; attempt++) {
    attempts += 1;
    try {
      const body = new FormData();
      body.append("event", JSON.stringify(event));
      const res = await fetchImpl(endpoint, {
        method: "POST",
        headers: { version: "2021-07-28" },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return true;
      last = `HTTP ${res.status}`;
      if (res.status >= 400 && res.status < 500) break;
    } catch (err) {
      // network error or timeout: fall through to the retry
      last = err instanceof Error ? err.name : "error";
    }
  }
  const formId = typeof event["formId"] === "string" ? event["formId"] : "unknown";
  console.error(`GHL submission failed (formId=${formId}, last=${last}, attempts=${attempts})`);
  return false;
}
