# Data Broker Opt-Out Advisor

An AI agent that generates personalized data removal plans to help you opt out of data broker sites — for free.

## The Problem

- **2,500-4,000 data brokers** in the US collect and sell your personal data
- Your name, address, phone, email, relatives, income estimates, and more are all for sale
- Only **6% of adults** have ever used a data removal service
- It would take **300+ hours** to manually opt out of every broker
- Paid services like DeleteMe and Incogni charge **$8-15/month**
- No free tool generates a **personalized, prioritized removal plan**

## What This Agent Does

1. **Assesses your exposure** — Based on your profile (homeowner? voter? social media?), identifies which data brokers likely have your data
2. **Researches opt-out processes** — Searches for current opt-out pages and instructions for each broker
3. **Generates a removal plan** — Creates a step-by-step, prioritized checklist with direct links, time estimates, and state-specific privacy rights

## Who It's For

- Anyone who values their privacy and wants to reduce their digital footprint
- People getting spam calls, junk mail, or phishing emails
- Identity theft victims trying to limit exposure
- Privacy-conscious individuals who don't want to pay $8+/month for a removal service

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> data-broker-opt-out
cd data-broker-opt-out
npm install

# 2. Configure
cp .env.example .env
# Set PROVIDER, MODEL, and API key

# 3. Run
npm run dev
# Open http://localhost:3000
```

## Example Prompts

- "I live in California and I'm a homeowner. Help me remove my data from broker sites."
- "Create a data removal plan for me. I'm in Texas, age 35, registered voter, active on social media."
- "What data brokers have my information and how do I opt out?"

## Tools

| Tool | Description |
|------|-------------|
| `assess_exposure` | Evaluates which brokers likely have your data based on your profile |
| `search_data_brokers` | Researches current opt-out processes and privacy rights for specific brokers |
| `write_removal_plan` | Generates a personalized, step-by-step data removal plan as a downloadable file |

## How It Works

```
User provides profile info (state, homeowner, voter, etc.)
    ↓
assess_exposure → Identifies 10-15+ priority data brokers
    ↓
search_data_brokers → Finds current opt-out pages for each
    ↓
web_fetch → Reads actual opt-out instructions
    ↓
write_removal_plan → Generates personalized removal checklist
```

## Output

A comprehensive markdown document with:
- Prioritized broker checklist (HIGH/MEDIUM risk)
- Step-by-step opt-out instructions per broker
- Direct links to opt-out pages
- Time estimates per broker
- State-specific privacy rights
- Ongoing protection tips

## Limitations

- Opt-out processes change frequently — the agent researches current instructions but they may shift
- Cannot remove data for you — generates instructions you follow manually
- Covers major US brokers; international coverage is limited
- Some public records (court filings, property deeds) can't be removed from government sources
- Not legal advice

## License

MIT
