// tiers: 'prosumer' | 'mid' | 'highend' | 'superauto' | 'all'
// category: 'pump' | 'boiler' | 'group' | 'steam' | 'grinder' | 'valves' | 'electronics' | 'water' | 'seals' | 'profiling'
// difficulty: 'beginner' | 'intermediate' | 'advanced'

export const CATEGORIES = [
  { id: 'pump', label: 'Pump', icon: '⚙️' },
  { id: 'boiler', label: 'Boiler', icon: '🔥' },
  { id: 'group', label: 'Group Head', icon: '☕' },
  { id: 'steam', label: 'Steam & Milk', icon: '💨' },
  { id: 'grinder', label: 'Grinder', icon: '🌀' },
  { id: 'valves', label: 'Valves & Solenoids', icon: '🔧' },
  { id: 'electronics', label: 'Electronics & PCB', icon: '🔌' },
  { id: 'water', label: 'Water System', icon: '💧' },
  { id: 'seals', label: 'Seals & Gaskets', icon: '🔩' },
  { id: 'profiling', label: 'Profiling & Flow', icon: '📈' },
];

export const ISSUES = [
  // ─────────── PUMP ───────────
  {
    id: 'pump-low-pressure',
    title: 'Pump failing to build pressure',
    category: 'pump',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Espresso extracts too quickly and runs thin',
      'Pressure gauge reads low (below 7 bar) during extraction',
      'Shot takes far longer than 25–30 seconds',
    ],
    summary: 'The pump is not delivering enough water pressure to extract espresso correctly, resulting in sour or weak shots.',
    cause: 'Vibration pumps typically last 3–5 years. Scale buildup can restrict the pump inlet. An air lock in the water line prevents the pump from priming. Worn pump diaphragm or impeller reduces output.',
    solution: `1. Prime the pump: open the steam wand valve for 10–15 seconds to purge trapped air.\n2. Descale the machine — scale inside the pump inlet is a very common culprit.\n3. Check the inlet filter screen and clean if clogged.\n4. Test pump pressure with a gauge at the group head. Under 8 bar at full flow = pump is failing.\n5. Replace the pump if output remains consistently low after the above steps.`,
    technicalDetail: `Vibration (ULKA) pumps: replace with like-for-like or upgrade to a Fluid-o-Tech or Isomac rotary pump for quieter, more consistent flow. Rotary pump machines: inspect the pump's inlet filter screen — often overlooked. On commercial plumbed-in machines, verify incoming water pressure is at least 2 bar. If the pump runs but the OPV (over-pressure valve) is stuck open, all pressure will bypass directly to the drip tray — diagnose OPV separately.`,
    diy: 'intermediate',
  },
  {
    id: 'pump-noise',
    title: 'Loud pump noise or rattling during extraction',
    category: 'pump',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Pump is noticeably louder than it used to be',
      'Rattling, buzzing, or vibrating during shots',
      'Machine shakes on the counter',
    ],
    summary: 'Increased pump noise usually means the rubber vibration dampeners are worn out, or the pump is starting to fail.',
    cause: 'Rubber mounting feet or pump dampeners dry out and crack over time. Pump internals wear and create more mechanical noise. Air in the water line causes cavitation. Loose mounting hardware amplifies vibration.',
    solution: `1. Check and replace rubber mounting dampeners/feet under the pump — these are cheap and easy to replace.\n2. Tighten any loose pump mounting hardware.\n3. Purge air from the system by opening the steam wand briefly.\n4. If noise persists after dampener replacement, the pump itself is likely worn and should be replaced.`,
    technicalDetail: `Vibration pumps inherently get louder as internal components wear. A pump that runs noticeably louder than new — even after dampener replacement — is approaching end of life. On under-counter (Modbar/Mavam) installations, verify the pump is properly isolated from the cabinetry to prevent resonance amplification.`,
    diy: 'diy',
  },
  {
    id: 'pump-no-water',
    title: 'Pump runs but no water reaches the group head',
    category: 'pump',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'You can hear the pump activate but no water comes from the group',
      'Pressure gauge stays near zero despite pump running',
      'Machine makes a straining sound but produces no extraction',
    ],
    summary: 'The pump is running but something downstream is blocking or diverting the water before it reaches the group head.',
    cause: 'The most common culprit is a stuck or failed 3-way solenoid valve. A clogged flow meter impeller, blocked intake filter, air lock, or kinked internal hose can also cause this.',
    solution: `1. Check the intake filter screen at the bottom of the water tank — clean if clogged.\n2. Listen for a click when you start a shot: if the solenoid coil is working, you'll hear it actuate. No click = potential coil failure.\n3. Hold a screwdriver near the solenoid valve while activating — a working coil will attract the screwdriver (it becomes magnetic).\n4. Inspect internal hoses for kinks or disconnection.\n5. If the flow meter is the issue, disconnect it and run water through by hand to check for a stuck impeller.`,
    technicalDetail: `Flow sensor types used in commercial machines vary significantly in reliability and repairability:\n- **Gicar paddle-wheel**: standard on many La Marzocco machines; impeller can clog with mineral deposits\n- **Digmesa Nano**: used in Gaggiuino profiling mods; small and accurate\n- **Sensirion thermal mass**: no moving parts, more reliable but expensive; used in some high-end specialty machines\n- **Keyence ultrasonic**: highest accuracy, zero contact with water, no clog risk; found in top-tier commercial systems\n\nOn volumetric/super-automatic machines, a blocked flow meter is a frequent service call. The impeller can be freed by disconnecting the meter, flushing it backward with clean water, and measuring the pulse output with a multimeter to confirm it's spinning freely.`,
    diy: 'tech',
  },

  // ─────────── BOILER ───────────
  {
    id: 'boiler-temp',
    title: 'Machine not reaching or holding brew temperature',
    category: 'boiler',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Espresso tastes sour, thin, or under-extracted despite correct grind settings',
      'Temperature readout or PID shows fluctuating or low values',
      'Machine takes unusually long to heat up',
    ],
    summary: 'The boiler is failing to reach or maintain the target temperature, leading to under-extracted, sour espresso.',
    cause: 'Heavy limescale insulates the heating element, reducing efficiency. A faulty thermostat, pressurestat, blown thermal fuse, or PID sensor failure can all cause temperature problems.',
    solution: `1. Descale thoroughly first — this resolves the problem in the majority of cases.\n2. If descaling doesn't fix it, test the thermal fuse with a multimeter (open = blown, replace).\n3. Measure heating element resistance — a failed element reads open circuit.\n4. If using a PID, verify the temperature probe (thermocouple or PT100) is reading accurately with an independent thermometer.\n5. Replace the pressurestat or thermostat if all else checks out.`,
    technicalDetail: `On dual-boiler machines (La Marzocco GS3, Synesso, Slayer), brew and steam boilers are independent — verify which boiler is underperforming. PID sensor drift: PT100 probes can drift by several degrees over years of use; replace if readings are inconsistent against a calibrated reference. On machines like the La Marzocco Linea Mini (single boiler), thermal stability is inherently limited by design — a gear pump profiling mod or PID upgrade adds meaningful temperature control. The FDC1004 capacitive temperature sensor is used in some advanced community mods for more accurate thermal profiling.`,
    diy: 'tech',
  },
  {
    id: 'boiler-safety-valve',
    title: 'Safety or pressure relief valve dripping or venting',
    category: 'boiler',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Water or steam drips from a small tube at the back or bottom of the machine',
      'Safety valve continuously releases steam when machine is at temperature',
      'Machine is losing water without explanation',
    ],
    summary: 'The safety/relief valve is activating continuously, which means either the boiler is overheating, the autofill solenoid is stuck open, or the valve itself has worn seals.',
    cause: "Three root causes: (1) failed pressurestat allowing boiler to overpressurize, (2) stuck-open autofill solenoid causing continuous overfill, or (3) the valve's internal Teflon diaphragm is worn and the valve itself is leaking.",
    solution: `1. Identify which scenario applies before replacing anything.\n2. Check boiler pressure gauge at operating temperature — if it's running above the relief valve threshold, the pressurestat is failing.\n3. If the machine overfills (water spilling from the overflow), the autofill solenoid is stuck open — clean or replace it.\n4. If pressure is normal and the valve still drips, the valve diaphragm is worn — replace the full valve assembly.\n⚠️ Do not attempt to adjust, cap, or bypass a safety valve. This is a pressurized system.`,
    technicalDetail: `On La Marzocco Strada MP machines, the MP (mechanical paddle) valve design is known for being engineered complexity — LM techs describe the original MP valve design as a "headache to service" despite being impressive engineering. The later conical valve design simplified servicing significantly. Pressurestat adjustment: if the boiler is running above spec, the pressurestat spring may have fatigued — adjust the calibration screw at operating temperature while monitoring the gauge, or replace the pressurestat entirely.`,
    diy: 'tech',
  },
  {
    id: 'boiler-opv',
    title: 'OPV misadjusted — pressure too high or too low',
    category: 'boiler',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Pressure gauge consistently shows above 11 bar or below 7 bar during extraction',
      'Water continuously drains to the drip tray even without brewing',
      'Inconsistent shot pressure; some shots under-extract while others over-extract',
    ],
    summary: 'The over-pressure valve (OPV) controls how much pressure reaches the group head. If it drifts out of calibration, shot quality suffers significantly.',
    cause: 'OPV spring fatigue, scale deposits in the valve seat, a worn O-ring inside the valve body, or the factory setting was never calibrated for your workflow (many machines ship at 9 bar; specialty coffee often targets 7–8 bar).',
    solution: `1. Locate the OPV — typically a brass spring-loaded valve inline from the pump, often accessible from the machine's underside or side panel.\n2. Soak in descaler solution if scale is suspected.\n3. To adjust: insert a flathead screwdriver into the adjustment slot. Clockwise = higher pressure, counterclockwise = lower pressure.\n4. Attach a pressure gauge at the group head portafilter to verify — adjust in small increments and re-test.\n5. Target: 7–8 bar at the group for specialty espresso; 9 bar for traditional espresso.\n6. If the valve leaks regardless of adjustment, replace the O-ring or full valve.`,
    technicalDetail: `On La Marzocco machines with gear pump profiling mods, the OPV becomes less relevant since the gear pump itself controls flow rate and pressure directly. The OPV is retained as a safety backstop but the profiling curve is managed electronically. On the Strada MP/EP, pressure profiling is built into the machine and the OPV calibration is managed within the machine's control system.`,
    diy: 'intermediate',
  },
  {
    id: 'boiler-scale',
    title: 'Limescale buildup causing heat and flow problems',
    category: 'boiler',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Longer heat-up times than normal',
      'Reduced steam output or power',
      'Unexplained pressure fluctuations',
      'White/gray deposits visible inside the boiler or on heating elements',
    ],
    summary: 'Mineral deposits from hard water accumulate on heating elements and inside the boiler, reducing efficiency and eventually causing component failure.',
    cause: 'Hard water contains calcium and magnesium that precipitate and bond to hot surfaces. Without regular descaling or water treatment, scale insulates the heating element and restricts water flow.',
    solution: `1. Run a full descaling cycle using citric acid (1 tbsp per liter) or a commercial descaler like Urnex Dezcal.\n2. Follow the manufacturer's descaling procedure exactly — many machines require multiple rinse cycles after descaling.\n3. Install an inline water softener or filter on the water line to prevent future buildup.\n4. In high-hardness water areas, descale every 4–6 weeks. In soft water areas, every 3–4 months.\n5. Severe scale may require professional boiler cleaning or heating element replacement (can cost $500–$2,000+).`,
    technicalDetail: `Never use distilled or RO water without a small addition of minerals — pure water is corrosive to boiler internals and also prevents the water level probe from sensing correctly (the probe requires mineral conductivity). A TDS of 75–150 ppm is the sweet spot for espresso: low enough to prevent heavy scale, high enough for machine safety and flavor. La Marzocco recommends inline Everpure or BWT filters on all commercial installations.`,
    diy: 'diy',
  },
  {
    id: 'boiler-replacement',
    title: 'Boiler replacement — new boiler installation',
    category: 'boiler',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Boiler visibly corroded or pitted on exterior',
      'Boiler leaking from the body itself (not from fittings or connections)',
      'Heating element seat damaged — element won\'t seal properly',
      'Repeated leaks after re-gasketing indicate boiler surface is too degraded to seal',
    ],
    summary: 'The boiler has deteriorated beyond repair — corrosion, pitting, or structural damage means the boiler body itself must be replaced rather than just its fittings or gaskets.',
    cause: 'Long-term corrosion from hard water, aggressive descaling acids used too frequently or at too high a concentration, electrolytic corrosion from dissimilar metals in the plumbing, or physical damage from a drop or impact. Brass boilers are more corrosion-resistant than aluminum but both eventually degrade without proper water treatment.',
    solution: `1. Assess the boiler condition: remove the boiler housing and inspect for pitting, green/white corrosion deposits, cracks, or weeping from the boiler walls (not just fittings).\n2. Determine repair vs. replace: if corrosion is limited to the element seat area, re-tapping the threads may save the boiler. If pitting is widespread or the boiler wall is thinned, replacement is the only option.\n3. Source the correct replacement boiler: match the boiler type (copper, brass, stainless, aluminum), dimensions, port layout, and heating element thread size exactly. OEM parts are preferred.\n4. Remove the old boiler: drain completely, disconnect all fittings (element, probe, safety valve, inlet/outlet), and remove mounting hardware.\n5. Install the new boiler with fresh gaskets on every connection point. Use Teflon tape or thread sealant rated for steam temperatures on all threaded connections.\n6. Pressure test before powering on: fill the boiler, pressurize to 1.5x operating pressure with water only, and inspect every fitting for leaks.\n7. Power on and verify temperature reaches and holds at the target setting.`,
    technicalDetail: `Boiler materials by manufacturer: La Marzocco uses stainless steel boilers on most commercial models. Rancilio Silvia uses brass. Many DeLonghi and Gaggia home machines use aluminum thermoblocks or boilers. Copper boilers are found in some E61 machines and vintage Italian machines. When replacing, never mix metals at connection points without proper dielectric unions — copper-to-stainless connections without isolation cause galvanic corrosion. Heating element thread standards: most Italian machines use a standard M12x1 or 1-1/4" BSP thread. Verify the wattage rating matches the original — an undersized element won't reach temperature; an oversized element can overshoot and trip the safety thermostat.`,
    diy: 'tech',
  },
  {
    id: 'overheating',
    title: 'Machine overheating — temperature too high or thermal cutoff tripping',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Coffee tastes burnt or ashy despite correct grind and dose',
      'Steam venting from the group head during idle',
      'Thermal cutoff or safety fuse tripping — machine shuts off unexpectedly',
      'Machine cycles off from overheating and won\'t restart until cooled',
    ],
    summary: 'The machine is running hotter than its design temperature, causing burnt-tasting coffee, safety shutdowns, or steam where there shouldn\'t be any. This is usually an electronics control issue, not a boiler defect.',
    cause: 'A stuck-on SSR (solid state relay) is the most common cause — when an SSR fails, it fails in the "on" position, delivering continuous power to the heating element with no temperature regulation. A failed pressurestat or thermostat that doesn\'t open at the set temperature has the same effect. A drifted PID sensor can also cause the controller to overshoot.',
    solution: `1. Check the pressurestat or thermostat setting: verify it hasn\'t been accidentally adjusted. On machines with an adjustable pressurestat, compare the gauge reading at cutoff against the spec.\n2. Test the SSR: with the machine at temperature and the heating element supposed to be off, measure voltage across the SSR output terminals. If voltage is present when the controller is calling for no heat, the SSR has failed closed — replace it immediately.\n3. Check the thermal fuse or cutoff: if it has tripped, it indicates the boiler exceeded a safe threshold. Test with a multimeter — an open circuit means the fuse is blown and must be replaced (never bypass it).\n4. Verify actual temperature with an independent thermometer or thermocouple at the group head. Compare against the PID or pressurestat reading.\n5. Replace the faulty component: SSR, pressurestat, thermostat, or PID probe depending on which is causing the overshoot.`,
    technicalDetail: `SSR failure mode: solid state relays use a triac or SCR internally. When the semiconductor junction breaks down, it typically fails short-circuit (conducting), which means the heating element receives continuous power. This is the single most dangerous common failure in espresso machines — it can cause boiler pressure to exceed the safety valve threshold if the pressurestat also fails to open. Always test SSRs periodically on PID-controlled machines. On machines with mechanical pressurestats (Sirai, Mater, XP110A), the contact points can weld together under repeated arcing, creating the same stuck-on failure. The thermal cutoff (TCO) is a non-resettable fuse rated to a specific temperature (typically 165-190C) — once tripped, it must be replaced with the exact same rating. Never substitute a higher-rated TCO.`,
    diy: 'tech',
  },

  // ─────────── GROUP HEAD ───────────
  {
    id: 'group-portafilter-leak',
    title: 'Portafilter leaking around the group head',
    category: 'group',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Water or coffee leaks around the outside of the portafilter during extraction',
      'Coffee runs down the outside of the portafilter handle',
      'Portafilter requires much more force than usual to lock in',
    ],
    summary: 'The group head gasket is worn out and no longer creates a watertight seal with the portafilter. This is one of the most common maintenance tasks on any espresso machine.',
    cause: 'The group head gasket hardens, compresses, and degrades over time from repeated heat cycling. Dried grounds in the group collar can also prevent a proper seal. Damaged portafilter ears are a less common cause.',
    solution: `1. Remove the shower screen and retaining screw from the group head.\n2. Use a flathead screwdriver or group head gasket tool to pry out the old gasket.\n3. Clean the gasket groove thoroughly — remove any dried coffee deposits.\n4. Press in the new gasket (correct size is critical — measure the old one or consult your machine's spec).\n5. Reinstall the shower screen and test.\n\nIn commercial settings, replace group head gaskets every 3 months or when the portafilter requires noticeably more force to lock.`,
    technicalDetail: `Standard E61 group head gaskets are 73×57×8.5mm. La Marzocco uses a different spec — typically 72×57×8mm. Always confirm part number for your machine. Aftermarket silicone gaskets tend to last longer than standard rubber. On the La Marzocco KB90 with its top-loading portafilter, the gasket design is different and replacement is less frequent.`,
    diy: 'diy',
  },
  {
    id: 'group-channeling',
    title: 'Channeling or uneven extraction from the group',
    category: 'group',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Espresso runs unevenly — faster from one spout than the other',
      'Pale, streaky, or blonde extraction visible in a naked portafilter',
      'Shot quality is inconsistent despite identical grind and dose',
    ],
    summary: 'Water is finding the path of least resistance through the coffee puck rather than distributing evenly, resulting in some grounds being over-extracted and others under-extracted.',
    cause: 'Dirty or clogged shower screen (most common); worn shower screen with enlarged or uneven holes; uneven puck distribution or tamping; group head not backflushed regularly.',
    solution: `1. Remove the shower screen and soak in hot water with Cafiza/Puly Caff for 20 minutes. Scrub with a brush.\n2. Backflush the group head daily using group head cleaner and a blind basket.\n3. Inspect the shower screen — if the holes are worn, uneven, or clogged beyond cleaning, replace it.\n4. Review puck prep: distribute evenly before tamping (a WDT tool helps significantly).\n5. Ensure your tamp is level and at consistent pressure.`,
    technicalDetail: `Commercial shower screens should be replaced every 6–12 months depending on volume — the holes enlarge with use, causing uneven water distribution. This is frequently overlooked. On La Marzocco machines, the saturation group design pre-soaks the puck before full pressure — this can mask poor puck prep but won't compensate for a heavily worn shower screen. On the Victoria Arduino Black Eagle Gravimetric, the built-in scale detects flow rate; channeling will show up as an anomalous flow curve even when the shot looks acceptable visually.`,
    diy: 'diy',
  },
  {
    id: 'group-no-flow',
    title: 'Group head dispensing no water or very low flow',
    category: 'group',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'One group produces little or no water while others work normally',
      'Machine activates but that group never starts flowing',
      'Significant flow imbalance between groups on a multi-group machine',
    ],
    summary: 'A specific group head is blocked or its solenoid valve is failing, preventing water flow even while the pump and other groups function normally.',
    cause: 'Blocked group solenoid valve (most common); clogged group inlet screen or dispersion plate; failed flow restrictor; heavy scale inside the group head passages.',
    solution: `1. Backflush the affected group aggressively with group head cleaner.\n2. Listen for the solenoid click when activating that group — no click suggests coil failure.\n3. Remove and inspect the group inlet screen for scale obstruction.\n4. Soak group head components in a descaling solution for 30 minutes.\n5. Test the solenoid coil with a multimeter — measure resistance (should match spec; open circuit = failed coil).`,
    technicalDetail: `On the E61 group head, the cam-operated valve can stick if not lubricated periodically with food-grade silicone grease. The cam follower and lever assembly should be inspected annually. On La Marzocco commercial machines (Linea PB, GB5), the group solenoid is field-replaceable and individual coils are available as spare parts. Nuova Simonelli Aurelia Wave and similar "Gravimetric" models have additional flow sensor hardware in the group — these can clog independently of the solenoid.`,
    diy: 'tech',
  },
  {
    id: 'clog-blockage',
    title: 'Blocked group head, steam tip, or brew circuit',
    category: 'group',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Low flow or no water from the group head',
      'Steam tip producing weak or uneven steam',
      'Brewing is unusually slow despite a coarser grind',
      'Water drips instead of flowing during a flush',
    ],
    summary: 'A blockage somewhere in the brew or steam circuit is restricting water flow. The most common locations are the group head shower screen, the steam tip holes, and the brew path tubing.',
    cause: 'Coffee oils and fine grounds clog the shower screen and dispersion plate over time. Steam tip holes block with dried milk protein if not purged after every use. Scale deposits can narrow or fully block internal tubing in the brew circuit. Backflush detergent residue can also harden inside passages if not rinsed thoroughly.',
    solution: `1. Identify the blockage location: group head (slow or no brew flow), steam tip (weak or absent steam), or brew path (slow flow from all groups).\n2. Group head blockage: remove the shower screen and soak in Cafiza or Puly Caff for 20 minutes. Use a stiff nylon brush to clean the dispersion plate and group cavity. Backflush with detergent using a blind basket.\n3. Steam tip blockage: remove the steam tip and clear each hole with the cleaning pin that came with your machine (or a thin sewing needle). Soak in hot water with milk cleaner for 15 minutes.\n4. Brew circuit blockage: run a full descaling cycle to dissolve scale in internal tubing. For severe blockages, disconnect tubing and flush with descaler solution using a syringe.\n5. After clearing, verify flow is restored by running water through the affected circuit and comparing to the expected output.`,
    technicalDetail: `On E61 group heads, the dispersion plate (also called the "mushroom" or "diffuser") sits above the shower screen and has a narrow central bore. This bore is the most common single point of blockage — a pin or thin wire can clear it without removing the dispersion plate. On La Marzocco saturated group heads, the group screen is retained by a single central screw — overtightening this screw can deform the screen and restrict flow even when clean. On commercial machines pulling 100+ shots per day, daily backflushing is mandatory. Weekly deep-cleaning with the screens removed is recommended. For steam tips, 4-hole tips clog faster than 1-hole tips because each hole is smaller; many baristas keep a spare steam tip on hand.`,
    diy: 'diy',
  },

  // ─────────── STEAM ───────────
  {
    id: 'steam-none',
    title: 'No steam or very weak steam output',
    category: 'steam',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Steam wand produces a trickle or nothing at all',
      'Frothing milk takes far longer than usual',
      'Steam output is inconsistent — strong then weak',
    ],
    summary: 'The steam wand is clogged or the steam boiler is not reaching operating pressure, resulting in insufficient steam for milk texturing.',
    cause: 'Clogged steam tip from dried milk (most common and easiest fix); failed pressurestat preventing boiler from reaching steam pressure; tripped or failed heating element; faulty steam solenoid; low boiler water level.',
    solution: `1. Remove the steam tip and soak in milk line cleaner (Rinza or similar) for 15 minutes. Clear each hole with a thin pin.\n2. Check boiler pressure gauge — steam boiler should be at 1.0–1.2 bar.\n3. Check the water level in the steam boiler (if visible via site glass).\n4. If pressure is low, verify the pressurestat is operating correctly.\n5. Test the heating element with a multimeter for continuity.`,
    technicalDetail: `On heat exchanger (HX) machines, the steam and brew paths share a single boiler — a pressure problem affects both. On dual-boiler machines, steam boiler issues are isolated and won't affect brew temperature. Pressurestat range: typical steam boiler operates at 1.0–1.5 bar. If the pressurestat is calibrated too low, steam output will be weak even with a fully functional machine. Adjust by turning the calibration screw at operating pressure while monitoring the gauge.`,
    diy: 'intermediate',
  },
  {
    id: 'steam-drip',
    title: 'Steam wand dripping when valve is closed',
    category: 'steam',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Steam wand drips or releases steam when you think it\'s off',
      'Steam escapes around the wand body or from the base',
      'Milk burns or foams inside the jug when wand is supposedly off',
    ],
    summary: 'The steam valve is not sealing completely — worn O-rings or a damaged valve seat are allowing steam to pass through.',
    cause: 'Worn or hardened O-rings on the steam valve stem; damaged valve ball or seat; milk deposits hardened inside the valve forcing it slightly open.',
    solution: `1. Purge the wand thoroughly — sometimes a milk clog is holding the valve partially open.\n2. Inspect and replace the O-rings on the steam valve stem — this is typically a simple, low-cost fix.\n3. If O-ring replacement doesn't resolve it, the valve seat may be damaged and require full valve replacement.\n4. Clean milk deposits from the valve interior using milk line cleaner.`,
    technicalDetail: `Steam valve O-rings should be replaced preventatively every 12–18 months on high-use commercial machines, before they fail completely. Use food-grade PTFE or silicone O-rings — standard rubber degrades quickly at steam temperatures. On Rancilio and La Cimbali machines, the steam valve assembly is field-replaceable as a unit.`,
    diy: 'intermediate',
  },

  // ─────────── GRINDER ───────────
  {
    id: 'grinder-inconsistent',
    title: 'Inconsistent grind size or varying shot times',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Shot times vary significantly (by 5+ seconds) between identical doses',
      'Espresso tastes noticeably different shot to shot',
      'Grind feels coarser or finer than your dial setting without changing it',
    ],
    summary: 'The grinder is producing inconsistent particle sizes, which means the espresso puck brews differently from one shot to the next even with the same technique.',
    cause: 'Worn or chipped burrs (most common in high-volume settings after 500+ kg throughput); burr misalignment; coffee oil and fines buildup in the burr chamber; foreign objects (pebbles, metal fragments) that have damaged burr edges.',
    solution: `1. Remove and inspect both burrs for wear, chipping, or uneven edges.\n2. Clean the burr chamber thoroughly — old coffee oils and fines coat the burrs and affect particle distribution.\n3. Run a rice or Grindz tablet cleaning cycle through the grinder.\n4. Re-align burrs if your model supports adjustment (use a feeler gauge or alignment tool).\n5. Replace burrs according to the manufacturer's volume schedule — typically every 500–1,000 kg for commercial flat burrs, 200–300 kg for conical burrs.`,
    technicalDetail: `Bimodal vs. unimodal grind distribution: most commercial flat burr grinders produce bimodal distributions (two particle size peaks — fine and coarse). As burrs wear, the bimodality increases — more fines and more coarse particles simultaneously. The Mythos One and EK43 are known for producing more uniform unimodal distributions. On commercial grinders with multiple dosing outlets (e.g., Mahlkönig E65S GBW), check that all outlets are drawing equally from the same grind chamber.`,
    diy: 'intermediate',
  },
  {
    id: 'grinder-static',
    title: 'Static and clumping in the doser or portafilter',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Ground coffee sticks to the doser chute and portafilter walls',
      'Grounds form clumps that are difficult to distribute evenly',
      'Frequent mess and waste around the grinder',
    ],
    summary: 'Triboelectric static causes coffee grounds to cling to plastic and metal surfaces, creating clumps that lead to uneven puck distribution and channeling.',
    cause: 'Friction between grounds and grinder surfaces generates static electricity. Worse in low-humidity environments, with certain coffee types, and as burrs wear. Coffee oil and fine particle buildup exacerbates the problem.',
    solution: `1. Use the Ross Droplet Technique (RDT): add one small drop of water to the bean dose just before grinding. This grounds the static almost entirely.\n2. Keep the grinder clean — old oils and fines increase static.\n3. Use a WDT (Weiss Distribution Technique) tool after grinding to break up clumps before tamping.\n4. In very low humidity environments, a small humidifier near the grinder helps.\n5. Anti-static dosing cups or funnel attachments can also help.`,
    technicalDetail: `Some grinder models are particularly prone to static due to the chute geometry (notably the Mahlkönig EK43 in high-throughput commercial settings). The Mythos One and newer Nuova Simonelli grinders with sealed grinding chambers are designed to minimize static. Static is most severe with light-roasted, low-oil beans. RDT is effective because water is a conductor that dissipates the static charge instantly.`,
    diy: 'diy',
  },
  {
    id: 'grinder-motor',
    title: 'Grinder motor stalling or not running',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Grinder stops mid-grind or won\'t start',
      'Motor hums but burrs don\'t spin',
      'Grinder trips the circuit breaker',
    ],
    summary: 'The grinder motor or its starting capacitor has failed, or the grinder is mechanically jammed.',
    cause: 'Overfed hopper causing a burr jam; foreign object caught in the burr chamber; motor thermal overload protection triggered by continuous use without cooling; failed start capacitor (very common); motor winding failure.',
    solution: `1. Unplug the grinder immediately.\n2. Carefully remove beans from the hopper and clear any jam in the burr chamber (use the cleaning brush — never fingers in a powered grinder).\n3. Allow 15–20 minutes for thermal overload to reset.\n4. Test the start capacitor — these fail far more often than the motor itself and are cheap to replace.\n5. If the capacitor is good but the motor still won't run, test motor windings with a multimeter. Motor replacement is a tech job.`,
    technicalDetail: `Capacitor failure is the single most common grinder motor fault. The start capacitor is typically a small cylindrical component wired in series with the motor. Test by discharging and measuring capacitance with a capacitor tester — a reading significantly below the rated value (or open circuit) indicates failure. Replace with an identical spec capacitor. Caution: capacitors store charge and must be safely discharged before handling, even when the machine is unplugged.`,
    diy: 'tech',
  },

  // ─────────── VALVES ───────────
  {
    id: 'solenoid-failure',
    title: '3-way solenoid valve failure',
    category: 'valves',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Puck remains pressurized and wet after the shot ends — portafilter sprays when opened',
      'Soggy puck when portafilter is removed after extraction',
      'Machine aborts mid-shot or fails to start a brew cycle',
    ],
    summary: 'The 3-way solenoid valve releases pressure from the group head after a shot. When it fails, the puck stays wet and pressurized, or the shot never starts properly.',
    cause: 'Solenoid coil failure (burned out or corroded); plunger/nucleus stuck from scale or debris deposits; worn O-rings on the valve body; continuous cycling fatigue on the coil.',
    solution: `1. Test coil magnetism: hold a screwdriver next to the solenoid body and activate the machine. A working coil will attract the screwdriver strongly.\n2. Measure coil resistance with a multimeter (open circuit = replace coil).\n3. If coil is good: remove the nucleus/plunger from the valve body and clean thoroughly in descaler — scale is frequently the only problem.\n4. Replace O-rings on the valve body.\n5. If the valve body itself is corroded or the seat is damaged: replace the full valve assembly.`,
    technicalDetail: `On La Marzocco commercial machines (Linea PB, GB5 S), the 3-way solenoid coil is field-replaceable as a plug-in component — you don't need to drain the boiler or re-plumb. Coil resistance spec varies by manufacturer (typically 12–24Ω at room temperature). The nucleus is a small stainless or brass plunger inside the valve body. After cleaning, verify it moves freely by blowing through the valve ports. On Rancilio and Nuova Simonelli machines, the solenoid valve assembly is typically replaced as a complete unit rather than serviced at the nucleus level.`,
    diy: 'intermediate',
  },
  {
    id: 'valve-stuck',
    title: 'Stuck or seized valve — steam, 3-way, or ceramic',
    category: 'valves',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Valve handle won\'t turn or requires extreme force',
      'Steam valve seized in closed or open position',
      '3-way valve not opening or closing properly',
      'Ceramic valve stuck — no flow change when adjusted',
    ],
    summary: 'A valve has seized from scale buildup, corrosion, or lack of lubrication, preventing normal control of steam, brew water, or pressure release.',
    cause: 'Scale deposits bind the valve stem to the body over time. Corrosion on brass valve threads causes seizing. Ceramic valve discs can lock together from mineral crystallization between the surfaces. Infrequent use accelerates seizing — machines that sit idle for months are especially prone.',
    solution: `1. Identify the valve type: steam valve (rotary knob on the front panel), 3-way solenoid (electrically operated, covered in the solenoid-failure card), or ceramic disc valve (found in some commercial group heads and water inlet valves).\n2. For a stuck steam valve: apply a small amount of food-safe penetrating oil (not WD-40) to the valve stem where it enters the body. Let it soak for 10–15 minutes.\n3. Use proper technique: grip the valve body with one wrench and the handle/stem with another. Apply slow, steady force — never use pliers directly on the valve body or you\'ll crush it.\n4. If the valve frees up: disassemble, clean all scale from threads and sealing surfaces, replace any damaged O-rings or Teflon packing, apply food-safe silicone grease, and reassemble.\n5. If the valve won\'t free or the stem is visibly corroded/stripped: replace the full valve assembly. Match the thread size and connection type exactly.`,
    technicalDetail: `On E61 group head machines, the steam valve uses a Teflon packing gland around the stem. When this packing dries out, it creates friction that feels like seizing — replacing the packing (a small ring of Teflon rope or a pre-cut gasket) often solves the problem without replacing the valve. Ceramic disc valves (used in some La Marzocco and Synesso machines) fail differently: the ceramic faces can chip or crack, allowing micro-particles to wedge between the discs. Ceramic valves cannot be repaired — they must be replaced as a unit. On commercial machines with multiple steam valves, preventive maintenance means cycling each valve fully open and closed at least once per day to prevent scale from setting.`,
    diy: 'intermediate',
  },

  // ─────────── WATER SYSTEM ───────────
  {
    id: 'water-autofill',
    title: 'Boiler autofill not working — boiler over or under fills',
    category: 'water',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Machine shows low water warning despite a full reservoir',
      'Pump runs continuously without reaching operating temperature',
      'Machine overflows water into the drip tray',
    ],
    summary: 'The boiler\'s automatic water level system is malfunctioning — either not detecting that water is needed, or failing to stop filling.',
    cause: 'Scale on the water level probe prevents it from sensing water conductivity. Distilled or RO water (zero minerals) prevents the conductivity probe from working at all. Stuck autofill solenoid (stuck open = overfill; stuck closed = won\'t fill). Failed water level control board relay.',
    solution: `1. Remove the water level probe and clean with fine sandpaper to remove scale deposits from the sensing tip.\n2. If you're using RO or distilled water: mix 80% RO with 20% tap water to restore mineral conductivity.\n3. Check and reseat the probe's electrical connector.\n4. Test the autofill solenoid — listen for the click when the pump should be filling. No click = coil failure or stuck plunger.\n5. If the machine overfills continuously: the autofill solenoid is stuck open — replace it.`,
    technicalDetail: `Water level probe conductivity threshold: most probes require a minimum of approximately 100 µS/cm water conductivity to sense correctly. Zero-mineral water won't trigger the probe. The probe tip should be lightly oxidized/clean metal — heavily scaled probes can read "full" even when the boiler is dry, or fail to read at all. On La Marzocco machines with an IoT module (Linea Mini AV 110v retrofit kit, for example), water level faults are logged and viewable remotely — useful for diagnosing intermittent autofill issues.`,
    diy: 'intermediate',
  },
  {
    id: 'water-flowmeter',
    title: 'Flow meter errors on volumetric or super-automatic machines',
    category: 'water',
    tiers: ['mid', 'highend', 'superauto'],
    difficulty: 'advanced',
    symptoms: [
      'Machine displays a flow error code and aborts mid-cycle',
      'Dose volumes are wildly inconsistent — too long or too short',
      'Touchscreen shows "flow sensor fault" or similar',
    ],
    summary: 'The flow meter that measures water volume to the group head is not sending a reliable signal to the control system, causing the machine to lose dose control.',
    cause: 'Impeller blocked by debris or scale (most common); broken signal wire; PCB relay failure; pump pressure too low to meet the flow meter\'s minimum threshold; grind too fine causing back-pressure that stalls the impeller.',
    solution: `1. Disconnect the flow meter and flush it by running clean water through both directions — a blocked impeller often frees itself.\n2. Test impeller rotation: with water flowing slowly through the meter, measure voltage pulses at the signal wire with a multimeter — should pulse steadily as impeller spins.\n3. Check all wiring connections from the flow meter to the PCB.\n4. Verify pump pressure is above the minimum threshold (typically 7.5 bar).\n5. Adjust grind slightly coarser to reduce back-pressure if this is the suspected cause.`,
    technicalDetail: `Flow meter comparison for espresso applications:\n- **Gicar paddle-wheel** (standard on many LM machines): reliable but susceptible to clogging; impeller diameter ~8mm\n- **Digmesa Nano** (used in Gaggiuino and community mods): compact, accurate, easily integrated into DIY systems\n- **Sensirion SFM series** (thermal mass): no moving parts, no clog risk, ±2% accuracy; used in some high-end specialty builds\n- **Keyence ultrasonic**: highest accuracy, zero contact with water; used in top-tier OEM commercial builds\n\nOn the Gaggiuino open-source profiling system for Gaggia machines, the flow meter is used to calculate real-time extraction yield alongside pressure — this inspired similar approaches in the LMPP (La Marzocco Linea Mini Profiling) community's gear pump mod projects.`,
    diy: 'tech',
  },

  // ─────────── ELECTRONICS ───────────
  {
    id: 'electronics-pcb',
    title: 'PCB or control board failure',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'advanced',
    symptoms: [
      'Machine powers on but does not respond to button inputs',
      'Erratic behavior — random starts, temperature changes, error codes',
      'Display goes blank or shows unrecoverable errors',
      'Machine shuts off mid-cycle without warning',
    ],
    summary: 'The main control board has failed, likely due to relay burnout, water damage from a leak, or component-level failure from years of thermal cycling.',
    cause: 'Relay failure from continuous thermal cycling (most common); corrosion from a nearby water leak reaching the board; failed capacitor, transformer, or rectifier; cold solder joints cracking over time.',
    solution: `1. Check upstream causes first: fuses (check all fuses — a blown fuse is cheap and often mistaken for board failure), power cable, thermal fuse.\n2. Inspect the board visually for burned components, corrosion staining, or swollen capacitors.\n3. Measure voltage input/output at the board with a multimeter.\n4. If the board is confirmed failed: replacement is usually more practical than component-level repair.\n5. Source OEM replacement boards or quality aftermarket alternatives through a certified service dealer.`,
    technicalDetail: `Community electronics projects in the La Marzocco space have produced custom control boards as alternatives to stock electronics:\n- **APEC SoM (System on Module)**: an open-source autonomous profiling module developed for the GS3 AV by community member Magnus (EAF); adds closed-loop pressure and flow profiling without replacing the entire board\n- **LMLM custom gear pump controller**: a bespoke PCB controlling a gear pump for profiling on the Linea Mini; documented on Home-Barista.com\n- **AC board mod** for Micra / Linea Mini R / Mini Classic: a custom board that adds shot timer functionality and is compatible across several Linea Mini variants; the Linea Mini R uses the Micra PCB internally with an added shot timer connector\n\nFor super-automatic machines (Franke, Jura, WMF), control board replacement typically costs $300–$800 in parts and $200–$400 in labor.`,
    diy: 'tech',
  },
  {
    id: 'power-failure',
    title: 'Machine completely dead — no power at all',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'No lights, no display, no response when the power switch is turned on',
      'Machine is completely dead — no signs of life whatsoever',
      'Machine was working yesterday but now does nothing',
    ],
    summary: 'The machine shows no sign of power at all. This is usually caused by a blown fuse, a failed power switch, a damaged power cord, or a tripped thermal cutoff — not a dead control board.',
    cause: 'A blown internal fuse is the most common cause (often from a power surge or a shorted component). A failed or corroded power switch, a damaged power cord with a broken conductor, or a tripped thermal cutoff that hasn\'t reset can all cause a completely dead machine. Control board failure is possible but less likely when there are zero signs of power.',
    solution: `1. Check the outlet: plug in a different appliance to verify the outlet works. Try a different outlet with the machine.\n2. Inspect the power cord for visible damage — cuts, kinks, burn marks, or a loose plug connection. If the machine uses a detachable IEC cord, try a known-good replacement cord.\n3. Check the fuse: most espresso machines have an internal fuse on the power inlet or the control board. Open the machine and locate the fuse (usually a glass or ceramic cylinder near the power inlet). Test with a multimeter for continuity — no continuity means it\'s blown. Replace with the exact same amperage and voltage rating.\n4. Test the power switch: with the machine unplugged, use a multimeter in continuity mode across the switch terminals. The switch should show continuity in the ON position and open circuit in OFF. A corroded or failed switch will show open circuit in both positions.\n5. Inspect internal wiring for burns, breaks, or disconnected spade connectors. Thermal damage near the boiler is common.\n6. Check the thermal cutoff or safety thermostat — if it has tripped, the machine won\'t power on until it\'s replaced (thermal cutoffs are non-resettable; thermal resets are resettable).\n7. If all of the above check out, the control board may have a failed power supply section — consult a technician.`,
    technicalDetail: `Fuse ratings vary by machine and voltage: 120V machines typically use 15A or 20A fuses; 220-240V machines use 10A or 13A fuses. Never substitute a higher-rated fuse — the fuse protects the wiring and components from fire. On machines with a rocker switch and neon indicator lamp, the lamp can burn out independently while the switch still works — a dead indicator light doesn\'t always mean no power. On dual-voltage machines (some Rocket, ECM, Profitec models), verify the voltage selector is set correctly for your region — incorrect voltage selection can blow the fuse immediately or damage the heating element. For machines that died during a power surge or storm, check the MOV (metal oxide varistor) on the power inlet board — if it has exploded (cracked, blackened), replace it along with the fuse.`,
    diy: 'intermediate',
  },
  {
    id: 'electronics-pressurestat',
    title: 'Pressurestat or thermostat calibration drift',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Steam boiler pressure consistently above or below the target',
      'Steam is too weak or machine vents constantly',
      'Brew temperature is off even though the PID reads correctly',
    ],
    summary: 'The device controlling the steam boiler\'s on/off threshold has drifted out of calibration, causing the boiler to run hotter or cooler than intended.',
    cause: 'Pressurestat spring fatigue over years of use; pressurestat diaphragm failure; thermostat contact contamination; PID temperature sensor (thermocouple or PT100 probe) failure or drift.',
    solution: `1. For pressurestat adjustment: with the machine at full operating temperature, turn the adjustment screw slowly while watching the pressure gauge. Clockwise = higher cutoff pressure.\n2. For PID temperature sensor drift: verify with an independent thermometer. If readings differ significantly, replace the PT100 probe.\n3. Replace the pressurestat if adjustment has no effect or if it cycles erratically.\n4. On PID-controlled machines, check the PID parameters (P, I, D values) haven't been inadvertently changed.`,
    technicalDetail: `PT100 probes (100Ω at 0°C) are the most common temperature sensor in commercial espresso machines. Test with a multimeter: at room temperature (~20°C), a PT100 reads approximately 107.8Ω. At 93°C, it reads approximately 135.5Ω. A reading significantly outside these ranges confirms probe drift or failure.\n\nThe FDC1004 capacitive measurement chip is used in some advanced community builds (notably Magnus's APEC SoM project for the GS3 AV) for highly accurate thermal tracking without contact resistance. This addresses galvanic corrosion artifacts that can affect PT100 readings in high-mineral-content water environments. On the Lelit Bianca, the community-standard 55-03 thermocouple spec is well-documented as a drop-in replacement reference.`,
    diy: 'tech',
  },

  {
    id: 'electronics-heating-element',
    title: 'Heating element failure',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'advanced',
    symptoms: [
      'Machine powers on but never heats up — stays at room temperature',
      'Machine takes far longer than usual to reach operating temperature',
      'Boiler pressure or PID temperature is frozen and unresponsive',
      'Thermal fuse has blown (a sign the element previously overheated)',
    ],
    summary: 'The heating element inside the boiler has failed and is no longer generating heat. This requires internal access and electrical testing — do not attempt without proper training.',
    cause: 'Limescale buildup insulating the element causes it to overheat and burn out. Dry-firing (running the element without water due to a failed autofill) destroys elements quickly. Normal end-of-life failure after 5–10 years of use.',
    solution: `1. First, confirm it is the element and not the thermal fuse, pressurestat, or wiring (these are cheaper and easier to test first).\n2. Unplug the machine completely and allow it to cool.\n3. Locate the heating element connections — typically two spade terminals on the boiler.\n4. Test continuity across the element terminals with a multimeter. Open circuit (no continuity) = element failure.\n5. Also test resistance to ground (earth). If there is continuity between element and chassis ground, the element has shorted internally — replace immediately and check the RCD/breaker.\n6. Source a replacement element matching the wattage and voltage spec on the original element label.\n⚠️ Heating elements operate at mains voltage. This repair must be performed with the machine completely unplugged and ideally by a qualified technician.`,
    technicalDetail: `Heating element wattage is matched to the boiler volume. Installing a higher-wattage element than rated is dangerous — it will exceed the boiler's thermal design limits. Element threading varies: most commercial boilers use BSP or metric threads — use a thread gauge before ordering. After replacement, always run a full cycle of water through before applying heat to avoid a dry-fire. On La Marzocco dual-boiler machines, brew and steam elements are independent — confirm which has failed before ordering parts.`,
    diy: 'tech',
  },
  {
    id: 'electronics-fuse',
    title: 'Blown fuse or tripped circuit breaker',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine is completely dead — no lights, no display, no response',
      'Machine worked fine then suddenly stopped with no warning',
      'Circuit breaker in the building has tripped',
    ],
    summary: 'A blown internal fuse or tripped building breaker is one of the most common reasons a machine goes completely dead — and one of the easiest to diagnose before assuming a major fault.',
    cause: 'A power surge or spike; a short circuit inside the machine (often from a water leak reaching the electronics); an aging component drawing excess current; or a fuse that has reached end of life after years of inrush current from the heating element.',
    solution: `1. Check the building's circuit breaker first — reset it and test whether it trips again immediately.\n2. If the breaker holds: locate the machine's internal fuse(s). These are usually in a fuse holder near the power inlet or on the PCB.\n3. Pull the fuse and test it with a multimeter on continuity mode. A blown fuse reads open circuit.\n4. Replace only with a fuse of identical amp rating and type (slow-blow vs. fast-blow). Never use a higher-rated fuse as a fix.\n5. If the new fuse blows immediately: there is an underlying short circuit that must be found before continuing.\n⚠️ Always unplug the machine before accessing any internal fuse or electrical component.`,
    technicalDetail: `Commercial espresso machines commonly use T6.3A or T10A slow-blow (time-delay) fuses rated at 250V. Slow-blow fuses are essential — the heating element's inrush current at startup briefly exceeds its running current, which would blow a fast-blow fuse on every startup. Always replace like-for-like. If a fuse has blown with no apparent cause, inspect all internal wiring for signs of burning, melting, or moisture ingress before powering the machine again.`,
    diy: 'diy',
  },
  {
    id: 'electronics-ssr',
    title: 'Solid state relay (SSR) failure',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Machine heats continuously and never stops — boiler overheats or vents steam constantly',
      'Machine does not heat at all despite the PID calling for heat',
      'PID reads correct temperature but heating is erratic',
    ],
    summary: 'The solid state relay switches the heating element on and off on command from the PID controller. When it fails, the boiler either runs non-stop or not at all.',
    cause: 'SSRs fail in two predictable ways: shorted (stuck ON — the element runs continuously, the boiler overheats), or open (stuck OFF — the element never fires, no heat). Overheating from poor heat sink contact or undersized SSR rating accelerates failure.',
    solution: `1. If the machine heats non-stop even when unplugging the PID signal wire: the SSR has shorted internally. Power off immediately — a stuck-on SSR can overheat the boiler and vent the safety valve.\n2. If there is no heat: test the SSR control terminals with a multimeter (typically 3–32V DC input signal). Confirm the PID is sending a signal.\n3. Test the SSR output (load) terminals for continuity when the control signal is active.\n4. Replace the SSR with an identical or higher-rated unit (match voltage/current spec — never go lower).\n5. When installing the replacement, apply a thin layer of thermal paste between the SSR and its heat sink.\n⚠️ SSR output terminals carry mains voltage when the machine is powered. Test with extreme caution or wait until the machine is fully unplugged and capacitors have discharged.`,
    technicalDetail: `SSRs used in espresso machines are typically rated 25A or 40A at 240V AC output, controlled by 3–32V DC input from the PID. The 40A version runs cooler and lasts longer in continuous duty — upgrading from a 25A to a 40A SSR is a common, worthwhile upgrade when replacing a failed unit. Quality SSRs (Crydom, Carlo Gavazzi, Fotek) outlast cheap no-brand units significantly. The heat sink must make solid, flat contact with the SSR body — use nylon screws on the signal side and ensure no high-voltage wiring runs near the heat sink surface.`,
    diy: 'tech',
  },
  {
    id: 'electronics-wiring',
    title: 'Wiring harness or connector corrosion',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Intermittent faults that come and go — often triggered by vibration or temperature changes',
      'One function stops working while everything else is fine',
      'Visible green or white corrosion on spade connectors or wire ends',
      'Burning smell from inside the machine without visible charring',
    ],
    summary: 'Corroded or loose electrical connectors cause intermittent failures that are frustratingly hard to diagnose — symptoms appear and disappear without obvious pattern.',
    cause: 'Steam and humidity inside the machine corrode exposed metal connectors over years. Loose spade terminals create resistance that generates heat and eventually arcs. Vibration from the pump gradually loosens push-fit connectors.',
    solution: `1. Unplug the machine completely before inspection.\n2. Inspect all spade connectors, especially on high-heat components (heating element, pressurestat, SSR).\n3. Pull each connector off and look for green or white corrosion on the terminal surface.\n4. Clean mild corrosion with a fine brass brush or electrical contact cleaner spray.\n5. Replace any connectors that are burnt, severely corroded, or that feel loose when reconnected.\n6. Use heat-shrink solder connectors when replacing corroded terminals for a permanent, sealed repair.\n⚠️ All connector inspection and replacement must be done with the machine fully unplugged. Even low-voltage signal wires can carry mains potential in some circuit configurations.`,
    technicalDetail: `Spade terminal resistance: a corroded connector can add 0.5–2Ω of resistance — enough to drop voltage significantly and generate substantial heat at current levels typical of heating element circuits (5–10A). This resistance heat can melt the plastic housing and eventually cause a fire risk. On machines that have had internal water leaks, check the PCB connector block (often a multi-pin Molex or Faston strip) for similar corrosion. Dielectric grease applied after cleaning slows future corrosion on reconnected terminals.`,
    diy: 'intermediate',
  },
  {
    id: 'electronics-display',
    title: 'Shot timer, display, or control panel not responding',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Display is blank or stuck on a startup screen',
      'Buttons on the control panel do not respond',
      'Shot timer starts but does not stop, or never starts at all',
      'Menu settings appear but cannot be changed',
    ],
    summary: 'The display module or control panel interface has failed or lost communication with the main board, making the machine difficult or impossible to operate.',
    cause: 'Failed display driver IC; loose ribbon cable or connector between display and PCB; firmware corruption (on machines with software settings); button membrane worn and no longer making contact; water damage to the display PCB.',
    solution: `1. Power cycle the machine by unplugging for 60 seconds — firmware lockups sometimes clear on restart.\n2. Inspect and firmly reseat the ribbon cable connecting the display to the main board.\n3. On machines with user-settable parameters, check whether a factory reset restores function (consult your manual).\n4. Test each button with a multimeter in continuity mode — a stuck or failed button can freeze the interface.\n5. If the display hardware itself is faulty, replacement display boards are available for most commercial machines from service dealers.`,
    technicalDetail: `On the La Marzocco Micra, Linea Mini, and newer machines with IoT modules, display issues may be firmware-related and can be addressed via the LM app or a firmware update from La Marzocco service. On super-automatics (Jura, Franke, WMF), display replacement typically requires calibration of the touchscreen using a manufacturer service tool. The LMPP community has documented an AC board mod for the Linea Mini / Micra that adds shot timer functionality to older machines using the Micra PCB's built-in timer connector.`,
    diy: 'intermediate',
  },
  {
    id: 'electronics-rcd',
    title: 'RCD / GFCI tripping or earth leakage fault',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'advanced',
    symptoms: [
      'RCD (residual current device) or GFCI breaker trips when the machine is plugged in or starts heating',
      'Mild tingling sensation when touching the machine chassis',
      'Machine trips the breaker immediately on startup',
    ],
    summary: 'Electrical current is leaking from the mains circuit to the machine chassis or earth. This is a serious safety issue — do not use the machine until the fault is found and repaired.',
    cause: 'A failed heating element with an internal short to its sheath (earth fault); degraded wiring insulation allowing mains contact with the chassis; water or steam condensation bridging a mains-voltage component to the frame; a failed capacitor in the EMC filter on the power inlet.',
    solution: `1. Stop using the machine immediately. Do not attempt to reset the RCD and continue.\n2. Unplug the machine and test the heating element for an earth fault: with a multimeter, test continuity between the element terminals and the machine chassis. Any reading = earth fault on the element.\n3. Inspect internal wiring carefully for any bare or damaged insulation.\n4. If no fault is found on the element or wiring, the EMC filter capacitor (the small capacitor block at the power inlet) is a common cause of nuisance RCD tripping — these are designed to shunt high-frequency noise to earth and can sometimes trip sensitive RCDs.\n⚠️ Earth leakage is a shock and fire hazard. Do not use the machine or attempt to bypass the RCD. Have a qualified electrician or technician inspect and repair it before use.`,
    technicalDetail: `RCDs (called GFCIs in North America) trip at 30mA earth leakage current for personal protection types, or 100–300mA for equipment protection types. Espresso machines should always be on a 30mA personal protection RCD. EMC filter capacitors (often called Y-capacitors) are connected between each line and earth — a leaky or failed Y-capacitor can create steady-state leakage current below the trip threshold while also causing nuisance trips on very sensitive 10mA RCDs. Replacements are inexpensive (X2/Y2 rated capacitors only — never substitute with standard film capacitors). On EU-market machines, IEC 60335-1 requires leakage current below 0.75mA in normal operation — above this indicates a fault condition regardless of whether the RCD trips.`,
    diy: 'tech',
  },
  {
    id: 'electronics-power-switch',
    title: 'Power switch or rocker switch failure',
    category: 'electronics',
    tiers: ['prosumer', 'mid', 'highend', 'superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Machine does not power on when the switch is pressed',
      'Machine turns off randomly during use',
      'Switch feels loose, sticky, or does not click properly',
      'Switch position (on/off) does not reliably correspond to machine state',
    ],
    summary: 'The main power switch has worn out internally and is no longer making reliable contact, causing intermittent power loss or complete failure to start.',
    cause: 'Mechanical wear of internal contacts after thousands of switching cycles; moisture or coffee residue entering the switch housing; overheating of the switch from running at or above its rated current; incorrect switch rating for the machine.',
    solution: `1. Unplug the machine.\n2. Test the switch with a multimeter in continuity mode: in the ON position, it should read zero resistance (closed circuit). In the OFF position, it should read open.\n3. If the switch tests good: check the wiring connected to it — loose spade connectors are a common source of intermittent behavior that appears to be the switch.\n4. Replace the switch with an identical unit: match the voltage rating (250V AC minimum), current rating (at least as high as original), and physical dimensions.\n5. Most espresso machine power switches use standard panel-mount rocker or key switches — replacements are widely available.\n⚠️ The power switch carries mains voltage on its input terminal at all times when the machine is plugged in. Disconnect power before touching any switch terminals.`,
    technicalDetail: `Commercial espresso machines typically draw 10–15A at 240V during heating — the power switch must be rated for this inrush current, not just the running current. Switches rated "10A resistive" are not appropriate for inductive/capacitive loads — use switches rated for motor or general-purpose loads. On some machines (particularly older La Cimbali and Faema models), the main switch is a key switch — replacements are machine-specific and available through service dealers. The switch current rating should always be equal to or greater than the heating element's rated current.`,
    diy: 'intermediate',
  },

  // ─────────── SEALS ───────────
  {
    id: 'seals-internal-leak',
    title: 'Internal hose or fitting leak',
    category: 'seals',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'intermediate',
    symptoms: [
      'Water drips or puddles inside the machine casing or drip tray without obvious cause',
      'Water staining or corrosion visible on internal components',
      'Machine loses water but no external leak is visible',
    ],
    summary: 'An internal hose, compression fitting, or O-ring has failed, causing water to leak inside the machine chassis before it ever reaches the group or boiler.',
    cause: 'High-temperature silicone or PTFE hoses crack from age and thermal cycling. Compression fittings loosen from vibration over time. O-rings at valve or fitting connections harden and lose sealing ability.',
    solution: `1. With the machine cold and unplugged, remove the side panel or bottom cover.\n2. Inspect all internal hoses and fittings carefully — look for discoloration, staining, or visible cracks.\n3. Replace any cracked or brittle hoses with food-grade high-temperature silicone rated for at least 150°C / 300 psi.\n4. Re-seat or replace O-rings at fitting connections using food-grade silicone O-rings.\n5. Apply PTFE thread seal tape to threaded connections if resealing.`,
    technicalDetail: `Hydraulic connector fitting sizes for La Marzocco Linea Mini gear pump installations: the LMPP community has documented a complete reference list of fitting sizes for the AV-ABR mod, available on Home-Barista.com (t94556) and the LMPP Discord. For Bezzera Arcadia pump O-rings specifically: the pump FG304X O-ring is part number 7730513, available from 1st-line.com — noted as expensive relative to generic equivalents.`,
    diy: 'tech',
  },

  // ─────────── GRINDER (additional) ───────────
  {
    id: 'grinder-burrs',
    title: 'Burr alignment, calibration, and replacement',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Grind quality has noticeably degraded despite correct settings',
      'Significant coffee fines even at coarse settings',
      'Uneven grind particle distribution visible on a scatter mat',
      'Grinder chirps or makes a metallic scratching sound',
    ],
    summary: 'Dull or misaligned burrs produce inconsistent particle sizes, killing extraction quality. Burrs dull over time and alignment drifts — both are serviceable.',
    cause: 'Steel burrs dull after 200–500 kg of coffee depending on quality. Ceramic burrs last longer but chip more easily. Alignment drifts from vibration, thermal cycling, or improper reassembly after cleaning. A chirping sound means the burrs are touching — immediate realignment required.',
    solution: `1. Test sharpness: sharper burrs produce a bimodal distribution (coarse + fine); dull burrs produce a unimodal blob. A Kruve sifter or scatter mat makes this visible.\n2. Check alignment first before replacing burrs: use the "marker test" — run a Sharpie around the flat burr face, reinstall, and rotate by hand. Ink will be scraped off only at high spots — adjust the upper burr carrier to compensate.\n3. Replace burrs if alignment is correct but grind quality is poor. Always replace as matched sets from the same manufacturer batch.\n4. After installing new burrs, run 500g of inexpensive beans ("seasoning the burrs") before using for quality coffee — new burrs shed metal particles and produce inconsistent grinds until broken in.\n5. Set grind zero point: carefully wind in until the burrs just touch (you'll hear a light chirp), then back out to your coarsest espresso setting from there.`,
    technicalDetail: `Burr alignment standards: the specialty community generally targets ≤50 micron run-out measured with a dial indicator at the burr face. Tools like the Bellissimo burr alignment kit or Titus alignment tool make this measurable. Single-dose grinders (Weber Key, Ek43S, Monolith Flat) are engineered to tighter tolerances than commercial workhorses like the Mazzer Robur. On the Robur, annual alignment is standard service. The Niche Zero has a reputation for factory alignment being near-perfect out of the box, though some units still benefit from the marker test.`,
    diy: 'advanced',
  },
  {
    id: 'grinder-clog',
    title: 'Grinder jammed or clogged — won\'t rotate',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Grinder motor hums but burrs do not rotate',
      'Motor trips its thermal overload and shuts off',
      'Grinding sound stops suddenly mid-session',
      'Complete blockage — grinder won\'t start at all',
    ],
    summary: 'A foreign object, compacted coffee oil residue, or a seized bearing is stopping the burrs from rotating. This is usually fixable without parts.',
    cause: 'A small stone, twig fragment, or hard seed in the beans is the most common culprit. Compacted, oily old coffee in the burr chamber also jams burrs over time. Thermal overload trips if the motor is overloaded — wait 10 minutes before retrying.',
    solution: `1. Unplug the grinder immediately.\n2. Remove the hopper and empty all beans.\n3. Remove the upper burr carrier (usually 3 screws or a bayonet twist).\n4. Inspect both burr faces for the foreign object — use a flashlight. Remove with tweezers.\n5. Clean the burr chamber thoroughly with a grinder brush before reassembling.\n6. If no foreign object is found and the motor still hums without spinning, the start capacitor or motor bearings may have failed — that requires component-level repair.\n7. For thermal overload trips: wait 15 minutes with the grinder unplugged before restarting.`,
    technicalDetail: `Super-automatic machines (Jura, DeLonghi, Saeco) have integrated grinders that are significantly harder to clear. On these machines, the manufacturer may provide a "cleaning tablet" mode that partially clears soft clogs. For hard jams on super-automatics, partial disassembly is typically required. On Mazzer commercial grinders, the motor start capacitor is a well-known failure mode on older units — a capacitor that fails causes the motor to hum without starting, mimicking a jam. Test by gently helping the burrs start rotating (with the machine unplugged!) — if the motor continues on its own after a hand-start, the capacitor is the culprit.`,
    diy: 'diy',
  },
  {
    id: 'burr-replacement',
    title: 'Grinder burr replacement — worn or damaged burrs',
    category: 'grinder',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Grind getting progressively coarser over time despite not changing the setting',
      'Uneven particle size — mix of boulders and fines visible on a white surface',
      'Grinder running noticeably longer to produce the same dose',
      'Coffee tastes stale, flat, or muddled despite using fresh beans',
    ],
    summary: 'The grinder burrs have worn past their useful life and are no longer cutting beans cleanly. Worn burrs tear and crush beans instead of cutting them, producing inconsistent particles and degraded flavor.',
    cause: 'All burrs wear over time. Steel flat burrs typically last 200–500 kg of coffee. Steel conical burrs last 500–1,000 kg. Ceramic burrs last 750–1,500 kg but are more brittle and can chip from foreign objects. Oily, dark-roasted beans accelerate wear. Running the grinder empty (metal-on-metal contact) destroys burrs quickly.',
    solution: `1. Check grind output quality: dose into a white cup or scatter mat and look for uniformity. Worn burrs produce an obviously uneven spread with both large chunks and excessive dust.\n2. Remove the upper burr carrier: on most grinders, this is 2–3 screws or a bayonet twist. On super-automatics, consult the service manual for your model — the burr carrier may require partial machine disassembly.\n3. Inspect the burr edges: sharp burrs have crisp, well-defined cutting edges. Worn burrs have rounded, smooth edges that reflect light — if you can see a shiny edge, the burr is dull.\n4. Replace the burr set: always replace both burrs as a matched pair. Match the exact burr diameter (common sizes: 50mm, 58mm, 64mm, 83mm) and mounting pattern. Use OEM or quality aftermarket burrs.\n5. Reassemble and calibrate: set the grind zero point by carefully closing the burrs until they just touch (light chirp), then back off to your target espresso setting.\n6. Season new burrs: run 250–500g of inexpensive beans through before using for quality coffee. New burrs shed microscopic metal particles and produce inconsistent grinds until the cutting surfaces break in.`,
    technicalDetail: `Burr types and expected lifespan: DeLonghi super-auto steel burrs last approximately 10,000–15,000 cups. Jura ceramic burrs are rated for 20,000+ cups. Mazzer commercial flat burrs (64mm) are rated for 250–350 kg; the 83mm Robur burrs last 400–600 kg due to slower RPM and larger cutting surface. Aftermarket burr options: SSP (South Korea) manufactures high-uniformity replacement burrs for Mazzer, Eureka, and EK43 — their "High Uniformity" and "Multi-Purpose" geometries are popular upgrades. Italmill (Italy) produces OEM burrs for many manufacturers. When replacing burrs on a super-automatic, take photos of the burr orientation before removing — the upper and lower burrs are not identical and must be installed in the correct direction. On DeLonghi ECAM grinders, the burr carrier is keyed and can only install one way, but the spring tension must be re-indexed after reassembly.`,
    diy: 'intermediate',
  },

  // ─────────── WATER SYSTEM (additional) ───────────
  {
    id: 'water-inlet-filter',
    title: 'Clogged water inlet filter or tank screen',
    category: 'water',
    tiers: ['prosumer', 'mid', 'highend', 'superauto', 'home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine has low flow despite pump working correctly',
      'Machine takes longer than normal to fill the boiler',
      'Machine runs dry even with a full water tank',
      'Visible debris or sediment in the water tank',
    ],
    summary: 'The water inlet filter or tank screen is clogged with mineral deposits or debris, restricting water supply to the pump.',
    cause: 'The inlet filter screen at the bottom of the water tank connection catches mineral flakes and debris that would otherwise reach the pump. Over time it clogs, especially in hard water areas or if the machine hasn\'t been serviced in years.',
    solution: `1. Remove the water tank and locate the filter screen — it's usually a small mesh strainer at the inlet port where the tank connects to the machine.\n2. On machines with a removable screen, pull it out and rinse under running water. Use a soft brush to dislodge mineral deposits.\n3. Soak stubborn deposits in a 1:10 citric acid solution for 15 minutes.\n4. Check inside the machine's water inlet tube as well — some machines have a second filter there.\n5. For plumbed-in machines, check the inline pre-filter and replace the cartridge if it's been more than 6 months.\n6. Install a tank water filter (Brita-style tablet or BWT Mg2+ disc) to slow future clogging.`,
    technicalDetail: `On La Marzocco Linea Mini and similar machines with a rotary pump, even minor flow restriction at the inlet can cause the pump to cavitate — producing a characteristic high-pitched whine and inconsistent pressure. The Linea Mini's tank-to-machine connection uses a push-fit connector and the internal screen is a small stainless mesh ring. On super-automatics with integrated grinders, the water inlet filter is often co-located with the descaling valve assembly and requires partial disassembly to access.`,
    diy: 'diy',
  },

  // ─────────── GROUP HEAD (additional) ───────────
  {
    id: 'group-backflush',
    title: 'Backflush routine and solenoid valve purge',
    category: 'group',
    tiers: ['prosumer', 'mid', 'highend'],
    difficulty: 'beginner',
    symptoms: [
      'Coffee taste has gradually degraded — bitter or sour even with fresh beans',
      'Brown liquid drains from the 3-way solenoid after shots',
      'Slow flow through the group head even with a fresh puck',
      'Visible coffee oil residue inside the portafilter basket',
    ],
    summary: 'Regular backflushing cleans coffee oils from the group head, dispersion screen, and 3-way solenoid valve. Machines with a 3-way solenoid (E61, HX, and most prosumer machines) require backflushing; single-boiler machines with no solenoid only need group head cleaning.',
    cause: 'Coffee oils oxidize and build up on the shower screen, dispersion plate, and inside the solenoid valve body. Without regular cleaning, this rancid residue taints extraction flavour and eventually blocks the solenoid\'s drain port.',
    solution: `1. Insert a blind basket (a solid disk, no holes) into the portafilter.\n2. Add a small amount of group head cleaner (Cafiza, Puly Caff, or equivalent) — typically 1/4 to 1/2 teaspoon.\n3. Lock the portafilter into the group. Start a shot — water pressure builds behind the blind basket.\n4. After 10 seconds, stop the shot. Pressure releases through the solenoid drain. Repeat 5–10 times.\n5. Remove the blind basket and lock in the portafilter with no coffee. Flush for 30 seconds to rinse residual cleaner.\n6. Wipe down the group head, shower screen, and portafilter basket thoroughly.\n\nFor commercial machines: backflush daily. For prosumer home machines: weekly (or every 10–15 shots).`,
    technicalDetail: `The 3-way solenoid drains the residual brew water from the puck after each shot — this is why the puck comes out dry on properly functioning machines. Coffee oil residue gradually coats the solenoid's internal Teflon seal and drain port. On the E61 group head, the cam mechanism also benefits from annual lubrication with food-grade silicone grease applied to the cam follower and pivot point. Avoid petroleum-based greases — they're not food safe and degrade rubber seals. For super-automatic machines: these have integrated cleaning tablet cycles that approximate backflushing; follow the manufacturer's schedule.`,
    diy: 'diy',
  },

  // ─────────── HOME SUPER-AUTOMATIC ───────────
  {
    id: 'superauto-brew-unit-jam',
    title: 'Brew unit stuck, jammed, or won\'t eject the puck',
    category: 'group',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine makes a grinding or straining sound but no coffee comes out',
      '"Insert brew unit" or "brew unit" error on the display',
      'The removable brew unit lever or handle is stuck and won\'t move',
      'Machine stops mid-brew cycle with no output',
    ],
    summary: 'The internal brewing chamber is seized due to coffee grounds buildup or lack of lubrication — by far the most common home superauto repair call.',
    cause: 'Coffee oils and fine grounds accumulate inside the brew unit over months of use, especially without regular cleaning tablet cycles. The O-rings and plastic slides dry out, causing the unit to seize. Forcing the unit in or out when it\'s stiff causes physical cracks that accelerate the problem.',
    solution: `1. Open the side door and pull out the brew unit using the release handle (DeLonghi: left side; Saeco/Philips: right side). Jura E/S series brew units are not user-removable — skip to step 5.\n2. Rinse the brew unit under warm (not hot) running water. Never put it in the dishwasher.\n3. Let it air dry for 30 minutes.\n4. Apply 2–3 drops of food-grade silicone grease (not petroleum-based) to the sliding rails on both sides. Do not use vegetable oil or cooking spray.\n5. Run a cleaning tablet cycle: drop a tablet into the cleaning slot and select "Clean" or "Rinse" from the menu.\n6. If the brew unit is completely stuck and won't come out: power the machine off, wait 2 minutes, then power on again — some machines unlock the brew unit on startup. Do not force it.`,
    technicalDetail: `On DeLonghi ECAM machines (Magnifica, PrimaDonna, Eletta), the brew unit uses a plastic upper and lower piston with a center drive shaft. The most common failure modes are: (1) cracking of the plastic drive arm, visible as a white stress fracture; (2) seizure of the central shaft due to coffee oil hardening. Replacement brew units for ECAM series are available from ~$40–$70. On Jura machines, the brew unit is NOT user-removable on Impressa/ENA series — if a brew unit error appears, it indicates a sensor fault or mechanical failure requiring service. On E/S series Jura, the brew unit is removable from the front panel after pressing the maintenance button. On Saeco/Philips LatteGo machines, ensure the milk carafe is disconnected before removing the brew unit — the shared spout connection point is a common source of misdiagnosis.`,
    diy: 'diy',
  },
  {
    id: 'brew-unit-stuck',
    title: 'Brew unit stuck or not resetting — super-automatic machines',
    category: 'group',
    tiers: ['superauto', 'home-superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Brew unit won\'t slide out of the machine',
      'Machine displaying brew unit error or service message',
      'Machine grinds beans but does not brew — cycle stops mid-way',
      'Brew unit stuck in the mid-cycle position and won\'t reset',
    ],
    summary: 'The brew unit is mechanically stuck or has failed to return to its home position after a brew cycle. This prevents the machine from completing or starting a new cycle.',
    cause: 'Coffee grounds buildup inside the brew unit housing creates friction that prevents the unit from sliding. Dried coffee oils on the guide rails cause the unit to seize. A failed drive motor or stripped gear in the brew unit drive mechanism can leave the unit stuck mid-cycle. Power interruption during a brew cycle can also leave the unit in an intermediate position.',
    solution: `1. Turn off and unplug the machine. Wait at least 30 seconds.\n2. Try the manual release lever: most DeLonghi and Saeco/Philips machines have a release mechanism accessible through the service door. On DeLonghi ECAM models, press the PUSH button on the brew unit while pulling the handle. On Saeco, press the release tab and pull.\n3. If the unit comes out: remove it and rinse thoroughly under warm running water. Use a soft brush to remove compacted grounds from the piston area and guide rails.\n4. Lubricate the guide rails with food-safe silicone grease (Dow Corning 111 or equivalent). Apply a thin film to both side rails and the central piston rod.\n5. Clean the brew unit housing inside the machine: use a long brush or vacuum to remove loose grounds from the cavity where the unit sits.\n6. Reinstall the brew unit and power on the machine. The machine should run an initialization cycle — listen for the motor engaging and the unit cycling to its home position.\n7. If the unit won\'t release at all: the drive gear may be stripped or the motor may have failed — this requires service-level disassembly.`,
    technicalDetail: `On DeLonghi ECAM machines, the brew unit drive mechanism uses a worm gear connected to a small DC motor. If the worm gear teeth strip (visible as white plastic shavings in the housing), the motor spins but the unit doesn't move. Replacement drive gears are available but require significant disassembly. On Jura machines with non-removable brew units (Impressa, ENA, A-line), the brew unit position is tracked by a microswitch — if the switch fails or the unit is physically stuck, the machine enters a permanent error state. A Jura service tool (available through authorized dealers) can force a reset of the brew unit position counter. On Saeco/Philips machines, the brew unit has a mechanical counter that tracks cycles — at a set interval (typically every 500 cycles), the machine prompts for lubrication. Ignoring this prompt accelerates wear on the drive mechanism.`,
    diy: 'intermediate',
  },
  {
    id: 'superauto-weak-coffee',
    title: 'Coffee is watery, weak, or has no crema',
    category: 'grinder',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Coffee tastes thin, sour, or like dirty water',
      'No visible crema, or only a thin pale layer',
      'Coffee flows too fast — full cup in under 15 seconds',
      'Increasing the coffee strength setting makes little difference',
    ],
    summary: 'Watery output from a home superautomatic almost always means the grind is too coarse for the current burr wear stage — the grinder needs to be set finer, or the burrs need replacing.',
    cause: 'Burrs wear gradually and need the grind setting moved finer every 6–18 months to compensate. Most new owners never adjust the factory default grind, which is set conservatively coarse. Stale beans, a low dose setting, or using pre-ground coffee in the bean hopper compound the problem.',
    solution: `1. Increase coffee strength: navigate to the coffee settings menu and raise strength to maximum (5/5 on most machines).\n2. Adjust grind finer: on most machines the grind dial is inside or under the bean hopper. Turn one step toward fine (Jura: A → B → C toward fine; DeLonghi: rotate toward the "fine" icon).\n3. Only adjust the grind while the grinder is running — adjusting a stopped grinder can crack the burrs.\n4. Run 2–3 brew cycles after adjusting to flush old grounds before evaluating.\n5. If coffee is still watery at maximum strength + finest grind: burrs are worn and need replacement.\n6. Do not use pre-ground coffee in the bean hopper unless your machine has a separate "bypass doser" chute (a second opening, usually labeled with a scoop icon).`,
    technicalDetail: `Ceramic burrs (Jura, higher-end Saeco) typically last 20,000+ cups. Steel burrs (DeLonghi Magnifica standard, Siemens EQ series) typically last 10,000–15,000 cups. On DeLonghi ECAM machines, the total cup count is accessible in the service menu (hold the "?" info button while powering on). On Jura machines, cup count is viewable in the free Jura Diagnostics app (iOS/Android). Replacing the grinder assembly on a DeLonghi Magnifica Evo is a ~$45–$60 part and 45–60 minutes of labor — it requires a Torx T20 screwdriver and significant disassembly. On Saeco HD8xxx series machines, the burr carrier is accessible after removing the top panel and is simpler to replace.`,
    diy: 'intermediate',
  },
  {
    id: 'superauto-descale-stuck',
    title: 'Machine stuck in descaling loop or won\'t finish descaling',
    category: 'water',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine shows "descale required" immediately after completing a full descale',
      'Descaling cycle stops mid-way and machine won\'t continue or resume',
      'Machine refuses to make coffee until descaling is done, even after descaling',
      'Descaling cycle starts then the machine beeps and halts',
    ],
    summary: 'The descaling cycle was interrupted, the wrong descaling product was used, or the machine\'s scale sensor wasn\'t cleared properly — leaving it in a loop.',
    cause: 'Using the wrong brand of descaler can cause mid-cycle failures (Jura requires Jura tablets; Saeco/Philips requires CA6700 liquid). Interrupting the cycle — unplugging mid-way, running out of water, or pressing cancel — corrupts the cycle state. Some machines use a conductivity sensor that stays triggered until scale is fully dissolved.',
    solution: `1. Use the correct descaler for your machine: Jura → Jura descaling tablets; De'Longhi → EcoDecalk liquid; Saeco/Philips → CA6700 descaler; Siemens/Bosch → CTL636 descaling tablets.\n2. If stuck mid-cycle: restart the machine and look for a "Resume" or "Restart Descaling" option in the menu.\n3. Run a second full descaling cycle — heavily scaled machines often need two passes.\n4. After descaling, flush the machine with 2–3 full tanks of plain water (use the "hot water" button to dispense).\n5. Check the water hardness setting in the machine menu — if set lower than your actual water hardness, the descale reminder will trigger again too soon. Use the test strip that came with your machine to measure hardness.`,
    technicalDetail: `Jura machines use the CLEARYL / Claris filter system, which both filters water and reduces scale buildup. If a Jura shows the descale indicator even after descaling, verify the Claris filter was properly registered in the machine's maintenance menu — filter tracking and descale tracking are independent. De'Longhi ECAM machines have a water hardness test strip in the original box; the correct hardness level must be programmed in the setup menu or the scale indicator will fire too early. On older Saeco Incanto machines (HD8xxx series), the anti-calc valve is a documented failure mode — it gets stuck open, allowing descaling solution to bypass the boiler and pass straight through. If descaler flows through without cycling, inspect or replace the anti-calc valve.`,
    diy: 'diy',
  },
  {
    id: 'superauto-milk-system',
    title: 'Milk system not frothing, blocked, or producing watery foam',
    category: 'steam',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Cappuccino or latte has no foam or only thin, flat foam',
      'The milk carafe makes noise but produces mostly cold liquid',
      'Machine shows a milk system cleaning error or "clean milk" message',
      'Milk foam is inconsistent — thick some days, absent others',
    ],
    summary: 'The milk system — carafe, LatteGo unit, or auto-frother — is blocked with dried milk protein. This is the most common maintenance failure on machines with automatic milk systems.',
    cause: 'Milk proteins denature and dry solid inside the carafe, mixing tube, and steam circuit within hours of use if not rinsed. Even skipping one post-use clean cycle can leave a partial blockage that builds with each subsequent use.',
    solution: `1. Always run the auto-rinse immediately after every milk drink — when the machine prompts "clean milk system," do it right then, not later.\n2. Remove and fully disassemble the milk carafe or LatteGo unit. Soak all parts in warm water with a dishwasher tablet or a Rinza/milk cleaner tablet for 30 minutes.\n3. Run the manual milk cleaning cycle from the machine menu (usually under "Maintenance" → "Clean milk system").\n4. Locate the small mixing chamber or venturi nozzle — use a thin pin or the cleaning pin that came with your machine to clear any visible blockage.\n5. On Saeco classic steam carafes: the rubber tip at the end of the steam wand tip is the most common blockage point — remove and soak separately.\n6. If cleaning doesn't restore frothing: run a descaling cycle — scale buildup inside the steam circuit reduces steam pressure enough to prevent proper frothing.`,
    technicalDetail: `The Philips LatteGo system (3200, 4300, 5400 series) is fully dishwasher-safe and the easiest home milk system to maintain. If a LatteGo still doesn't froth after cleaning, check: (1) worn AquaClean filter reducing steam pressure, (2) cracked spout seal, (3) residue in the mixing nozzle's narrow slot. The Jura Fine Foam (FF) unit uses a micro-mesh screen that is delicate — never use a metal brush or the mesh will deform and require replacement. On De'Longhi PrimaDonna models with the LatteCrema Hot system, the internal mixing valve behind the front panel is a documented blockage point that typically requires service-level disassembly to clear properly.`,
    diy: 'diy',
  },
  {
    id: 'superauto-grounds-in-cup',
    title: 'Coffee grounds appearing in the cup',
    category: 'seals',
    tiers: ['home-superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Fine coffee grounds or grit visible in the bottom of the cup',
      'Gritty mouthfeel when drinking',
      'Muddy sediment settles at the bottom of a cooled cup',
      'Problem has been gradually getting worse over time',
    ],
    summary: 'Grounds in the cup typically indicate a blown seal, a cracked filter screen inside the brew unit, or a grind that is too fine for the screen to contain.',
    cause: 'The brew unit contains a stainless mesh filter screen and rubber O-rings that harden and degrade from heat over time. A worn or cracked mesh allows fine particles through. A poorly-seated brew unit or cracked lower piston are also causes.',
    solution: `1. Remove the brew unit and hold the filter screen up to a light source — look for holes, tears, or crushed areas in the mesh.\n2. If the screen is intact, inspect the rubber O-rings on the brew unit pistons — they should be soft and round, not cracked, flattened, or missing.\n3. Try coarsening the grind one step — if grounds in cup disappear, the grind was too fine for the current screen condition.\n4. Replace the brew unit O-ring seal kit: De'Longhi ~$8–$12 on Amazon; search "[your model] brew unit seal kit." Watch a YouTube guide for your exact model before starting.\n5. If the mesh screen itself is torn, the brew unit will need replacement ($40–$80 depending on model).`,
    technicalDetail: `The lower seal kit for De'Longhi ECAM machines (Magnifica/PrimaDonna series) contains 5 O-rings of varying sizes — the critical ones are the large flat washer seal around the filter screen perimeter and the two shaft O-rings on the piston rod. Failure of any of these allows grounds to bypass the mesh. On Jura machines, the brew group is a sealed unit that end-users cannot fully disassemble — grounds-in-cup on a Jura almost always requires a replacement brew group from an authorised Jura service dealer. On Saeco/Philips machines, first check the bypass doser chute: if this chute is clogged and overflows, loose coffee can reach the spout without going through the brew unit at all.`,
    diy: 'intermediate',
  },
  {
    id: 'superauto-error-code',
    title: 'Error code on display or machine refuses to brew',
    category: 'electronics',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine shows an error symbol, blinking light pattern, or error number',
      'Machine powers on but will not start a brew cycle',
      'Machine continuously restarts or displays a persistent service message',
      'A specific component — grinder, milk, water — is flagged as erroring',
    ],
    summary: 'Error codes on home superautos almost always indicate a maintenance task, a sensor trigger, or a component that needs cleaning — not an electronic failure. Most are user-resolvable.',
    cause: 'The machine monitors water level, brew unit position, drip tray level, grounds container fill, and bean hopper level via sensors. A dirty sensor contact, slightly mis-seated component, or triggered maintenance reminder puts the machine in a lockout state.',
    solution: `1. Write down the exact error code or description, then search YouTube for "[your machine model] [error code or description]" — most De'Longhi and Jura errors have video walkthroughs.\n2. Common fixes by error type:\n   – "Fill water" with a full tank: remove and reseat the tank; wipe the metal contact pins at the bottom of the tank well with a damp cloth.\n   – "Insert drip tray": push the drip tray fully in and ensure the float inside is lying flat (not stuck in the up position).\n   – "Empty grounds container": empty the grounds container even if it doesn't look full — the counter is separate from the visual fill level.\n   – "Maintenance / cleaning required": run the requested cleaning or descaling cycle from the menu.\n   – "Grinder error" or "no beans": check for a bean jam, refill the hopper, then perform a grinder reset (consult your model's manual).\n3. After resolving the root cause, perform a full restart: unplug for 30 seconds, then power on.\n4. If the same error returns after all maintenance steps: the underlying sensor or component has likely failed — consult a technician.`,
    technicalDetail: `Jura machines feature a self-diagnostic system — E## error codes can be decoded using the free Jura Diagnostics app (iOS/Android), which also displays real-time sensor values and cup counters. De'Longhi ECAM machines use icon-based error states; the service manual for most ECAM models is publicly available via Home-Barista.com and documents every error code and its resolution. The single most misdiagnosed "failure" on De'Longhi Magnifica Evo is the water level reed switch — it detects the float magnet in the tank well. Limescale on the brass contact pins causes a false "no water" reading even with a full tank. Clean the brass pins with a cotton swab moistened with white vinegar, then rinse with plain water.`,
    diy: 'diy',
  },
  {
    id: 'superauto-coffee-temp',
    title: 'Coffee dispenses lukewarm or cooler than expected',
    category: 'boiler',
    tiers: ['home-superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Coffee is noticeably less hot than it used to be',
      'Cup feels only warm, not hot, immediately after dispensing',
      'Machine takes longer than usual to reach ready temperature',
      'Steam or heat noticeably weaker than it once was',
    ],
    summary: 'Low coffee temperature on a home superauto usually means the thermoblock is heavily scaled, the temperature setting is too low, or heat is being lost to a cold ceramic cup.',
    cause: 'Scale inside the thermoblock acts as insulation, reducing heat transfer to the water. The machine\'s temperature setting may have been changed accidentally. Cold ceramic cups steal heat very quickly. Older thermoblocks can also develop partial calcification that persists even after descaling.',
    solution: `1. Check the temperature setting in the machine menu — set it to maximum (usually High or 3/3).\n2. Preheat the cup: use the machine's hot water button to dispense 30–50 ml of hot water into the cup, discard it, then brew your coffee into the warm cup.\n3. Enable cup warming if your machine has a warming plate or tray on top — place cups there for 5 minutes before brewing.\n4. Run a full descaling cycle — heavy thermoblock scale is the most common cause of temperature loss over time.\n5. If temperature doesn't improve after descaling: the thermoblock may need professional cleaning or replacement.`,
    technicalDetail: `Home superauto machines use a single thermoblock rather than a traditional boiler — it heats water rapidly but has less thermal mass, making them more susceptible to cold-cup temperature loss. On De'Longhi ECAM machines, the coffee temperature PID setpoint is accessible via the service menu (hold the "?" info button while powering on) — the factory default is usually 92°C and can be increased to 96°C for hotter output. On Jura machines, the "Aroma G3" thermoblock pre-heats to a precise target temperature before brewing — if the thermoblock is scaling, the machine will still report "ready" but actual water temperature at the spout will be several degrees lower due to scale insulation. Replacing a De'Longhi Magnifica thermoblock is a $30–$50 part but requires nearly full machine disassembly; book this as a service repair.`,
    diy: 'diy',
  },

  // ─────────── PROFILING ───────────
  {
    id: 'profiling-gear-pump',
    title: 'Gear pump profiling mod — setup and troubleshooting',
    category: 'profiling',
    tiers: ['prosumer', 'highend'],
    difficulty: 'advanced',
    symptoms: [
      'Machine uses a gear pump mod but extraction profiles are not matching the intended curve',
      'Pump bracket doesn\'t fit correctly or vibrates excessively',
      'Flow sensor readings don\'t match expected values',
      'Reed switch / lever position detection not triggering correctly',
    ],
    summary: 'Gear pump profiling mods replace the stock vibratory pump with a gear pump controlled by a custom PCB, enabling variable flow rate and pressure profiling. Troubleshooting these mods requires both mechanical and electronics skills.',
    cause: 'Bracket misalignment; incorrect flow sensor selection or calibration; loose reed switch placement; pump bracket clearance issues; firmware not configured for the installed sensor type.',
    solution: `1. Verify the pump bracket seats flush and level — the gear pump must be oriented correctly relative to the chassis.\n2. Confirm the reed switch (lever position sensor) is positioned close enough to the trigger magnet (typically 3–5mm gap).\n3. Check that the flow sensor type matches the firmware configuration (Gicar, Digmesa, Sensirion, or Keyence will each have different pulse/liter ratios).\n4. Test the gear pump in isolation by applying rated voltage directly and verifying smooth rotation.\n5. Calibrate the flow sensor by running a known volume of water and adjusting the pulse-per-liter constant in firmware.`,
    technicalDetail: `Gear pump profiling for the La Marzocco Linea Mini (LMLM AV-ABR mod) is the flagship project of the LMPP Discord community. Key resources:\n- **Home-Barista.com thread**: t94556 — "La Marzocco Linea Mini AV-ABR Gear Pump Profiling Mod"\n- **LMPP Discord** (invite-only): #general channel has 100s of messages on bracket design, sensor selection, and firmware\n- **WE Coffee Co. YouTube**: video demonstrating the mod with Acaia Lunar Brew integration\n- **Firmware / kaffee-netz.de**: LMLM firmware download documented in the LMPP Discord\n\nInspired by the Gaggiuino project (open-source profiling for Gaggia machines), which itself was inspired by the Decent DE1. The Strada EP from La Marzocco and the Decent DE1 remain the commercial/prosumer benchmarks for flow profiling capability.\n\nThe Lelit Bianca uses a similar paddle-wheel approach for flow profiling — community member Magnus has documented the GS3 AV APEC SoM adaptation, noting that the GS3 is easier to work on than the Bianca for this type of modification.`,
    diy: 'tech',
  },

  // ─────────── PUMP IDENTIFICATION GUIDE ───────────
  {
    id: 'pump-identification-guide',
    title: 'Identifying and sourcing the right replacement pump',
    category: 'pump',
    tiers: ['prosumer', 'mid', 'highend', 'all'],
    difficulty: 'beginner',
    symptoms: [
      'Need to replace the pump but unsure which model to order',
      'Replacement pump arrived but fittings or orientation do not match',
      'Looking for an upgrade from vibratory to rotary pump',
      'Pump label is worn or unreadable',
    ],
    summary: 'Espresso machines use either vibration (ULKA/Invensys) pumps or rotary pumps. Ordering the wrong model is the most common sourcing mistake — identifying your pump type and fitting size before ordering saves time and money.',
    cause: 'Two main pump families: vibration pumps (ULKA EX5, EP5, EX4, EP4) and rotary pumps (Fluid-o-Tech, Procon). Fitting orientation (vertical, horizontal, angled) varies by machine. Wattage and voltage must match your region.',
    solution: `1. **Locate the pump label**: Open the machine and look for a white or silver label on the pump body. You need the model number (e.g., "ULKA EX5", "EP5", "E Type").
2. **Measure fittings**: Note the inlet and outlet fitting size. Most home/prosumer machines use 1/8" BSP or push-fit barb fittings. Commercial rotary pumps often use 3/8" NPT or 1/4" BSP.
3. **Check orientation**: Vibration pumps install vertically (most common) or horizontally. The pump head must face the same direction as the original.
4. **Verify voltage and wattage**: Match exactly — 120V/60Hz for North America, 220-240V/50Hz for Europe. Most home machine vibratory pumps are 48W (EX5) or 70W (EP5).
5. **Order from a known supplier**: Espresso Parts, Chris Coffee, Whole Latte Love, or the manufacturer's authorized parts distributor. Avoid generic pumps with no brand markings.`,
    technicalDetail: `**ULKA EX5 vs EP5**: The EX5 is the standard pump in most home and prosumer machines (48W, single-phase, 230V or 120V). The EP5 is a higher-power variant (70W) used in higher-volume machines. They are physically interchangeable if the fittings match, but the EP5 produces slightly more pressure — avoid in machines calibrated for lower pressure unless you plan to recalibrate the OPV.

**Brass vs. plastic fittings**: Pumps come with either brass or nylon/plastic push-fit barb connections. Both are reliable, but plastic fittings are more fragile during installation — use compression fittings where possible.

**Rotary pump upgrades**: Fluid-o-Tech POMS series (200/300/400 series) are the standard upgrade for home prosumer machines. Rotary pumps produce lower noise, more consistent pressure, and longer service life, but require a separate motor, additional plumbing, and a pressure-limiting valve or OPV calibration.

**Where to source**: For North American buyers, Espresso Parts Northwest (espressoparts.com) and 1st-line Equipment carry genuine ULKA and Fluid-o-Tech pumps. For European buyers, Espresso Outlet UK and Coffee Parts Europe carry the same.`,
    diy: 'intermediate',
  },

  // ─────────── STEAM DIAGNOSIS FLOWCHART ───────────
  {
    id: 'steam-diagnosis-flowchart',
    title: 'Steam system diagnosis: nozzle, valve, or boiler?',
    category: 'steam',
    tiers: ['prosumer', 'mid', 'highend', 'all'],
    difficulty: 'intermediate',
    symptoms: [
      'Steam is weak, intermittent, or absent — unsure where to start diagnosis',
      'Machine produces steam but pressure seems lower than it should be',
      'Steam works sometimes but cuts out during use',
      'Steam wand drips or leaks when the valve is closed',
    ],
    summary: 'Steam problems can originate at four points: the nozzle tip, the steam valve, the steam boiler or thermoblock, or the machine\'s heating control. Accurate diagnosis before replacing parts saves time and money.',
    cause: 'The most common cause is a clogged nozzle tip (blocked by dried milk or scale). Second most common is a failing steam valve (solenoid or manual). Boiler or thermoblock scale is a distant third in properly maintained machines.',
    solution: `**Step 1 — Test with no portafilter (open wand test)**
Turn on the steam wand with nothing attached to the tip. If steam flows freely with good pressure, the problem is in the nozzle or milk path — not the valve or boiler.

**Step 2 — Check the nozzle tip**
Remove the nozzle tip (usually unscrews counter-clockwise). Soak in a cup of hot water mixed with Cafiza/Puro Caff for 10–15 minutes. Rinse and reinstall. Test again.

**Step 3 — If no improvement, test the steam valve**
With nozzle removed, open the steam valve. If steam flows strongly: nozzle clog was the cause — replace nozzle. If steam is still weak: valve or boiler issue.

**Step 4 — Check steam valve function**
For solenoid valves: listen for a click when the steam button is pressed. No click = electrical fault or failed solenoid. Click but no flow = valve plunger stuck or scale-blocked.
For manual valves: check for wear or damaged O-rings inside the valve body — these can prevent full opening.

**Step 5 — Check boiler temperature**
On machines with a pressure gauge, verify the steam boiler reaches its rated pressure (typically 1.0–1.5 bar). If pressure is consistently below 0.8 bar: thermostat/pressurestat may be failing or set too low.`,
    technicalDetail: `**Solenoid valve testing**: Disconnect the solenoid coil wires and test resistance with a multimeter. Most steam solenoids read 10–30Ω. An open circuit (infinite resistance) means the coil is burned out and needs replacement.

**Scale inside the steam boiler**: On machines with accessible boilers, scale accumulation on the heating element reduces heat transfer. This presents as a machine that reaches correct boiler pressure slowly or struggles to maintain pressure during extended steaming. Running a citric acid descale cycle addresses this without disassembly.

**Thermoblock steam issues**: Thermoblock machines (e.g., most DeLonghi home automatics) heat water on-demand. If the thermoblock is scaled, steam output will degrade gradually. These machines almost always need a descale before component replacement.

**Pressurestat vs. PID control**: On older prosumer machines (Rancilio Silvia, early Gaggia Classic), the steam boiler is controlled by a pressurestat. If the pressurestat is set too low or is drifting, steam pressure will be inadequate — adjust or replace. PID-controlled machines need the PID steam setpoint verified.`,
    diy: 'intermediate',
  },

  // ─────────── ERROR CODE GUIDE ───────────
  {
    id: 'error-code-guide',
    title: 'Understanding espresso machine error codes and alarm lights',
    category: 'electronics',
    tiers: ['superauto', 'home-superauto', 'mid', 'prosumer'],
    difficulty: 'beginner',
    symptoms: [
      'Machine displays a numeric error code (e.g., E1, 8, A05)',
      'Lights are flashing in an unusual pattern',
      'Machine has stopped working and shows symbols you don\'t recognize',
      'Machine enters a descale or rinse cycle repeatedly and won\'t exit',
    ],
    summary: 'Error codes and alarm lights are the machine\'s way of communicating a specific fault. Most codes point to either a maintenance task (descale needed, tray full) or a hardware failure (sensor, pump, or heating element). Looking up the specific code before attempting repairs is essential.',
    cause: 'The code source depends on the manufacturer. Jura uses single-digit numeric codes and text messages. DeLonghi uses "AL" prefix codes. Breville uses "C" prefix codes. Saeco/Philips use blinking light patterns. Always check the manual first.',
    solution: `**Step 1 — Note the exact code or light pattern**
Write down exactly what you see: the number, letter prefix, and any accompanying symbols. For blinking lights, count the blink sequence (e.g., "3 fast blinks, pause, 2 slow blinks").

**Step 2 — Check the machine manual**
The manual typically has a troubleshooting section that maps error codes to causes. Download your manual from the manufacturer's website if you don't have it.

**Step 3 — Run maintenance tasks first**
About 80% of error codes on super-automatic machines are cleared by:
- Emptying and reinserting the drip tray and grounds container
- Completing a descale cycle (if descale indicator is on)
- Running the rinse/purge cycle
- Cleaning the brew unit (remove, rinse under water, reinsert)

**Step 4 — Look up brand-specific codes**
Common codes by brand:
- **Jura**: E1 = grinder blocked; E8 = coffee grounds dispenser blocked; A1 = no water; A3 = descale required
- **DeLonghi Magnifica/Perfecta**: AL1 = descale; AL2 = water tank empty; AL3 = waste container full; AL6 = coffee unit fault
- **Breville**: Clean/descale alerts are displayed as text; hardware faults show as "C" codes in service mode
- **Saeco/Philips**: Blinking red/orange lights indicate maintenance needs; see your model's specific pattern chart

**Step 5 — If code persists after maintenance**
A code that reappears immediately after clearing maintenance tasks indicates a hardware fault. Common hardware failures by code type: flow sensor failure, temperature sensor failure, pump failure, brew unit motor failure. These require component testing or professional service.`,
    technicalDetail: `**Error code vs. maintenance alert distinction**: True error codes indicate hardware failure and require component testing. Maintenance alerts (fill water, empty grounds, descale) are normal and expected — they clear once the task is completed.

**Jura service codes**: Jura machines have a hidden service mode accessible by holding specific button combinations. In service mode, raw sensor readings and component test functions are available. The Jura J.O.E. app (iOS/Android) can also read connected machine status and error history on WiFi-enabled models.

**DeLonghi Dinamica/PrimaDonna codes**: These machines use a large display with text descriptions. If the text is cut off, cycle through the menus to read the full message. DeLonghi's service documentation (available from authorized dealers) maps AL codes to specific sensor and actuator failures.

**PCB fault codes**: When a code appears that is not in the manual and doesn't clear with maintenance, the PCB (main control board) itself may be logging a diagnostic fault. On some Saeco and Jura models, the error code log can be read with a service cable connected to a PC. This is typically done by authorized service centers only.`,
    diy: 'beginner',
  },

  // ─────────── LEAK DETECTION GUIDE ───────────
  {
    id: 'leak-detection-guide',
    title: 'How to find and diagnose internal espresso machine leaks',
    category: 'seals',
    tiers: ['home', 'mid', 'prosumer', 'commercial'],
    difficulty: 'intermediate',
    symptoms: [
      'Water pooling under or inside the machine',
      'Machine leaving a wet trail or dripping during brewing',
      'Water level dropping faster than normal without visible output',
      'Scale or corrosion staining on internal components',
      'Machine trips GFCI or shows electrical issues after leak starts',
    ],
    summary: 'Internal leaks are almost never "just the gasket." There are five common leak origins: group head gasket, hose fittings, boiler fittings, pump head, and solenoid valve body. Finding the exact source before replacing parts saves time and money.',
    cause: 'Leaks originate from worn seals, cracked hoses, corroded fittings, or failed solder joints on the boiler. The group head gasket is the most common failure on machines over 5 years old, but it accounts for maybe 30% of leaks — hose and fitting failures are equally common and often misdiagnosed.',
    solution: `**Step 1 — Run the machine and observe with the housing removed**
Remove the top and/or side panels (unplug first, then replug to run). Use a flashlight and watch the machine during a brew cycle. Look for: drips, mist, or wet spots that appear during pump activation or steam.

**Step 2 — Identify the leak timing**
- Leak only during brewing (pump active) → pump, group head, solenoid valve, or pressure hoses
- Leak only during steam → steam valve, steam wand fitting, or steam boiler fitting
- Continuous slow drip when idle → check valve failure or solenoid not seating properly
- Leak from bottom only → lower hose fitting, pump base, or boiler drain fitting

**Step 3 — Common leak locations to check first**
1. **Group head gasket**: The rubber ring between the group head and portafilter. Squeeze the portafilter — if you can wiggle it up slightly or water drips around the seal ring, it's due.
2. **Hose barb fittings**: Braided hoses press onto plastic or brass barbs. These crack and leak at the clamp point. Run your finger along every hose joint during operation.
3. **Boiler inlet/outlet fittings**: Threaded fittings into the boiler body. Look for white mineral deposits (crystallized scale) around the joint — this indicates a slow ongoing leak.
4. **Pump head body**: The pump has inlet and outlet ports. If the pump body is cracked or the fittings are loose, water will drip from the pump itself during operation.
5. **Solenoid valve body**: The 3-way solenoid valve can crack or leak around its body seam on older machines.

**Step 4 — Use paper towels to isolate the source**
Dry all components before running the machine. Then run a brew cycle and immediately check each component area with dry paper towel. The first wet spot locates the leak.

**Step 5 — Assess repair difficulty**
- Group head gasket: DIY-friendly, $3–8 part, 30-minute job
- Hose replacement: DIY-friendly, $5–15 per hose, requires correct ID/OD sizing
- Boiler fitting: intermediate — thread sealant or fitting replacement, may need boiler removal
- Boiler itself (cracked): professional repair or boiler replacement`,
    technicalDetail: `**Pressure testing**: A pressure gauge with a portafilter blank (blind basket) can verify the pump is reaching spec (8–9 bar for espresso machines). If pressure is low AND there's a leak, fix the leak first — pressure loss and leaks can compound each other.

**Hose sizing**: Espresso machine hoses are typically 8mm or 10mm ID silicone or EPDM. When replacing, match the inner diameter exactly. "Close enough" fittings will fail under pressure. Source replacement hoses from espresso parts suppliers rather than hardware stores — food-grade silicone rated to 180°C is required.

**Thread sealant on boiler fittings**: Use food-safe PTFE thread tape or pipe sealant. Standard hardware store PTFE tape is acceptable for cold water fittings but may need multiple wraps for steam pressure fittings. Do not overtighten brass-to-brass fittings — hand-tight plus 1–2 turns is usually correct.

**Water damage to electronics**: If a leak has been ongoing, inspect the PCB and wiring harness for corrosion. White or green deposits on connectors indicate water contact. Clean with isopropyl alcohol and check for broken insulation on wires near the leak path.`,
    diy: 'intermediate',
  },

  // ─────────── DESCALING COMPLETE GUIDE ───────────
  {
    id: 'descaling-complete-guide',
    title: 'Complete descaling guide: solutions, frequency, and full procedure',
    category: 'maintenance',
    tiers: ['home', 'home-superauto', 'mid', 'prosumer', 'superauto'],
    difficulty: 'beginner',
    symptoms: [
      'Machine is running a descale alert or indicator light',
      'Shot extraction is slower than normal (taking 40+ seconds)',
      'Steam output has decreased noticeably',
      'Machine is louder than usual during pump operation',
      'Water flow appears restricted or inconsistent',
    ],
    summary: 'Descaling removes calcium and magnesium scale deposits from the boiler, heating element, thermoblock, and internal plumbing. Scale is the #1 cause of preventable machine failure. A proper descale takes 30–60 minutes and should be done every 2–3 months in hard water areas.',
    cause: 'All water contains dissolved minerals. When water is heated repeatedly, these minerals precipitate out and adhere to heating surfaces. Scale insulates the heating element (causing higher energy use and slower heat-up), restricts water flow through small passages, and eventually causes heating element failure if left untreated.',
    solution: `**Step 1 — Choose the right descaling solution**
Use a food-safe, espresso-machine-rated acid solution. Recommended options:
- **Citric acid** (cheapest): 15–20g dissolved in 1 liter of water. Effective on light-to-moderate scale.
- **Brand-specific descalers** (DeLonghi EcoDecalk, Jura descaler, Breville Descaler): Pre-measured, pH-balanced for their machines. Use these if your warranty requires it.
- **Avoid**: White vinegar (too mild, leaves smell), generic household descalers (may damage rubber seals).

**Step 2 — Check your machine's descale procedure**
Most super-automatic machines have a guided descale mode (enter via menu or button combination). Follow the on-screen prompts exactly — these cycles are timed to flush different parts of the machine sequentially.

For machines without a guided cycle (manual espresso machines):
1. Fill the tank with descaling solution
2. Run water through the group head in 30-second intervals with 30-second pauses
3. Run water through the steam wand the same way
4. Alternate until tank is empty

**Step 3 — Rinse cycle (critical)**
After descaling, run 2–3 full tanks of fresh water through the machine to flush all acid residue. For super-automatics, use the built-in rinse program if available. Taste a shot of water — if it tastes acidic, rinse again.

**Step 4 — Verify results**
After descaling, extraction time should return to normal (25–30 seconds for a double shot). Steam should be noticeably stronger. If performance doesn't improve, consider whether the machine has advanced scale buildup requiring disassembly and manual cleaning of components.

**Step 5 — Set your next reminder**
- **Soft water areas** (< 7 gpg hardness): Every 3–4 months
- **Medium water** (7–15 gpg): Every 2–3 months
- **Hard water** (> 15 gpg): Monthly, or use a water filter/softener
- Use distilled or filtered water to extend intervals`,
    technicalDetail: `**Why citric acid works**: Calcium scale (CaCO₃) and magnesium scale react with citric acid to form soluble citrate salts that flush out with water. The reaction is: CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂. Concentration matters — too weak (< 10g/L) won't dissolve heavy scale; too strong (> 30g/L) risks damaging rubber seals over time.

**Thermoblock vs. boiler descaling**: Thermoblocks (used in most home super-automatics) are narrow-channel heat exchangers with very little capacity for scale before flow is impacted. They scale faster than boilers and respond well to regular light descaling. Traditional boilers have more volume and can tolerate more scale before performance degrades, but scale on the heating element causes more damage there.

**When descaling isn't enough**: If the machine has never been descaled and is several years old, a single descale cycle may not fully remove heavy buildup. Running 2–3 consecutive descale cycles (with full rinse between each) is sometimes needed. For machines with completely blocked thermoblock passages or a scaled-up heating element, mechanical removal or part replacement may be required.

**Water hardness testing**: Test strips (pool test strips work) or digital TDS meters let you measure your water hardness. TDS of 50–150 ppm is ideal for espresso. Above 200 ppm is hard water that scales quickly. Many coffee purists use a 50/50 blend of filtered and tap water.`,
    diy: 'beginner',
  },

  // ─────────── PROFESSIONAL TUNE-UP GUIDE ───────────
  {
    id: 'professional-tuneup-guide',
    title: 'What a professional espresso machine tune-up includes',
    category: 'maintenance',
    tiers: ['home', 'mid', 'prosumer', 'commercial'],
    difficulty: 'beginner',
    symptoms: [
      'Machine is several years old and has never been professionally serviced',
      'Shot quality has gradually degraded despite home maintenance',
      'Machine is making unusual noises during operation',
      'You\'re unsure whether your machine is running safely',
      'Preparing to sell the machine and want it in top condition',
    ],
    summary: 'A professional tune-up goes beyond descaling and includes mechanical inspection, seal replacement, calibration, and deep cleaning of components that can\'t be accessed during home maintenance. Most machines benefit from a professional service every 12–24 months depending on usage.',
    cause: 'Home maintenance (descaling, backflushing, cleaning the steam wand) keeps the accessible parts clean but doesn\'t address wear in seals, calibration drift in the OPV, scale in the boiler that requires manual scraping, or electrical connections that corrode over time.',
    solution: `**What a typical professional tune-up includes:**

**Mechanical inspection**
- Group head seal and shower screen replacement (done every service regardless of condition)
- Steam wand O-ring and tip inspection
- Check valve inspection (prevents backflow into the pump)
- Pump pressure test and measurement (target: 8–9 bar at the group)
- OPV (over-pressure valve) calibration — most machines drift 0.5–2 bar over time

**Cleaning**
- Manual descale of boiler interior if accessible (removes scale that flush cycles don't reach)
- Group head soaking and ultrasonic cleaning of screens and diffusers
- Steam wand ultrasonic cleaning (milk proteins build up inside the wand)
- Drip tray and drain path cleaning
- Exterior cleaning and polishing

**Electrical / safety checks**
- Inspect wiring harness for wear, heat damage, or rodent damage
- Test heating element resistance (should be 20–50Ω for most home machines)
- Inspect PCB capacitors (bulging caps are a common failure mode)
- Verify thermostat / pressurestat / PID is operating within spec

**Calibration**
- Set OPV to correct brew pressure for the machine type
- For PID machines: verify temperature accuracy with a calibrated probe
- For grinders: set burr alignment and calibrate grind for standard shot time

**How often?**
- Casual home use (1–2 shots/day): Every 18–24 months
- Moderate home use (3–5 shots/day): Every 12 months
- Office or light commercial use: Every 6 months
- High-volume commercial: Every 3–6 months`,
    technicalDetail: `**OPV calibration detail**: The over-pressure valve limits maximum brew pressure. Stock settings are often 9–12 bar from the factory; serious home baristas typically set this to 8–9 bar. The OPV is adjusted with a spring-loaded screw — one quarter turn changes pressure by roughly 0.5 bar. Always verify with a calibrated pressure gauge (or portafilter gauge) after adjustment.

**Pump pressure vs. OPV setting**: The pump generates pressure, the OPV limits it. If you measure low pressure (6–7 bar) and the OPV is set correctly, the pump itself may be worn. Ulka pumps (standard in most home machines) typically last 3,000–5,000 brew cycles — roughly 5–10 years of average home use.

**Group head seal replacement intervals**: Natural rubber group gaskets harden and compress over time, eventually leaking. Silicone gaskets last longer but are more expensive. Replacing the group gasket every 12–18 months is inexpensive (typically $5–10) and prevents leaks from developing. Waiting until the machine leaks means the gasket has been creating a poor seal for an unknown period.

**Cost expectations**: A professional tune-up at an authorized service center typically costs $100–200 for a home machine, $150–300 for a prosumer machine, and $250–500 for commercial equipment. Parts (seals, group gasket) are usually $20–40 additional. Total cost of ownership is much lower with regular service versus waiting for a major failure.`,
    diy: 'beginner',
  },

  // ─────────── GRINDER DIAGNOSIS GUIDE ───────────
  {
    id: 'grinder-diagnosis-guide',
    title: 'Diagnosing built-in espresso grinder problems: motor vs. burrs',
    category: 'grinder',
    tiers: ['home-superauto', 'mid', 'prosumer', 'superauto'],
    difficulty: 'intermediate',
    symptoms: [
      'Grinder is making an unusual grinding or squealing noise',
      'Grind output is inconsistent or has coarse chunks',
      'Grinder runs but produces little or no grounds',
      'Grinder stalls or stops mid-grind',
      'Coffee tastes different despite no change in settings',
    ],
    summary: 'Built-in grinder problems fall into three categories: burr wear (poor grind quality), burr blockage (stall or jam), and motor failure (no movement). The diagnosis approach is different for each. Most built-in grinder issues are user-serviceable with basic tools.',
    cause: 'Burrs wear gradually over millions of rotations. For most home users, this takes 5–10 years of regular use. Blockages happen when beans jam between the burr and housing — often after grinding oily, dark-roast beans or foreign objects accidentally enter the hopper. Motor failures are less common and usually present as a complete loss of grinder function.',
    solution: `**Step 1 — Identify the symptom category**

**Grinder runs but output is inconsistent or coarse:**
This is typically a burr issue. Check:
- Are you grinding at the correct setting for espresso (fine)?
- When did you last clean the burr chamber? Built-up coffee oils can cause inconsistent grinding.
- Have you recently switched bean types? Oily dark roasts affect grinding differently than light roasts.

**Grinder stalls or jams:**
1. Remove the bean hopper if possible
2. Use a thin tool (wooden chopstick, not metal) to check for a bean stuck in the grinding chamber
3. On super-automatics: remove and clean the brew unit, then test — brew unit blockages can back-pressure the grinder
4. If the grinder jams repeatedly with normal beans: check burr gap alignment

**Grinder runs but produces no coffee:**
Check whether the grinder path is clear from hopper to brew unit. On Jura and DeLonghi super-automatics, the ground coffee chute can become completely blocked with compacted old coffee — remove the brew unit and clear the chute.

**No movement, no sound:**
- Check for error codes on the display (see error-code-guide)
- Test whether the machine responds to other commands (heating up, etc.)
- If the machine is otherwise functional, the grinder motor may have failed

**Step 2 — Burr cleaning procedure**
1. Empty the hopper completely
2. Run a few cycles with a commercial grinder cleaner tablet (Grindz or equivalent) — this absorbs oils and clears fine coffee dust
3. For accessible burrs (prosumer machines): remove the top burr carrier, brush off grounds, and wipe the burr faces with a dry cloth
4. Do not use water to clean burrs — moisture causes rust and grounds to clump

**Step 3 — Motor vs. burr determination**
If the grinder motor runs (you hear it) but output is poor: burr issue.
If the motor doesn't run at all: electrical issue — test for power at the motor connector with a multimeter. If power is present but motor doesn't turn: motor failure. If no power: relay, PCB, or wiring issue.`,
    technicalDetail: `**Burr replacement timing**: Most home machine burrs are rated for 500–800 kg of coffee before significant wear. For a household grinding 250g per week, that's 4–6 years. Worn burrs produce more fines and bimodal particle distribution, which causes bitter, over-extracted shots even at correct settings. A comparison test: grind a small amount and visually inspect — worn burrs produce noticeably more powder (fines) alongside the coarser particles.

**Burr gap calibration (prosumer machines)**: After cleaning or replacing burrs, verify the zero-point calibration — the adjustment at which the burrs just barely touch when rotating. Most machines have a locking collar and reference mark. If the zero point has drifted (common after dropping or forcing the grinder), recalibrate before setting grind size. Incorrect zero-point calibration makes fine adjustment useless.

**Motor testing**: DC grinder motors read 1–10Ω across the brushes when tested with an ohmmeter. An open circuit indicates burned brushes or a failed armature. AC induction motors (less common in home machines) are harder to test without a load — check the capacitor first (capacitor failure causes hum with no rotation in single-phase AC motors).

**Static electricity and grind clumping**: Some grinders produce static-charged grounds that clump together. This is a physical property of the grinder and burr material, not a fault. Remedies include: the Ross Droplet Technique (RDT — adding a few drops of water to beans before grinding), using an anti-static brew cup, or upgrading to a machine with ionizer technology (some Jura models include this).`,
    diy: 'intermediate',
  },

  // ─────────── WHAT HAPPENS IN SERVICE ───────────
  {
    id: 'what-happens-in-service',
    title: 'What happens when you send your espresso machine in for service',
    category: 'maintenance',
    tiers: ['home', 'home-superauto', 'mid', 'prosumer', 'commercial'],
    difficulty: 'beginner',
    symptoms: [
      'Considering professional service and want to know what\'s involved',
      'Wondering why a repair video doesn\'t show every step',
      'Machine returned from service and you want to understand what was done',
      'Comparing DIY repair cost/time against professional service',
    ],
    summary: 'Professional espresso machine service follows a systematic process: intake assessment, diagnosis, repair, calibration, and a final run test before return. Not every step is filmed — some procedures are repetitive or happen on machines belonging to other customers at the same time.',
    cause: 'Understanding the service process helps set expectations for turnaround time, cost, and what you\'ll see in repair videos. Most videos show the diagnosis and the specific repair — not the full cleaning and calibration that happens after every repair regardless of the chief complaint.',
    solution: `**The service process at Kanen Coffee:**

**1. Intake assessment (Day 1)**
Every machine that comes in gets an intake inspection before any work begins:
- Physical inspection (cracks, damage from transit, missing parts)
- Power-on test to reproduce the reported issue
- Water pressure and temperature measurement
- Quick visual inspection of internal components for obvious problems
- Work order created with initial findings

**2. Diagnosis**
For complex issues, diagnosis can take longer than the repair itself:
- Systematic elimination of possible causes
- Component testing (pump, heating element, solenoid valves, sensors)
- This is what most repair videos show — the "detective" phase

**3. Repair**
The actual repair depends on what diagnosis found:
- Parts sourced from our inventory or ordered (parts arrival can add 1–3 days)
- Disassembly to access the failed component
- Replacement or cleaning of the specific part
- Reassembly

**4. Post-repair service (done on every machine)**
Even when the repair is a single part, we do a complete tune-up before return:
- Group head seal replacement
- Full descale cycle
- Backflush cleaning
- Steam wand cleaning and O-ring inspection

**5. Calibration and testing**
- OPV pressure set to spec (8–9 bar)
- Shot extraction timed (target 25–30 seconds for a double)
- Steam output verified
- Any error codes cleared

**6. Final run test**
Machine runs for a full brew and steam cycle before being packaged. Any issue found at this stage goes back to step 3.

**Why not everything is on video:**
- Some repairs are straightforward and show the same steps every time — we prioritize unique or educational content
- Cleaning and calibration steps are repetitive and not filmed on every machine
- Customer privacy — we don't film every machine's condition on intake
- Some repairs happen across multiple machines simultaneously`,
    technicalDetail: `**Turnaround time expectations**: Simple repairs (group gasket, thermostat, pump) typically complete in 1–3 business days once parts arrive. Complex PCB repairs, boiler replacements, or machines requiring multiple ordered parts can take 5–10 business days. Machines needing manufacturer-only parts (some Jura and Miele components) may take 2–3 weeks for parts arrival.

**Repair vs. replace economics**: For machines where repair cost exceeds 60–70% of replacement cost, we discuss the options with the customer before proceeding. A 10-year-old home machine worth $200 used may not justify a $150 repair for a PCB failure, but a $2,000 prosumer machine is worth repairing almost regardless of cost.

**Warranty on repairs**: Professional repairs typically carry a 90-day warranty on parts and labor for the specific component repaired. General wear items (group gaskets, hoses) replaced during service are covered for 30 days. The warranty covers the repair — not new problems that develop on other components afterward.

**What "diagnosed and fixed" means in our video titles**: Every video we publish shows a machine that was fully repaired and passed our final run test. The title format "Diagnosed & Fixed" means: we found the root cause, corrected it, and verified the machine works correctly. We don't publish videos on machines with unknown outcomes.`,
    diy: 'beginner',
  },

  // ─────────── WARRANTY & SERVICE INFO ───────────
  {
    id: 'warranty-repair',
    title: 'Warranty service — manufacturer claims & Kanen Coffee 90-day guarantee',
    category: 'maintenance',
    tiers: ['home', 'home-superauto', 'mid', 'prosumer', 'commercial'],
    difficulty: 'beginner',
    symptoms: [
      'Machine is still under manufacturer warranty and needs repair',
      'Looking for warranty service options for your espresso machine',
      'Want to understand what Kanen Coffee\'s 90-day repair guarantee covers',
      'Unsure whether to contact the manufacturer or a local repair shop',
    ],
    summary: 'If your machine is under manufacturer warranty, you may be entitled to free or discounted repair. Kanen Coffee handles warranty service in-house when possible and supports you through the manufacturer process when required. Every Kanen Coffee repair — warranty or not — comes with a 90-day guarantee on the work performed.',
    cause: 'Espresso machines fail for many reasons, and warranty coverage depends on the manufacturer, the age of the machine, and the nature of the failure. Manufacturer warranties typically cover defects in materials and workmanship but exclude damage from lack of maintenance, scale buildup, unauthorized modifications, or normal wear items (group gaskets, seals, filters).',
    solution: `**Step 1 — Check warranty status with the manufacturer**
Contact the manufacturer or check your purchase documentation to verify warranty coverage. Most home machines carry a 1–2 year warranty. Commercial machines may have different terms. You will typically need: proof of purchase (receipt), the machine serial number (usually on a label on the bottom or back), and a description of the problem.

**Step 2 — Contact Kanen Coffee for warranty service**
Whether your machine is in warranty or not, we can help. Bring or ship the machine to us and we will diagnose the issue and advise you on the best path forward — manufacturer warranty claim, in-house repair, or a combination.

**Step 3 — We diagnose and document the issue**
We perform a full diagnostic to identify the root cause. This documentation serves double duty: it guides the repair AND supports a warranty claim if one is needed. We photograph and describe the failure for the manufacturer\'s review.

**Step 4 — Repair handled in-house or manufacturer shipping supported**
For many warranty issues, we can perform the repair ourselves and the manufacturer reimburses the parts. For claims that require returning the machine to the manufacturer, we help you package and ship it, and we track the claim on your behalf.

**Step 5 — Machine tested and returned with 90-day Kanen Coffee guarantee**
Every repair we perform — regardless of warranty status — includes a full test cycle and comes with our 90-day guarantee on the work performed. If the same issue recurs within 90 days, we fix it at no additional charge.`,
    technicalDetail: `**Manufacturer warranty terms (general guidelines — always verify with the manufacturer):**
- **Breville/Sage**: 1-year limited warranty (2 years in EU). Covers manufacturing defects. Scale damage is excluded.
- **DeLonghi**: 1-year limited warranty. Super-automatics often require authorized service center repair.
- **Jura**: 2-year limited warranty. Jura strongly prefers repairs through authorized Jura service partners.
- **La Marzocco**: 2-year warranty on home machines (Linea Mini, Micra). Commercial machines have separate commercial warranty terms.
- **Rancilio**: 2-year warranty (Silvia and Silvia Pro).
- **Gaggia**: 1-year warranty. Gaggia Classic is widely serviced by independent shops.
- **Rocket Espresso**: 2-year warranty. Requires authorized service center for warranty claims.

**What warranty does NOT cover (nearly universal):**
Scale damage from lack of descaling, worn group gaskets and seals, cosmetic damage, damage from unauthorized modifications, damage from using non-approved cleaning products, and normal wear items.

**Kanen Coffee 90-day guarantee details:**
Our guarantee covers the specific repair performed — the parts we replaced and the labor to install them. It does not cover new, unrelated failures on different components. If we replace a pump and it fails again within 90 days, that is covered. If we replace a pump and the heating element fails 60 days later, that is a separate issue and a separate repair.`,
    diy: 'beginner',
  },
  {
    id: 'cleaning-maintenance',
    title: 'Cleaning and maintenance — keeping your machine running',
    category: 'maintenance',
    tiers: ['home', 'home-superauto', 'mid', 'prosumer', 'commercial'],
    difficulty: 'beginner',
    symptoms: [
      'Slow flow or reduced brew pressure that develops gradually',
      'Coffee tastes stale, bitter, or off despite fresh beans',
      'Visible buildup on group head, shower screen, or steam wand',
      'Machine overdue for regular service — unsure what to do',
    ],
    summary: 'Regular cleaning and preventive maintenance is the single most effective way to keep an espresso machine running well and avoid expensive repairs. Most common failures we see in the shop are caused by deferred maintenance, not component defects.',
    cause: 'Coffee oils oxidize and turn rancid inside the brew path. Scale builds on heating surfaces and restricts flow. Milk proteins dry and harden inside steam circuits. Gaskets and seals degrade from heat cycling. All of these happen gradually, which means the taste and performance degrade so slowly that many owners don\'t notice until a failure occurs.',
    solution: `**Daily maintenance (2 minutes)**
- Wipe the group head gasket area with a damp cloth after your last shot
- Purge the steam wand immediately after every milk drink — a 2-second blast of steam clears the tip
- Empty the drip tray and grounds container (super-automatics)

**Weekly maintenance (10 minutes)**
- Backflush with detergent: insert a blind basket, add 1/2 tsp of Cafiza or Puly Caff, run 5 cycles of 10 seconds on / 10 seconds off. Rinse with 5 cycles of plain water. (Only for machines with a 3-way valve — most prosumer and commercial machines)
- Clean the steam wand tip: unscrew and soak in hot water with milk cleaner for 10 minutes
- Wipe down the exterior and drip tray

**Monthly maintenance (30 minutes)**
- Run a full descaling cycle following your machine\'s procedure (see our descaling guide for details)
- Remove and soak the shower screen in group head cleaner
- On super-automatics: run the built-in cleaning cycle with a manufacturer-approved cleaning tablet

**Every 6–12 months (or annually)**
- Replace the group head gasket — even if it\'s not leaking yet, the rubber hardens and a fresh gasket improves seal and extraction consistency
- Clean the shower screen and replace if holes are worn or enlarged
- Lubricate the E61 cam mechanism with food-safe silicone grease (E61 group machines only)
- Lubricate the brew unit guide rails (super-automatics)
- Inspect steam wand O-rings and replace if cracked or stiff
- Check all hoses for cracks, bulging, or hardening — replace any suspect hoses`,
    technicalDetail: `**Cleaning products that work (and ones to avoid):**
Group head cleaners: Cafiza (Urnex), Puly Caff (Puly), JoeGlo — all are espresso-specific alkaline detergents that dissolve coffee oils without damaging metal or rubber. Never use dish soap (leaves residue and can damage seals) or bleach (corrodes metal and is toxic in a food system).

Descalers: Citric acid (food-grade, 15-20g per liter), Dezcal (Urnex), EcoDecalk (DeLonghi), manufacturer-specific descalers for super-automatics. Avoid white vinegar (too mild, leaves lingering taste and smell) and generic household descalers (wrong pH, may damage seals).

Milk cleaners: Rinza (Urnex), Puly Milk — these are alkaline solutions that break down dried milk protein. Hot water alone does not fully dissolve milk protein once it has dried.

**Maintenance schedule impact on machine life:**
A well-maintained prosumer espresso machine (Rancilio Silvia, Gaggia Classic, Breville Dual Boiler) should last 10–15+ years. The same machine with no maintenance typically develops problems within 2–3 years. Commercial machines in cafe environments need daily backflushing and quarterly professional service — most manufacturer warranties require documented maintenance records.

**Super-automatic maintenance notes:**
DeLonghi, Jura, Saeco, and Siemens machines all have built-in maintenance reminders. Follow them. The cleaning tablet cycle is not optional — it removes coffee oil buildup from the brew unit and internal tubing that rinsing alone cannot clear. On Jura machines, the Claris/CLEARYL water filter should be replaced every 50 liters or 2 months (whichever comes first) — the machine tracks usage and prompts for replacement.`,
    diy: 'diy',
  },
];
