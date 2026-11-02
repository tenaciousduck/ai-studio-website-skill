import { SENDER } from "@/lib/sender";

// The Terms of Sale, as plain data so the /terms page and the checkout pop-up
// show the same words and bun can test them. Fixed in code on purpose: a stray
// /admin save must never change what a buyer agreed to.
//
// A labelled sample from one seller of a fixed-price physical product. Not legal
// advice, and it won't suit services or memberships. Every REPLACE is the client's
// decision, so ask; see references/09-legal.md. Delete what doesn't apply, and
// check the rest.

/** Saved with each order as the record of what the buyer agreed to.
 * Change it, and TERMS_UPDATED, whenever these terms change. */
export const TERMS_VERSION = "REPLACE_YYYY-MM-DD";
export const TERMS_UPDATED = "REPLACE_Month D, YYYY";

export const TERMS_SUMMARY = "The short version: REPLACE_ONE_LINE_SUMMARY.";

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "seller",
    title: "Who am I buying from?",
    paragraphs: [
      `You're buying from ${SENDER.business}. In these terms, "we" means ${SENDER.business}.`,
    ],
  },
  {
    id: "covers",
    title: "What do these terms cover?",
    paragraphs: [
      "These terms apply to anything you buy directly on REPLACE_DOMAIN. You agree to them when you tick the box before payment.",
    ],
  },
  {
    id: "order",
    title: "What do I get when I order?",
    paragraphs: ["The price, closing date and shipping dates for each item are on its order page."],
    items: ["REPLACE_WHAT_IS_INCLUDED", "REPLACE_LIMITS_SUCH_AS_ONE_PER_ORDER"],
  },
  {
    id: "payment",
    title: "How does payment work?",
    paragraphs: [
      "Prices are in REPLACE_CURRENCY, and the full price is charged when you order. If your card is in another currency, your bank may convert the amount and charge its own fee.",
      "REPLACE_SHIPPING_AND_TAX_LINE",
      "Stripe processes card payments. Your card statement will show REPLACE_STATEMENT_NAME.",
      "REPLACE_AGE_RULE",
    ],
  },
  {
    id: "refunds",
    title: "Can I get a refund or cancel?",
    paragraphs: [
      "REPLACE_REFUND_RULE",
      `If something has gone wrong, write to ${SENDER.email} and we'll talk through your options.`,
      "If we can't fill your order, you'll get a full refund. That includes an item that has sold out, an address outside our shipping area, or an item we can't supply.",
    ],
  },
  {
    id: "shipping",
    title: "Where and when do you ship?",
    paragraphs: [
      "We ship to REPLACE_SHIPPING_AREA only.",
      "We ship to the billing address you enter at checkout, so please check it before you pay. If that address is wrong, any cost to send the item again is yours.",
      "Orders ship in the window shown on the order page when you ordered. We do our best to meet it, but delays outside our control can happen.",
    ],
  },
  {
    id: "duties",
    title: "Who pays import duties or fees?",
    // Example: "You do. Our price covers shipping only. Any import duties, taxes,
    // customs charges or brokerage fees are not included and are yours to pay."
    paragraphs: ["REPLACE_DUTIES_RULE"],
  },
  {
    id: "damage",
    title: "What if my parcel is late, damaged or lost?",
    paragraphs: [
      "Once we hand your parcel to the carrier, it's in the carrier's care. From then on, as far as the law allows, we aren't responsible for delays, damage or loss, and any claim is made with the carrier.",
      "Write to us and we'll share the shipping details you need.",
    ],
  },
  {
    id: "content",
    title: "Can I share the site's content?",
    paragraphs: [
      `The content on this site is protected by copyright. It belongs to ${SENDER.business} or its other owners. It's for your own personal use, so please don't copy, share or sell it without written permission.`,
    ],
  },
  {
    id: "liability",
    title: "What are the limits on your responsibility?",
    paragraphs: [
      "Our total responsibility for an order is limited, as far as the law allows, to what you paid for it. We aren't responsible for indirect or unexpected losses.",
      "Other companies run the website platform, payments, email and delivery. As far as the law allows, we aren't responsible for their outages or failures.",
    ],
  },
  {
    id: "rights",
    title: "What about my legal rights?",
    paragraphs: [
      "Nothing in these terms removes a right the law says can't be removed. If part of these terms can't be enforced, the rest still applies.",
    ],
  },
  {
    id: "law",
    title: "Which law applies?",
    paragraphs: [
      "These terms are governed by the laws of REPLACE_GOVERNING_LAW. If you live somewhere else, you keep any local consumer rights that can't be waived.",
    ],
  },
  {
    id: "changes",
    title: "Can these terms change?",
    paragraphs: [
      "We may update these terms. The version on this page when you placed your order is the one that applies to it.",
    ],
  },
  {
    id: "contact",
    title: "How do I reach you?",
    paragraphs: [`Write to ${SENDER.email}, or use the Contact page.`],
  },
];
