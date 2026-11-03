// Sends a form's answers to the CRM. Fictional endpoint for this sample site.
const ENDPOINT = "https://forms.crm.test/submit";

export function trackFormSubmission(fields: Record<string, string>) {
  // Fire and forget: we never look at the reply.
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "external form submission",
      fields,
    }),
  });

  // Success is shown right away, whether or not the CRM accepted it.
  return { ok: true };
}
