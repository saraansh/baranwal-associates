import { Link } from "react-router";

import { firm } from "~/lib/content";
import { RuleDraw } from "./motion";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="annotation mb-4">Start a conversation</p>
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
              Let&rsquo;s design
              <br />
              something <span className="italic text-accent">lasting</span>.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${firm.whatsapp}?text=${encodeURIComponent("Hello! I'm interested in your architectural services.")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
              >
                WhatsApp us
              </a>
              <a
                href={`tel:${firm.phones[0].replace(/\s/g, "")}`}
                className="rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {firm.phones[0]}
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="annotation mb-4">Studio</p>
            <address className="text-sm not-italic leading-7 text-muted">
              {firm.address}
              <br />
              {firm.hours}
              <br />
              <a
                href={`mailto:${firm.email}`}
                className="text-ink underline-offset-4 hover:text-accent hover:underline"
              >
                {firm.email}
              </a>
            </address>
          </div>

          <div className="md:col-span-2">
            <p className="annotation mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Portfolio", "/portfolio"],
                ["Journal", "/blog"],
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Client Portal", "/auth/login"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="annotation mb-4">Elsewhere</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Facebook", firm.social.facebook],
                ["Houzz", firm.social.houzz],
                ["Justdial", firm.social.justdial],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <RuleDraw className="mt-16" />

        <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {firm.name} · {firm.principal} ·
            Architects & Structural Engineers, {firm.city}
          </p>
          <p className="annotation">Since {firm.since} — {firm.region}</p>
        </div>
      </div>
    </footer>
  );
}
