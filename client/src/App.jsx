import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ISSUES, CATEGORIES } from './data/issues';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import IssueCard from './components/IssueCard';
import EmptyState from './components/EmptyState';
import ElectricalSafetyBanner from './components/ElectricalSafetyBanner';
import SafetyDisclaimer from './components/SafetyDisclaimer';

// Fire a gtag event if available
function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

const BOOK_URL = 'https://www.kanencoffee.com/bookappointment';

function bookingUrl(source, issueId = null) {
  const params = new URLSearchParams({
    utm_source: 'help',
    utm_medium: 'referral',
    utm_campaign: 'troubleshooter',
    utm_content: issueId ? `card-${issueId}` : source,
  });
  return `${BOOK_URL}?${params}`;
}

// Enrich issues with resolved category label/icon for card display
const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
const ENRICHED_ISSUES = ISSUES.map((issue) => ({
  ...issue,
  categoryLabel: CATEGORY_MAP[issue.category]?.label ?? issue.category,
  categoryIcon: CATEGORY_MAP[issue.category]?.icon ?? '🔧',
}));

export default function App() {
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // On mount: read URL hash, auto-expand matching issue and scroll to it
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const issue = ENRICHED_ISSUES.find((i) => i.id === hash);
    if (!issue) return;
    setExpandedId(hash);
    trackEvent('page_view', { page_location: window.location.href, page_title: document.title });
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Log search to Vercel KV (fire-and-forget)
  const logSearch = useCallback((query, resultCount, filters) => {
    fetch('/api/search-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, resultCount, filters }),
    }).catch(() => {}); // silent fail — analytics should never break UX
  }, []);

  // Debounced search tracking — fires GA4 + Vercel KV log
  const searchLogRef = useRef(null);
  const handleSearchTracked = useCallback((query) => {
    if (query.trim().length < 3) return;
    trackEvent('search', { search_term: query.trim() });

    // Delay KV log slightly so filtered results have settled
    clearTimeout(searchLogRef.current);
    searchLogRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const count = ENRICHED_ISSUES.filter((issue) =>
        issue.title.toLowerCase().includes(q) ||
        issue.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        issue.summary.toLowerCase().includes(q)
      ).length;
      logSearch(query.trim(), count, {
        tiers: selectedTiers.length ? selectedTiers : undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
      });
    }, 300);
  }, [logSearch, selectedTiers, selectedCategories]);

  function handleToggle(issueId) {
    setExpandedId((prev) => {
      const next = prev === issueId ? null : issueId;
      if (next) {
        history.replaceState(null, '', `#${next}`);
        trackEvent('issue_expand', { issue_id: issueId });
      } else {
        history.replaceState(null, '', window.location.pathname);
        trackEvent('page_view', { page_location: window.location.href, page_title: document.title });
      }
      return next;
    });
  }

  function toggleTier(tierId) {
    const next = selectedTiers.includes(tierId)
      ? selectedTiers.filter((t) => t !== tierId)
      : [...selectedTiers, tierId];
    setSelectedTiers(next);
    trackEvent('filter_tier', { tier_id: tierId, active: !selectedTiers.includes(tierId) });
  }

  function toggleCategory(catId) {
    const next = selectedCategories.includes(catId)
      ? selectedCategories.filter((c) => c !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(next);
    trackEvent('filter_category', { category_id: catId, active: !selectedCategories.includes(catId) });
  }

  function clearAll() {
    setSelectedTiers([]);
    setSelectedCategories([]);
    setSearchQuery('');
    trackEvent('filter_clear');
  }

  const handleBookRepair = useCallback((source, issueId = null) => {
    trackEvent('book_repair_click', {
      source,
      issue_id: issueId,
      issue_difficulty: issueId ? ENRICHED_ISSUES.find((i) => i.id === issueId)?.diy : undefined,
    });
  }, []);

  // Back-to-top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ENRICHED_ISSUES.filter((issue) => {
      const tierMatch =
        selectedTiers.length === 0 ||
        selectedTiers.some((t) => issue.tiers.includes(t));

      const catMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(issue.category);

      const searchMatch =
        !q ||
        issue.title.toLowerCase().includes(q) ||
        issue.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        issue.summary.toLowerCase().includes(q);

      return tierMatch && catMatch && searchMatch;
    });
  }, [selectedTiers, selectedCategories, searchQuery]);

  const filteredWithNum = useMemo(
    () => filtered.map((issue) => ({ issue, num: ENRICHED_ISSUES.indexOf(issue) + 1 })),
    [filtered]
  );

  // Track when active filters/search produce zero results — only fires on transition to zero
  const hasActiveFilters = selectedTiers.length > 0 || selectedCategories.length > 0 || searchQuery.trim().length > 0;
  const prevFilteredLengthRef = useRef(filtered.length);
  useEffect(() => {
    const wasNonZero = prevFilteredLengthRef.current !== 0;
    if (filtered.length === 0 && hasActiveFilters && wasNonZero) {
      const term = searchQuery.trim() || null;
      trackEvent('no_results', {
        search_term: term,
        tier_filters: selectedTiers.join(',') || null,
        category_filters: selectedCategories.join(',') || null,
      });
      // Also send a specific GA4 event for easier reporting
      if (term) {
        trackEvent('search_no_results', { search_term: term });
      }
    }
    prevFilteredLengthRef.current = filtered.length;
  }, [filtered.length, hasActiveFilters, searchQuery, selectedTiers, selectedCategories]);

  return (
    <div className="min-h-screen bg-cream">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchTracked={handleSearchTracked}
        bookRepairUrl={bookingUrl('header')}
        onBookRepair={() => handleBookRepair('header')}
      />

      <FilterBar
        selectedTiers={selectedTiers}
        onTierToggle={toggleTier}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        resultCount={filtered.length}
        totalCount={ENRICHED_ISSUES.length}
      />

      <main id="main-content" className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        <SafetyDisclaimer />
        {(selectedCategories.includes('electronics') ||
          (searchQuery.trim() !== '' && filtered.some((i) => i.category === 'electronics'))) && (
          <ElectricalSafetyBanner />
        )}
        {filteredWithNum.length === 0 ? (
          <EmptyState onClear={clearAll} searchQuery={searchQuery.trim()} />
        ) : (
          <div className="space-y-3">
            {filteredWithNum.map(({ issue, num }) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                num={num}
                isExpanded={expandedId === issue.id}
                onToggle={() => handleToggle(issue.id)}
                bookRepairUrl={bookingUrl('card', issue.id)}
                onBookRepair={() => handleBookRepair('card', issue.id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 sm:px-6 mt-6 border-t border-cream-border pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="text-sm text-espresso-dark">
            <span className="font-semibold">Kanen Coffee</span>
            <span className="text-espresso-muted"> — Berkeley's espresso machine repair specialists since 2011</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-espresso-muted">
            <a
              href={bookingUrl('footer')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleBookRepair('footer')}
              className="font-semibold text-amber-cafe hover:text-amber-700 transition-colors"
            >
              Book a Repair
            </a>
            <a
              href="tel:+15108594425"
              onClick={() => trackEvent('phone_click', { source: 'footer' })}
              className="hover:text-espresso-dark transition-colors"
            >
              (510) 859-4425
            </a>
            <a
              href="https://www.kanencoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-espresso-dark transition-colors"
            >
              Shop
            </a>
            <a
              href="https://www.youtube.com/@kanencoffee"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('youtube_click', { source: 'footer' })}
              className="hover:text-espresso-dark transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
        <p className="text-xs text-espresso-muted">
          Mon–Fri 12pm–5pm · 2129 San Pablo Ave, Berkeley, CA 94702 · General troubleshooting guide only.
          Always isolate power before servicing. For machine-specific part numbers, consult your service manual or authorised distributor.
        </p>
        <p className="text-xs text-espresso-muted mt-2">
          Authorized service for Lelit, Rancilio, Eureka, Breville, Baratza &amp; more · © {new Date().getFullYear()} Kanen Coffee, LLC.
        </p>
      </footer>

      {/* Sticky mobile CTA bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-cream-border px-4 py-3 flex gap-3">
        <a
          href="tel:+15108594425"
          onClick={() => trackEvent('phone_click', { source: 'mobile_sticky' })}
          className="flex-1 text-center py-2.5 rounded-md border border-cream-border text-sm font-semibold text-espresso-dark hover:bg-cream transition-colors"
        >
          Call Us
        </a>
        <a
          href={bookingUrl('mobile_sticky')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleBookRepair('mobile_sticky')}
          className="flex-1 text-center py-2.5 rounded-md bg-amber-cafe text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
        >
          Book a Repair
        </a>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 md:bottom-8 right-4 z-20 w-10 h-10 rounded-full bg-white border border-cream-border shadow-md flex items-center justify-center text-espresso-muted hover:text-espresso-dark hover:border-espresso-muted transition-all"
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
      )}
    </div>
  );
}
