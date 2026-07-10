import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

import type { Theme } from "~/lib/theme";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Nav({ theme }: { theme: Theme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="group" aria-label="Baranwal Associates — home">
          <span className="font-display text-lg font-medium tracking-tight">
            Baranwal<span className="text-accent">&nbsp;Associates</span>
          </span>
          <span className="annotation ml-3 hidden transition-colors group-hover:text-accent sm:inline">
            est. 1987
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              viewTransition
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <ThemeToggle theme={theme} />
          <Link
            to="/auth/login"
            className="rounded-full border border-ink px-4 py-1.5 text-sm transition-colors hover:border-accent hover:bg-accent hover:text-paper"
          >
            Client Portal
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle theme={theme} />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-0.5 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-6 py-6 md:hidden">
          <ul className="space-y-4">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  viewTransition
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl"
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="annotation !text-accent"
              >
                Client Portal →
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
