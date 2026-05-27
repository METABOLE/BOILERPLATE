export const LINKS = [
  {
    href: '/',
    text: { en: 'Home', fr: 'Accueil' },
  },
  {
    href: '/sample',
    text: { en: 'Sample', fr: 'Sample' },
  },
];

export const STATIC_PAGES = [
  ...LINKS.map((l) => (l.href === '/' ? '' : l.href)),
  '/terms-of-service',
] as const;

export const LEGALS = [
  {
    href: '/terms-of-service',
    text: { en: 'Terms', fr: 'Mentions' },
  },
];
