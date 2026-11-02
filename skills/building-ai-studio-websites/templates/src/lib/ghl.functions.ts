// Server function — sends an email-form submission to the CRM from the server,
// so the browser's own network doesn't matter. It is not guaranteed to finish if
// the visitor closes the tab first: on Cloudflare/Nitro that would need
// `waitUntil`. A paid order whose details are lost that way is caught by
// a follow-up workflow in the CRM.
// A final failure is logged by `postEvent`. Public: no auth middleware.

import { createServerFn } from "@tanstack/react-start";
import { buildTrackingEvent, postEvent, submissionSchema, GHL_ENDPOINT } from "./ghl-submit";

export const sendFormSubmission = createServerFn({ method: "POST" })
  .validator((data) => submissionSchema.parse(data))
  .handler(async ({ data }) => {
    const { sessionId, ...submission } = data;
    const event = buildTrackingEvent(submission, sessionId, Date.now());
    // GHL_TRACKING_ENDPOINT lets a local stub stand in for the real endpoint.
    const endpoint = process.env["GHL_TRACKING_ENDPOINT"] || GHL_ENDPOINT;
    const ok = await postEvent(event, endpoint, fetch);
    return { ok };
  });
