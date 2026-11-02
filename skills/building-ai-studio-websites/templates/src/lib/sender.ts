// Who is sending the emails and selling. Fixed in code on purpose: the legal
// identity rarely changes and must never be blank where consent is asked (CASL).
// Show the phone number only where the client agrees.

export const SENDER = {
  name: "REPLACE_PUBLIC_NAME",
  business: "REPLACE_LEGAL_BUSINESS_NAME",
  address: "REPLACE_MAILING_ADDRESS",
  email: "REPLACE_CONTACT_EMAIL",
  phone: "REPLACE_PHONE",
};

/** The sender line shown under every sign-up form (the Privacy link follows it). */
export function senderLineText(): string {
  return `From ${SENDER.name} (${SENDER.business}) · ${SENDER.address} · ${SENDER.email}. Unsubscribe any time with one click.`;
}
