# Flight Rights Advisor

AI agent that helps airline passengers understand their rights and claim compensation for flight disruptions — cancellations, delays, denied boarding, baggage issues, and downgrades.

## The Problem

When your flight gets cancelled or delayed, airlines count on passengers not knowing their rights. The average passenger leaves **$200-$600** on the table per disruption. The US DOT's 2024 automatic refund rule means airlines must refund cancelled flights without you even asking — but many still don't comply. EU261 entitles you to up to **€600** in fixed compensation. Yet most passengers either don't file claims or accept lowball vouchers.

Existing claim services (AirHelp, Flightright) take **25-50% commission** on your compensation. Free letter generators produce generic templates without analyzing your specific rights. There's no free tool that combines disruption analysis, rights research, airline reputation data, and personalized claim plans.

## How It Works

```
Tell the agent your flight details
         │
         ▼
┌─────────────────────────┐
│  analyze_flight_disruption │ ← Determines applicable regulations
│  (US DOT, EU261, APPR)     │   (US DOT, EU261, Canadian APPR),
│                             │   estimates compensation, identifies
│                             │   your specific rights
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────┐
│  search_airline_rights   │ ← Searches for latest regulatory
│                          │   updates and airline-specific policies
└────────────┬─────────────┘
             │
             ▼
┌─────────────────────────┐
│  research_airline_record │ ← Checks airline's DOT complaint
│                          │   history, on-time stats, reputation
└────────────┬─────────────┘
             │
             ▼
┌─────────────────────────┐
│  write_claim_plan        │ ← Generates complete claim plan:
│                          │   claim letter, DOT complaint filing,
│                          │   EU261 NEB guidance, chargeback steps,
│                          │   escalation timeline
└──────────────────────────┘
```

## Example Prompts

- "My United flight UA 1234 from Chicago to London on March 5 was cancelled. They offered a voucher but I want a cash refund."
- "Delta flight DL 567 from JFK to CDG was delayed 5 hours. What compensation am I entitled to?"
- "I was denied boarding on American Airlines AA 890 from LAX to Miami due to overbooking."
- "My Lufthansa flight from Frankfurt to New York lost my checked bag and it's been 3 days."
- "Air Canada flight AC 123 from Toronto to Vancouver was delayed 7 hours due to a crew shortage."

## Tools

| Tool | Description |
|------|-------------|
| `analyze_flight_disruption` | Determines applicable regulations based on route/airline, calculates compensation eligibility, handles cancellations/delays/denied boarding/baggage/downgrades |
| `search_airline_rights` | Searches for current passenger rights regulations, DOT rule changes, EU261 updates, airline-specific policies |
| `research_airline_record` | Researches airline's DOT complaint history, on-time performance, consumer reviews, refund processing reputation |
| `write_claim_plan` | Generates comprehensive claim plan with airline claim letter, DOT complaint instructions, EU261 NEB guidance, credit card chargeback steps, escalation timeline |
| `web_search` | General web search for additional research |
| `web_fetch` | Fetch and extract content from web pages |
| `file_write` | Save claim plans and reports to disk |
| `file_read` | Read files from disk |

## Regulations Covered

- **US DOT** — 2024 Final Rule on Automatic Refunds, denied boarding compensation, tarmac delay rules
- **EU Regulation 261/2004** — Fixed compensation (€250-€600), right to care, extraordinary circumstances
- **Canadian APPR** — Air Passenger Protection Regulations ($125-$1,000 CAD)
- **Credit Card Rights** — Fair Credit Billing Act chargeback procedures

## Quick Start

```bash
npm install
cp .env.example .env
# Set OPENROUTER_API_KEY (or ANTHROPIC_API_KEY) in .env
npm run dev
# Open http://localhost:3000
```

## Why This Matters

- Airlines collected **$700M+** in cancellation/change fees in 2023 before DOT's new rules
- Only **15%** of eligible EU passengers claim their EU261 compensation
- DOT complaints are up — but enforcement is down due to budget cuts
- Claim services charge **25-50% commission** on money that's rightfully yours
- This tool is **free** and helps you keep 100% of your compensation

## Disclaimer

This tool provides **informational guidance only**, not legal advice. Airline passenger rights are complex and vary by jurisdiction. For disputes involving large amounts, consult a consumer rights attorney. Always verify current regulations before filing claims.

---

Built on the [Agentic Harness](../../seed/README.md) — a minimal, self-hosted AI agent framework.
