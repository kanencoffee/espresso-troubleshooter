import { useState } from 'react';

export default function ProductCard({ product }) {
  const defaultConfig = product.configurations[0];
  const defaultColor = product.colors[0];

  const [selectedConfigId, setSelectedConfigId] = useState(defaultConfig.id);
  const [selectedColorId, setSelectedColorId] = useState(defaultColor.id);
  const [specsOpen, setSpecsOpen] = useState(false);

  const selectedConfig = product.configurations.find((c) => c.id === selectedConfigId);
  const selectedColor = product.colors.find((c) => c.id === selectedColorId);

  // If the current color isn't available for the new config, fall back to stainless/first
  function handleConfigChange(configId) {
    setSelectedConfigId(configId);
    const currentColor = product.colors.find((c) => c.id === selectedColorId);
    if (!currentColor?.configs.includes(configId)) {
      const fallback = product.colors.find((c) => c.configs.includes(configId));
      if (fallback) setSelectedColorId(fallback.id);
    }
  }

  const price = selectedConfig?.basePrice ?? 0;
  const colorAvailableForConfig = selectedColor?.configs.includes(selectedConfigId);

  return (
    <div className="bg-white border border-cream-border rounded-xl overflow-hidden shadow-sm">
      {/* Header band */}
      <div className="bg-espresso-dark px-6 py-4">
        <p className="text-xs font-medium tracking-widest text-amber-cafe uppercase mb-0.5">
          {product.brand}
        </p>
        <h2 className="text-2xl font-bold text-white">{product.name}</h2>
        <p className="text-sm text-gray-300 mt-1">{product.tagline}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <p className="text-sm text-espresso-muted leading-relaxed">{product.description}</p>

        {/* Configuration selector */}
        <div>
          <h3 className="text-xs font-semibold text-espresso-dark uppercase tracking-wider mb-2">
            Configuration
          </h3>
          <div className="flex flex-col gap-2">
            {product.configurations.map((config) => (
              <button
                key={config.id}
                onClick={() => handleConfigChange(config.id)}
                className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  selectedConfigId === config.id
                    ? 'border-amber-cafe bg-amber-light text-espresso-dark'
                    : 'border-cream-border bg-cream text-espresso-muted hover:border-amber-cafe hover:text-espresso-dark'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{config.label}</span>
                    <p className="text-xs mt-0.5 leading-snug opacity-80">{config.description}</p>
                  </div>
                  <span className="ml-4 flex-shrink-0 font-bold text-espresso-dark">
                    ${config.basePrice.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <h3 className="text-xs font-semibold text-espresso-dark uppercase tracking-wider mb-2">
            Color
            {selectedColor && (
              <span className="ml-2 text-espresso-muted normal-case font-normal tracking-normal">
                — {selectedColor.label}
                {selectedColor.note && (
                  <span className="ml-1 text-xs text-amber-cafe">({selectedColor.note})</span>
                )}
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const availableForConfig = color.configs.includes(selectedConfigId);
              const isSelected = selectedColorId === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => availableForConfig && setSelectedColorId(color.id)}
                  disabled={!availableForConfig}
                  title={
                    !availableForConfig
                      ? `${color.label} — not available for this configuration`
                      : color.label
                  }
                  aria-label={color.label}
                  aria-pressed={isSelected}
                  className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'scale-110 shadow-md'
                      : availableForConfig
                      ? 'hover:scale-105 opacity-90'
                      : 'opacity-25 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    borderColor: isSelected ? '#B45309' : color.border,
                  }}
                >
                  {isSelected && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                      style={{ color: color.id === 'stainless' || color.id === 'white' || color.id === 'warm-white' ? '#1C1410' : '#fff' }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {!colorAvailableForConfig && (
            <p className="text-xs text-amber-cafe mt-2">
              That color isn't available for the selected configuration. Color reset to {selectedColor?.label}.
            </p>
          )}
        </div>

        {/* Price summary */}
        <div className="flex items-center justify-between py-3 border-t border-cream-border">
          <div>
            <p className="text-xs text-espresso-muted">
              {product.name} · {selectedConfig?.label} · {selectedColor?.label}
            </p>
            <p className="text-2xl font-bold text-espresso-dark mt-0.5">
              ${price.toLocaleString()}
            </p>
            <p className="text-xs text-espresso-muted">USD · Free shipping · Tax not included</p>
          </div>
        </div>

        {/* Specs accordion */}
        <div className="border border-cream-border rounded-lg overflow-hidden">
          <button
            onClick={() => setSpecsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-espresso-dark hover:bg-cream transition-colors"
          >
            <span>Specifications</span>
            <span className="text-espresso-muted text-xs">{specsOpen ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {specsOpen && (
            <div className="border-t border-cream-border divide-y divide-cream-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex px-4 py-2 text-sm">
                  <span className="w-28 flex-shrink-0 font-medium text-espresso-dark">{spec.label}</span>
                  <span className="text-espresso-muted">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disabled Add to Cart */}
        <div className="space-y-2">
          <button
            disabled
            aria-disabled="true"
            className="w-full py-3 rounded-lg bg-cream-border text-espresso-muted text-sm font-semibold cursor-not-allowed select-none"
          >
            Add to Cart — Unavailable Online
          </button>
          <p className="text-xs text-center text-espresso-muted">
            La Marzocco machines must be purchased through an authorized dealer.{' '}
            <a
              href="https://www.kanencoffee.com/bookappointment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-cafe hover:underline font-medium"
            >
              Contact us
            </a>{' '}
            to discuss availability and lead times.
          </p>
        </div>
      </div>
    </div>
  );
}
