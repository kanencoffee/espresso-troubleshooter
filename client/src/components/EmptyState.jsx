export default function EmptyState({ onClear }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
      <h3 className="text-lg font-medium text-espresso-dark mb-2">No issues match your filters</h3>
      <p className="text-espresso-muted mb-6 max-w-sm mx-auto">
        Try adjusting your machine tier, category, or search query to find relevant troubleshooting guides.
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-amber-cafe text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
