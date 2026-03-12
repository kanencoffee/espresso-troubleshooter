export default function Header() {
  return (
    <header className="bg-white border-b border-cream-border">
      <div className="max-w-5xl mx-auto px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">☕</span>
          <div>
            <h1 className="text-xl font-semibold text-espresso-dark leading-tight">
              Espresso Machine Troubleshooting
            </h1>
            <p className="text-sm text-espresso-muted mt-0.5">
              Diagnose and fix common commercial machine problems — from pump failures to PCB faults
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
