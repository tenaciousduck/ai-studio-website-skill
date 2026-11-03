import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { trackFormSubmission } from "../lib/tracking";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | Glimmerpane Window Co." }] }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const result = trackFormSubmission(data);
    setSent(result.ok);
  }

  if (sent) return <p>Thanks! We will be in touch.</p>;

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name <input name="name" required />
      </label>
      <label>
        Email <input name="email" type="email" required />
      </label>
      <label>
        <input type="checkbox" name="consent" defaultChecked />
        Yes, send me news and offers by email.
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
