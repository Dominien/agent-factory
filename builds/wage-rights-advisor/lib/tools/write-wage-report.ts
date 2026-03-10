import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_wage_report',
  description:
    'Generate and save a comprehensive wage rights analysis report. Includes FLSA exemption analysis, state-specific laws, unpaid wage calculations, filing instructions, and next steps. Always use this as the final step after gathering all employment data and researching applicable laws.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the report (e.g. "wage-analysis-john.md")',
      },
      employee_name: {
        type: 'string',
        description: 'Employee name (for personalization)',
      },
      job_title: {
        type: 'string',
        description: 'Employee\'s job title',
      },
      employer_name: {
        type: 'string',
        description: 'Employer name (if provided)',
      },
      state: {
        type: 'string',
        description: 'State where work is performed',
      },
      exemption_analysis: {
        type: 'string',
        description: 'FLSA exemption analysis results as markdown',
      },
      state_law_summary: {
        type: 'string',
        description: 'Summary of applicable state wage and overtime laws as markdown',
      },
      wage_calculation: {
        type: 'string',
        description: 'Unpaid wage/overtime calculation results as markdown',
      },
      violations_found: {
        type: 'string',
        description: 'List of potential violations identified, as markdown',
      },
      filing_instructions: {
        type: 'string',
        description: 'How to file a wage complaint — federal and state-specific instructions',
      },
      state_labor_contact: {
        type: 'string',
        description: 'State labor department contact info (name, phone, website)',
      },
    },
    required: ['filename', 'state', 'exemption_analysis'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const employeeName = (args.employee_name as string) || '[Your Name]'
  const jobTitle = (args.job_title as string) || 'Not specified'
  const employerName = (args.employer_name as string) || '[Employer Name]'
  const state = args.state as string
  const exemptionAnalysis = (args.exemption_analysis as string) || 'Not analyzed'
  const stateLawSummary = (args.state_law_summary as string) || 'See your state labor department website'
  const wageCalculation = (args.wage_calculation as string) || 'Not calculated'
  const violationsFound = (args.violations_found as string) || 'None identified'
  const filingInstructions = (args.filing_instructions as string) || ''
  const stateLaborContact = (args.state_labor_contact as string) || 'See your state labor department website'

  if (!filename || !state || !exemptionAnalysis) {
    return 'Error: filename, state, and exemption_analysis are required'
  }

  const today = new Date().toISOString().split('T')[0]

  const report = `# Wage Rights Analysis Report
## ${employeeName} — ${jobTitle}

**Prepared**: ${today}
**State**: ${state}
**Employer**: ${employerName}

---

## Important Disclaimer

**This report is for informational purposes only. It is NOT legal advice.** Employment law is complex and fact-specific. This analysis is based on general FLSA and state law principles applied to the information you provided. For legal advice specific to your situation, consult a licensed employment attorney. Many employment attorneys offer free consultations and work on contingency (no upfront cost to you).

---

## Executive Summary

This report analyzes your employment situation under the federal Fair Labor Standards Act (FLSA) and ${state} state wage laws. It identifies potential wage violations, estimates amounts owed, and provides guidance on how to take action.

---

## FLSA Exemption Analysis

${exemptionAnalysis}

---

## ${state} State Wage Laws

${stateLawSummary}

---

## Unpaid Wage Calculation

${wageCalculation}

---

## Violations Identified

${violationsFound}

---

${filingInstructions ? `## How to File a Wage Complaint

${filingInstructions}

---

` : ''}## ${state} Labor Department Contact

${stateLaborContact}

---

## Your Rights Under FLSA

### Key Protections
1. **Overtime pay**: Non-exempt employees must receive 1.5x their regular rate for hours over 40/week
2. **Minimum wage**: Federal minimum is $7.25/hour; many states have higher minimums
3. **Anti-retaliation**: It is **illegal** for your employer to retaliate against you for filing a wage complaint, asking about your pay, or discussing wages with coworkers
4. **Record-keeping**: Employers must maintain accurate time and pay records — if they don't, the burden of proof shifts to the employer
5. **Liquidated damages**: You can recover double the unpaid wages (back-pay + equal amount in damages)
6. **Attorney fees**: If you win, your employer pays your attorney fees

### Common Employer Violations
- Misclassifying hourly workers as "salaried" to avoid overtime
- Not paying for "off-the-clock" work (emails, prep time, cleanup)
- Requiring employees to work through meal breaks without pay
- Averaging hours across two weeks instead of paying weekly overtime
- Paying a "day rate" without separate overtime compensation
- Deducting for uniforms, tools, or shortages below minimum wage

---

## Recommended Next Steps

### If Violations Were Found

1. **Document everything now**
   - Save pay stubs, time records, schedules, and any communications about hours/pay
   - Start keeping a personal log of hours worked (use your phone's notes app)
   - Screenshot or photograph any policies about hours, overtime, or pay

2. **Calculate your claim value**
   - Use the estimates in this report as a starting point
   - An attorney can calculate the precise amount including damages

3. **Consult a free employment attorney**
   - Many employment attorneys offer free consultations
   - Most work on contingency — you pay nothing unless you win
   - Find attorneys at: [NELA.org](https://exchange.nela.org/memberdirectory/findlawyer)
   - Or search: "${state} wage theft attorney free consultation"

4. **File a complaint**
   - **Federal**: File with DOL Wage and Hour Division at [dol.gov/agencies/whd](https://www.dol.gov/agencies/whd/contact/complaints) or call 1-866-4US-WAGE (1-866-487-9243)
   - **State**: Contact your ${state} labor department (see contact info above)
   - You can file both federal and state complaints simultaneously

5. **Know the deadlines**
   - Federal FLSA: 2 years (3 years for willful violations)
   - State deadlines vary — check with your state labor department
   - **File sooner rather than later** — every week that passes is a week of back-pay you may lose

### If No Violations Were Found

1. Your classification appears correct based on the information provided
2. Continue monitoring your pay stubs for accuracy
3. Keep records of hours worked in case your situation changes
4. Know that you can always file a complaint if you believe you're being underpaid

---

## Resources

- **DOL Wage & Hour Division**: [dol.gov/agencies/whd](https://www.dol.gov/agencies/whd) — Federal wage law enforcement
- **NELA Attorney Directory**: [nela.org](https://exchange.nela.org/memberdirectory/findlawyer) — Find an employment attorney
- **Worker.gov**: [worker.gov](https://www.worker.gov/) — Know your federal worker rights
- **FLSA Overtime Fact Sheet**: [dol.gov/agencies/whd/fact-sheets/23](https://www.dol.gov/agencies/whd/fact-sheets/23)
- **State Labor Offices**: [dol.gov/agencies/whd/state](https://www.dol.gov/agencies/whd/state/contacts) — All state labor department contacts

---

*Generated by Wage Rights Advisor — a free, open-source AI agent that helps workers understand their wage and overtime rights. Not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    return `Report saved to output/${sanitized} (${report.length} characters)\n\nYour wage rights analysis for ${employeeName} (${jobTitle}) in ${state} is ready!`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
