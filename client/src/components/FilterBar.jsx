import { useEffect, useRef } from 'react';
import { TIERS } from '../data/machines';
import { CATEGORIES } from '../data/issues';

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        active
          ? 'bg-amber-cafe text-white border-amber-cafe'
          : 'bg-white text-espresso-muted border-cream-border hover:border-espresso-muted hover:text-espresso-dark'
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({
  selectedTiers,
  onTierToggle,
  selectedCategories,
  onCategoryToggle,
  searchQuery,
  onSearchChange,
  onSearchTracked,
  resultCount,
  totalCount,
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
    <div className="bg-white border-b border-cream-border">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search issues, symptoms…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-cream-border rounded-md bg-cream placeholder-espresso-muted text-espresso-dark focus:outline-none focus:ring-2 focus:ring-amber-cafe focus:border-transparent"
          />
        </div>

        {/* Machine tier filter */}
        <div>
          <p className="text-xs font-medium text-espresso-muted uppercase tracking-wide mb-2">Machine Tier</p>
          <div className="flex flex-wrap gap-2">
            {TIERS.map((tier) => (
              <FilterChip
                key={tier.id}
                label={tier.label}
                active={selectedTiers.includes(tier.id)}
                onClick={() => onTierToggle(tier.id)}
              />
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs font-medium text-espresso-muted uppercase tracking-wide mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                label={`${cat.icon} ${cat.label}`}
                active={selectedCategories.includes(cat.id)}
                onClick={() => onCategoryToggle(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-espresso-muted">
          Showing <span className="font-medium text-espresso-dark">{resultCount}</span> of {totalCount} issues
        </p>
      </div>
    </div>
  );
}
