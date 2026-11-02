import { SENDER } from "@/lib/sender";
import { TERMS_SECTIONS } from "@/lib/terms";

// The Terms of Sale's words, for the /terms page and the checkout pop-up.
// No page frame here: each of those draws its own.

const LINK =
  "font-semibold text-frame-plum underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame-plum";

const mail = `mailto:${SENDER.email}`;

/** A paragraph with the contact address, where it appears, as a link. */
function Paragraph({ text }: { text: string }) {
  const parts = text.split(SENDER.email);
  return (
    <p>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 ? (
            <a href={mail} className={LINK}>
              {SENDER.email}
            </a>
          ) : null}
          {part}
        </span>
      ))}
    </p>
  );
}

export function TermsContent() {
  return (
    <div className="text-[1.05rem] leading-relaxed text-[#3d3646]">
      {TERMS_SECTIONS.map((section) => (
        <section key={section.id} className="mt-10 grid gap-3 first:mt-0">
          <h2 className="font-display text-[1.6rem] font-medium leading-tight text-frame-ink">
            {section.title}
          </h2>
          {section.paragraphs.map((text) => (
            <Paragraph key={text} text={text} />
          ))}
          {section.items ? (
            <ul className="grid list-disc gap-2 pl-6">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.id === "seller" ? (
            <p>
              {SENDER.business}
              <br />
              {SENDER.address}
              <br />
              <a href={`tel:${SENDER.phone.replace(/[^+\d]/g, "")}`} className={LINK}>
                {SENDER.phone}
              </a>
              <br />
              <a href={mail} className={LINK}>
                {SENDER.email}
              </a>
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
