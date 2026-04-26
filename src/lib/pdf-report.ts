import jsPDF from "jspdf";
import {
  type Bidder,
  type EvaluationResult,
  type Status,
  summarizeResults,
  tender,
} from "./tender-data";

const statusLabel: Record<Status, string> = {
  eligible: "ELIGIBLE",
  ineligible: "NOT ELIGIBLE",
  review: "NEEDS REVIEW",
};

export function generateBidderReport(
  bidder: Bidder,
  results: EvaluationResult[],
  opts: {
    overrides: Record<string, Status>;
    notes: string;
    attested: boolean;
  },
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;

  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const hr = () => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };

  const text = (
    str: string,
    opts2: {
      size?: number;
      style?: "normal" | "bold" | "italic";
      color?: [number, number, number];
      font?: "helvetica" | "times";
      indent?: number;
      lineGap?: number;
    } = {},
  ) => {
    const {
      size = 10,
      style = "normal",
      color = [20, 20, 19],
      font = "helvetica",
      indent = 0,
      lineGap = 2,
    } = opts2;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(str, contentW - indent) as string[];
    for (const ln of lines) {
      ensureSpace(size + lineGap);
      doc.text(ln, margin + indent, y);
      y += size + lineGap;
    }
  };

  // ---- Header ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(82);
  doc.text("SYSTEM PROTOCOL v.4.12  ·  TENDERLENS AI", margin, y);
  y += 14;
  doc.setFont("times", "normal");
  doc.setFontSize(22);
  doc.setTextColor(20);
  doc.text("Evaluation Record", margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(82);
  doc.text(
    `Dossier ${tender.reference}  ·  ${tender.title}`,
    margin,
    y,
  );
  y += 12;
  doc.text(
    `Generated ${new Date().toLocaleString()}`,
    margin,
    y,
  );
  y += 16;
  hr();

  // ---- Bidder block ----
  text("ENTITY", { size: 8, style: "bold", color: [82, 82, 78] });
  text(bidder.name, { size: 16, font: "times" });
  text(
    `${bidder.registration}  ·  ${bidder.jurisdiction}`,
    { size: 9, color: [82, 82, 78] },
  );
  text(`Submitted ${new Date(bidder.submittedAt).toLocaleString()}`, {
    size: 9,
    color: [82, 82, 78],
  });
  y += 6;

  // ---- Determination ----
  const finalResults = results.map((r) => ({
    ...r,
    finalStatus: opts.overrides[r.criterion.id] ?? r.status,
    overridden: Boolean(opts.overrides[r.criterion.id]),
  }));
  const finalSummary = summarizeResults(
    finalResults.map((r) => ({ ...r, status: r.finalStatus })),
  );

  ensureSpace(60);
  doc.setFillColor(245, 241, 230);
  doc.rect(margin, y, contentW, 56, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(82);
  doc.text("DETERMINATION", margin + 12, y + 16);
  doc.setFont("times", "italic");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text(statusLabel[finalSummary.overall], margin + 12, y + 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(82);
  const rightLines = [
    `Eligible:     ${finalSummary.eligible} / ${finalSummary.total}`,
    `Needs Review: ${finalSummary.review} / ${finalSummary.total}`,
    `Not Eligible: ${finalSummary.ineligible} / ${finalSummary.total}`,
    `Avg Conf.:    ${(finalSummary.avgConfidence * 100).toFixed(1)}%`,
  ];
  rightLines.forEach((ln, i) => {
    doc.text(ln, pageW - margin - 12, y + 14 + i * 11, { align: "right" });
  });
  y += 72;

  // ---- Criteria ----
  text("CRITERION-BY-CRITERION EVIDENCE", {
    size: 8,
    style: "bold",
    color: [82, 82, 78],
  });
  y += 4;
  hr();

  for (const r of finalResults) {
    ensureSpace(80);
    const blockStart = y;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(82);
    doc.text(
      `${r.criterion.code}  ·  ${r.criterion.type.toUpperCase()}`,
      margin,
      y,
    );

    // Status pill (right-aligned)
    const pill = statusLabel[r.finalStatus];
    doc.setFontSize(8);
    const pillW = doc.getTextWidth(pill) + 12;
    const colors: Record<Status, [number, number, number]> = {
      eligible: [36, 61, 37],
      review: [120, 90, 20],
      ineligible: [92, 29, 29],
    };
    const [pr, pg, pb] = colors[r.finalStatus];
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.7);
    doc.rect(pageW - margin - pillW, y - 9, pillW, 13);
    doc.setTextColor(pr, pg, pb);
    doc.text(pill, pageW - margin - pillW / 2, y, { align: "center" });
    y += 14;

    text(r.criterion.title, { size: 13, font: "times" });
    text(r.criterion.requirement, {
      size: 9,
      color: [82, 82, 78],
    });
    y += 4;

    text("Extracted Value", { size: 8, style: "bold", color: [82, 82, 78] });
    text(r.evidence?.extractedValue ?? "Not located", {
      size: 11,
      font: "times",
      style: r.evidence ? "normal" : "italic",
    });
    y += 2;

    text("Reasoning", { size: 8, style: "bold", color: [82, 82, 78] });
    text(r.reasoning, { size: 10 });
    y += 2;

    if (r.evidence) {
      text("Source", { size: 8, style: "bold", color: [82, 82, 78] });
      text(
        `${r.evidence.source.document}  ·  p.${r.evidence.source.page}`,
        { size: 9, color: [82, 82, 78] },
      );
      text(`"${r.evidence.source.excerpt}"`, {
        size: 9,
        font: "times",
        style: "italic",
      });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(82);
    const meta = `Confidence ${(r.confidence * 100).toFixed(1)}%${r.overridden ? `  ·  OPERATOR OVERRIDE (was ${r.status})` : ""}`;
    ensureSpace(12);
    doc.text(meta, margin, y);
    y += 14;

    // Vertical rule on the left of the block
    doc.setDrawColor(220);
    doc.setLineWidth(0.5);
    doc.line(margin - 10, blockStart - 8, margin - 10, y - 6);

    hr();
  }

  // ---- Audit Trail ----
  ensureSpace(80);
  text("AUDIT TRAIL", { size: 8, style: "bold", color: [82, 82, 78] });
  y += 4;

  const trail: string[] = [
    `[14:32:01]  Document intake — ${bidder.documents.length} files received, checksum verified.`,
    `[14:32:04]  OCR pipeline complete · 47 pages · 3 scanned facsimiles processed.`,
    `[14:32:09]  Criterion extraction · ${tender.criteria.length} criteria located in tender.`,
    `[14:32:14]  Evidence matching · ${results.length} of ${tender.criteria.length} criteria resolved.`,
  ];
  for (const [cid, st] of Object.entries(opts.overrides)) {
    trail.push(`[ — ]       Operator override · ${cid.toUpperCase()} → ${st.toUpperCase()}`);
  }
  if (opts.notes.trim()) {
    trail.push(`[ — ]       Reviewer note attached (${opts.notes.length} chars).`);
  }
  trail.push(
    `[ — ]       Final determination: ${statusLabel[finalSummary.overall]}${opts.attested ? " · ATTESTED" : ""}.`,
  );

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(82);
  for (const line of trail) {
    const wrapped = doc.splitTextToSize(line, contentW) as string[];
    for (const ln of wrapped) {
      ensureSpace(12);
      doc.text(ln, margin, y);
      y += 11;
    }
  }
  y += 6;

  if (opts.notes.trim()) {
    ensureSpace(40);
    text("REVIEWER NOTES", { size: 8, style: "bold", color: [82, 82, 78] });
    text(opts.notes, { size: 10, font: "times", style: "italic" });
  }

  // ---- Page footers ----
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text(
      `TENDERLENS AI · ${tender.reference} · ${bidder.name}`,
      margin,
      pageH - 20,
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageW - margin,
      pageH - 20,
      { align: "right" },
    );
  }

  const safeName = bidder.name.replace(/[^a-z0-9]+/gi, "_");
  doc.save(`TenderLens_${tender.reference}_${safeName}.pdf`);
}
