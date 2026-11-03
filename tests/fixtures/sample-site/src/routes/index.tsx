import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Glimmerpane Window Co." }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <h1>Glimmerpane Window Co.</h1>
      <img src="/hero.png" alt="A clean storefront window" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p>Trusted by 500+ happy clients across town.</p>
      <blockquote>
        "They made our shop sparkle. Highly recommend!" Sarah M. ★★★★★
      </blockquote>
      <a href="/contact">Ask for a quote</a>
    </main>
  );
}
