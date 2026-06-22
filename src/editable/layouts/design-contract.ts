import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f0f0f0',
  '--slot4-page-text': '#11243f',
  '--slot4-panel-bg': '#d9e9cf',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#576867',
  '--slot4-soft-muted-text': '#809189',
  '--slot4-accent': '#1f78be',
  '--slot4-accent-fill': '#1f78be',
  '--slot4-accent-soft': '#d9e9cf',
  '--slot4-dark-bg': '#1a2f4d',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#e6ece6',
  '--slot4-cream': '#f0f0f0',
  '--slot4-warm': '#ffffff',
  '--slot4-lavender': '#96a78d',
  '--slot4-gray': '#d7dde0',
  '--slot4-highlight': '#b6ceb4',
  '--slot4-border': 'rgba(17, 36, 63, 0.12)',
  '--slot4-body-gradient': 'radial-gradient(circle at top, rgba(182,206,180,0.28), transparent 28%), linear-gradient(180deg, #f6f8f4 0%, #ffffff 26%, #edf3ea 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:var(--slot4-border)]',
  darkBorder: 'border-white/18',
  shadow: 'shadow-[0_18px_50px_rgba(26,47,77,0.10)]',
  shadowStrong: 'shadow-[0_32px_90px_rgba(26,47,77,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(17,36,63,0.05),rgba(17,36,63,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[230px] shrink-0 snap-start sm:w-[260px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.2em]',
    heroTitle: 'text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[5.4rem]',
    sectionTitle: 'text-3xl font-black leading-none tracking-[-0.045em] sm:text-4xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-md bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[var(--slot4-accent-fill)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--slot4-border)] bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white`,
    accent: `inline-flex items-center justify-center gap-2 rounded-md bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[var(--slot4-dark-bg)]`,
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(17,17,17,0.14)]',
    fade: 'transition duration-300 hover:opacity-75',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use a publication-style utility bar, premium masthead, refined green neutrals, and a polished media-distribution visual rhythm.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Prioritize readable desktop and mobile layouts with broad story columns and a focused long-form article measure.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference publication name or logo.',
] as const
