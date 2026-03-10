# Wage Rights Advisor

An AI agent that helps workers determine if they're being paid correctly under federal and state wage laws.

## The Problem

- **$50 billion** in wages are stolen from workers every year in the US
- **82 million** workers have experienced being paid incorrectly or underpaid
- The average wage theft victim loses **$3,300/year**
- **1 in 3 workers** can't accurately calculate their overtime pay
- DOL enforcement is at a **52-year low** — workers need to advocate for themselves
- Most workers don't know if they're exempt or non-exempt, or what that even means

Existing tools are just simple overtime calculators — they do the math but don't tell you if you're legally entitled to overtime in the first place.

## What This Agent Does

Tell the agent about your job — title, duties, pay, hours, and state — and it will:

1. **Determine your FLSA exemption status** — Are you exempt or non-exempt? Based on the actual duties tests, not just your job title
2. **Research your state's wage laws** — Overtime rules, minimum wage, meal break requirements, and more
3. **Calculate what you may be owed** — If violations are found, estimate back-pay including liquidated damages
4. **Guide you on next steps** — How to file a complaint, find a free attorney, and protect yourself from retaliation
5. **Generate a comprehensive report** — Saved as a markdown file with everything you need

## Quick Start

```bash
cp .env.example .env   # Add your OPENROUTER_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and describe your employment situation.

## Example Prompt

> "I work as an assistant manager at a retail store in Texas. I'm salaried at $32,000/year and regularly work 50-55 hours per week. My boss says I'm exempt because I'm a manager, but I mostly stock shelves, run the register, and help customers. I supervise two part-time employees but I can't hire or fire anyone. Am I owed overtime?"

## Tools

| Tool | Purpose |
|------|---------|
| `analyze_employment` | Determines FLSA exempt/non-exempt status based on job duties, salary, and role |
| `search_wage_laws` | Finds state-specific overtime, minimum wage, and wage theft laws |
| `calculate_owed_wages` | Computes potential unpaid wages/overtime with liquidated damages |
| `write_wage_report` | Generates comprehensive wage rights analysis report |
| `web_search` | Searches for additional legal information and resources |
| `web_fetch` | Reads state labor department pages and legal resources |

## Output

A saved markdown report containing:

- FLSA exemption analysis (exempt, non-exempt, or borderline)
- State-specific wage law summary
- Unpaid wage calculation with back-pay estimates
- List of potential violations
- Filing instructions (federal and state)
- State labor department contact info
- Next steps and legal resources
- Disclaimer that this is not legal advice

## Key Facts

- Being "salaried" does NOT automatically make you exempt from overtime
- The FLSA salary threshold is $684/week ($35,568/year) — below this, you get overtime regardless of duties
- FLSA allows you to recover **double** the unpaid wages (liquidated damages)
- It is **illegal** for employers to retaliate against you for asking about your pay
- Many employment attorneys work on contingency — no cost to you unless you win
- You can file complaints with both federal DOL and your state labor department

## Limitations

- This is NOT legal advice — consult an employment attorney for your specific situation
- State law analysis depends on web search results and may not capture every nuance
- Some industries have special exemptions (agriculture, transportation, healthcare)
- The agent cannot access your actual pay records — calculations are based on what you report
- Complex situations (multiple jobs, tipped employees, piece-rate workers) may need professional review
