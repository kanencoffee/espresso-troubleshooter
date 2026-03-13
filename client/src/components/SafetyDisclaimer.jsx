export default function SafetyDisclaimer() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 mb-6">
      {/* Hazard icons row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">⚠️</span>
        <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
          Safety Notice — Read Before Servicing
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {/* Heat */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">🔥</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Extreme Heat</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Boilers operate at 90–130 °C. Steam lines and group heads retain heat long after the
              machine is switched off. <strong>Always allow at least 30 minutes to cool</strong> before
              opening the machine.
            </p>
          </div>
        </div>

        {/* Pressure */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">💨</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">High Pressure</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Steam boilers operate at 1.0–1.5 bar; brew circuits at 8–9 bar. <strong>Never
              disassemble pressurised components.</strong> Open steam wands or use the hot water tap
              to fully depressurise before any internal work.
            </p>
          </div>
        </div>

        {/* Electrical */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">⚡</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Mains Electricity</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Machines run at 120–240 V AC. Capacitors stay charged after unplugging.{' '}
              <strong>Unplug and wait 2 minutes</strong> before touching internal components.
              If you are not trained in electrical safety, do not open the machine.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-amber-200 pt-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Disclaimer:</strong> The information on this site is provided for general
          reference and educational purposes only. Espresso machine servicing involves genuine risks
          of electric shock, scalding, and high-pressure injury.{' '}
          <strong>
            Kanen Coffee and the contributors to this guide accept no responsibility or liability
            for any damage, injury, loss, or other consequence
          </strong>{' '}
          arising from the use of this information. Always consult a qualified service technician
          for repairs beyond your skill level. When in doubt — call a professional.
        </p>
      </div>
    </div>
  );
}
