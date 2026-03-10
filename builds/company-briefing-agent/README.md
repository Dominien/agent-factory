# Company Briefing Agent

An AI agent that generates interview preparation briefings. Give it a company name and get a 3-minute read covering what they do, their culture, recent news, and smart questions to ask your interviewer.

## Why This Exists

You have an interview tomorrow. You need to research the company but it's 10pm and you have to check:
- Their website (what do they actually do?)
- Glassdoor (what do employees say?)
- Crunchbase (funding, investors?)
- LinkedIn (who's the hiring manager?)
- Google News (anything recent?)

That's 15-20 minutes of tab-juggling. This agent does it in one prompt and gives you a briefing you can read on the train.

## How It Works

```
"I'm interviewing at Stripe for Senior Engineer"
        |
        v
+------------------------+
|  1. COMPANY PROFILE    |  Fetch website, about page,
|  fetch_company_profile  |  products, mission, team info
+---------+--------------+
          |
          v
+------------------------+
|  2. REPUTATION         |  Glassdoor reviews, recent news,
|  research_reputation    |  funding, leadership, interview tips
+---------+--------------+
          |
          v
+------------------------+
|  3. WRITE BRIEFING     |  Talking points, smart questions,
|  write_briefing         |  red flags, prep checklist
+------------------------+
        |
        v
   3-minute briefing in ./output/
```

## What You Get

- **Company overview**: What they do in 2-3 sentences
- **Culture signals**: Glassdoor insights, values, work style
- **Recent news**: Funding, launches, leadership changes
- **Key people**: CEO, CTO, founders to know about
- **Talking points**: Things to say that show you did your homework
- **Smart questions**: Questions that impress interviewers
- **Prep checklist**: Last-minute reminders before the interview

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> company-briefing-agent
cd company-briefing-agent
npm install

# 2. Configure
cp .env.example .env
# Edit .env — set PROVIDER, MODEL, and API key

# 3. Run
npm run dev
# Open http://localhost:3000
```

## Example Prompts

- "I'm interviewing at Stripe for a Senior Software Engineer role"
- "Brief me on Anthropic — I have a product manager interview"
- "Research Vercel for me, I'm interviewing there next week"
- "What should I know about Cloudflare before my interview?"

## Output

Briefings are saved to `./output/` as markdown with:
- Structured sections you can skim quickly
- Specific talking points (not generic advice)
- Questions that reference actual company initiatives
- A prep checklist for the day of

## Built On

[Agentic Harness](https://github.com/your-org/agentic-harness) — a minimal, self-hosted AI agent framework with tool use and streaming.

## License

MIT
