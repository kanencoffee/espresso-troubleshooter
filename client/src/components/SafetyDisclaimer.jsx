export default function SafetyDisclaimer() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 mb-6">
      {/* Hazard icons row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">⚠️</span>
        <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
          Your Safety Matters — Please Read Before Servicing
        </h2>
      </div>

      <p className="text-xs text-amber-800 leading-relaxed mb-4">
        We care about your well-being. Espresso machines involve real hazards — extreme heat,
        high-pressure steam, scalding water, mains electricity, and chemical cleaning agents.
        Please take a moment to review these precautions before working on your machine.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Heat & Pressure */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">🔥</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Heat &amp; Pressure</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Boilers reach 90–130 °C and brew circuits operate at 8–9 bar. Steam lines and
              group heads stay dangerously hot long after the machine is switched off.{' '}
              <strong>
                Always unplug your machine and wait at least one hour — or until all surfaces
                are cool to the touch, whichever is longer — before opening it up.
              </strong>{' '}
              Keep the machine unplugged the entire time you are working on it. Open steam wands
              or the hot water tap to fully depressurise before any internal work.
            </p>
          </div>
        </div>

        {/* Electrical */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">⚡</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Mains Electricity</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Machines run at 120–240 V AC and capacitors can hold a charge even after unplugging.{' '}
              <strong>
                Never work on any internal components while the machine is plugged in.
              </strong>{' '}
              If you are not trained in electrical safety, please do not open the machine —
              leave it to a qualified technician.
            </p>
          </div>
        </div>

        {/* Chemical Safety */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">🧪</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Chemical Safety</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Descalers, backflush detergents, and cleaning tablets each contain different
              active chemicals.{' '}
              <strong>Never mix cleaning products</strong> — combining them can produce toxic
              fumes or harmful reactions. Always follow the manufacturer's instructions, use
              one product at a time, and rinse thoroughly between steps.
            </p>
          </div>
        </div>

        {/* General Precaution */}
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0" aria-hidden="true">🛡️</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">Know Your Limits</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              There is no shame in calling a professional. If a repair feels beyond your comfort
              level, please reach out to us or another qualified service technician.{' '}
              <strong>Your safety is always more important than any repair.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Liability Disclaimer */}
      <div className="border-t border-amber-200 pt-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Disclaimer:</strong> The information on this site is provided for general
          reference and educational purposes only. Espresso machine repair carries inherent risks
          including, but not limited to, burns, scalding, electric shock, high-pressure injury,
          and exposure to hazardous chemicals.{' '}
          <strong>
            Kanen Coffee, LLC and the contributors to this guide cannot accept responsibility
            or liability for any injury, damage, loss, or other consequence
          </strong>{' '}
          arising from the use or application of the information provided here. By using this
          guide, you acknowledge these risks and agree to proceed at your own discretion.
          Always consult a qualified service technician for repairs beyond your skill level.
        </p>
      </div>
    </div>
  );
}
