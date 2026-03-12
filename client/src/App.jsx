import { useState, useMemo } from 'react';
import { ISSUES, CATEGORIES } from './data/issues';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import IssueCard from './components/IssueCard';
import EmptyState from './components/EmptyState';

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
      <Header />

      <FilterBar
        selectedTiers={selectedTiers}
        onTierToggle={toggleTier}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filtered.length}
        totalCount={ENRICHED_ISSUES.length}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
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
                onToggle={() =>
                  setExpandedId((prev) => (prev === issue.id ? null : issue.id))
                }
              />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 sm:px-6 mt-6 border-t border-cream-border">
        <p className="text-xs text-espresso-muted text-center">
          General commercial espresso machine troubleshooting guide. Always isolate power before
          servicing. For machine-specific part numbers, consult your service manual or authorised
          distributor.
        </p>
      </footer>
    </div>
  );
}
