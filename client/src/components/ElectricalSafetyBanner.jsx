export default function ElectricalSafetyBanner() {
  return (
    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">⚡</span>
        <div>
          <h2 className="text-base font-bold text-red-800 mb-1">
            Electrical Safety Warning
          </h2>
          <p className="text-sm text-red-700 leading-relaxed mb-3">
            Commercial espresso machines operate at <strong>mains voltage (120–240V AC)</strong> and store electrical energy even when switched off. Incorrect repairs can cause electric shock, fire, or death.
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-none mb-3">
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span><strong>If you are not trained in electrical safety, do not open the machine.</strong> Call a qualified technician.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Always <strong>unplug the machine</strong> and wait at least 2 minutes before touching any internal components — capacitors remain charged after power is removed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Never bypass, remove, or tape over a <strong>fuse, RCD, or safety device</strong>. These exist to protect you.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>If you smell burning, see sparks, or feel a tingle when touching the machine — <strong>unplug it immediately</strong> and do not use it until it has been inspected.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Work with <strong>one hand behind your back</strong> when probing live circuits — this prevents current passing across your chest if you contact a live terminal.</span>
            </li>
          </ul>
          <p className="text-xs text-red-600 font-medium">
            The troubleshooting guides below are provided for reference and diagnostic understanding. All electrical repairs should be performed by a qualified service technician.
          </p>
        </div>
      </div>
    </div>
  );
}
