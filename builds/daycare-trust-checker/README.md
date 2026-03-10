# Daycare Trust Checker

> Research your daycare in 30 seconds, not 30 browser tabs.

An AI agent that checks childcare licenses, inspection violations, parent reviews, complaints, and accreditation before you enroll — consolidating research across 50 fragmented state databases into one report.

## The Problem

Parents check 5+ sources before choosing a daycare:
- State licensing database (is the license active? any violations?)
- Google Reviews / Yelp / Care.com (what do other parents say?)
- News search (any incidents or investigations?)
- BBB (any formal complaints?)
- Facility website (do they share curriculum, staff info, ratios?)

Every state has a **completely different** licensing database and UI. Data is fragmented across 50+ systems. This takes 30-60 minutes per facility, and parents typically evaluate 3-5 options.

## How It Works

```
You: "Check Little Stars Academy in Austin, Texas"

Agent:
  1. search_daycare        → Find web presence, state license info, review listings, inspection records
  2. verify_daycare        → Check complaints, news incidents, violations, BBB, accreditation, review patterns
  3. write_daycare_report  → Trust score 1-10, red/green flags, enroll/avoid recommendation
```

## What Gets Checked

| Check | Method | What It Reveals |
|-------|--------|-----------------|
| Web presence | DuckDuckGo search | Website, professionalism, online footprint |
| State license | License database search | Active, expired, suspended, or not found |
| Inspections | Violation search | Health, safety, ratio, supervision findings |
| Parent reviews | Multi-platform search | Google, Yelp, Care.com, Winnie review patterns |
| Complaints | Web search | Abuse, neglect, safety reports, warnings |
| News incidents | News search | Injuries, investigations, closures |
| BBB profile | BBB search | Formal complaints and resolution |
| Accreditation | NAEYC / quality search | Gold-standard accreditation status |
| Website quality | Direct fetch | Phone, address, curriculum, staff info |

## Trust Score Guide

| Score | Label | Meaning |
|-------|-------|---------|
| 8-10 | TRUSTED | Licensed, clean record, good reviews. Visit and enroll with confidence. |
| 5-7 | SOME CONCERNS | Mixed signals. Visit multiple times and ask pointed questions. |
| 1-4 | HIGH RISK | Major red flags. Avoid or investigate further before considering. |

## Quick Start

```bash
npm install
cp .env.example .env
# Add your OPENROUTER_API_KEY (or other provider key)
npm run dev
# Open http://localhost:3000
```

## Example Queries

- "Check Bright Horizons in San Jose, CA"
- "Research Little Stars Academy in Austin, Texas"
- "Is Sunshine Daycare on 123 Main Street licensed?"
- "Check out the KinderCare on Oak Avenue in Portland, Oregon"
- "A home daycare called Maria's Little Learners in Houston — is it safe?"

## Tools

| Tool | Purpose |
|------|---------|
| `search_daycare` | Find web presence, license info, review listings, inspection records |
| `verify_daycare` | Deep check: complaints, news, violations, BBB, accreditation, reviews |
| `write_daycare_report` | Generate scored report with enroll/avoid recommendation |

## Built With

Hand-written agentic orchestration loop, DuckDuckGo search. No API keys needed beyond the LLM provider.

## License

MIT
