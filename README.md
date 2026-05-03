# TenderLens AI

Explainable AI platform for automated tender evaluation and eligibility analysis.

## Overview

TenderLens AI is a web-based system that automates the evaluation of government tenders by extracting eligibility criteria from tender documents and matching them against bidder submissions.

The system processes unstructured documents (PDFs, scanned files, images) and generates structured, explainable decisions that can be audited and verified.

## Problem

Tender evaluation is typically:

- Manual and time-consuming
- Inconsistent across evaluators
- Dependent on unstructured documents
- Difficult to audit and verify

This results in delays, errors, and lack of transparency in procurement workflows.

## Solution

TenderLens AI provides an automated pipeline that:

- Extracts eligibility criteria from tender documents
- Processes bidder submissions across multiple formats
- Matches extracted data with defined criteria
- Generates clear and explainable decisions

Each evaluation produces:

- Eligibility status (Eligible / Not Eligible / Needs Review)
- Extracted values from documents
- Source references
- Reasoning behind decisions

## Features

- Automatic extraction of tender criteria
- Multi-format document support (PDF, scanned documents, images)
- OCR integration for non-digital files
- AI-based data extraction and matching
- Explainable decision engine
- Structured evaluation output

## How It Works

1. Upload a tender document
2. System extracts eligibility criteria
3. Upload bidder documents
4. System extracts relevant data using OCR and NLP
5. Matching engine evaluates bidder eligibility
6. Results are generated with explanations

## Explainability

The system provides transparent outputs for every decision:

Example:

- Criteria: Minimum turnover ≥ ₹5 Cr  
- Extracted Value: ₹4.8 Cr  
- Result: Not Eligible  
- Source: Financial Statement  

## Architecture

The system is divided into four layers:

Input Layer:
- Tender documents
- Bidder submissions

Processing Layer:
- OCR for scanned documents
- NLP/AI for data extraction

Intelligence Layer:
- Criteria matching engine
- Confidence scoring

Output Layer:
- Evaluation results
- Explanation data

## Tech Stack

- Frontend: React / Next.js
- Backend: Node.js / FastAPI
- OCR: PaddleOCR / Tesseract
- AI/NLP: Transformer models / LLM
- Database: PostgreSQL
- Deployment: Cloudflare Workers / Vercel

## Getting Started

### Clone the repository

```bash
git clone https://github.com/SUPREME-AKASH-DEVELOPER/tender-lens-ai.git
cd tender-lens-ai
````

### Install dependencies

```bash
npm install
# OR
pip install -r requirements.txt
```

### Run the application

```bash
npm start
# OR
uvicorn main:app --reload
```

### Run frontend

```bash
cd frontend
npm install
npm run dev
```

### Open in browser

[http://localhost:3000](http://localhost:3000)

## Impact

* Reduces evaluation time significantly
* Improves consistency and accuracy
* Enables transparent and auditable decisions
* Suitable for scalable procurement workflows

## Future Improvements

* Multilingual document support
* Advanced document understanding
* Improved confidence scoring models
* Integration with external systems

```

---

## ✅ This version is:
- Clean ✅  
- Professional ✅  
- Project-focused ✅  
- No hackathon noise ✅  

---

If you want next level:
- I can add **badges + screenshots + API docs (pro GitHub look)**  
- Or convert this into a **portfolio-grade project repo**

Just say 👍
```
