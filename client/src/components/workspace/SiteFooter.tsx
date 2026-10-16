import { ChevronUp, Github, Globe, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Site footer.
//
// It is also the answer to "where is such-and-such?". The side navigation shows
// icons; this names every view in plain groups, so nothing in the register is
// something a reader has to go hunting for.
//
// The links are actions, not routes — the application is one shell, and a
// footer link opens its panel over the map rather than navigating away.
// ---------------------------------------------------------------------------

export interface FooterLink {
  label: string;
  /** In-app action. Mutually exclusive with `href`. */
  onSelect?: () => void;
  /** External destination. Opens in a new tab with no referrer. */
  href?: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface SiteFooterProps {
  open: boolean;
  onToggle: () => void;
  columns: FooterColumn[];
  /** The handful of links worth showing even while the footer is collapsed. */
  quickLinks: FooterLink[];
}

function LinkItem({ link, muted = true }: { link: FooterLink; muted?: boolean }) {
  const cls = `text-left text-xs ${muted ? 'text-white/75' : 'text-white/80'} hover:text-white transition-colors`;
  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer noopener" className={cls}>
        {link.label} <span aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={link.onSelect} className={cls}>
      {link.label}
    </button>
  );
}

export default function SiteFooter({ open, onToggle, columns, quickLinks }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-white/10 bg-[#070b14]">
      {open && (
        <div className="px-4 lg:px-6 pt-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-8 max-w-[90rem]">
            {/* Brand block */}
            <div>
              <div className="flex items-center gap-2.5">
                <img
                  src={`${import.meta.env.BASE_URL}nhid-logo.png`}
                  alt=""
                  aria-hidden="true"
                  className="w-7 h-7 object-contain"
                />
                <p className="text-sm font-semibold text-white">AI Governance Map</p>
              </div>
              <p className="text-xs text-white/75 leading-relaxed mt-2 max-w-xs">
                A local-only reference for AI obligations, controls and risk across the frameworks that bind
                them. Your assessment data never leaves this browser.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href="https://github.com/thankcheeses/ai-governance-map"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Repository on GitHub"
                  className="p-1.5 rounded border border-white/15 text-white/80 hover:text-white hover:border-white/35"
                >
                  <Github size={14} />
                </a>
                <a
                  href="https://nhid-clinical.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="NHID-Clinical website"
                  className="p-1.5 rounded border border-white/15 text-white/80 hover:text-white hover:border-white/35"
                >
                  <Globe size={14} />
                </a>
              </div>
            </div>

            {/* Grouped links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
              {columns.map((col) => (
                <nav key={col.heading} aria-label={col.heading}>
                  <h2 className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/80 mb-2.5">
                    {col.heading}
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    {col.links.map((link) => (
                      <li key={link.label} className="flex">
                        <LinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-3 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[0.75rem] text-white/70">
              © {year} AI Governance Map · Reference material, not legal advice.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[0.75rem] text-white/70 hover:text-white/80"
              >
                NHID-Clinical: CC BY 4.0 <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/thankcheeses/ai-governance-map"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[0.75rem] text-white/70 hover:text-white/80"
              >
                Source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed bar: a few named destinations are always on screen, so the
          map never looks like a dead end. */}
      <div className="flex items-center gap-3 px-4 lg:px-6 h-10">
        <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/70 hidden sm:inline">
          Browse
        </span>
        <div className="flex items-center gap-3 overflow-x-auto">
          {quickLinks.map((link) => (
            <span key={link.label} className="whitespace-nowrap">
              <LinkItem link={link} muted={false} />
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white whitespace-nowrap"
        >
          {open ? <X size={12} aria-hidden="true" /> : <ChevronUp size={12} aria-hidden="true" />}
          {open ? 'Hide all views' : 'All views'}
        </button>
      </div>
    </footer>
  );
}
