import { useState, useMemo, useEffect, useCallback } from 'react';
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
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search tracking
  const handleSearchTracked = useCallback((query) => {
    if (query.trim().length >= 3) {
      trackEvent('search', { search_term: query.trim() });
    }
  }, []);

  function handleToggle(issueId) {
    setExpandedId((prev) => {
      const next = prev === issueId ? null : issueId;
      if (next) {
        history.replaceState(null, '', `#${next}`);
        trackEvent('issue_expand', { issue_id: issueId });
      } else {
        history.replaceState(null, '', window.location.pathname);
      }
      return next;
    });
  }

  function toggleTier(tierId) {
    setSelectedTiers((prev) =>
      prev.includes(tierId) ? prev.filter((t) => t !== tierId) : [...prev, tierId]
    );
  }

  function toggleCategory(catId) {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  }

  function clearAll() {
    setSelectedTiers([]);
    setSelectedCategories([]);
    setSearchQuery('');
  }

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

  return (
    <div className="min-h-screen bg-cream">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchTracked={handleSearchTracked}
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
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="space-y-3">
            {filteredWithNum.map(({ issue, num }) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                num={num}
                isExpanded={expandedId === issue.id}
                onToggle={() => handleToggle(issue.id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 sm:px-6 mt-6 border-t border-cream-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="text-sm text-espresso-dark">
            <span className="font-semibold">Kanen Coffee</span>
            <span className="text-espresso-muted"> — Berkeley's espresso machine repair specialists since 2011</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-espresso-muted">
            <a href="https://www.kanencoffee.com/bookappointment" target="_blank" rel="noopener noreferrer" className="hover:text-espresso-dark transition-colors">Book a Repair</a>
            <a href="tel:+15108594425" className="hover:text-espresso-dark transition-colors">(510) 859-4425</a>
            <a href="https://www.youtube.com/@kanencoffee" target="_blank" rel="noopener noreferrer" className="hover:text-espresso-dark transition-colors">YouTube</a>
          </div>
        </div>
        <p className="text-xs text-espresso-muted">
          Mon–Fri 12pm–5pm · 2129 San Pablo Ave, Berkeley, CA 94702 · General troubleshooting guide only.
          Always isolate power before servicing. For machine-specific part numbers, consult your service manual or authorised distributor.
        </p>
        <p className="text-xs text-espresso-muted mt-2">© {new Date().getFullYear()} Kanen Coffee, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
