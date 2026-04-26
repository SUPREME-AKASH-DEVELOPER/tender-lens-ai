import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { generateBidderReport } from "@/lib/pdf-report";
import {
  evaluateBidder,
  getBidder,
  summarizeResults,
  tender,
  type EvaluationResult,
  type Status,
} from "@/lib/tender-data";

export const Route = createFileRoute("/evaluation/$bidderId")({
  head: ({ params }) => {
    const b = getBidder(params.bidderId);
    const title = b
      ? `${b.name} — Evaluation Record`
      : "Evaluation Record — TenderLens AI";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: b
            ? `Per-criterion eligibility verdict for ${b.name} against ${tender.reference}.`
            : "Bidder evaluation record.",
        },
        { property: "og:title", content: title },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <div className="flex-1 grid place-items-center p-10">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-5xl">Record not found</h1>
          <p className="text-muted-foreground mt-3 mb-6">
            No submission matches that identifier.
          </p>
          <Link to="/" className="underline underline-offset-4">
            Return to ledger
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
  component: EvaluationPage,
});

function EvaluationPage() {
  const { bidderId } = useParams({ from: "/evaluation/$bidderId" });
  const bidder = getBidder(bidderId);
  if (!bidder) {
    throw new Error("not found");
  }

  const results = useMemo(() => evaluateBidder(bidder), [bidder]);
  const summary = useMemo(() => summarizeResults(results), [results]);

  // Human-in-the-loop overrides (per criterion)
  const [overrides, setOverrides] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState("");
  const [attested, setAttested] = useState(false);

  const finalResults = results.map((r) => ({
    ...r,
    finalStatus: overrides[r.criterion.id] ?? r.status,
    overridden: Boolean(overrides[r.criterion.id]),
  }));
  const finalSummary = summarizeResults(
    finalResults.map((r) => ({ ...r, status: r.finalStatus })),
  );

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      {/* Header band */}
      <section className="border-b border-border px-6 md:px-10 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground hover:text-foreground"
          >
            ← Bidder Ledger
          </Link>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">{bidder.name}</h2>
          <p className="text-sm text-muted-foreground font-mono">
            {bidder.registration} · {bidder.jurisdiction} · submitted{" "}
            {new Date(bidder.submittedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-2">
              Determination
            </p>
            <p className="font-serif text-4xl italic">
              {finalSummary.overall === "eligible"
                ? "Eligible"
                : finalSummary.overall === "ineligible"
                  ? "Not Eligible"
                  : "Needs Review"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 tabular-nums">
              Avg confidence {(finalSummary.avgConfidence * 100).toFixed(1)}%
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              generateBidderReport(bidder, results, { overrides, notes, attested })
            }
            className="px-5 py-2.5 border border-foreground text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
          >
            Download PDF Report
          </button>
        </div>
      </section>

      {/* Counts strip */}
      <section className="grid grid-cols-3 border-b border-border">
        {(
          [
            { k: "Eligible", n: finalSummary.eligible, color: "text-status-eligible" },
            { k: "Needs Review", n: finalSummary.review, color: "text-status-review" },
            { k: "Not Eligible", n: finalSummary.ineligible, color: "text-status-ineligible" },
          ] as const
        ).map((c, i) => (
          <div
            key={c.k}
            className={`p-6 ${i < 2 ? "border-r border-border" : ""}`}
          >
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
              {c.k}
            </p>
            <p className={`font-serif text-4xl mt-2 tabular-nums ${c.color}`}>
              {String(c.n).padStart(2, "0")}
            </p>
          </div>
        ))}
      </section>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Ledger entries */}
        <main>
          {finalResults.map((r) => (
            <ResultRow
              key={r.criterion.id}
              result={r}
              onOverride={(status) =>
                setOverrides((o) => {
                  const next = { ...o };
                  if (status === r.status) {
                    delete next[r.criterion.id];
                  } else {
                    next[r.criterion.id] = status;
                  }
                  return next;
                })
              }
            />
          ))}

          {/* Audit trail */}
          <section className="px-6 md:px-10 py-12 border-t border-border bg-accent/40">
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-muted-foreground mb-4">
              Audit Trail
            </p>
            <ol className="space-y-3 font-mono text-xs text-muted-foreground">
              <li>
                <span className="tabular-nums">[14:32:01]</span> Document intake — 5 files received,
                checksum verified.
              </li>
              <li>
                <span className="tabular-nums">[14:32:04]</span> OCR pipeline complete · 47 pages ·
                3 scanned facsimiles processed.
              </li>
              <li>
                <span className="tabular-nums">[14:32:09]</span> Criterion extraction · 7 criteria
                located in tender.
              </li>
              <li>
                <span className="tabular-nums">[14:32:14]</span> Evidence matched · {results.length}{" "}
                of {tender.criteria.length} criteria resolved.
              </li>
              {Object.entries(overrides).map(([cid, st]) => (
                <li key={cid} className="text-foreground">
                  <span className="tabular-nums">[—]</span> Operator override · {cid.toUpperCase()} →{" "}
                  {st}
                </li>
              ))}
            </ol>
          </section>
        </main>

        {/* Verification panel */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border bg-background">
          <div className="p-8 border-b border-border">
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] mb-6">
              Verification Log
            </p>
            <dl className="space-y-5 text-xs">
              <div>
                <dt className="text-muted-foreground uppercase text-[10px]">Model</dt>
                <dd className="mt-1">TenderLens Reasoner v2.4</dd>
              </div>
              <div>
                <dt className="text-muted-foreground uppercase text-[10px]">Compliance set</dt>
                <dd className="mt-1 font-medium underline underline-offset-4">EU-TDR-2024</dd>
              </div>
              <div>
                <dt className="text-muted-foreground uppercase text-[10px]">Documents</dt>
                <dd className="mt-1 space-y-1 font-mono">
                  {bidder.documents.map((d) => (
                    <div key={d}>· {d}</div>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <div className="p-8 space-y-4">
            <p className="text-[10px] uppercase font-bold tracking-[0.25em]">
              Manual Attestation
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              maxLength={1000}
              className="w-full h-32 p-4 text-sm border border-border bg-card resize-none focus:outline-none focus:border-foreground placeholder:italic placeholder:text-muted-foreground"
              placeholder="Enter certification notes…"
            />
            <p className="text-[10px] text-muted-foreground tabular-nums text-right">
              {notes.length}/1000
            </p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attested}
                onChange={(e) => setAttested(e.target.checked)}
                className="size-4 mt-0.5 accent-foreground"
              />
              <span className="text-xs leading-snug">
                I affirm the data integrity of this record and accept reviewer responsibility.
              </span>
            </label>
            <button
              type="button"
              disabled={!attested}
              className="w-full px-4 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/85 transition-colors"
            >
              Certify Determination
            </button>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

function ResultRow({
  result,
  onOverride,
}: {
  result: EvaluationResult & { finalStatus: Status; overridden: boolean };
  onOverride: (s: Status) => void;
}) {
  const { criterion, evidence, finalStatus, status, confidence, reasoning, overridden } = result;
  return (
    <article className="border-b border-border hover:bg-accent/40 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left: criterion */}
        <div className="md:col-span-4 p-8 md:border-r border-border space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {criterion.code} · {criterion.type}
          </p>
          <h3 className="font-serif text-xl leading-tight">{criterion.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{criterion.requirement}</p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <StatusBadge status={finalStatus} />
            {overridden && (
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                · Overridden (was {status})
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-muted-foreground tabular-nums">
            Confidence {(confidence * 100).toFixed(1)}%
          </p>
        </div>

        {/* Middle: reasoning + evidence */}
        <div className="md:col-span-8 p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
              Extracted Value
            </p>
            <p className="font-serif text-lg">
              {evidence?.extractedValue ?? <span className="italic text-muted-foreground">Not located</span>}
            </p>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground pt-3">
              Reasoning
            </p>
            <p className="text-sm leading-relaxed">{reasoning}</p>

            <div className="pt-4 flex gap-2 flex-wrap">
              {(["eligible", "review", "ineligible"] as Status[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onOverride(s)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold border transition-colors ${
                    finalStatus === s
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  Mark {s === "review" ? "Review" : s === "eligible" ? "Eligible" : "Ineligible"}
                </button>
              ))}
            </div>
          </div>

          {evidence ? (
            <div className="bg-card border border-border p-5 relative">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-3">
                Source · {evidence.source.document} · p.{evidence.source.page}
              </p>
              <p className="text-sm leading-relaxed font-serif italic">
                “
                {evidence.source.excerpt
                  .split(evidence.source.highlight)
                  .map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="bg-accent border-b border-foreground/50 px-1 not-italic font-sans font-medium text-foreground">
                          {evidence.source.highlight}
                        </span>
                      )}
                    </span>
                  ))}
                ”
              </p>
              <p className="absolute bottom-2 right-3 text-[9px] font-mono text-muted-foreground">
                ID: {criterion.id.toUpperCase()}-EV
              </p>
            </div>
          ) : (
            <div className="border border-dashed border-border p-5 grid place-items-center">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                No matching evidence located
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
