#!/usr/bin/env python3
"""
kanen_youtube_core.py
Shared title-cleaning, description-building, and tag logic for the Kanen Coffee
YouTube bulk updater scripts. Imported by both kanen_youtube_updater.py and
kanen_youtube_dryrun.py — edit this file once to update both.
"""

import re

# ── Brand list ────────────────────────────────────────────────────────────────

BRANDS = [
    'Breville', 'DeLonghi', 'Delonghi', 'Saeco', 'Jura', 'Rancilio',
    'Rocket', 'Lelit', 'Gaggia', 'Bezzera', 'Expobar', 'Profitec',
    'Ascaso', 'Zacconi', 'Pasquini', 'La Marzocco', 'Nuova Simonelli',
    'ECM', 'Izzo', 'Quick Mill', 'Victoria Arduino', 'Slayer', 'Synesso',
    'La Pavoni', 'Elektra', 'Isomac', 'Vibiemme', 'Krups', 'Nespresso',
    'Melitta', 'Miele', 'Philips', 'Siemens', 'Bosch', 'Smeg',
]

# ── Problem prefix patterns ───────────────────────────────────────────────────

PROBLEM_PREFIXES = [
    r'^error\s+\d+[-\s]',
    r'^not\s+frothing[-\s]',
    r'^no\s+heat[-\s]',
    r'^no\s+steam[-\s]',
    r'^no\s+pressure[-\s]',
    r'^leaking[-\s]',
    r'^not\s+heating[-\s]',
    r'^low\s+pressure[-\s]',
    r'^milk\s+sensor[-\s]',
    r'^won\'?t\s+\w+[-\s]',
    r'^grinding\s+issue[-\s]',
]

# ── Problem → help.kanencoffee.com deep link mapping ─────────────────────────
# Values: (issue_id, issue_title, help_cta)
# issue_id is the hash fragment on help.kanencoffee.com (e.g. #pump-low-pressure)

PROBLEM_HELP_MAP = {
    'pump':             ('pump-low-pressure',         'Pump failing to build pressure',
                         "Machine not pumping? Our free guide covers the most common causes of pump failure, what to check first, and how to fix it"),
    'pump-noise':       ('pump-noise',                'Loud pump noise or rattling during extraction',
                         "Loud pump noise? Our free guide walks through vibration pump diagnosis and when to replace"),
    'not-heating':      ('boiler-temp',               'Machine not reaching brew temperature',
                         "Machine not heating up? Our free guide covers thermostat, heating element, and SSR diagnosis step by step"),
    'heating-element':  ('electronics-heating-element','Heating element failure',
                         "Heating element gone? Our free guide covers testing and replacing heating elements on espresso machines"),
    'thermostat':       ('electronics-pressurestat',  'Pressurestat or thermostat calibration drift',
                         "Temperature off? Our free guide covers pressurestat and thermostat testing, adjustment, and replacement"),
    'ssr':              ('electronics-ssr',            'Solid state relay (SSR) failure',
                         "SSR issue? Our free guide covers testing and replacing solid state relays on espresso machines"),
    'steam':            ('steam-none',                'No steam or very weak steam output',
                         "Steam wand not working? Our free guide covers every common cause — clogs, failed valves, thermostat issues — and how to fix each one"),
    'leak':             ('seals-internal-leak',       'Internal hose or fitting leak',
                         "Machine leaking? Our free guide covers the most common leak sources — gaskets, seals, portafilter — and how to fix each one"),
    'portafilter-leak': ('group-portafilter-leak',    'Portafilter leaking around the group head',
                         "Portafilter leaking? Our free guide covers group head gasket replacement and portafilter seal diagnosis"),
    'grinder':          ('grinder-motor',             'Grinder motor stalling or not running',
                         "Grinder not working? Our free guide covers motor issues, inconsistent grind, and static — with step-by-step fixes"),
    'descale':          ('boiler-scale',              'Limescale buildup causing heat and flow problems',
                         "Limescale causing problems? Our free guide walks you through the full descaling process and what to do if it doesn't fix it"),
    'solenoid':         ('solenoid-failure',          '3-way solenoid valve failure',
                         "Solenoid valve issue? Our free guide covers testing, cleaning, and replacing 3-way solenoid valves"),
    'error':            ('electronics-pcb',           'PCB or control board failure',
                         "Seeing an error code? Our free guide explains what each code means, what's likely failing, and whether it's a DIY fix or needs a tech"),
    'flow-meter':       ('water-flowmeter',           'Flow meter errors on volumetric machines',
                         "Flow meter issue? Our free guide covers testing and replacing flow meters on volumetric espresso machines"),
    'pressure':         ('boiler-opv',                'OPV misadjusted — pressure too high or too low',
                         "Pressure problem? Our free guide covers OPV adjustment, testing, and diagnosis on espresso machines"),
    'no-flow':          ('group-no-flow',             'Group head dispensing no water or very low flow',
                         "No water from group head? Our free guide covers blockages, solenoid issues, and pump diagnosis step by step"),
    'tune-up':          (None, None,
                         "Want to maintain your machine yourself? Our free troubleshooting hub covers everything from descaling to gasket replacement"),
    'general':          (None, None,
                         "Want to maintain your machine yourself? Our free troubleshooting hub covers everything from descaling to gasket replacement"),
}

# ── Context-specific help link refinements ─────────────────────────────────────
# More specific links based on what we detect in captions
# Format: (problem_type, context_part) → (help_id, title, cta)
# Falls back to PROBLEM_HELP_MAP if no context match found

CONTEXT_HELP_REFINEMENTS = {
    # Solenoid-specific steam links
    ('steam', 'solenoid'): ('solenoid-failure', '3-way solenoid valve in steam circuit',
                            'Solenoid valve not working? Our solenoid-specific guide covers testing and replacement'),
    ('steam', 'steam_wand'): ('steam-none', 'Steam wand clog diagnosis',
                              'Steam wand clogged? Our guide covers nozzle cleaning and unclogging'),

    # Pump-specific refinements
    ('pump', 'pump'): ('pump-low-pressure', 'Pump replacement and pressure testing',
                       'Pump failing? Our pump guide covers diagnosis, replacement, and pressure verification'),

    # Gasket-specific leak links
    ('leak', 'gasket'): ('group-portafilter-leak', 'Group head gasket failure and replacement',
                         'Gasket leak? Our guide walks through gasket replacement step by step'),
    ('leak', 'seal'): ('seals-internal-leak', 'Internal seal and hose failure',
                       'Internal seal leaking? Our guide covers seal replacement and fitting repair'),

    # Heating-specific refinements
    ('not-heating', 'heating_element'): ('electronics-heating-element', 'Heating element failure diagnosis',
                                          'No heat? Your heating element may have failed. See our element testing guide'),
    ('not-heating', 'thermostat'): ('electronics-pressurestat', 'Thermostat calibration and testing',
                                     'Heating issue? Could be your thermostat. See our diagnosis and adjustment guide'),

    # Grinder-specific
    ('grinder', 'grinder'): ('grinder-motor', 'Grinder motor and burr repair',
                             'Grinder not working? Our guide covers motor diagnosis, burr cleaning, and replacement'),

    # Descale-specific
    ('descale', None): ('boiler-scale', 'Full descaling procedure and troubleshooting',
                        'Limescale problems? Our guide covers full descaling, what to do if it doesn\'t work, and prevention'),
}

def select_help_link(problem_type, context=None, brand=None):
    """
    Select the most specific help link based on problem type and caption context.
    Checks for context-specific refinements first, then falls back to general problem type.

    Args:
        problem_type: The detected problem type (e.g., 'pump', 'steam', 'error')
        context: Dict from extract_context_from_captions with parts, actions, error codes, etc.
        brand: The machine brand (for future brand-specific links)

    Returns:
        Tuple of (help_id, issue_title, help_cta) for use in descriptions
    """
    if not context:
        context = {}

    # Check for context-specific refinement
    part_mentioned = context.get('part_mentioned', None)
    if part_mentioned:
        key = (problem_type, part_mentioned)
        if key in CONTEXT_HELP_REFINEMENTS:
            return CONTEXT_HELP_REFINEMENTS[key]

    # Check for problem-type-only refinement (used for descale, etc.)
    key = (problem_type, None)
    if key in CONTEXT_HELP_REFINEMENTS:
        return CONTEXT_HELP_REFINEMENTS[key]

    # Fall back to general problem help map
    return PROBLEM_HELP_MAP.get(problem_type, PROBLEM_HELP_MAP['general'])

# ── Clickable hybrid title hooks ──────────────────────────────────────────────
# {bm} is replaced with "Brand Model" (e.g. "DeLonghi Magnifica S")

TITLE_HOOKS = {
    'pump':             "{bm} Won't Build Pressure? Here's What We Found | Kanen Coffee",
    'pump-noise':       "{bm} Making a Loud Pump Noise — Diagnosed & Fixed | Kanen Coffee",
    'not-heating':      "{bm} Had No Heat at All — The Diagnosis Surprised Us | Kanen Coffee",
    'heating-element':  "{bm} Heating Element Dead — Full Replacement Walkthrough | Kanen Coffee",
    'thermostat':       "{bm} Temperature Way Off — Thermostat Diagnosis & Fix | Kanen Coffee",
    'ssr':              "{bm} SSR Failure — How We Diagnosed & Fixed It | Kanen Coffee",
    'steam':            "{bm} Not Frothing Milk — Diagnosed & Fixed | Kanen Coffee",
    'leak':             "{bm} Leaking Water — Tracked Down the Source & Fixed It | Kanen Coffee",
    'portafilter-leak': "{bm} Portafilter Leaking — Group Head Seal Replacement | Kanen Coffee",
    'grinder':          "{bm} Grinder Issue — Diagnosed & Fixed | Kanen Coffee",
    'descale':          "{bm} Scaled Up Badly — Full Descale & Service | Kanen Coffee",
    'solenoid':         "{bm} Solenoid Valve Failure — Full Repair Walkthrough | Kanen Coffee",
    'error':            "{bm} Error Code — What It Means & How We Fixed It | Kanen Coffee",
    'flow-meter':       "{bm} Flow Meter Issue — Diagnosis & Replacement | Kanen Coffee",
    'pressure':         "{bm} Pressure Problem — OPV Diagnosis & Adjustment | Kanen Coffee",
    'no-flow':          "{bm} No Water from Group Head — Full Diagnosis | Kanen Coffee",
    'tune-up':          "{bm} Full Tune-Up — Everything We Check & Replace | Kanen Coffee",
    'test':             "{bm} Service Complete — Test Shot After Full Tune-Up | Kanen Coffee",
    'general':          "{bm} Full Service & Inspection | Kanen Coffee",
}

# ── Description opening sentences ────────────────────────────────────────────
# {machine} is replaced with the brand name or "espresso machine"

DESCRIPTION_INTROS = {
    'pump':             "This {machine} had zero pump pressure. After repair, here's the post-service test showing the pump working correctly.",
    'pump-noise':       "This {machine} was making a loud rattling pump noise. After service, here's the test showing smooth, quiet operation.",
    'not-heating':      "This {machine} came in completely cold. After repair, here's the test showing proper heating.",
    'heating-element':  "Heating element failed on this {machine}. After replacement, here's the verification test.",
    'thermostat':       "This {machine} had temperature issues. After thermostat service, here's the test showing correct temperature.",
    'ssr':              "SSR failure on this {machine}. After replacement, here's the test confirming normal heating operation.",
    'steam':            "This {machine} had no steam pressure. After service, here's the test showing steam frother working correctly.",
    'leak':             "This {machine} was leaking water. After repair, here's the test showing no leaks under pressure.",
    'portafilter-leak': "This {machine} was leaking from the portafilter. After seal replacement, here's the test showing a dry puck eject.",
    'grinder':          "Grinder issue on this {machine}. After repair, here's the test showing proper grinding and operation.",
    'descale':          "This {machine} was severely scaled. After descaling and service, here's the test showing restored flow and temperature.",
    'solenoid':         "3-way solenoid valve failed on this {machine}. After replacement, here's the test showing correct operation.",
    'error':            "This {machine} had an error code. After diagnosis and repair, here's the test showing error-free operation.",
    'flow-meter':       "Flow meter issue on this {machine}. After repair, here's the test showing accurate dosing.",
    'pressure':         "This {machine} had pressure problems. After OPV adjustment, here's the test showing correct extraction pressure.",
    'no-flow':          "No water flow from the group head on this {machine}. After diagnosis and repair, here's the test showing full flow restored.",
    'tune-up':          "This {machine} received a complete professional tune-up at Kanen Coffee. This clip shows the machine running after service was completed.",
    'test':             "Service complete on this {machine}. Here's the final test shot confirming everything is running correctly.",
    'general':          "This {machine} came through our shop for service. Here's the machine verified working after the work was completed.",
}

# ── Per-brand hashtag sets ────────────────────────────────────────────────────

BRAND_TAGS = {
    'DeLonghi':          '#DeLonghi #DeLonghiRepair #DeLonghiEspresso',
    'Delonghi':          '#DeLonghi #DeLonghiRepair #DeLonghiEspresso',
    'Breville':          '#Breville #BrevilleRepair #BrevilleEspresso',
    'Gaggia':            '#Gaggia #GaggiaRepair #GaggiaEspresso',
    'Jura':              '#Jura #JuraRepair #JuraCoffee',
    'Rancilio':          '#Rancilio #RancilioSilvia #RancilioRepair',
    'La Pavoni':         '#LaPavoni #LaPavoniRepair #LaPavoniEspresso',
    'Saeco':             '#Saeco #SaecoRepair #SaecoEspresso',
    'Rocket':            '#RocketEspresso #RocketEspressoRepair',
    'Pasquini':          '#Pasquini #PasquiniEspresso',
    'Lelit':             '#Lelit #LelitRepair #LelitEspresso',
    'Zacconi':           '#Zacconi #ZacconiEspresso',
    'Quick Mill':        '#QuickMill #QuickMillRepair #QuickMillEspresso',
    'Expobar':           '#Expobar #ExpobarRepair',
    'ECM':               '#ECMEspresso #ECMRepair',
    'Profitec':          '#Profitec #ProfitecRepair #ProfitecEspresso',
    'La Marzocco':       '#LaMarzocco #LaMarzoccoRepair',
    'Isomac':            '#Isomac #IsomacRepair',
    'Bezzera':           '#Bezzera #BezzeraRepair',
    'Elektra':           '#Elektra #ElektraEspresso',
    'Vibiemme':          '#Vibiemme #VibiemmeRepair',
    'Nuova Simonelli':   '#NuovaSimonelli #NuovaSimonelliRepair',
    'Krups':             '#Krups #KrupsRepair',
    'Izzo':              '#Izzo #IzzoEspresso',
    'Ascaso':            '#Ascaso #AscasoRepair',
    'Miele':             '#Miele #MieleRepair',
    'Smeg':              '#Smeg #SmegEspresso',
    'Philips':           '#Philips #PhilipsCoffee',
    'Victoria Arduino':  '#VictoriaArduino',
    'Nespresso':         '#Nespresso #NespressoRepair',
    'Bosch':             '#Bosch #BoschCoffee',
}

# ── Per-problem hashtag sets ──────────────────────────────────────────────────

PROBLEM_TAGS = {
    'pump':             '#PumpReplacement #EspressoPump #NoPressureFix',
    'pump-noise':       '#PumpNoise #EspressoPump #LoudPumpFix',
    'not-heating':      '#NoHeatFix #HeatingRepair #EspressoHeating',
    'heating-element':  '#HeatingElementReplacement #EspressoHeating #NoHeatFix',
    'thermostat':       '#ThermostatReplacement #EspressoTemperature',
    'ssr':              '#SSRReplacement #EspressoElectronics',
    'steam':            '#SteamWandFix #MilkFrotherFix #SteamRepair',
    'leak':             '#LeakRepair #EspressoLeak #GasketReplacement',
    'portafilter-leak': '#PortafilterLeak #GroupHeadGasket #EspressoLeak',
    'grinder':          '#GrinderRepair #EspressoGrinder #GrinderFix',
    'descale':          '#Descaling #EspressoMaintenance #DescaleGuide',
    'solenoid':         '#SolenoidValve #EspressoValve #SolenoidRepair',
    'error':            '#ErrorCode #EspressoError #ErrorFix',
    'flow-meter':       '#FlowMeter #VolumetricRepair #EspressoFlow',
    'pressure':         '#PressureFix #OPVAdjustment #EspressoPressure',
    'no-flow':          '#GroupHeadRepair #NoWaterFix #EspressoFlow',
    'tune-up':          '#EspressoTuneUp #EspressoMaintenance #ProsumerEspresso',
    'test':             '#TestShot #EspressoService #AfterRepair',
    'general':          '#EspressoService #EspressoFix #DIYEspresso',
}

BASE_TAGS = '#EspressoMachineRepair #CoffeeMachineRepair #KanenCoffee #HomeBarista'

# ── What's actually in each video (shown in description) ─────────────────────
# Each entry describes only what's genuinely visible in that type of video.
# "test" and "general" videos show a working machine — NOT a tutorial.

VIDEO_CONTENT = {
    'pump':             "• Pump failure diagnosis — confirmed dead vs. serviceable\n• Full pump replacement with part compatibility notes (EX5/EP5, brass vs. plastic fitting)\n• Pressure test after repair — machine verified pulling correct extraction pressure",
    'pump-noise':       "• Pump noise diagnosis — vibration dampener vs. pump failure\n• Dampener replacement or full pump swap\n• Quiet operation confirmed after service",
    'not-heating':      "• No-heat diagnosis\n• Heating component identification and replacement\n• Heat-up and temperature verification",
    'heating-element':  "• Heating element failure diagnosis\n• Full element replacement\n• Temperature and safety verification",
    'thermostat':       "• Thermostat or pressurestat testing\n• Calibration or replacement\n• Temperature accuracy verified at operating pressure",
    'ssr':              "• Solid state relay diagnosis\n• SSR replacement\n• Heating cycle verified after repair",
    'steam':            "• Milk frother / steam system diagnosis — clogged nozzle, blocked solenoid valve, or thermostat\n• Nozzle cleaning or valve replacement\n• Steam output and milk frothing verified after service",
    'leak':             "• Internal leak source traced\n• Hose, fitting, or seal replacement\n• Pressure test — no leak confirmed",
    'portafilter-leak': "• Group head gasket inspection\n• Gasket and shower screen replacement\n• Portafilter seal verified under pressure",
    'grinder':          "• Grinder motor or burr diagnosis\n• Component repair or replacement\n• Grind consistency verified after service",
    'descale':          "• Descaling cycle performed\n• Scale-affected components inspected and cleaned\n• Flow and temperature verified after descale",
    'solenoid':         "• Solenoid valve diagnosis\n• Valve cleaning or replacement\n• 3-way operation verified — puck ejects dry",
    'error':            "• Error code / alarm diagnosis — specific fault identified\n• Root cause repaired (board, sensor, valve, or flow component)\n• Machine verified error-free after service\n• For step-by-step DIY guidance on this error, see the help link above",
    'flow-meter':       "• Flow meter diagnosis\n• Sensor cleaning or replacement\n• Volumetric accuracy verified after repair",
    'pressure':         "• OPV pressure test\n• OPV adjustment or replacement\n• Extraction pressure verified at group head",
    'no-flow':          "• No-flow diagnosis\n• Blockage, solenoid, or pump repair\n• Full flow restored and verified",
    'tune-up':          "• Complete professional tune-up performed at Kanen Coffee\n• This clip shows the machine running after service\n• Repair and disassembly steps are not shown in this video",
    'test':             "• Final test shot after completed service\n• Machine verified running correctly\n• No diagnostic or repair steps shown — service was completed prior to this clip",
    'general':          "• Machine verified running correctly after service\n• Post-service clip only — no diagnostic or repair steps shown\n• Full service was completed prior to filming",
}

# ── Core functions ────────────────────────────────────────────────────────────

def detect_brand(title):
    """Return the first matching brand found in the title, or None."""
    for b in BRANDS:
        if b.lower() in title.lower():
            return b
    return None

def extract_job_number(title):
    """
    Extract an internal job/order number from a video title if present.
    Returns the number as a string (e.g. '3039') or None.
    Patterns handled:
      - "Test 3039", "test 3039 test", "#7813", "[7792]"
      - "Rancilio Silvia - 3039", "3039 test" (standalone at start or end)
    """
    patterns = [
        r'(?:^|[\s#\[])\d{4,5}(?:$|[\s\])])',   # standalone 4-5 digit number
        r'#(\d{4,5})',                             # #7813
        r'\[(\d{4,5})\]',                          # [7792]
    ]
    # Try specifically formatted first
    for pat in patterns[1:]:
        m = re.search(pat, title)
        if m:
            return m.group(1)
    # Then bare number
    m = re.search(r'(?:^|[\s\-–#\[])(\d{4,5})(?:$|[\s\-–\])])', title)
    if m:
        return m.group(1)
    return None

def detect_problem_type(title):
    """Detect primary problem type for help link, title hook, and tag selection."""
    t = title.lower()
    if re.search(r'pump.*nois|rattle.*pump|vibrat.*pump', t): return 'pump-noise'
    if re.search(r'\bpump\b|no pressure|not pump|won.t pump|low pressure', t): return 'pump'
    if re.search(r'heating element', t): return 'heating-element'
    if re.search(r'\bthermostat\b|\bpressurestat\b|\bpid\b', t): return 'thermostat'
    if re.search(r'\bssr\b|\bsolid.state', t): return 'ssr'
    if re.search(r'not heating|no heat\b|won.t heat', t): return 'not-heating'
    if re.search(r'not frothing|no steam|steam wand|weak steam|no froth|frothing', t): return 'steam'
    if re.search(r'portafilter leak|group head leak', t): return 'portafilter-leak'
    if re.search(r'leak|leaking\b|\bgasket\b|\bseal\b', t): return 'leak'
    if re.search(r'grinder|grinding|grind', t): return 'grinder'
    if re.search(r'descal|scale\b|limescale', t): return 'descale'
    if re.search(r'solenoid', t): return 'solenoid'
    if re.search(r'error\s+\d|error code|flashing|\balarm\b|error\s+[a-z]', t): return 'error'
    if re.search(r'flow meter', t): return 'flow-meter'
    if re.search(r'no water|no flow|group head.*water', t): return 'no-flow'
    if re.search(r'\bpressure\b|\bopv\b', t): return 'pressure'
    if re.search(r'tune.up|tune up', t): return 'tune-up'
    if re.search(r'\btest\b|\bshot\b', t): return 'test'
    return 'general'

def detect_problem_type_from_captions(transcript):
    """
    Analyze video transcript (auto-captions) to detect actual repair type.
    Much more accurate than title-based detection since it analyzes what was actually done.
    """
    if not transcript:
        return 'general'

    text = transcript.lower()

    # Order matters: check specific combinations first, then broader keywords
    # This prevents false positives (e.g., mentioning "thermostat" in a pump video)

    if re.search(r'(?:replace|install|new|swap).*(?:pump|piston pump|rotary pump)', text): return 'pump'
    if re.search(r'pump.*(?:pressure|flow|test|pull)', text): return 'pump'
    if re.search(r'(?:no|zero|low).*pressure|pressure.*(?:fail|problem|low)', text): return 'pump'

    if re.search(r'(?:pump|motor).*(?:noise|loud|rattle|vibrat|quiet)', text): return 'pump-noise'
    if re.search(r'(?:noisy|loud|rattle|vibrat).*pump', text): return 'pump-noise'

    if re.search(r'(?:replace|install|new).*(?:heating element|element)', text): return 'heating-element'
    if re.search(r'heating element.*(?:fail|break|dead|test)', text): return 'heating-element'

    if re.search(r'(?:thermostat|pressurestat|pid|temperature).*(?:test|adjust|calibrat|replace)', text): return 'thermostat'
    if re.search(r'(?:temperature|heat).*(?:off|wrong|adjust|calibrat)', text): return 'thermostat'

    if re.search(r'(?:ssr|solid state relay).*(?:replace|install|fail)', text): return 'ssr'
    if re.search(r'(?:heating|heat).*(?:fail|no|ssr)', text): return 'ssr'

    if re.search(r'(?:no|zero).*(?:heat|heating)|(?:cold|not heating)', text): return 'not-heating'
    if re.search(r'heating.*(?:fail|problem|issue)', text): return 'not-heating'

    if re.search(r'(?:froth|steam|milk|nozzle).*(?:not|no|clog|clean|replace|fix)', text): return 'steam'
    if re.search(r'steam.*(?:fail|not|no|weak|clog)', text): return 'steam'
    if re.search(r'(?:solenoid|valve).*steam', text): return 'steam'

    if re.search(r'(?:portafilter|group head).*(?:leak|gasket|seal)', text): return 'portafilter-leak'
    if re.search(r'(?:seal|gasket).*(?:group|portafilter)', text): return 'portafilter-leak'

    if re.search(r'(?:leak|leaking|water).*(?:hose|fitting|seal|gasket)', text): return 'leak'
    if re.search(r'(?:internal|drip|seep).*leak', text): return 'leak'

    if re.search(r'(?:grinder|burr|motor).*(?:not|fail|repair|replace)', text): return 'grinder'
    if re.search(r'(?:grind|burr|static).*(?:issue|problem|fix)', text): return 'grinder'

    if re.search(r'(?:descal|descaling|scale|limescale|calcium)', text): return 'descale'
    if re.search(r'scale.*(?:buildup|problem|affect)', text): return 'descale'

    if re.search(r'solenoid.*(?:valve|test|replace|fail)', text): return 'solenoid'
    if re.search(r'(?:3-way|three-way).*valve', text): return 'solenoid'

    if re.search(r'(?:error|error code|code|alarm|flashing|fault).*(?:\d+|display)', text): return 'error'
    if re.search(r'(?:display|screen).*(?:error|code|alarm)', text): return 'error'

    if re.search(r'flow meter.*(?:test|replace|fix)', text): return 'flow-meter'
    if re.search(r'volumetric.*(?:machine|dose)', text): return 'flow-meter'

    if re.search(r'(?:no|zero|low).*(?:flow|water|pressure).*group', text): return 'no-flow'
    if re.search(r'group.*(?:no|blocked|clog)', text): return 'no-flow'

    if re.search(r'(?:opv|pressure|adjust).*(?:valve|opv)', text): return 'pressure'
    if re.search(r'pressure.*(?:too|adjustment|setting)', text): return 'pressure'

    if re.search(r'(?:tune.?up|service|complete service|full service)', text): return 'tune-up'
    if re.search(r'(?:complete|full|professional).*service', text): return 'tune-up'

    if re.search(r'(?:test shot|final test|pull.*shot|extraction|brew)', text): return 'test'
    if re.search(r'testing.*machine|verify|running', text): return 'test'

    return 'general'

def extract_problem_prefix(title):
    """Detect if title starts with a problem description (before the brand/model)."""
    for pattern in PROBLEM_PREFIXES:
        m = re.match(pattern, title, re.IGNORECASE)
        if m:
            return title[:m.end()].strip(' -–'), title[m.end():].strip()
    return None, title

def clean_title(original_title):
    """Convert an internal workshop title to SEO-friendly hybrid clickable format.
    Idempotent — safe to run on already-updated titles without producing duplicates."""
    title = original_title.strip()

    # ── Strip existing Kanen Coffee formatting (makes function idempotent) ────
    # Removes "| Kanen Coffee" suffix so re-processed titles don't double up hooks
    title = re.sub(r'\s*\|\s*Kanen Coffee\s*$', '', title).strip()
    # Strip hook bodies so re-processed titles don't accumulate duplicate hooks.
    # Pattern covers all TITLE_HOOKS suffixes — with or without an em-dash prefix.
    title = re.sub(
        r'\s+(?:(?:Full\s+)+Service & Inspection|(?:Full\s+)+Tune-Up.*|Service Complete.*'
        r'|Won\'t Build Pressure\?.*|Making a Loud Pump Noise.*'
        r'|Had No Heat at All.*|Heating Element Dead.*|Temperature Way Off.*'
        r'|SSR Failure.*|Not Frothing Milk.*|Leaking Water.*|Portafilter Leaking.*'
        r'|Grinder Issue.*|Scaled Up Badly.*|Solenoid Valve Failure.*'
        r'|Error Code.*|Flow Meter Issue.*|Pressure Problem.*'
        r'|No Water from Group Head.*)\s*$',
        '', title, flags=re.IGNORECASE
    ).strip()
    # Strip any leftover trailing "Full" word that got orphaned by the hook-body strip
    # e.g. "Saeco Minuto Full" after stripping "Full Tune-Up..." → becomes "Saeco Minuto"
    title = re.sub(r'\s+Full\s*$', '', title, flags=re.IGNORECASE).strip()

    # ── Remove internal job numbers and test/video suffixes ───────────────────
    # Must handle "test # 7813" (space between # and digits) BEFORE the general regex
    title = re.sub(r'\s*[-–]?\s*[Tt]est\s*#\s*\d*\s*$', '', title)   # "test # 7813", "test# 7750", "test #"
    title = re.sub(r'\s*[-–]?\s*(?:[Tt]est\s+)?#?\[?\d{4,5}\]?\s*$', '', title)
    title = re.sub(r'\s+\d{3,5}\s+[Tt]est\s*$', '', title)   # "3039 test" at end
    title = re.sub(r'\s+\d{3,5}\s*$', '', title)
    title = re.sub(r'\s*\[[\d]+\]', '', title)
    title = re.sub(r'\s*[-–]\s*[Tt]est\s+[Vv]ideo\s*$', '', title)
    title = re.sub(r'\s+[Tt]est\s+[Vv]ideo\s*$', '', title)
    # Re-strip job numbers exposed after "- Test Video" removal (e.g. "Xelsis - #7742 - Test Video")
    title = re.sub(r'\s*[-–]?\s*#\d{4,5}\s*$', '', title)
    title = re.sub(r'\s*[-–]?\s*\d{4,5}\s*$', '', title)
    # Strip trailing commas, spaces, and punctuation from cleanup
    title = title.strip(' ,–-')
    title = title.strip()

    # Detect problem type from the ORIGINAL title before stripping so that
    # already-formatted titles ("Won't Build Pressure? Here's What We Found | Kanen Coffee")
    # retain their correct problem classification after the hook body is removed.
    problem_type = detect_problem_type(original_title)

    # Handle "Problem - Brand Model" prefix format
    problem_desc, title_remainder = extract_problem_prefix(title)

    brand = detect_brand(title)

    # Extract model part
    if brand:
        # When a problem prefix was found, "milk- Brand Model" can happen if the problem
        # description bled extra words before the brand. Skip to where the brand starts.
        if problem_desc:
            m = re.search(re.escape(brand), title_remainder, re.IGNORECASE)
            source = title_remainder[m.start():] if m else title_remainder
        else:
            source = title
        model_part = re.sub(re.escape(brand), '', source, flags=re.IGNORECASE).strip()
        # Strip after a dash/space separator (or at start) followed by a problem keyword
        _STRIP_PAT = (
            r'(?:^|(?:\s*[-–]\s*|\s+))'
            r'(?:tune[-\s]?up|test|service|pump|warranty|inspection|repair|replacement|shot'
            r'|heating element|thermostat|pressurestat|solenoid|descal|grinder|flow meter'
            r'|not frothing|no steam|steam wand|no heat|no pressure|no water|no flow'
            r'|leak|gasket|seal|pressure|ssr|pid|error|flashing|error code|alarm|solution|milk|sensor'
            r'|pump replacement|pump repair|pump noise|portafilter|group head|solenoid valve).*'
        )
        model_part = re.sub(_STRIP_PAT, '', model_part, flags=re.IGNORECASE).strip(' -–').strip()
        model_part = re.sub(r'^#?\d+\s*', '', model_part).strip()
        # Strip leftover job-number suffixes like "- 3039" or "- 3039 test"
        model_part = re.sub(r'\s*[-–]\s*#?\d{3,5}(\s+[Tt]est)?\s*$', '', model_part).strip()
        # Strip trailing standalone bare numbers (e.g. "7813" at end without a dash)
        model_part = re.sub(r'\s+\d{4,5}\s*$', '', model_part).strip()
        # Strip trailing dash-clause where text reads like a problem description, not a model name
        # e.g. "Magnifica - General" → "Magnifica" ; "Touch - Milk Sensor Causing" → "Touch"
        # Matches " - Word words..." but NOT " - V3" or " - AV" (requires 2+ chars of lowercase)
        model_part = re.sub(r'\s*[-–]\s*[A-Za-z][a-z]{1,}[a-z\s]*$', '', model_part).strip()
        brand_model = f"{brand} {model_part}" if model_part and len(model_part) > 1 else brand
    else:
        # For non-brand videos, strip after a dash if a problem/service keyword follows
        _NOBRAND_STRIP = (
            r'\s*[-–]\s*(?:tune[-\s]?up|test video|test|service|pump|warranty|inspection'
            r'|repair|replacement|shot|heating element|thermostat|pressurestat|solenoid'
            r'|descal|grinder|flow meter|not frothing|no steam|no heat|no pressure'
            r'|no water|no flow|leak|gasket|seal|pressure|ssr|pid|error|flashing|alarm|solution'
            r'|overhaul|rewire|board replacement|grinder cleaning|inline filter).*$'
        )
        clean = re.sub(_NOBRAND_STRIP, '', title, flags=re.IGNORECASE).strip()
        brand_model = clean

    hook = TITLE_HOOKS.get(problem_type, TITLE_HOOKS['general'])

    # ── YouTube hard limit: 100 characters ───────────────────────────────────
    # Trim brand_model to fit the hook within the limit
    hook_body = hook.replace('{bm} ', '').replace('{bm}', '')
    max_bm = 100 - len(hook_body) - 1  # -1 for the space between {bm} and hook
    if len(brand_model) > max_bm:
        brand_model = brand_model[:max_bm].rsplit(' ', 1)[0]

    new_title = hook.format(bm=brand_model)
    return re.sub(r'\s+', ' ', new_title).strip()

def build_description(video_title, brand=None, job_number=None):
    """
    Build SEO description with problem-specific help.kanencoffee.com deep link and rich tags.
    If job_number is provided it is appended at the bottom so technicians can search for a
    specific machine by its internal work-order number (e.g. job #3039).
    """
    problem_type = detect_problem_type(video_title)
    issue_id, issue_title, help_cta = PROBLEM_HELP_MAP.get(problem_type, PROBLEM_HELP_MAP['general'])

    if issue_id:
        help_url = f"https://help.kanencoffee.com/#{issue_id}"
        help_line = f"👉 {help_url} — {issue_title}"
    else:
        help_url = "https://help.kanencoffee.com"
        help_line = f"👉 {help_url} — Kanen Coffee Help Center"

    machine = brand if brand else "espresso machine"
    intro = DESCRIPTION_INTROS.get(problem_type, DESCRIPTION_INTROS['general']).format(machine=machine)

    brand_tag_str = BRAND_TAGS.get(brand, '') if brand else ''
    problem_tag_str = PROBLEM_TAGS.get(problem_type, PROBLEM_TAGS['general'])
    all_tags = f"{BASE_TAGS} {brand_tag_str} {problem_tag_str}".strip()

    # Job number footer — preserved for internal search
    job_line = f"\n\n🔢 Work order: #{job_number}" if job_number else ""

    video_content = VIDEO_CONTENT.get(problem_type, VIDEO_CONTENT['general'])

    return f"""{intro}

🔧 {help_cta}:
{help_line}

🛒 Parts, machines & service: https://www.kanencoffee.com/service

📋 What's in this video:
{video_content}

Need a technician? Visit https://www.kanencoffee.com/service

{all_tags}{job_line}"""

def extract_context_from_captions(transcript, problem_type):
    """
    Extract specific details from transcript to customize description.
    Returns dict with contextual info about what was actually done.
    """
    if not transcript:
        return {}

    text = transcript.lower()
    context = {}

    # Extract specific part/component mentioned
    parts = {
        'pump': r'(?:piston pump|rotary pump|pump)',
        'heating_element': r'heating element',
        'thermostat': r'(?:thermostat|pressurestat)',
        'solenoid': r'(?:solenoid|3-way valve)',
        'gasket': r'(?:group gasket|group head gasket|gasket)',
        'seal': r'seal',
        'boiler': r'boiler',
        'steam_wand': r'steam (?:wand|nozzle)',
        'grinder': r'grinder',
    }

    for part_name, pattern in parts.items():
        if re.search(pattern, text):
            context['part_mentioned'] = part_name
            break

    # Extract action (replaced, cleaned, adjusted, etc.)
    actions = ['replaced', 'installed', 'cleaned', 'adjusted', 'recalibrated', 'descaled', 'repaired', 'fixed']
    for action in actions:
        if action in text:
            context['action'] = action
            break

    # Extract error codes if present
    error_match = re.search(r'error\s+(?:code\s+)?([a-z]?\d+)', text)
    if error_match:
        context['error_code'] = error_match.group(1)

    # Extract specific measurements/values mentioned
    pressure_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:bar|psi)', text)
    if pressure_match:
        context['pressure_value'] = pressure_match.group(1)

    # Check for specific verification mentions
    if re.search(r'(?:test|pull|extraction|brew|shot)', text):
        context['has_test_shot'] = True

    return context

def build_custom_description_from_captions(brand, problem_type, context, job_number=None):
    """
    Enhance the template description by injecting caption-specific details.
    Preserves the original structure while making intros more specific.

    Examples:
    • Before: "This DeLonghi had zero pump pressure. After repair, here's..."
    • After:  "This DeLonghi had zero pump pressure. After pump replacement, here's..."

    • Before: "This machine had an error code. After diagnosis and repair..."
    • After:  "This machine had an error code E001. After diagnosis and repair..."
    """
    machine_name = brand if brand else 'espresso machine'

    # Start with template description
    template_intro = DESCRIPTION_INTROS.get(problem_type, DESCRIPTION_INTROS['general']).format(machine=machine_name)

    # Enhance intro with caption-specific details
    intro = template_intro
    action = context.get('action', '')
    part = context.get('part_mentioned', '')
    error_code = context.get('error_code', '')
    pressure_value = context.get('pressure_value', '')

    # Build specific enhancement string
    enhancements = []
    if action:
        enhancements.append(action)
    if part:
        part_labels = {
            'pump': 'pump',
            'heating_element': 'heating element',
            'thermostat': 'thermostat',
            'solenoid': 'solenoid valve',
            'gasket': 'gasket',
            'seal': 'seal',
            'boiler': 'boiler',
            'steam_wand': 'steam wand',
            'grinder': 'grinder',
        }
        enhancements.append(part_labels.get(part, part))

    # Inject error code near the beginning if present
    if error_code:
        intro = intro.replace(f"an error code", f"an error code {error_code}", 1)

    # Inject action + part into "After repair/service/replacement" phrases
    if enhancements:
        enhancement_str = ' '.join(enhancements)
        patterns = [
            'After repair,',
            'After service,',
            'After replacement,',
            'After diagnosis and repair,',
            'After descaling and service,',
            'After cleaning and testing,',
            'After testing and adjustment,',
            'After adjustment,',
        ]
        for pattern in patterns:
            if pattern in intro:
                intro = intro.replace(pattern, f'After {enhancement_str},', 1)
                break

    # Get most specific help link based on problem type + caption context
    issue_id, issue_title, help_cta = select_help_link(problem_type, context=context, brand=brand)

    if issue_id:
        help_url = f"https://help.kanencoffee.com/#{issue_id}"
        help_line = f"👉 {help_url} — {issue_title}"
    else:
        help_url = "https://help.kanencoffee.com"
        help_line = f"👉 {help_url} — Kanen Coffee Help Center"

    # Use template video content (unchanged)
    video_content = VIDEO_CONTENT.get(problem_type, VIDEO_CONTENT['general'])

    # Brand and problem tags (unchanged)
    brand_tag_str = BRAND_TAGS.get(brand, '') if brand else ''
    problem_tag_str = PROBLEM_TAGS.get(problem_type, PROBLEM_TAGS['general'])
    all_tags = f"{BASE_TAGS} {brand_tag_str} {problem_tag_str}".strip()

    # Job number footer
    job_line = f"\n\n🔢 Work order: #{job_number}" if job_number else ""

    # Assemble description — keeping your favorite structure intact!
    return f"""{intro}

🔧 {help_cta}:
{help_line}

🛒 Parts, machines & service: https://www.kanencoffee.com/service

📋 What's in this video:
{video_content}

Need a technician? Visit https://www.kanencoffee.com/service

{all_tags}{job_line}"""
