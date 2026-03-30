export default function EmptyState({ onClear, searchQuery, bookRepairUrl, onBookRepair }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
      <h3 className="text-2xl font-bold text-espresso-dark mb-2">
        No results for{searchQuery ? <> &ldquo;<span className="text-amber-cafe">{searchQuery}</span>&rdquo;</> : ' your filters'}
      </h3>
      <p className="text-espresso-muted mb-6 max-w-sm mx-auto">
        We don&rsquo;t have a guide for that yet — but our technicians have seen it all.
      </p>
      <button
        onClick={onClear}
        className="text-sm text-espresso-muted underline underline-offset-2 hover:text-espresso-dark transition-colors"
      >
        Clear search and show all issues
      </button>
    </div>
  );
}
