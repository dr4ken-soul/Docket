import { Link } from "react-router-dom";
import { MarketingNav } from "../layout/MarketingNav";
import { Reveal } from "./Reveal";

const timeline = [
  ["Received", "The message enters your Docket inbox.", "The original content and sender context stay attached to the record."],
  ["Interpreted", "The required work is separated from the prose.", "OpenAI identifies actions, dates, owners and uncertainty with source excerpts."],
  ["Checked", "The cited source is checked before confidence is shown.", "Firecrawl retrieves the official page and stores the supporting excerpt with its retrieval time."],
  ["Ready", "The obligation becomes something you can complete.", "Convex keeps the state live while AgentMail prepares an approved follow-up."],
];

/** Renders the complete public Docket marketing page. */
export function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-[var(--bg-primary)]">
      <a href="#main-content" className="skip-link">Skip to main content</a><MarketingNav /><Atmosphere />
      <main id="main-content" className="relative isolate min-h-[100dvh] overflow-x-clip bg-transparent">
        <Hero /><Problem /><Intake /><Workflow /><Ledger /><Comparison /><Foundation /><FinalAction />
      </main><Footer />
    </div>
  );
}

/** Renders the coded atmospheric background layers. */
function Atmosphere() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[0] overflow-hidden bg-[var(--bg-primary)]"><div className="dot-field absolute inset-0 opacity-[0.22]" /><div className="noise absolute inset-0 opacity-[0.06]" /></div>;
}

/** Renders the split-screen evidence console hero. */
function Hero() {
  return <section id="top" className="relative z-[100] min-h-[100dvh] overflow-hidden px-4 pb-12 pt-32 md:px-8 md:pb-16 md:pt-40 lg:px-16"><div className="mx-auto grid min-h-[calc(100dvh-10rem)] w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16"><div className="relative z-[100] max-w-[620px]"><Reveal delay={0.25}><p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:mb-6 md:text-sm">Inbox to action</p></Reveal><Reveal delay={0.4}><h1 className="max-w-[620px] text-balance font-display text-[clamp(3.75rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">Make every notice actionable.</h1></Reveal><Reveal delay={0.7}><p className="mt-7 max-w-[54ch] text-pretty text-base leading-[1.65] text-[var(--text-secondary)] md:mt-8 md:text-lg">Docket turns official messages into verified actions, dates and follow-ups you can track.</p></Reveal><Reveal delay={0.9} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row md:mt-10"><Link className="primary-cta" to="/sign-in">Forward a notice <span>↗</span></Link><a href="#workflow" className="secondary-cta">See the workflow</a></Reveal></div><Reveal delay={0.55}><EvidenceConsole /></Reveal></div></section>;
}

/** Renders the hero's example evidence console. */
function EvidenceConsole() {
  return <div className="relative z-[100] rounded-[20px] bg-[var(--bg-secondary)] p-2 ring-1 ring-[var(--border-default)] shadow-[0_20px_40px_-15px_oklch(0.82_0.18_101_/_0.05)]"><div className="rounded-[14px] bg-[var(--bg-surface)] p-5 shadow-[inset_0_1px_1px_oklch(0.95_0.02_100_/_0.12)] md:p-7"><div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4"><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" /><span className="label">Docket intake</span></div><span className="text-xs text-[var(--text-muted)]">Live</span></div><div className="py-6"><p className="label text-[var(--text-muted)]">Incoming notice</p><h2 className="mt-3 text-xl font-semibold md:text-2xl">Permit renewal requires a response</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">Received from the forwarded inbox, 09:42</p></div><div className="grid gap-3 sm:grid-cols-2"><ConsoleCell label="Due date" value="18 October" /><ConsoleCell label="Source check" value="Supported" success /></div><div className="mt-4 border-t border-[var(--border-subtle)] pt-4"><div className="flex items-center justify-between gap-4"><p className="text-sm text-[var(--text-secondary)]">Next action</p><span className="status-badge status-warning">Ready to review</span></div><p className="mt-2 font-semibold">Confirm the renewal documents and send the reply.</p></div></div></div>;
}

/** Renders one evidence console metric. */
function ConsoleCell({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return <div className="rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4"><p className="label text-[var(--text-muted)]">{label}</p><p className={`mt-2 text-lg font-semibold ${success ? "text-[var(--success)]" : ""}`}>{success ? "✓ " : ""}{value}</p></div>;
}

/** Renders the editorial problem statement. */
function Problem() { return <section className="section-band"><div className="mx-auto grid w-full max-w-[1280px] gap-10 md:grid-cols-[0.32fr_0.68fr] md:gap-16"><Reveal delay={0.1}><p className="eyebrow">The problem</p></Reveal><Reveal delay={0.18}><h2 className="display-heading max-w-[18ch]">The important part of a notice is usually buried inside it.</h2></Reveal></div></section>; }

/** Renders the asymmetric intake bento. */
function Intake() { return <section id="evidence" className="content-section"><div className="mx-auto max-w-[1280px]"><div className="mb-12 grid gap-6 md:grid-cols-[0.45fr_0.55fr] md:items-end md:gap-12"><Reveal><h2 className="display-heading">A notice becomes a docket.</h2></Reveal><Reveal delay={0.08}><p className="body-lead">Docket keeps the original message, the supporting source and the next action together.</p></Reveal></div><div className="grid auto-rows-[minmax(180px,auto)] gap-3 md:grid-cols-4 md:gap-4"><Reveal className="bento-primary md:col-span-2 md:row-span-2" delay={0.08}><p className="eyebrow">01, Intake</p><h3 className="mt-14 max-w-[12ch] font-display text-4xl font-semibold leading-[0.92] md:mt-20 md:text-6xl">Start with the message you already have.</h3><p className="mt-6 text-sm text-[var(--text-secondary)]">Forward it to your Docket inbox or paste the text directly.</p></Reveal><Bento label="Required action" value="Confirm the renewal documents and reply." delay={0.16} wide /><Bento label="Due" value="18 Oct" delay={0.24} accent /><Bento label="Evidence" value="✓ Official source supported" delay={0.32} success /></div></div></section>; }

/** Renders one intake bento item. */
function Bento({ label, value, delay, wide, accent, success }: { label: string; value: string; delay: number; wide?: boolean; accent?: boolean; success?: boolean }) { return <Reveal delay={delay} className={`bento ${wide ? "md:col-span-2" : ""}`}><p className="label text-[var(--text-muted)]">{label}</p><p className={`mt-6 font-semibold ${accent ? "font-display text-4xl text-[var(--accent)]" : "text-xl"} ${success ? "text-[var(--success)]" : ""}`}>{value}</p></Reveal>; }

/** Renders the evidence workflow timeline. */
function Workflow() { return <section id="workflow" className="section-band"><div className="mx-auto grid max-w-[1280px] gap-14 md:grid-cols-[0.38fr_0.62fr] md:gap-20"><Reveal className="md:sticky md:top-32 md:self-start"><p className="eyebrow">The workflow</p><h2 className="display-heading mt-5 max-w-[12ch]">Follow the evidence.</h2><p className="body-lead mt-6">Every useful answer has a visible path back to the notice and the source that supports it.</p></Reveal><ol className="relative border-l border-[var(--border-default)] pl-7 md:pl-10">{timeline.map(([label, title, body], index) => <Reveal key={label} delay={0.1 + index * 0.08}><li className="timeline-item"><span className="timeline-dot" /><p className="eyebrow">{label}</p><h3 className="mt-3 text-2xl font-semibold">{title}</h3><p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">{body}</p></li></Reveal>)}</ol></div></section>; }

/** Renders the example live operational ledger. */
function Ledger() { const rows = [["Permit renewal documents","18 Oct","Review","Official page"],["School form confirmation","22 Oct","Ready","Forwarded email"],["Insurance evidence request","Awaiting date","Review needed","Unverified"]]; return <section className="content-section"><div className="mx-auto max-w-[1280px]"><Reveal className="flex flex-col justify-between gap-6 border-b border-[var(--border-default)] pb-8 md:flex-row md:items-end"><div><p className="eyebrow">Live docket</p><h2 className="display-heading mt-4">Know what needs attention.</h2></div><p className="max-w-[34ch] text-sm text-[var(--text-secondary)]">Convex keeps each change visible across the workspace.</p></Reveal><div className="mt-8 overflow-x-auto"><div className="min-w-[680px]"><LedgerRow values={["Obligation","Due","Status","Source"]} header />{rows.map((row,index)=><Reveal key={row[0]} delay={0.1+index*0.06}><LedgerRow values={row} /></Reveal>)}</div></div></div></section>; }

/** Renders one row in the marketing ledger. */
function LedgerRow({ values, header = false }: { values: string[]; header?: boolean }) { return <div className={`ledger-row ${header ? "ledger-header" : ""}`}>{values.map((value,index)=><span key={value} className={index === 0 && !header ? "font-semibold text-[var(--text-primary)]" : ""}>{value}</span>)}</div>; }

/** Renders the notice to action comparison. */
function Comparison() { return <section className="section-band"><div className="mx-auto max-w-[1280px]"><Reveal delay={0.18}><p className="eyebrow">The difference</p><h2 className="display-heading mt-4">From message to next action.</h2></Reveal><Reveal delay={0.32} className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch"><article className="document-surface"><p className="label text-[var(--text-muted)]">Original notice</p><p className="mt-8 max-w-[34ch] leading-7 text-[var(--text-secondary)]">Please provide the requested renewal documents before the stated date. See the official guidance for current requirements.</p></article><div className="flex items-center justify-center text-2xl text-[var(--accent)]" aria-hidden="true">→</div><article className="document-surface border-[var(--accent)]/30 bg-[var(--bg-surface)]"><p className="eyebrow">Docket record</p><p className="mt-8 text-xl font-semibold">Collect the renewal documents and reply before 18 October.</p><p className="mt-4 text-sm text-[var(--text-secondary)]">Source checked. Follow-up draft available for approval.</p></article></Reveal></div></section>; }

/** Renders the sponsor system evidence rail. */
function Foundation() { return <section id="security" className="content-section"><div className="mx-auto max-w-[1280px]"><Reveal className="grid gap-8 md:grid-cols-[0.42fr_0.58fr] md:items-end"><h2 className="display-heading">Every decision keeps its trail.</h2><p className="body-lead">Docket connects inbox, source, reasoning, live state and approved follow-up without hiding the handoffs.</p></Reveal><div className="mt-12 grid border-y border-[var(--border-default)] md:grid-cols-4">{[["Inbox","AgentMail receives"],["Reasoning","OpenAI interprets"],["Evidence","Firecrawl checks"],["State","Convex keeps live"]].map(([label,value],index)=><Reveal key={label} delay={0.1+index*0.06} className="foundation-cell"><p className="label text-[var(--text-muted)]">{label}</p><p className="mt-4 font-semibold">{value}</p></Reveal>)}</div></div></section>; }

/** Renders the final public call to action. */
function FinalAction() { return <section className="section-band border-b-0"><Reveal delay={0.2} className="mx-auto grid max-w-[1280px] gap-10 border-l-4 border-[var(--accent)] pl-6 md:grid-cols-[0.7fr_0.3fr] md:items-end md:pl-10"><div><p className="eyebrow">Start with the next notice</p><h2 className="display-heading mt-4 max-w-[14ch]">Forward the notice. Keep the answer.</h2></div><div className="flex flex-col gap-3 md:items-end"><Link className="primary-cta" to="/sign-in?sample=1">Try a sample notice <span>↗</span></Link><a className="secondary-link" href="#workflow">View the workflow</a></div></Reveal></section>; }

/** Renders the marketing footer. */
function Footer() { return <footer className="relative z-[100] border-t border-[var(--border-subtle)] px-4 py-8 md:px-8 lg:px-16"><div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between"><span className="font-display text-2xl font-semibold">Docket</span><div className="flex flex-wrap gap-5 text-sm text-[var(--text-muted)]"><a href="#evidence">Evidence</a><a href="#workflow">Workflow</a><a href="#security">Trust</a><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>Built with Convex</span></div></div></footer>; }
