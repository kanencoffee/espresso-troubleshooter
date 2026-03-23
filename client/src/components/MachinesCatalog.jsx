import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

export default function MachinesCatalog() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Section intro */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-espresso-dark">La Marzocco Machines</h2>
        <p className="text-sm text-espresso-muted mt-1 max-w-2xl">
          We sell and service La Marzocco equipment. Browse configurations and colors below —
          all machines require purchase through an authorized dealer. Reach out and we'll walk you
          through the options.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-light border border-amber-cafe/30 rounded-md text-xs text-amber-cafe font-medium">
          <span>⚠</span>
          Online ordering unavailable — contact us for pricing &amp; lead times
        </div>
      </div>

      {/* Product grid — stacked on mobile, side-by-side on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 p-6 bg-white border border-cream-border rounded-xl text-center">
        <p className="text-sm font-semibold text-espresso-dark mb-1">
          Not sure which model is right for you?
        </p>
        <p className="text-xs text-espresso-muted mb-4">
          We've been repairing and selling La Marzocco machines since 2011. Come in for a
          demo or give us a call — we'll help you pick the right machine for your workflow and budget.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.kanencoffee.com/bookappointment"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-md bg-amber-cafe text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            Book a Consultation
          </a>
          <a
            href="tel:+15108594425"
            className="px-5 py-2 rounded-md border border-cream-border text-espresso-dark text-sm font-semibold hover:bg-cream transition-colors"
          >
            Call (510) 859-4425
          </a>
        </div>
      </div>
    </main>
  );
}
