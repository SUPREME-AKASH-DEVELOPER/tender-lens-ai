import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { tender, bidders } from "@/lib/tender-data";

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: "Active Dossier — TenderLens AI" },
      {
        name: "description",
        content: `${tender.reference} — ${tender.title}. Mandatory criteria, source excerpts and submitting entities.`,
      },
      { property: "og:title", content: "Active Dossier — TenderLens AI" },
      {
        property: "og:description",
        content: `${tender.reference} — ${tender.title}.`,
      },
    ],
  }),
  component: DossierPage,
});

const typeLabels = {
  technical: "Technical",
  financial: "Financial",
  compliance: "Compliance",
} as const;

function DossierPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      <section className="border-b border-border px-6 md:px-10 py-12">
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground">
          Dossier · {tender.reference}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-3 max-w-4xl">
          {tender.title}
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Issued by {tender.authority} · Closes{" "}
          <span className="tabular-nums">
            {new Date(tender.closingAt).toLocaleDateString()}
          </span>
        </p>
      </section>

      <main className="flex-1 px-6 md:px-10 py-12">
        <div className="max-w-5xl">
          <div className="flex items-baseline gap-4 mb-8">
            <h3 className="font-serif text-2xl">Extracted Eligibility Criteria</h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {tender.criteria.length} mandatory
            </span>
          </div>

          <div className="border-t border-border">
            {tender.criteria.map((c) => (
              <article
                key={c.id}
                className="grid grid-cols-12 gap-6 py-8 border-b border-border"
              >
                <div className="col-span-12 md:col-span-3 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {c.code}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em]">
                    {typeLabels[c.type]}
                  </p>
                  <h4 className="font-serif text-xl leading-tight">{c.title}</h4>
                </div>
                <div className="col-span-12 md:col-span-9 space-y-4">
                  <p className="text-sm leading-relaxed">{c.requirement}</p>
                  <div className="bg-card border border-border p-5 relative">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-3">
                      Source · PDF p.{c.source.page} · {c.source.section}
                    </p>
                    <p className="text-sm leading-relaxed font-serif italic text-foreground/90">
                      “
                      {c.source.excerpt
                        .split(c.source.highlight)
                        .map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="bg-accent border-b border-foreground/40 px-1 not-italic font-sans font-medium text-foreground">
                                {c.source.highlight}
                              </span>
                            )}
                          </span>
                        ))}
                      ”
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 p-8 bg-accent border border-border">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-3">
              Submissions on record
            </p>
            <div className="flex flex-wrap gap-3">
              {bidders.map((b) => (
                <Link
                  key={b.id}
                  to="/evaluation/$bidderId"
                  params={{ bidderId: b.id }}
                  className="px-4 py-2 bg-card border border-border text-sm hover:border-foreground transition-colors font-serif"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
