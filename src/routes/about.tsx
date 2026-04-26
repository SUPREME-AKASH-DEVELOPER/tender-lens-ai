import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Method — TenderLens AI" },
      {
        name: "description",
        content:
          "How TenderLens evaluates tenders: criterion extraction, evidence matching, reasoning and human-in-the-loop review.",
      },
      { property: "og:title", content: "Method — TenderLens AI" },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    n: "01",
    title: "Every verdict is sourced.",
    body: "No determination is rendered without a citation: the source clause from the tender, the extracted value from the bidder, and the reasoning that connects them.",
  },
  {
    n: "02",
    title: "Confidence is exposed, not hidden.",
    body: "Each criterion carries an explicit confidence score. Anything below the operator's threshold routes automatically to human review.",
  },
  {
    n: "03",
    title: "Humans hold the pen.",
    body: "Reviewers may override any AI verdict. Overrides are recorded in the audit trail with operator identity, timestamp and rationale.",
  },
  {
    n: "04",
    title: "The record is immutable.",
    body: "Submissions, extractions, verdicts and overrides are written to an append-only ledger. Past determinations cannot be silently rewritten.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      <section className="px-6 md:px-10 py-16 md:py-24 border-b border-border">
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground">
          Method
        </p>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight mt-4 max-w-4xl leading-[1.05]">
          Procurement decisions deserve a <span className="italic">paper trail.</span>
        </h2>
        <p className="mt-8 max-w-2xl text-base text-muted-foreground leading-relaxed">
          TenderLens treats tender evaluation as an archival discipline. The system reads,
          extracts, reasons — and then records its work the way a careful clerk would: each line
          item, each citation, each signature.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-4xl space-y-12">
          {principles.map((p) => (
            <div key={p.n} className="grid grid-cols-12 gap-6 border-b border-border pb-12 last:border-0">
              <p className="col-span-12 md:col-span-2 font-mono text-xs text-muted-foreground tabular-nums">
                {p.n}
              </p>
              <div className="col-span-12 md:col-span-10 space-y-3">
                <h3 className="font-serif text-3xl tracking-tight">{p.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t border-border bg-accent/40">
        <div className="max-w-4xl">
          <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-muted-foreground mb-4">
            Pipeline
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border border border-border">
            {[
              "Intake",
              "OCR",
              "Extract",
              "Match",
              "Reason",
            ].map((s, i) => (
              <li key={s} className="bg-background p-6">
                <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
                  STAGE {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-serif text-xl mt-2">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
