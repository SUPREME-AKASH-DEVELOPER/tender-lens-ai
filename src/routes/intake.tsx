import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { bidders, tender } from "@/lib/tender-data";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Document Intake — TenderLens AI" },
      {
        name: "description",
        content:
          "Upload tender and bidder documents. OCR, criterion extraction and matching run automatically.",
      },
      { property: "og:title", content: "Document Intake — TenderLens AI" },
    ],
  }),
  component: IntakePage,
});

const stages = [
  { label: "Document intake", detail: "Hash & checksum verified" },
  { label: "OCR pipeline", detail: "Scanned facsimiles processed" },
  { label: "Criterion extraction", detail: "Reading tender clauses" },
  { label: "Evidence matching", detail: "Cross-referencing bidder data" },
  { label: "Reasoning & verdict", detail: "Per-criterion determination" },
] as const;

function IntakePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!running) return;
    if (stage >= stages.length) {
      // Route to first sample bidder's evaluation
      const id = bidders[0]?.id ?? "bdr-001";
      const t = setTimeout(
        () => navigate({ to: "/evaluation/$bidderId", params: { bidderId: id } }),
        500,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [running, stage, navigate]);

  function pick(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).slice(0, 10);
    setFiles(arr);
  }

  function start() {
    setRunning(true);
    setStage(0);
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      <section className="border-b border-border px-6 md:px-10 py-12">
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground">
          Phase 01 · Document Intake
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-3 max-w-3xl">
          Submit tender and bidder documents.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          For this preview, uploads are simulated against dossier{" "}
          <span className="font-mono">{tender.reference}</span>. The pipeline below mirrors the
          production flow: OCR → criterion extraction → evidence matching → reasoning.
        </p>
      </section>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Upload */}
        <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-border">
          <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-muted-foreground mb-6">
            Upload Bay
          </p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-border bg-card p-12 text-center"
          >
            <p className="font-serif text-2xl mb-2">Drop dossier here</p>
            <p className="text-xs text-muted-foreground mb-6">
              PDF, DOCX or scanned image. Max 10 files.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2.5 border border-foreground text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent"
            >
              Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => pick(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <ul className="mt-6 divide-y divide-border border border-border bg-card">
              {files.map((f) => (
                <li
                  key={f.name + f.size}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="truncate font-mono text-xs">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums uppercase">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={start}
            disabled={running}
            className="mt-8 w-full px-6 py-4 bg-foreground text-background text-sm font-bold uppercase tracking-[0.2em] disabled:opacity-40 hover:bg-foreground/85 transition-colors"
          >
            {running ? "Processing…" : files.length > 0 ? "Begin Evaluation" : "Run Sample Evaluation"}
          </button>
        </div>

        {/* Pipeline */}
        <div className="p-6 md:p-10">
          <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-muted-foreground mb-6">
            Pipeline
          </p>
          <ol className="border border-border bg-card divide-y divide-border">
            {stages.map((s, i) => {
              const state =
                stage > i ? "done" : stage === i && running ? "active" : "pending";
              return (
                <li key={s.label} className="flex items-start gap-4 p-5">
                  <div className="mt-1 size-5 grid place-items-center shrink-0">
                    {state === "done" ? (
                      <div className="size-2 rotate-45 bg-foreground" />
                    ) : state === "active" ? (
                      <div className="size-2 rounded-full bg-foreground animate-pulse" />
                    ) : (
                      <div className="size-2 rounded-full border border-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Stage {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="font-serif text-lg leading-tight">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                      state === "done"
                        ? "text-status-eligible"
                        : state === "active"
                          ? "text-foreground"
                          : "text-muted-foreground/60"
                    }`}
                  >
                    {state}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
