# Debt Collection Rights Advisor

AI agent that helps consumers understand their rights under the Fair Debt Collection Practices Act (FDCPA) and fight back against abusive debt collectors. Analyzes collector behavior for violations, checks statute of limitations, researches the collector's complaint history, and generates personalized dispute letters and defense strategies.

## The Problem

**70 million Americans** are contacted by debt collectors every year. Over 1 in 4 feel threatened. 56% report collectors trying to collect debts they don't owe. 75% who request cease-contact say collectors ignore them. CFPB received 207,800 debt collection complaints in 2024 — nearly double the year before.

Yet ALL AI tools in debt collection serve the *collector* side (Skit.ai, Floatbot, Vodex). Zero serve consumers. Free template letters exist but require you to already know the FDCPA. SoloSuit charges $99-300 for dispute responses. There's no free tool that analyzes your specific situation for violations, checks your state's statute of limitations, and generates customized dispute letters.

## How It Works

```
Tell the agent about the debt collector
         │
         ▼
┌──────────────────────────┐
│  analyze_debt_situation   │ ← Identifies FDCPA violations in
│                           │   collector behavior, checks statute
│                           │   of limitations, assesses rights
└────────────┬──────────────┘
             │
             ▼
┌──────────────────────────┐
│  search_debt_collection  │ ← Searches for state-specific debt
│  _laws                   │   collection laws beyond federal FDCPA
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  research_collector      │ ← Checks collector's CFPB complaints,
│  _record                 │   BBB rating, enforcement actions
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  write_dispute_letter    │ ← Generates validation demand letter,
│                          │   cease-and-desist, credit bureau
│                          │   dispute, CFPB complaint guide,
│                          │   escalation timeline
└──────────────────────────┘
```

## Example Prompts

- "A company called Midland Credit Management keeps calling me about a $3,200 credit card debt. They call 3-4 times a day and threatened to garnish my wages. I'm in Texas and I think the last payment was in 2020."
- "I got a letter from Portfolio Recovery Associates about a medical bill for $1,800. I don't recognize this debt and they never sent me a validation notice. I'm in California."
- "A debt collector called my mother and told her I owe money. Then they called my work. I live in Florida."
- "Someone from Enhanced Recovery Company keeps texting me about a $500 utility bill. They text after 10 PM. Is this legal?"

## Tools

| Tool | Description |
|------|-------------|
| `analyze_debt_situation` | Analyzes collector behavior for FDCPA violations, checks statute of limitations by state and debt type, identifies consumer rights and recommended actions |
| `search_debt_collection_laws` | Searches for state-specific debt collection laws, CFPB Regulation F updates, and consumer protection rules |
| `research_collector_record` | Researches collector's CFPB complaints, BBB rating, consumer reviews, FTC/AG enforcement actions |
| `write_dispute_letter` | Generates personalized debt validation demand, cease-and-desist, credit bureau dispute letters, plus CFPB complaint guide and escalation timeline |
| `web_search` | General web search for additional research |
| `web_fetch` | Fetch and extract content from web pages |
| `file_write` | Save dispute letters and plans to disk |
| `file_read` | Read files from disk |

## Key Features

- **FDCPA Violation Detection**: Analyzes collector behavior against 12+ violation categories (false threats, prohibited call times, third-party contact, harassment, missing validation, etc.)
- **Statute of Limitations**: Built-in SOL data for all 50 states + DC across 4 debt categories
- **Three Letter Templates**: Debt validation demand, cease-and-desist, and credit bureau dispute
- **Regulatory Filing Guidance**: CFPB complaint, state AG complaint, and FTC report instructions
- **Attorney Referral**: NACA attorney finder for FDCPA cases (taken on contingency)

## Quick Start

```bash
npm install
cp .env.example .env
# Set OPENROUTER_API_KEY (or ANTHROPIC_API_KEY) in .env
npm run dev
# Open http://localhost:3000
```

## Why This Matters

- $1,000 statutory damages per FDCPA violation + actual damages + attorney's fees
- Debt collectors make 1 billion+ contacts per year, many in violation of federal law
- CFPB enforcement is declining due to budget cuts — consumers need self-help tools
- All existing AI tools serve collectors, not consumers
- This tool is **free** and helps level the playing field

## Disclaimer

This tool provides **informational guidance only**, not legal advice. Debt collection law is complex and varies by state. For disputes involving large amounts or FDCPA violations, consult a consumer rights attorney — many take these cases on contingency (no upfront cost). Never use this tool as a substitute for professional legal counsel.

---

Built on the [Agentic Harness](../../seed/README.md) — a minimal, self-hosted AI agent framework.
