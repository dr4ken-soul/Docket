import { Section } from "./Section";

interface Step {
  label: string;
  active: boolean;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    label: "Received",
    active: true,
    title: "The message enters your Docket inbox.",
    body: "The original content and sender context stay attached to the record.",
  },
  {
    label: "Interpreted",
    active: false,
    title: "The required work is separated from the prose.",
    body: "OpenAI identifies actions, dates, owners, and uncertainty with source excerpts.",
  },
  {
    label: "Checked",
    active: false,
    title: "The cited source is checked before confidence is shown.",
    body: "Firecrawl retrieves the official page and stores the supporting excerpt with its retrieval time.",
  },
  {
    label: "Ready",
    active: true,
    title: "The obligation becomes something you can complete.",
    body: "Convex keeps the state live, while AgentMail can prepare the approved follow-up.",
  },
];

/**
 * Section 4, Evidence trail. A vertical timeline with a sticky evidence rail.
 * Section id is `workflow` per the layout specification.
 */
export function EvidenceTimeline() {
  return (
    <Section id="workflow" band stagger>
      <div className="grid gap-14 md:grid-cols-[0.38fr_0.62fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            The workflow
          </p>
          <h2 className="mt-5 max-w-[12ch] text-balance font-display text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]">
            Follow the evidence.
          </h2>
          <p className="mt-6 max-w-[38ch] text-base leading-[1.65] text-[var(--text-secondary)]">
            Every useful answer has a visible path back to the notice and the
            source that supports it.
          </p>
        </div>
        <ol className="relative border-l border-[var(--border-default)] pl-7 md:pl-10">
          {STEPS.map((step) => {
            const dotBorder = step.active
              ? "border-2 border-[var(--accent)]"
              : "border-2 border-[var(--border-default)]";
            const dotInner = step.active
              ? "bg-[var(--accent)]"
              : "bg-[var(--text-muted)]";
            const labelClass = step.active
              ? "text-[var(--accent)]"
              : "text-[var(--text-muted)]";
            return (
              <li key={step.label} className="relative pb-12">
                <span
                  className={`absolute -left-[35px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--bg-secondary)] md:-left-[51px] ${dotBorder}`}
                  aria-hidden="true"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${dotInner}`}
                  />
                </span>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.16em] ${labelClass}`}
                >
                  {step.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

export default EvidenceTimeline;
