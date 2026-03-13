export default function ElectricalSafetyBanner() {
  return (
    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">⚡</span>
        <div>
          <h2 className="text-base font-bold text-red-800 mb-1">
            Electrical Work — Additional Warnings
          </h2>
          <p className="text-sm text-red-700 leading-relaxed mb-3">
            Electronics repairs involve <strong>live mains voltage (120–240 V AC)</strong> and
            components that stay energised even after unplugging. These issues are for reference and
            diagnosis — physical repairs should be performed by a qualified technician.
          </p>
          <ul className="text-sm text-red-700 space-y-1.5 list-none mb-3">
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>
                <strong>Never bypass, remove, or tape over a fuse, RCD, or GFCI.</strong> These
                devices protect you from shock and fire.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>
                If you smell burning, see sparks, or feel a tingle when touching the machine —
                <strong> unplug it immediately</strong> and do not use it again until inspected.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>
                When probing live circuits, keep{' '}
                <strong>one hand behind your back</strong> — this prevents current crossing your
                chest if you contact a live terminal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>
                <strong>Capacitors store dangerous charge</strong> and must be safely discharged
                before handling, even when the machine has been unplugged.
              </span>
            </li>
          </ul>
          <p className="text-xs text-red-600 font-medium">
            If you are not confident working safely with mains electricity — stop and call a
            qualified service technician. No espresso shot is worth a serious injury.
          </p>
        </div>
      </div>
    </div>
  );
}
