import { useEffect, useRef } from 'react';

export default function Header({ searchQuery = '', onSearchChange, onSearchTracked }) {
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

  return (
    <header className="bg-white border-b border-cream-border sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Logo + title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-2xl" aria-hidden="true">☕</span>
            <div>
              <h1 className="text-base font-semibold text-espresso-dark leading-tight">
                Espresso Troubleshooting
              </h1>
              <p className="text-xs text-espresso-muted hidden sm:block">
                Kanen Coffee — Diagnose &amp; fix common machine problems
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-4 text-sm text-espresso-muted">
            <a
              href="https://www.kanencoffee.com/service"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-espresso-dark transition-colors"
            >
              Book a Repair
            </a>
            <a
              href="https://www.youtube.com/@kanencoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-espresso-dark transition-colors"
            >
              YouTube
            </a>
          </nav>

          {/* Search — right side */}
          <div className="relative flex-1 max-w-xs ml-auto">
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
      </div>
    </header>
  );
}
