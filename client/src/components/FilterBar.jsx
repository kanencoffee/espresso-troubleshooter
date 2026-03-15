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
  resultCount,
  totalCount,
}) {
  return (
    <div className="bg-white border-b border-cream-border">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 space-y-3">
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
