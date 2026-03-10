# Validation: Wage Rights Advisor

## Test Scenario

**Prompt**: "I work as an assistant manager at a retail store in Texas. I'm salaried at $32,000/year and regularly work 50-55 hours per week. My boss says I'm exempt because I'm a manager, but I mostly stock shelves, run the register, and help customers. I supervise two part-time employees but I can't hire or fire anyone. Am I owed overtime?"

## Expected Tool Chain

1. `analyze_employment` — analyzes job details: salaried at $32K (below $35,568 threshold), 50-55 hrs/week, manages 2 employees but no hiring authority
2. `search_wage_laws` — searches for Texas overtime and wage laws
3. `web_fetch` — fetches Texas Workforce Commission wage law page
4. `calculate_owed_wages` — calculates unpaid overtime (10-15 hrs/week × rate × 52 weeks)
5. `web_search` — searches for "Texas wage complaint filing process"
6. `write_wage_report` — generates comprehensive report

## Expected Output

A saved markdown report (`output/wage-analysis-*.md` or similar) containing:

- [ ] FLSA exemption analysis showing LIKELY NON-EXEMPT (salary below $35,568 threshold)
- [ ] Note that being "salaried" and "assistant manager" does NOT make them exempt
- [ ] Texas-specific overtime and minimum wage information
- [ ] Overtime calculation: ~10-15 hrs/week × ($32K/2080 × 0.5) × 52 weeks
- [ ] Estimated annual back-pay (should be several thousand dollars)
- [ ] Liquidated damages calculation (doubling the back-pay)
- [ ] Texas Workforce Commission complaint filing instructions
- [ ] Federal DOL complaint hotline (1-866-4US-WAGE)
- [ ] Recommendation to consult a free employment attorney
- [ ] Disclaimer that this is not legal advice

## Validation Criteria

- [ ] `npm install` succeeds without errors
- [ ] `npm run dev` starts the development server
- [ ] Agent correctly identifies the worker as LIKELY NON-EXEMPT
- [ ] Agent explains WHY they're non-exempt (salary below threshold = automatic non-exempt)
- [ ] State-specific Texas wage laws are researched
- [ ] Overtime calculation is reasonable and clearly explained
- [ ] Report is saved to the output directory
- [ ] Agent provides honest assessment with proper disclaimers
