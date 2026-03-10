# Consumer Complaint Resolution Advisor

A free AI agent that helps consumers fight back when companies wrong them. Tell it what happened, and it figures out which agencies to file with, drafts complaint letters, researches the company's track record, and gives you a step-by-step escalation plan.

## The Problem

Every year, millions of Americans get ripped off, overcharged, or poorly served by companies — and most don't know what to do about it. The system is fragmented:

- **CFPB** handles financial complaints
- **FTC** tracks fraud and deception
- **FCC** covers telecom issues
- **State AG** enforces state consumer protection laws
- **BBB** is optional but sometimes effective
- **Small claims court** is powerful but intimidating

Most people don't know which agency handles their type of complaint, what their state-specific rights are, or how to write an effective complaint letter. So they give up. The company wins.

**This agent changes that.** It's like having a consumer advocate in your pocket — for free.

## How It Works

```
YOU describe your complaint
    ↓
ANALYZE → classify complaint type, identify relevant agencies
    ↓
SEARCH → find your state-specific consumer protection rights
    ↓
RESEARCH → check the company's complaint history (CFPB, BBB, lawsuits)
    ↓
GENERATE → personalized resolution plan with complaint letters,
           agency filing links, escalation timeline, and tips
```

## What You Get

- **Agency routing**: Which agencies to file with and WHY (CFPB, FTC, FCC, state AG, etc.)
- **Complaint letter templates**: Ready-to-send letters customized to your situation
- **State-specific rights**: What consumer protection laws apply in your state
- **Company research**: The company's complaint history and how they respond
- **Escalation timeline**: Day-by-day plan (company → agencies → chargeback → small claims)
- **Credit card chargeback guidance**: Often the fastest way to get money back

## Quick Start

```bash
git clone <repo-url> consumer-complaint-advisor
cd consumer-complaint-advisor
cp .env.example .env
# Add your OPENROUTER_API_KEY (or ANTHROPIC_API_KEY)
npm install
npm run dev
# Open http://localhost:3000
```

## Example Prompts

- "Comcast has been charging me $40/month for a service I cancelled 3 months ago. I've called 5 times and they keep saying they'll fix it but never do. I'm in California."
- "I bought a laptop from Best Buy that stopped working after 2 weeks. They say it's out of the return window and the manufacturer warranty doesn't cover it. Texas."
- "A debt collector keeps calling me about a debt I already paid. They call 3-4 times a day, even after I told them to stop. New York."
- "I signed up for a free trial that auto-converted to a $99/year subscription. I never agreed to be charged and I can't find how to cancel. Florida."

## Tools

| Tool | Description |
|------|-------------|
| `analyze_complaint` | Classifies complaint type, identifies agencies, recommends escalation strategy |
| `search_consumer_rights` | Searches for state-specific consumer protection laws |
| `research_company_complaints` | Researches company's complaint history on CFPB, BBB, and web |
| `write_resolution_plan` | Generates comprehensive plan with letters, timelines, and instructions |
| `web_search` | General web search |
| `web_fetch` | Fetch and read web page content |

## Why This Matters

- **CFPB complaints up 89.1% YoY** — consumer problems are growing
- **20M+ households** have unresolved ISP complaints alone
- **CFPB being defunded** — consumers need self-help tools more than ever
- **61% of consumers** don't know which agency handles their type of complaint
- **FairShake** charges a fee — this is free
- **USA.gov** has a directory, not a personalized advisor

## Limitations

- This is **not legal advice** — consult an attorney for complex disputes
- Cannot file complaints on your behalf — provides guidance and templates
- Consumer protection laws change — research results reflect current web data
- Company complaint data depends on public records availability

## License

MIT
