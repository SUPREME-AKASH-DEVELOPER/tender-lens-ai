// Mock tender + bidder data and a deterministic evaluation engine
// Simulates: criterion extraction, bidder data extraction, matching, reasoning.

export type Status = "eligible" | "ineligible" | "review";

export type CriterionType = "technical" | "financial" | "compliance";

export interface Criterion {
  id: string;
  code: string;
  type: CriterionType;
  title: string;
  requirement: string;
  // Source excerpt from the tender document
  source: {
    page: number;
    section: string;
    excerpt: string;
    highlight: string;
  };
}

export interface BidderEvidence {
  criterionId: string;
  // Extracted value from bidder docs
  extractedValue: string;
  source: {
    document: string;
    page: number;
    excerpt: string;
    highlight: string;
  };
}

export interface EvaluationResult {
  criterion: Criterion;
  evidence: BidderEvidence | null;
  status: Status;
  confidence: number; // 0..1
  reasoning: string;
}

export interface Bidder {
  id: string;
  name: string;
  registration: string;
  jurisdiction: string;
  submittedAt: string;
  documents: string[];
  evidence: BidderEvidence[];
}

export interface Tender {
  id: string;
  reference: string;
  title: string;
  authority: string;
  issuedAt: string;
  closingAt: string;
  estimatedValue: string;
  criteria: Criterion[];
}

// ------------------------------------------------------------------
// Sample tender
// ------------------------------------------------------------------

export const tender: Tender = {
  id: "tdr-9928",
  reference: "REF-9928-ALPHA",
  title: "Municipal Transit Expansion — Phase IV Infrastructure Works",
  authority: "Department of Public Works, Northern District",
  issuedAt: "2024-09-12",
  closingAt: "2024-11-04",
  estimatedValue: "USD 48,400,000",
  criteria: [
    {
      id: "c-101",
      code: "C-101",
      type: "financial",
      title: "Minimum Annual Turnover",
      requirement:
        "Average annual turnover of at least USD 12,000,000 over the past three (3) financial years.",
      source: {
        page: 14,
        section: "Section 4.1 — Financial Capacity",
        excerpt:
          "The proponent shall demonstrate an average annual turnover of not less than USD 12,000,000 calculated over the three (3) immediately preceding financial years, evidenced by audited statements.",
        highlight: "average annual turnover of not less than USD 12,000,000",
      },
    },
    {
      id: "c-102",
      code: "C-102",
      type: "financial",
      title: "Liquidity Ratio",
      requirement: "Net liquidity ratio of at least 1.50:1 in the most recent audited period.",
      source: {
        page: 15,
        section: "Section 4.2 — Solvency Protection",
        excerpt:
          "Proponents must show a net liquidity ratio of at least 1.50:1, calculated against outstanding short-term liabilities, in the most recent audited fiscal year.",
        highlight: "net liquidity ratio of at least 1.50:1",
      },
    },
    {
      id: "c-201",
      code: "C-201",
      type: "technical",
      title: "Comparable Project Experience",
      requirement:
        "At least two (2) completed transit infrastructure projects of value ≥ USD 20M within the last 7 years.",
      source: {
        page: 22,
        section: "Section 5.3 — Technical Track Record",
        excerpt:
          "Bidders shall provide evidence of having satisfactorily completed at least two transit infrastructure works contracts each valued at twenty million USD or more within the last seven calendar years.",
        highlight: "at least two transit infrastructure works contracts each valued at twenty million USD or more",
      },
    },
    {
      id: "c-202",
      code: "C-202",
      type: "technical",
      title: "Cold-Climate Operational History",
      requirement: "Documented operations in sub-zero (≤ -10°C) climates for ≥ 24 months.",
      source: {
        page: 24,
        section: "Section 5.5 — Climate Resilience",
        excerpt:
          "The contractor must provide documented evidence of continuous operational history in sub-zero climates of -10°C or lower for a minimum of twenty-four (24) months.",
        highlight: "twenty-four (24) months",
      },
    },
    {
      id: "c-301",
      code: "C-301",
      type: "compliance",
      title: "ISO 9001 Quality Certification",
      requirement: "Valid ISO 9001:2015 certification, with ≥ 6 months remaining post-award.",
      source: {
        page: 31,
        section: "Section 7.1 — Quality Management",
        excerpt:
          "A valid ISO 9001:2015 certification must be furnished, with no fewer than six (6) months of validity remaining beyond the projected award date.",
        highlight: "six (6) months of validity remaining",
      },
    },
    {
      id: "c-302",
      code: "C-302",
      type: "compliance",
      title: "Personnel Security Clearance",
      requirement: "100% of core implementation team must hold Level 2 National Vetting.",
      source: {
        page: 41,
        section: "Section 7.4 — Personnel Vetting",
        excerpt:
          "The entire core implementation team — being all named project leads in Appendix G — shall hold valid Level 2 National Vetting clearance from the National Security Bureau.",
        highlight: "Level 2 National Vetting",
      },
    },
    {
      id: "c-303",
      code: "C-303",
      type: "compliance",
      title: "Geopolitical Restrictions",
      requirement:
        "No direct or indirect ownership exceeding 10% by entities from restricted jurisdictions (Schedule B).",
      source: {
        page: 44,
        section: "Section 7.7 — Beneficial Ownership",
        excerpt:
          "No bidder shall be owned, directly or indirectly, by more than ten percent (10%) by any entity registered in jurisdictions enumerated in Schedule B of this document.",
        highlight: "more than ten percent (10%)",
      },
    },
  ],
};

// ------------------------------------------------------------------
// Sample bidders
// ------------------------------------------------------------------

export const bidders: Bidder[] = [
  {
    id: "bdr-001",
    name: "Global Infra-Structure Partners",
    registration: "GIP-2011-44829",
    jurisdiction: "Republic of Vendelar",
    submittedAt: "2024-10-22T14:32:00Z",
    documents: [
      "GIP_Audited_Financials_2021-2023.pdf",
      "GIP_Project_Portfolio.pdf",
      "GIP_ISO9001_Certificate.pdf",
      "GIP_Personnel_Roster_AppG.pdf",
      "GIP_Beneficial_Ownership_Disclosure.pdf",
    ],
    evidence: [
      {
        criterionId: "c-101",
        extractedValue: "USD 18,420,000 (3-yr avg)",
        source: {
          document: "GIP_Audited_Financials_2021-2023.pdf",
          page: 4,
          excerpt:
            "Total revenue across fiscal years 2021, 2022 and 2023 amounted to USD 14.2M, USD 19.1M and USD 21.96M respectively, yielding a three-year average of USD 18,420,000.",
          highlight: "three-year average of USD 18,420,000",
        },
      },
      {
        criterionId: "c-102",
        extractedValue: "1.84 : 1",
        source: {
          document: "GIP_Audited_Financials_2021-2023.pdf",
          page: 14,
          excerpt:
            "As at 31 December 2023, current assets of USD 32.4M against current liabilities of USD 17.6M yield a net liquidity ratio of 1.84 : 1.",
          highlight: "net liquidity ratio of 1.84 : 1",
        },
      },
      {
        criterionId: "c-201",
        extractedValue: "3 qualifying projects (USD 24M, 31M, 47M)",
        source: {
          document: "GIP_Project_Portfolio.pdf",
          page: 7,
          excerpt:
            "Completed contracts include the Vendelar Light-Rail Extension (USD 24M, 2021), Northport Bus Terminal (USD 31M, 2022) and the Eastline Tunnel Refit (USD 47M, 2023).",
          highlight: "USD 24M, 2021)... USD 31M, 2022)... USD 47M, 2023",
        },
      },
      {
        criterionId: "c-202",
        extractedValue: "Partial — 11 months of cold-climate ops documented",
        source: {
          document: "GIP_Project_Portfolio.pdf",
          page: 19,
          excerpt:
            "The Eastline Tunnel Refit was conducted in ambient temperatures of -14°C for the period January 2023 through November 2023, totalling approximately 11 months of continuous sub-zero operations.",
          highlight: "11 months of continuous sub-zero operations",
        },
      },
      {
        criterionId: "c-301",
        extractedValue: "Valid until 15 November 2024",
        source: {
          document: "GIP_ISO9001_Certificate.pdf",
          page: 1,
          excerpt:
            "This is to certify that Global Infra-Structure Partners holds ISO 9001:2015 certification, valid through 15 November 2024.",
          highlight: "valid through 15 November 2024",
        },
      },
      {
        criterionId: "c-302",
        extractedValue: "12 of 12 leads cleared (Level 2)",
        source: {
          document: "GIP_Personnel_Roster_AppG.pdf",
          page: 3,
          excerpt:
            "All twelve (12) named project leads listed in Appendix G hold active Level 2 National Vetting clearances issued by the National Security Bureau, verified by cryptographic signature.",
          highlight: "All twelve (12) named project leads ... Level 2 National Vetting",
        },
      },
      {
        criterionId: "c-303",
        extractedValue: "0% restricted-jurisdiction ownership",
        source: {
          document: "GIP_Beneficial_Ownership_Disclosure.pdf",
          page: 2,
          excerpt:
            "No beneficial owner holds shares from any jurisdiction enumerated in Schedule B. Total restricted-jurisdiction ownership: 0.0%.",
          highlight: "Total restricted-jurisdiction ownership: 0.0%",
        },
      },
    ],
  },
  {
    id: "bdr-002",
    name: "Northbridge Civil Works Ltd.",
    registration: "NCW-1998-00112",
    jurisdiction: "Kingdom of Talos",
    submittedAt: "2024-10-23T09:15:00Z",
    documents: [
      "NCW_Financial_Summary.pdf",
      "NCW_Project_References.pdf",
      "NCW_ISO9001.pdf",
      "NCW_Personnel.pdf",
      "NCW_Ownership.pdf",
    ],
    evidence: [
      {
        criterionId: "c-101",
        extractedValue: "USD 9,600,000 (3-yr avg)",
        source: {
          document: "NCW_Financial_Summary.pdf",
          page: 2,
          excerpt:
            "The three-year revenue average for fiscal years 2021–2023 stands at USD 9,600,000.",
          highlight: "USD 9,600,000",
        },
      },
      {
        criterionId: "c-102",
        extractedValue: "2.10 : 1",
        source: {
          document: "NCW_Financial_Summary.pdf",
          page: 6,
          excerpt: "Liquidity ratio reported at 2.10 : 1 as at the most recent audit close.",
          highlight: "2.10 : 1",
        },
      },
      {
        criterionId: "c-201",
        extractedValue: "4 qualifying transit projects",
        source: {
          document: "NCW_Project_References.pdf",
          page: 3,
          excerpt:
            "Northbridge has delivered four transit infrastructure projects above USD 20M between 2018 and 2024.",
          highlight: "four transit infrastructure projects above USD 20M",
        },
      },
      {
        criterionId: "c-202",
        extractedValue: "38 months continuous sub-zero operations",
        source: {
          document: "NCW_Project_References.pdf",
          page: 11,
          excerpt:
            "Documented operational history in -18°C average conditions across the Talos Northern Corridor (Aug 2020 – Oct 2023), totalling 38 months.",
          highlight: "38 months",
        },
      },
      {
        criterionId: "c-301",
        extractedValue: "Valid until 04 August 2026",
        source: {
          document: "NCW_ISO9001.pdf",
          page: 1,
          excerpt: "ISO 9001:2015 certificate valid through 04 August 2026.",
          highlight: "04 August 2026",
        },
      },
      {
        criterionId: "c-302",
        extractedValue: "10 of 14 leads cleared",
        source: {
          document: "NCW_Personnel.pdf",
          page: 4,
          excerpt:
            "Of the 14 named leads in Appendix G, 10 hold active Level 2 clearance; 4 are pending re-vetting as of submission.",
          highlight: "10 hold active Level 2 clearance; 4 are pending",
        },
      },
      {
        criterionId: "c-303",
        extractedValue: "0% restricted-jurisdiction ownership",
        source: {
          document: "NCW_Ownership.pdf",
          page: 2,
          excerpt: "No Schedule B exposure declared.",
          highlight: "No Schedule B exposure",
        },
      },
    ],
  },
  {
    id: "bdr-003",
    name: "Sterling Continental Engineering",
    registration: "SCE-2007-77910",
    jurisdiction: "Federation of Aral",
    submittedAt: "2024-10-23T17:45:00Z",
    documents: [
      "SCE_Financials.pdf",
      "SCE_Portfolio.pdf",
      "SCE_ISO.pdf",
      "SCE_Personnel.pdf",
      "SCE_Ownership.pdf",
    ],
    evidence: [
      {
        criterionId: "c-101",
        extractedValue: "USD 31,200,000 (3-yr avg)",
        source: {
          document: "SCE_Financials.pdf",
          page: 3,
          excerpt: "Three-year average revenue: USD 31,200,000.",
          highlight: "USD 31,200,000",
        },
      },
      {
        criterionId: "c-102",
        extractedValue: "1.62 : 1",
        source: {
          document: "SCE_Financials.pdf",
          page: 8,
          excerpt: "Liquidity ratio of 1.62 : 1 reported in the FY2023 audit.",
          highlight: "1.62 : 1",
        },
      },
      {
        criterionId: "c-201",
        extractedValue: "5 qualifying projects",
        source: {
          document: "SCE_Portfolio.pdf",
          page: 2,
          excerpt: "Five transit-class infrastructure projects above USD 20M completed since 2019.",
          highlight: "Five transit-class infrastructure projects above USD 20M",
        },
      },
      {
        criterionId: "c-202",
        extractedValue: "27 months sub-zero operations",
        source: {
          document: "SCE_Portfolio.pdf",
          page: 9,
          excerpt: "Aral Highland Project: 27 months of continuous operations at -12°C average.",
          highlight: "27 months",
        },
      },
      {
        criterionId: "c-301",
        extractedValue: "Valid until 22 March 2027",
        source: {
          document: "SCE_ISO.pdf",
          page: 1,
          excerpt: "ISO 9001:2015 valid through 22 March 2027.",
          highlight: "22 March 2027",
        },
      },
      {
        criterionId: "c-302",
        extractedValue: "16 of 16 leads cleared",
        source: {
          document: "SCE_Personnel.pdf",
          page: 5,
          excerpt: "All 16 named leads in Appendix G hold Level 2 clearance.",
          highlight: "All 16 named leads ... Level 2",
        },
      },
      {
        criterionId: "c-303",
        extractedValue: "14% indirect ownership via Schedule B entity",
        source: {
          document: "SCE_Ownership.pdf",
          page: 3,
          excerpt:
            "Indirect beneficial ownership of 14% traced through Aral Strategic Holdings, an entity registered in a Schedule B jurisdiction.",
          highlight: "14% traced through Aral Strategic Holdings",
        },
      },
    ],
  },
];

// ------------------------------------------------------------------
// Evaluation engine — deterministic per-criterion rules with reasoning
// ------------------------------------------------------------------

interface Rule {
  evaluate: (extracted: string) => { status: Status; confidence: number; reasoning: string };
}

const rules: Record<string, Rule> = {
  "c-101": {
    evaluate: (v) => {
      const m = v.match(/USD\s*([\d,]+)/);
      const value = m ? Number(m[1].replace(/,/g, "")) : 0;
      const threshold = 12_000_000;
      if (value >= threshold)
        return {
          status: "eligible",
          confidence: 0.97,
          reasoning: `Extracted three-year average turnover of USD ${value.toLocaleString()} exceeds the required threshold of USD ${threshold.toLocaleString()} by ${(((value - threshold) / threshold) * 100).toFixed(1)}%.`,
        };
      return {
        status: "ineligible",
        confidence: 0.95,
        reasoning: `Extracted turnover of USD ${value.toLocaleString()} falls short of the mandatory minimum of USD ${threshold.toLocaleString()}. Shortfall of USD ${(threshold - value).toLocaleString()}.`,
      };
    },
  },
  "c-102": {
    evaluate: (v) => {
      const m = v.match(/([\d.]+)\s*:\s*1/);
      const value = m ? Number(m[1]) : 0;
      const threshold = 1.5;
      if (value >= threshold)
        return {
          status: "eligible",
          confidence: 0.96,
          reasoning: `Liquidity ratio of ${value.toFixed(2)}:1 satisfies the ≥${threshold.toFixed(2)}:1 requirement.`,
        };
      return {
        status: "ineligible",
        confidence: 0.94,
        reasoning: `Reported liquidity ratio of ${value.toFixed(2)}:1 is below the mandatory ${threshold.toFixed(2)}:1 floor.`,
      };
    },
  },
  "c-201": {
    evaluate: (v) => {
      const m = v.match(/(\d+)/);
      const count = m ? Number(m[1]) : 0;
      if (count >= 2)
        return {
          status: "eligible",
          confidence: 0.93,
          reasoning: `Identified ${count} qualifying projects ≥ USD 20M within the trailing 7-year window. Requirement is 2.`,
        };
      return {
        status: "ineligible",
        confidence: 0.9,
        reasoning: `Only ${count} qualifying project(s) found; requirement is at least 2.`,
      };
    },
  },
  "c-202": {
    evaluate: (v) => {
      const m = v.match(/(\d+)\s*month/i);
      const months = m ? Number(m[1]) : 0;
      const threshold = 24;
      if (months >= threshold)
        return {
          status: "eligible",
          confidence: 0.91,
          reasoning: `Documented ${months} months of continuous sub-zero operations meets the 24-month threshold.`,
        };
      if (months >= threshold - 18)
        return {
          status: "review",
          confidence: 0.62,
          reasoning: `Only ${months} months of continuous sub-zero operations documented (threshold: 24). Bidder may have additional unindexed evidence; manual verification of project annexes recommended.`,
        };
      return {
        status: "ineligible",
        confidence: 0.88,
        reasoning: `${months} months documented; falls materially short of the 24-month requirement.`,
      };
    },
  },
  "c-301": {
    evaluate: (v) => {
      // accept dates like "15 November 2024" or "04 August 2026"
      const d = new Date(v.replace(/^Valid until\s+/i, ""));
      const awardDate = new Date("2024-12-01");
      const minValid = new Date(awardDate);
      minValid.setMonth(minValid.getMonth() + 6);
      if (Number.isNaN(d.getTime()))
        return {
          status: "review",
          confidence: 0.4,
          reasoning: `Could not parse certificate expiry from extracted value. Manual confirmation required.`,
        };
      if (d >= minValid)
        return {
          status: "eligible",
          confidence: 0.97,
          reasoning: `ISO 9001 expiry (${d.toDateString()}) provides ≥ 6 months of validity beyond the projected award date.`,
        };
      const fmt = d.toDateString();
      return {
        status: "review",
        confidence: 0.7,
        reasoning: `Certificate expires ${fmt}, before the required ${minValid.toDateString()} cutoff (6 months post-award). Bidder may renew before award; flag for confirmation.`,
      };
    },
  },
  "c-302": {
    evaluate: (v) => {
      const m = v.match(/(\d+)\s*of\s*(\d+)/i);
      if (!m)
        return {
          status: "review",
          confidence: 0.5,
          reasoning: `Could not parse personnel clearance ratio from extracted value.`,
        };
      const cleared = Number(m[1]);
      const total = Number(m[2]);
      if (cleared === total)
        return {
          status: "eligible",
          confidence: 0.98,
          reasoning: `All ${total} named project leads in Appendix G hold Level 2 clearance (100%).`,
        };
      const pct = (cleared / total) * 100;
      return {
        status: "ineligible",
        confidence: 0.93,
        reasoning: `${cleared} of ${total} leads cleared (${pct.toFixed(0)}%). Requirement mandates 100% clearance.`,
      };
    },
  },
  "c-303": {
    evaluate: (v) => {
      const m = v.match(/(\d+(?:\.\d+)?)\s*%/);
      const pct = m ? Number(m[1]) : 0;
      if (pct <= 10)
        return {
          status: "eligible",
          confidence: 0.96,
          reasoning: `Restricted-jurisdiction ownership of ${pct}% is at or below the 10% ceiling.`,
        };
      return {
        status: "ineligible",
        confidence: 0.97,
        reasoning: `Restricted-jurisdiction ownership of ${pct}% breaches the 10% maximum permitted under Schedule B.`,
      };
    },
  },
};

export function evaluateBidder(bidder: Bidder, t: Tender = tender): EvaluationResult[] {
  return t.criteria.map((criterion) => {
    const evidence = bidder.evidence.find((e) => e.criterionId === criterion.id) ?? null;
    if (!evidence) {
      return {
        criterion,
        evidence: null,
        status: "review" as Status,
        confidence: 0.3,
        reasoning:
          "No matching evidence located in bidder submission. Criterion cannot be auto-determined; route to human reviewer.",
      };
    }
    const rule = rules[criterion.id];
    if (!rule) {
      return {
        criterion,
        evidence,
        status: "review" as Status,
        confidence: 0.5,
        reasoning: "No automated rule registered for this criterion; manual review required.",
      };
    }
    const out = rule.evaluate(evidence.extractedValue);
    return { criterion, evidence, ...out };
  });
}

export function summarizeResults(results: EvaluationResult[]) {
  const counts = { eligible: 0, ineligible: 0, review: 0 };
  let confSum = 0;
  for (const r of results) {
    counts[r.status]++;
    confSum += r.confidence;
  }
  const avgConfidence = results.length ? confSum / results.length : 0;
  let overall: Status = "eligible";
  if (counts.ineligible > 0) overall = "ineligible";
  else if (counts.review > 0) overall = "review";
  return { ...counts, total: results.length, avgConfidence, overall };
}

export function getBidder(id: string) {
  return bidders.find((b) => b.id === id);
}
