import { useEffect, useRef, useState } from 'react';

export default function Header({ searchQuery = '', onSearchChange, onSearchTracked, bookRepairUrl, onBookRepair }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Debounce search tracking — fire after 1s of no typing
  const debounceRef = useRef(null);
  useEffect(() => {
    if (!searchQuery.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearchTracked) onSearchTracked(searchQuery);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, onSearchTracked]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-cafe focus:text-white focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
    <header className="bg-white border-b border-cream-border sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Logo + title */}
          <a href="https://www.kanencoffee.com" className="flex items-center gap-3 flex-shrink-0 no-underline" target="_blank" rel="noopener noreferrer">
            <span className="text-2xl" aria-hidden="true">☕</span>
            <div>
              <h1 className="text-base font-semibold text-espresso-dark leading-tight">
                Espresso Troubleshooting
              </h1>
              <p className="text-xs text-espresso-muted hidden sm:block">
                Kanen Coffee — Diagnose &amp; fix common machine problems
              </p>
            </div>
          </a>

          {/* Search — left of nav links */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted text-sm"
              aria-hidden="true"
            >
              🔍
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search issues…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-cream-border rounded-md bg-cream placeholder-espresso-muted text-espresso-dark focus:outline-none focus:ring-2 focus:ring-amber-cafe focus:border-transparent"
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-3 text-sm ml-auto" aria-label="Site navigation">
            <a
              href="https://www.kanencoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              Shop
            </a>
            <a
              href="https://www.youtube.com/@kanencoffee"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { if (typeof window.gtag === 'function') window.gtag('event', 'youtube_click', { source: 'header' }); }}
              className="text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              YouTube
            </a>
            <a
              href="tel:+15108594425"
              className="text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              (510) 859-4425
            </a>
            <a
              href={bookRepairUrl || 'https://www.kanencoffee.com/bookappointment'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onBookRepair}
              className="px-4 py-1.5 rounded-md bg-amber-cafe text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              Book a Repair
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto p-2 text-espresso-dark rounded-md hover:bg-cream transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile search — always visible on small screens */}
        <div className="relative mt-3 sm:hidden">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted text-sm"
            aria-hidden="true"
          >
            🔍
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search issues…"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-cream-border rounded-md bg-cream placeholder-espresso-muted text-espresso-dark focus:outline-none focus:ring-2 focus:ring-amber-cafe focus:border-transparent"
          />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-cream-border bg-white">
          <nav className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex flex-col gap-2" aria-label="Mobile navigation">
            <a
              href="https://www.kanencoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-sm text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              Shop Machines
            </a>
            <a
              href="https://www.youtube.com/@kanencoffee"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { if (typeof window.gtag === 'function') window.gtag('event', 'youtube_click', { source: 'mobile_menu' }); }}
              className="py-2 text-sm text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              YouTube (5,500+ repair videos)
            </a>
            <a
              href="tel:+15108594425"
              className="py-2 text-sm text-espresso-muted hover:text-espresso-dark transition-colors"
            >
              Call (510) 859-4425
            </a>
            <a
              href={bookRepairUrl || 'https://www.kanencoffee.com/bookappointment'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { onBookRepair && onBookRepair(); setMenuOpen(false); }}
              className="mt-1 text-center px-4 py-2.5 rounded-md bg-amber-cafe text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              Book a Repair
            </a>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
