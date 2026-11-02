// Pure decision for the editor gate shared by /auth and /admin.
// `adminExists` is null when we could not find out (the service-role check was
// unavailable); that must never block an editor, and never offers "claim".

export type AdminStatus = { isAdmin: boolean; adminExists: boolean | null };

export type AdminGateState = "editor" | "not-editor" | "claimable" | "error";

export function adminGateState(status: AdminStatus | undefined, failed = false): AdminGateState {
  if (failed || !status) return "error";
  if (status.isAdmin) return "editor";
  if (status.adminExists === false) return "claimable";
  return "not-editor";
}

export const ADMIN_GATE_MESSAGES = {
  "not-editor": "This account isn't an editor. Ask an existing editor to add you.",
  claimable: "No editor has been set up yet. Claim editor access below.",
  error: "Couldn't check editor access. Please try again.",
} as const;

// Whether the first editor may be claimed, given the result of counting the
// existing editors. Fails closed: if the count could not be read, nobody may
// claim (a failed count must never be mistaken for "zero editors").
export function claimPrecheck(
  count: number | null,
  countError: unknown,
): { ok: true } | { ok: false; reason: "admin-exists" | "check-failed" } {
  if (countError || count === null) return { ok: false, reason: "check-failed" };
  if (count > 0) return { ok: false, reason: "admin-exists" };
  return { ok: true };
}
