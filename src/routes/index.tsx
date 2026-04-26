import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { bidders, evaluateBidder, summarizeResults, tender } from "@/lib/tender-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TenderLens AI — Explainable Tender Evaluation" },
      {
        name: "description",
        content:
          "Audit-grade tender evaluation. Match bidder submissions against tender criteria with full source-cited reasoning.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const summaries = bidders.map((b) => ({
    bidder: b,
    summary: summarizeResults(evaluateBidder(b)),
  }));

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mb-6">
            Dossier · {tender.reference} · Issued {new Date(tender.issuedAt).toLocaleDateString()}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-4xl">
            Eligibility decisions you can{" "}
            <span className="italic">defend in writing.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            TenderLens reads the tender, reads each bidder, and produces a per-criterion verdict —
            with the source excerpt, the extracted value and the reasoning behind every call.
            Every record is auditable. Every override is logged.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/dossier"
              className="px-6 py-3 bg-foreground text-background text-sm font-semibold tracking-[0.15em] uppercase hover:bg-foreground/85 transition-colors"
            >
              Open Active Dossier
            </Link>
            <Link
              to="/intake"
              className="px-6 py-3 border border-foreground text-foreground text-sm font-semibold tracking-[0.15em] uppercase hover:bg-accent transition-colors"
            >
              Submit Documents
            </Link>
          </div>
        </div>
      </section>

      {/* Tender record summary */}
      <section className="border-b border-border grid grid-cols-1 md:grid-cols-4">
        {[
          { k: "Issuing Authority", v: tender.authority },
          { k: "Estimated Value", v: tender.estimatedValue },
          { k: "Closing Date", v: new Date(tender.closingAt).toLocaleDateString() },
          { k: "Criteria Count", v: `${tender.criteria.length} mandatory` },
        ].map((item, i) => (
          <div
            key={item.k}
            className={`p-8 ${i < 3 ? "md:border-r" : ""} border-border ${i > 0 ? "border-t md:border-t-0" : ""}`}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-3">
              {item.k}
            </p>
            <p className="font-serif text-xl tabular-nums">{item.v}</p>
          </div>
        ))}
      </section>

      {/* Bidder ledger */}
      <section className="px-6 md:px-10 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground mb-2">
              Active Submissions
            </p>
            <h3 className="font-serif text-3xl">Bidder Ledger</h3>
          </div>
          <p className="text-xs text-muted-foreground tabular-nums hidden md:block">
            {summaries.length} entities · evaluated {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="border-t border-border">
          <div className="grid grid-cols-12 gap-4 py-3 border-b border-border text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            <div className="col-span-1 px-2">#</div>
            <div className="col-span-4 px-2">Entity</div>
            <div className="col-span-2 px-2">Jurisdiction</div>
            <div className="col-span-3 px-2">Criteria Result</div>
            <div className="col-span-2 px-2 text-right">Confidence</div>
          </div>

          {summaries.map((s, i) => (
            <Link
              key={s.bidder.id}
              to="/evaluation/$bidderId"
              params={{ bidderId: s.bidder.id }}
              className="grid grid-cols-12 gap-4 py-6 border-b border-border items-center hover:bg-accent transition-colors group"
            >
              <div className="col-span-1 px-2 font-mono text-xs text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-4 px-2">
                <p className="font-serif text-lg group-hover:italic transition-all">
                  {s.bidder.name}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {s.bidder.registration}
                </p>
              </div>
              <div className="col-span-2 px-2 text-sm">{s.bidder.jurisdiction}</div>
              <div className="col-span-3 px-2 flex items-center gap-3 flex-wrap">
                <StatusBadge status={s.summary.overall} />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {s.summary.eligible}/{s.summary.total} pass
                </span>
              </div>
              <div className="col-span-2 px-2 text-right font-mono text-sm tabular-nums">
                {(s.summary.avgConfidence * 100).toFixed(1)}%
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
