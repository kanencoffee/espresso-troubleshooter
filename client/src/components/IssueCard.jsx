import { useState } from 'react';
import DifficultyBadge from './DifficultyBadge';
import { TIERS } from '../data/machines';

const DIY_CONFIG = {
  diy: { label: 'DIY Friendly', classes: 'bg-green-100 text-green-800 border border-green-200' },
  intermediate: { label: 'Some Experience Needed', classes: 'bg-amber-100 text-amber-800 border border-amber-200' },
  tech: { label: 'Technician Recommended', classes: 'bg-red-100 text-red-800 border border-red-200' },
};

function TierBadge({ tierId }) {
  const tier = TIERS.find((t) => t.id === tierId);
  if (!tier) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cream border border-cream-border text-espresso-muted">
      {tier.label}
    </span>
  );
}

function SolutionSteps({ text }) {
  const lines = text.split('\n').filter(Boolean);
  const numbered = lines.filter((l) => /^\d+\./.test(l.trim()));
  if (numbered.length === lines.length) {
    return (
      <ol className="list-decimal list-inside space-y-1 text-sm text-espresso-dark">
        {lines.map((line, i) => (
          <li key={i} className="leading-relaxed">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <p className="text-sm text-espresso-dark leading-relaxed whitespace-pre-line">{text}</p>
  );
}

function CopyLinkButton({ issueId }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(e) {
    e.stopPropagation();
    const url = `${window.location.origin}/#${issueId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-cream-border text-espresso-muted hover:border-espresso-muted hover:text-espresso-dark transition-colors"
      title="Copy link to this issue"
    >
      {copied ? '✅ Copied!' : '🔗 Copy link'}
    </button>
  );
}

export default function IssueCard({ issue, num, isExpanded, onToggle }) {
  const [techOpen, setTechOpen] = useState(false);
  const diy = DIY_CONFIG[issue.diy] || DIY_CONFIG.tech;

  return (
    <div
      id={issue.id}
      className={`bg-white rounded-lg border scroll-mt-4 ${isExpanded ? 'border-amber-cafe shadow-md' : 'border-cream-border hover:border-espresso-muted'} transition-all duration-200`}
    >
      {/* Clickable header row */}
      <button
        className="w-full text-left px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-cafe rounded-lg"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Number + title */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-espresso-muted">#{String(num).padStart(2, '0')}</span>
              <h2 className="text-base font-semibold text-espresso-dark">{issue.title}</h2>
            </div>

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="text-sm text-espresso-muted">
                {issue.categoryIcon} {issue.categoryLabel}
              </span>
              <span className="text-cream-border">·</span>
              <DifficultyBadge difficulty={issue.difficulty} />
              {issue.tiers.map((t) => (
                <TierBadge key={t} tierId={t} />
              ))}
            </div>

            {/* Symptoms bullets — always visible */}
            <ul className="mt-3 space-y-1">
              {issue.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-espresso-muted">
                  <span className="mt-0.5 text-amber-cafe font-bold">–</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            {/* Plain summary */}
            <p className="mt-2 text-sm text-espresso-dark font-medium">{issue.summary}</p>
          </div>

          {/* Chevron */}
          <span
            className={`flex-shrink-0 mt-1 text-espresso-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded body */}
      {isExpanded && (
        <div className="border-t border-cream-border px-5 pb-5 pt-4 space-y-5">
          {/* Cause */}
          <section>
            <h3 className="text-sm font-semibold text-espresso-dark mb-1"><span aria-hidden="true">⚡</span> What causes this</h3>
            <p className="text-sm text-espresso-muted leading-relaxed">{issue.cause}</p>
          </section>

          {/* Solution */}
          <section>
            <h3 className="text-sm font-semibold text-espresso-dark mb-2"><span aria-hidden="true">✅</span> How to fix it</h3>
            <SolutionSteps text={issue.solution} />
          </section>

          {/* DIY badge + copy link */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${diy.classes}`}>
              <span aria-hidden="true">🏷️</span> {diy.label}
            </span>
            <CopyLinkButton issueId={issue.id} />
          </div>

          {/* Technical detail — collapsible */}
          {issue.technicalDetail && (
            <section>
              <button
                className="flex items-center gap-2 text-sm font-medium text-espresso-muted hover:text-espresso-dark transition-colors w-full text-left"
                onClick={() => setTechOpen((v) => !v)}
                aria-expanded={techOpen}
              >
                <span><span aria-hidden="true">🔧</span> Technical details</span>
                <span className="text-xs text-espresso-muted italic">(for technicians &amp; advanced users)</span>
                <span className={`ml-auto transition-transform duration-200 ${techOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>

              {techOpen && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                  <p className="text-sm text-espresso-dark leading-relaxed whitespace-pre-line">{issue.technicalDetail}</p>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
