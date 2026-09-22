# Docket Frontend Specification

## Status

Design gates 1 through 7 are approved. This file is the implementation contract for the public Docket page and the visual foundation for the authenticated workspace.

No application code has been written as part of this specification pass.

## Approved direction

- Primary aesthetic: Bento grid operational
- Supporting aesthetic: Kinetic editorial
- Navigation: A2 Scroll-morph pill with B1 scroll-progress behaviour
- Page atmosphere: Static but atmospheric
- Section transition: Staggered viewport reveal
- Display font: Barlow Condensed
- Body font: IBM Plex Sans
- Palette: Cold Evidence
- Hero: Split-screen evidence console
- Page rhythm: editorial stagger with operational density
- Motion dial: 3/10, purposeful and restrained
- Visual density dial: 7/10
- Design variance dial: 6/10

Project fingerprint: split-screen / Swiss rational / cold ops / technical grid / editorial stagger / subtle precision

## Product reading

Docket turns an official notice into a verified, trackable obligation. The visual system must make evidence, deadlines, ownership, and next actions easy to scan. The interface must never imply legal, medical, financial, or governmental authority that Docket does not have.

## Copy rules

- Use British English.
- Do not use em dashes anywhere.
- Use direct product language.
- Avoid generic AI claims and filler verbs.
- Do not use invented customer testimonials, performance statistics, or official logos.
- Use plain text `Docket` as the wordmark. No logo symbol is required.

## Font loading

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
```

```css
:root {
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
}
```

Display type uses Barlow Condensed at weights 600 and 700. Body and interface text use IBM Plex Sans at weights 400, 500, and 600 only.

## Colour tokens

```css
:root {
  --bg-primary: oklch(0.16 0.018 160);
  --bg-secondary: oklch(0.20 0.022 160);
  --bg-surface: oklch(0.25 0.026 160);
  --bg-elevated: oklch(0.30 0.030 160);
  --accent: oklch(0.82 0.18 101);
  --accent-hover: oklch(0.88 0.16 101);
  --accent-glow: oklch(0.82 0.18 101 / 0.12);
  --text-primary: oklch(0.95 0.020 100);
  --text-secondary: oklch(0.76 0.030 160);
  --text-muted: oklch(0.61 0.030 160);
  --border-subtle: oklch(0.95 0.020 100 / 0.08);
  --border-default: oklch(0.95 0.020 100 / 0.16);
  --success: oklch(0.75 0.14 150);
  --warning: oklch(0.82 0.18 101);
  --error: oklch(0.68 0.18 25);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
}
```

Use the restrained strategy. Signal yellow must remain an action and verification colour, not a page-wide wash. Do not use a purple or blue glow. Do not use pure black or pure white.

## Semantic z-index scale

```css
:root {
  --z-base: 0;
  --z-grid: 10;
  --z-noise: 20;
  --z-content: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

Never use arbitrary values such as `z-[9999]`.

## Global foundation

### Body

```tsx
<body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-body antialiased selection:bg-[var(--accent)] selection:text-[var(--bg-primary)]">
```

The root page wrapper is:

```tsx
<main id="main-content" className="relative isolate min-h-[100dvh] overflow-x-clip bg-[var(--bg-primary)]">
```

Add a first focusable skip link:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-[10px] focus:bg-[var(--accent)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]">
  Skip to main content
</a>
```

### Atmospheric layers

The background is coded and requires no external asset.

```tsx
<div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[0] overflow-hidden bg-[var(--bg-primary)]">
  <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,oklch(0.95_0.02_100_/_0.12)_1px,transparent_0)] [background-size:24px_24px]" />
  <div className="absolute inset-0 opacity-[0.06] [background-image:url(&quot;data:image/svg+xml,%3Csvg_viewBox='0_0_160_160'_xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter_id='n'%3E%3CfeTurbulence_type='fractalNoise'_baseFrequency='.85'_numOctaves='3'_stitchTiles='stitch'/%3E%3C/filter%3E%3Crect_width='100%25'_height='100%25'_filter='url(%23n)'_opacity='.7'/%3E%3C/svg%3E&quot;)] [background-size:160px_160px]" />
</div>
```

The grid is meaningful because Docket is an evidence and deadline surface. It must stay below `opacity-[0.22]` and must not become a decorative overlay over text.

## Gate 2 navigation

### Scroll-morph pill

Recipe reference: `scroll-morph-pill`, based on the floating and pill-based navigation recipes.

Initial state, before 80px scroll:

```tsx
<nav className="fixed inset-x-0 top-0 z-[200] px-4 py-4 md:px-8 md:py-5" aria-label="Primary navigation">
  <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between border-b border-[var(--border-subtle)] bg-[color:oklch(0.16_0.018_160_/_0.72)] px-4 py-3 backdrop-blur-md transition-[border-radius,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-6">
    <a href="#top" className="min-h-11 flex items-center font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] outline-none transition-colors duration-150 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:text-3xl">
      Docket
    </a>
    <div className="hidden items-center gap-1 md:flex">
      <a href="#evidence" className="min-h-11 rounded-[10px] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Evidence</a>
      <a href="#workflow" className="min-h-11 rounded-[10px] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Workflow</a>
      <a href="#security" className="min-h-11 rounded-[10px] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Trust</a>
      <button className="group ml-2 flex min-h-11 items-center gap-3 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]" type="button">
        <span>Forward a notice</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
          <span aria-hidden="true" className="text-base leading-none">↗</span>
        </span>
      </button>
    </div>
    <button type="button" aria-label="Open navigation" className="flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-[var(--border-default)] text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-surface)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden">
      <span aria-hidden="true" className="text-lg">+</span>
    </button>
  </div>
</nav>
```

After 80px scroll, the same wrapper transitions to `mx-auto max-w-[420px] rounded-full border border-[var(--border-default)] bg-[color:oklch(0.20_0.022_160_/_0.86)] px-2 py-2 shadow-[0_16px_48px_oklch(0.10_0.03_160_/_0.20)]`. Show only the text wordmark and one primary action. The links move to the mobile style drawer on all widths.

Scroll behaviour: `scrollY > 80` toggles the compact state. Transition duration `300ms`. Easing `cubic-bezier(0.16, 1, 0.3, 1)`. The nav remains keyboard reachable in both states.

### B1 progress behaviour

```tsx
<div aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--border-subtle)]">
  <div className="h-px origin-left bg-[var(--accent)] transition-transform duration-150 ease-linear" style={{ transform: 'scaleX(var(--scroll-progress))' }} />
</div>
```

The section label is a visually hidden live region plus a visible `text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]` label that updates when the active section changes.

## Gate 6 hero

### Structure

Recipe reference: `dark-editorial-two-column`, adapted as a coded evidence console. No photography, video, logo asset, or brand symbol is required.

```tsx
<section id="top" className="relative z-[100] min-h-[100dvh] overflow-hidden px-4 pb-12 pt-32 md:px-8 md:pb-16 md:pt-40 lg:px-16">
  <div className="mx-auto grid min-h-[calc(100dvh-10rem)] w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
```

Hero z-index stack:

```text
z-0:  Cold Evidence surface
z-10: dot field
z-20: micro-noise layer
z-100: hero content
z-200: scroll-morph navigation
```

### Left hero column

```tsx
<div className="relative z-[100] max-w-[620px]">
  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:mb-6 md:text-sm">Inbox to action</p>
  <h1 className="max-w-[620px] text-balance font-display text-[clamp(3.75rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">
    Make every notice actionable.
  </h1>
  <p className="mt-7 max-w-[54ch] text-pretty text-base leading-[1.65] text-[var(--text-secondary)] md:mt-8 md:text-lg">
    Docket turns official messages into verified actions, dates, and follow-ups you can track.
  </p>
  <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-10">
    <button type="button" className="group flex min-h-12 items-center justify-between gap-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] sm:min-w-[190px]">
      <span>Forward a notice</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">↗</span>
    </button>
    <a href="#workflow" className="flex min-h-12 items-center justify-center rounded-full border border-[var(--border-default)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">See the workflow</a>
  </div>
</div>
```

Hero copy entrance:

- Eyebrow: `initial { filter: blur(10px), opacity: 0, y: 20 }`, `animate { filter: blur(0px), opacity: 1, y: 0 }`, duration `0.7s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.25s`.
- H1: same initial and animate values, duration `0.8s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.4s`.
- Description: same values, duration `0.7s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.7s`.
- CTA group: same values, duration `0.7s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.9s`.

### Right evidence console

Use a double-bezel enclosure. The outer shell is:

```tsx
<div className="relative z-[100] rounded-[20px] bg-[var(--bg-secondary)] p-2 ring-1 ring-[var(--border-default)] shadow-[0_20px_40px_-15px_oklch(0.82_0.18_101_/_0.05)]">
  <div className="rounded-[14px] bg-[var(--bg-surface)] p-5 shadow-[inset_0_1px_1px_oklch(0.95_0.02_100_/_0.12)] md:p-7">
```

Inner console classes:

```tsx
<div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
  <div className="flex items-center gap-3">
    <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Docket intake</span>
  </div>
  <span className="text-xs font-medium text-[var(--text-muted)]">Live</span>
</div>
<div className="py-6">
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Incoming notice</p>
  <h2 className="mt-3 text-xl font-semibold leading-tight text-[var(--text-primary)] md:text-2xl">Permit renewal requires a response</h2>
  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Received from the forwarded inbox, 09:42</p>
</div>
<div className="grid gap-3 sm:grid-cols-2">
  <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Due date</p>
    <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">18 October</p>
  </div>
  <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Source check</p>
    <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--success)]"><span aria-hidden="true">✓</span> Supported</p>
  </div>
</div>
<div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
  <div className="flex items-center justify-between gap-4">
    <p className="text-sm font-medium text-[var(--text-secondary)]">Next action</p>
    <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">Ready to review</span>
  </div>
  <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">Confirm the renewal documents and send the reply.</p>
</div>
```

Console entrance: `initial { filter: 'blur(10px)', opacity: 0, y: 24, scale: 0.985 }`, `animate { filter: 'blur(0px)', opacity: 1, y: 0, scale: 1 }`, duration `0.9s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.55s`.

On mobile, use `grid-cols-1`, move the console below the CTA, and preserve the full console width with `w-full`.

## Section 2, Problem statement

Layout family: full-width editorial statement. This is a breathing section between the hero and dense operational content.

```tsx
<section className="relative z-[100] border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto grid w-full max-w-[1280px] gap-10 md:grid-cols-[0.32fr_0.68fr] md:gap-16">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The problem</p>
    <h2 className="max-w-[18ch] text-balance font-display text-[clamp(2.75rem,6vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">The important part of a notice is usually buried inside it.</h2>
  </div>
</section>
```

Animation: section children use `initial { filter: 'blur(10px)', opacity: 0, y: 24 }`, `animate { filter: 'blur(0px)', opacity: 1, y: 0 }`, duration `0.75s`, easing `cubic-bezier(0.16,1,0.3,1)`, stagger `0.08s`, first delay `0.1s`. The reveal repeats when the section leaves and re-enters the viewport. Use an IntersectionObserver that adds and removes the revealed class. Do not use a one-shot reveal.

## Section 3, Intake system

Section id: `evidence`. Layout family: asymmetric bento grid. Maximum five cells. No decorative shadows.

```tsx
<section id="evidence" className="relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto w-full max-w-[1280px]">
    <div className="mb-12 grid gap-6 md:grid-cols-[0.45fr_0.55fr] md:items-end md:gap-12">
      <h2 className="text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">A notice becomes a docket.</h2>
      <p className="max-w-[54ch] text-pretty text-base leading-[1.65] text-[var(--text-secondary)] md:text-lg">Docket keeps the original message, the supporting source, and the next action together.</p>
    </div>
    <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
      <article className="rounded-[14px] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 md:col-span-2 md:row-span-2 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">01, Intake</p>
        <h3 className="mt-14 max-w-[12ch] font-display text-4xl font-semibold leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)] md:mt-20 md:text-6xl">Start with the message you already have.</h3>
        <p className="mt-6 max-w-[42ch] text-sm leading-6 text-[var(--text-secondary)]">Forward it to your Docket inbox or paste the text directly.</p>
      </article>
      <article className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 md:col-span-2 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Required action</p>
        <p className="mt-6 text-xl font-semibold leading-tight text-[var(--text-primary)]">Confirm the renewal documents and reply.</p>
      </article>
      <article className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Due</p>
        <p className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] text-[var(--accent)]">18 Oct</p>
      </article>
      <article className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Evidence</p>
        <p className="mt-6 flex items-center gap-2 text-base font-semibold text-[var(--success)]"><span aria-hidden="true">✓</span> Official source supported</p>
      </article>
    </div>
  </div>
</section>
```

Each bento item uses blur-in entrance: `initial { filter: 'blur(10px)', opacity: 0, y: 24 }`, `animate { filter: 'blur(0px)', opacity: 1, y: 0 }`, duration `0.65s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay by item index `0.08s` up to `0.32s`. Use repeatable viewport observation.

## Section 4, Evidence trail

Section id: `workflow`. Layout family: vertical timeline with a fixed evidence rail.

```tsx
<section id="workflow" className="relative z-[100] border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto grid w-full max-w-[1280px] gap-14 md:grid-cols-[0.38fr_0.62fr] md:gap-20">
    <div className="md:sticky md:top-32 md:self-start">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The workflow</p>
      <h2 className="mt-5 max-w-[12ch] text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">Follow the evidence.</h2>
      <p className="mt-6 max-w-[38ch] text-base leading-[1.65] text-[var(--text-secondary)]">Every useful answer has a visible path back to the notice and the source that supports it.</p>
    </div>
    <ol className="relative border-l border-[var(--border-default)] pl-7 md:pl-10">
      <li className="relative pb-12">
        <span className="absolute -left-[35px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg-secondary)] md:-left-[51px]" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Received</p>
        <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">The message enters your Docket inbox.</h3>
        <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">The original content and sender context stay attached to the record.</p>
      </li>
      <li className="relative pb-12">
        <span className="absolute -left-[35px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-[var(--bg-secondary)] md:-left-[51px]" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" /></span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Interpreted</p>
        <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">The required work is separated from the prose.</h3>
        <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">OpenAI identifies actions, dates, owners, and uncertainty with source excerpts.</p>
      </li>
      <li className="relative pb-12">
        <span className="absolute -left-[35px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-[var(--bg-secondary)] md:-left-[51px]" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" /></span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Checked</p>
        <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">The cited source is checked before confidence is shown.</h3>
        <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">Firecrawl retrieves the official page and stores the supporting excerpt with its retrieval time.</p>
      </li>
      <li className="relative">
        <span className="absolute -left-[35px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--success)] bg-[var(--bg-secondary)] md:-left-[51px]" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /></span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--success)]">Ready</p>
        <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">The obligation becomes something you can complete.</h3>
        <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">Convex keeps the state live, while AgentMail can prepare the approved follow-up.</p>
      </li>
    </ol>
  </div>
</section>
```

Timeline reveal: same blur-in values, duration `0.7s`, easing `cubic-bezier(0.16,1,0.3,1)`, item delay `0.1s`, `0.18s`, `0.26s`, and `0.34s`. Use repeatable viewport observation. Sticky behaviour is disabled below `md`.

## Section 5, Live docket

Layout family: operational ledger. Use borders, row spacing, and status labels. Do not box every row as a card.

```tsx
<section className="relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto w-full max-w-[1280px]">
    <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-default)] pb-8 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Live docket</p>
        <h2 className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">Know what needs attention.</h2>
      </div>
      <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">Convex keeps each change visible across the workspace.</p>
    </div>
    <div className="mt-8 overflow-x-auto">
      <div className="min-w-[680px]">
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] border-b border-[var(--border-default)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <span>Obligation</span><span>Due</span><span>Status</span><span>Source</span>
        </div>
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] items-center border-b border-[var(--border-subtle)] px-3 py-5 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">Permit renewal documents</span><span>18 Oct</span><span className="text-[var(--accent)]">Review</span><span>Official page</span>
        </div>
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] items-center border-b border-[var(--border-subtle)] px-3 py-5 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">School form confirmation</span><span>22 Oct</span><span className="text-[var(--success)]">Ready</span><span>Forwarded email</span>
        </div>
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] items-center border-b border-[var(--border-subtle)] px-3 py-5 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">Insurance evidence request</span><span>Awaiting date</span><span className="text-[var(--text-muted)]">Review needed</span><span>Unverified</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

Rows use blur-in entrance with duration `0.55s`, easing `cubic-bezier(0.16,1,0.3,1)`, and delays `0.1s`, `0.16s`, and `0.22s`. On mobile, the ledger scrolls horizontally rather than wrapping into an unreadable table.

## Section 6, Before and after

Layout family: editorial comparison. This section is not a second split-screen hero. It uses two document surfaces with a central transformation marker.

```tsx
<section className="relative z-[100] border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto w-full max-w-[1280px]">
    <div className="max-w-[620px]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The difference</p>
      <h2 className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">From message to next action.</h2>
    </div>
    <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
      <article className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Original notice</p>
        <p className="mt-8 max-w-[34ch] text-base leading-7 text-[var(--text-secondary)]">Please provide the requested renewal documents before the stated date. See the official guidance for current requirements.</p>
      </article>
      <div className="flex items-center justify-center text-2xl text-[var(--accent)]" aria-hidden="true">→</div>
      <article className="rounded-[14px] border border-[var(--accent)]/30 bg-[var(--bg-surface)] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Docket record</p>
        <p className="mt-8 text-xl font-semibold leading-tight text-[var(--text-primary)]">Collect the renewal documents and reply before 18 October.</p>
        <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">Source checked. Follow-up draft available for approval.</p>
      </article>
    </div>
  </div>
</section>
```

Entrance values: `initial { filter: 'blur(10px)', opacity: 0, y: 24 }`, `animate { filter: 'blur(0px)', opacity: 1, y: 0 }`, duration `0.75s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.18s` for the heading and `0.32s` for the comparison.

## Section 7, System foundation

Section id: `security`. Layout family: horizontal evidence rail. No hardcoded sponsor logos or symbols.

```tsx
<section id="security" className="relative z-[100] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto w-full max-w-[1280px]">
    <div className="grid gap-8 md:grid-cols-[0.42fr_0.58fr] md:items-end">
      <h2 className="text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">Every decision keeps its trail.</h2>
      <p className="max-w-[48ch] text-base leading-[1.65] text-[var(--text-secondary)]">Docket connects inbox, source, reasoning, live state, and approved follow-up without hiding the handoffs.</p>
    </div>
    <div className="mt-12 grid gap-0 border-y border-[var(--border-default)] md:grid-cols-4">
      <div className="border-b border-[var(--border-subtle)] p-5 md:border-b-0 md:border-r md:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">Inbox</p><p className="mt-4 text-base font-semibold text-[var(--text-primary)]">AgentMail receives</p></div>
      <div className="border-b border-[var(--border-subtle)] p-5 md:border-b-0 md:border-r md:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">Reasoning</p><p className="mt-4 text-base font-semibold text-[var(--text-primary)]">OpenAI interprets</p></div>
      <div className="border-b border-[var(--border-subtle)] p-5 md:border-b-0 md:border-r md:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">Evidence</p><p className="mt-4 text-base font-semibold text-[var(--text-primary)]">Firecrawl checks</p></div>
      <div className="p-5 md:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">State</p><p className="mt-4 text-base font-semibold text-[var(--text-primary)]">Convex keeps live</p></div>
    </div>
  </div>
</section>
```

Use a four-item stagger: initial `filter: blur(10px), opacity: 0, y: 16`, animate `filter: blur(0px), opacity: 1, y: 0`, duration `0.6s`, easing `cubic-bezier(0.16,1,0.3,1)`, delays `0.1s`, `0.16s`, `0.22s`, and `0.28s`.

## Section 8, Final action

Layout family: full-width action block. Use a distinct accent edge, not a full yellow background.

```tsx
<section className="relative z-[100] border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-24 md:px-8 md:py-32 lg:px-16">
  <div className="mx-auto grid w-full max-w-[1280px] gap-10 border-l-4 border-[var(--accent)] pl-6 md:grid-cols-[0.7fr_0.3fr] md:items-end md:gap-16 md:pl-10">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Start with the next notice</p>
      <h2 className="mt-4 max-w-[14ch] text-balance font-display text-[clamp(3rem,6vw,7rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">Forward the notice. Keep the answer.</h2>
    </div>
    <div className="flex flex-col items-stretch gap-3 md:items-end">
      <button type="button" className="group flex min-h-12 w-full items-center justify-between gap-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] md:w-auto md:min-w-[220px]"><span>Try a sample notice</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">↗</span></button>
      <a href="#workflow" className="flex min-h-12 items-center justify-center px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] underline decoration-[var(--border-default)] underline-offset-4 transition-colors duration-150 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">View the workflow</a>
    </div>
  </div>
</section>
```

Entrance: initial `filter: blur(10px), opacity: 0, y: 24`, animate `filter: blur(0px), opacity: 1, y: 0`, duration `0.8s`, easing `cubic-bezier(0.16,1,0.3,1)`, delay `0.2s`.

## Section 9, Footer

```tsx
<footer className="relative z-[100] border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-8 md:px-8 md:py-10 lg:px-16">
  <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Docket</span>
    <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--text-muted)]">
      <a href="#evidence" className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Evidence</a>
      <a href="#workflow" className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Workflow</a>
      <a href="#security" className="transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Trust</a>
      <span>Built with Convex</span>
    </div>
  </div>
</footer>
```

## Responsive rules

- Mobile-first layout with `px-4`, `py-24`, and single-column grids.
- At `md`, use `px-8`, two-column editorial layouts, and larger type.
- At `lg`, use `px-16`, the hero split, and the full operational width.
- Minimum interactive target is `min-h-11 min-w-11`.
- No critical action is hidden on mobile.
- The ledger uses horizontal overflow within its own wrapper, never on the body.
- Sticky timeline content becomes normal flow below `md`.
- Headline sizing uses `clamp()` to avoid overflow.

## Interaction requirements

- Every button has a visible focus ring.
- Every icon-only control has an `aria-label`.
- The primary CTA uses button-in-button trailing icon treatment.
- Hover changes use CSS classes, not inline mouse event style changes.
- Reduced motion removes translate and scale, leaving a short opacity transition.
- Scroll reveals repeat on re-entry. Use IntersectionObserver to add and remove the revealed state.
- No more than four interactive motion patterns appear on the public page. Docket uses scroll-morph navigation, staggered viewport reveals, button-in-button hover motion, and ledger row hover state.

## Async and product states

The later application workspace must include:

- Skeleton state for intake processing.
- Verification pending, supported, partially supported, and unable to verify states.
- Empty inbox with a primary intake action.
- Empty docket with a sample notice action.
- Email draft saving state.
- Email sent confirmation.
- Provider timeout with retry.
- Runtime error boundary with retry and return-home actions.

## Asset strategy

The public page is intentionally asset-light. No stock photography, video, hardcoded logos, or invented brand symbols are required.

ASSET BRIEF:

```text
Type: coded product interface
Description: evidence console showing a forwarded notice becoming a verified obligation
Motion: restrained state transitions only
Mood: precise, calm, accountable
Resolution: responsive DOM and CSS, no raster asset
Generation tool: not required
Hosting: application bundle
Fallback: static coded panel with the same Cold Evidence tokens
```

## Implementation audit

- [ ] Exact Tailwind classes exist for every visible element.
- [ ] Every entrance has initial state, animate state, duration, easing, and delay.
- [ ] Every section declares its z-index layer.
- [ ] No section needs an unapproved external asset.
- [ ] Responsive variants exist wherever layout or size changes.
- [ ] The scroll-morph pill and progress line are implemented.
- [ ] Scroll reveal is repeatable.
- [ ] No em dash appears in UI copy, comments, or documentation.
- [ ] No hardcoded logo or sponsor symbol appears.
- [ ] Public page has skip link, focus states, reduced motion, empty states, and error states.
