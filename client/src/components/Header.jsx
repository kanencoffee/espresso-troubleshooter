import { useEffect, useRef } from 'react';

export default function Header({
  searchQuery = '',
  onSearchChange,
  onSearchTracked,
  bookRepairUrl,
  onBookRepair,
  currentTab,
  onTabChange,
}) {
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
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-cafe focus:text-white focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <header className="bg-white border-b border-cream-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top row */}
          <div className="flex items-center gap-4 py-3">
            {/* Logo + title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-2xl" aria-hidden="true">☕</span>
              <div>
                <h1 className="text-base font-semibold text-espresso-dark leading-tight">
                  Kanen Coffee
                </h1>
                <p className="text-xs text-espresso-muted hidden sm:block">
                  Berkeley's espresso specialists since 2011
                </p>
              </div>
            </div>

            {/* Search — only visible on troubleshooter tab */}
            {currentTab === 'troubleshooter' && (
              <div className="relative flex-1 max-w-xs">
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
            )}

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-3 text-sm ml-auto" aria-label="Site navigation">
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
                href={bookRepairUrl || 'https://www.kanencoffee.com/bookappointment'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBookRepair}
                className="px-4 py-1.5 rounded-md bg-amber-cafe text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
              >
                Book a Repair
              </a>
            </nav>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 -mb-px" role="tablist" aria-label="Site sections">
            <button
              role="tab"
              aria-selected={currentTab === 'troubleshooter'}
              onClick={() => onTabChange('troubleshooter')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'troubleshooter'
                  ? 'border-amber-cafe text-amber-cafe'
                  : 'border-transparent text-espresso-muted hover:text-espresso-dark'
              }`}
            >
              Troubleshooter
            </button>
            <button
              role="tab"
              aria-selected={currentTab === 'machines'}
              onClick={() => onTabChange('machines')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'machines'
                  ? 'border-amber-cafe text-amber-cafe'
                  : 'border-transparent text-espresso-muted hover:text-espresso-dark'
              }`}
            >
              Machines
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
