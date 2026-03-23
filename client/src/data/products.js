// La Marzocco product catalog
// "available" arrays reference config IDs that can be paired with each color.
// Prices in USD.

export const PRODUCTS = [
  {
    id: 'gs3',
    brand: 'La Marzocco',
    name: 'GS3',
    tagline: 'Dual-Boiler Home Espresso — Professional in Every Way',
    description:
      'The GS3 brought commercial dual-boiler technology into the home. Independent brew and steam boilers deliver perfect temperature stability, while the iconic design and handcrafted build quality have made it the benchmark for serious home espresso since 2008.',
    specs: [
      { label: 'Boiler', value: 'Dual (brew 0.4 L + steam 1.5 L)' },
      { label: 'Pump', value: 'Rotary (standard)' },
      { label: 'PID', value: 'Dual — independent brew & steam' },
      { label: 'Dimensions', value: '14.5″ W × 13.3″ D × 15.2″ H' },
      { label: 'Weight', value: '44 lb' },
      { label: 'Power', value: '1,400 W' },
      { label: 'Warranty', value: '2 years parts & labor' },
    ],
    configurations: [
      {
        id: 'mp',
        label: 'Manual Paddle (MP)',
        description:
          'Lever-style paddle gives full manual control over pre-infusion and flow rate. Preferred by experienced baristas who want maximum expression over the shot.',
        basePrice: 8249,
      },
      {
        id: 'av',
        label: 'Auto Volumetric (AV)',
        description:
          'Programmable volumetric dosing — set your yield once and repeat it consistently. Great for households where multiple people pull shots.',
        basePrice: 8249,
      },
      {
        id: 'mpav',
        label: 'MP + AV',
        description:
          'Ships with both the paddle and volumetric electronics installed. Switch between manual and automatic modes via the front panel.',
        basePrice: 9249,
      },
    ],
    colors: [
      {
        id: 'stainless',
        label: 'Stainless Steel',
        hex: '#C2C2C2',
        border: '#9CA3AF',
        configs: ['mp', 'av', 'mpav'],
        note: null,
      },
      {
        id: 'black',
        label: 'Black',
        hex: '#1C1410',
        border: '#374151',
        configs: ['mp', 'av', 'mpav'],
        note: null,
      },
      {
        id: 'white',
        label: 'White',
        hex: '#F2EDE6',
        border: '#D1C7BB',
        configs: ['mp', 'av', 'mpav'],
        note: null,
      },
      {
        id: 'cobalt',
        label: 'Cobalt Blue',
        hex: '#1D4ED8',
        border: '#1E40AF',
        configs: ['mp', 'av'],
        note: 'Not available in MP/AV',
      },
      {
        id: 'neon',
        label: 'Neon Green',
        hex: '#16A34A',
        border: '#15803D',
        configs: ['mp'],
        note: 'Manual Paddle only · Limited edition',
      },
      {
        id: 'red',
        label: 'Rosso Red',
        hex: '#DC2626',
        border: '#B91C1C',
        configs: ['mp', 'av'],
        note: 'Not available in MP/AV',
      },
    ],
  },
  {
    id: 'linea-mini',
    brand: 'La Marzocco',
    name: 'Linea Mini',
    tagline: 'Commercial Linea DNA — Scaled for Your Home',
    description:
      'The Linea Mini is a direct descendant of the iconic Linea commercial machine used in coffee bars worldwide. Featuring a dual-boiler system, saturated group head, and the same internal engineering as its commercial sibling, it delivers café-quality espresso in a home-sized footprint.',
    specs: [
      { label: 'Boiler', value: 'Dual (brew 0.35 L + steam 1.8 L)' },
      { label: 'Pump', value: 'Vibration (standard) · Rotary (R model)' },
      { label: 'PID', value: 'Dual — independent brew & steam' },
      { label: 'Dimensions', value: '13.5″ W × 14.2″ D × 14.2″ H' },
      { label: 'Weight', value: '39 lb' },
      { label: 'Power', value: '1,600 W' },
      { label: 'Warranty', value: '2 years parts & labor' },
    ],
    configurations: [
      {
        id: 'standard',
        label: 'Standard',
        description:
          'Classic vibration pump. The original Linea Mini — all the dual-boiler performance, ideal for home plumbing setups.',
        basePrice: 5500,
      },
      {
        id: 'r',
        label: 'R (Rotary Pump)',
        description:
          'Quiet rotary pump with direct-connect plumbing support. Preferred for custom installations, built-in setups, or anyone who wants whisper-quiet operation.',
        basePrice: 6800,
      },
      {
        id: 'connected',
        label: 'Connected',
        description:
          'Built-in WiFi + Bluetooth with La Marzocco Home app. Preheat remotely, track shot data, and adjust temperature from your phone. Ships with vibration pump.',
        basePrice: 6100,
      },
    ],
    colors: [
      {
        id: 'stainless',
        label: 'Stainless Steel',
        hex: '#C2C2C2',
        border: '#9CA3AF',
        configs: ['standard', 'r', 'connected'],
        note: null,
      },
      {
        id: 'black',
        label: 'Black',
        hex: '#1C1410',
        border: '#374151',
        configs: ['standard', 'r', 'connected'],
        note: null,
      },
      {
        id: 'white',
        label: 'White',
        hex: '#F2EDE6',
        border: '#D1C7BB',
        configs: ['standard', 'r', 'connected'],
        note: null,
      },
      {
        id: 'cobalt',
        label: 'Cobalt Blue',
        hex: '#1D4ED8',
        border: '#1E40AF',
        configs: ['standard', 'connected'],
        note: 'Not available with Rotary pump',
      },
      {
        id: 'neon',
        label: 'Neon Green',
        hex: '#16A34A',
        border: '#15803D',
        configs: ['standard'],
        note: 'Standard only · Limited edition',
      },
      {
        id: 'red',
        label: 'Rosso Red',
        hex: '#DC2626',
        border: '#B91C1C',
        configs: ['standard', 'connected'],
        note: 'Not available with Rotary pump',
      },
      {
        id: 'warm-white',
        label: 'Warm White',
        hex: '#FFF8E1',
        border: '#D6C89A',
        configs: ['connected'],
        note: 'Connected model only',
      },
    ],
  },
];
