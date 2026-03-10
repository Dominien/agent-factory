import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_compliance_briefing',
  description:
    'Generate and save a comprehensive regulatory compliance briefing for a small business. Includes applicable federal, state, and local requirements organized by category with deadlines, penalties, and action items.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the briefing (e.g. "restaurant-california-compliance.md")',
      },
      business_type: {
        type: 'string',
        description: 'The type of business',
      },
      state: {
        type: 'string',
        description: 'State of operation',
      },
      employee_count: {
        type: 'string',
        description: 'Number of employees (affects which regulations apply)',
      },
      federal_requirements: {
        type: 'string',
        description: 'Markdown-formatted federal requirements (IRS, DOL, OSHA, industry-specific federal agencies)',
      },
      state_requirements: {
        type: 'string',
        description: 'Markdown-formatted state-specific requirements (licensing, employment law, state tax, industry permits)',
      },
      local_requirements: {
        type: 'string',
        description: 'Markdown-formatted local/municipal requirements (business license, zoning, health permits). Optional.',
      },
      recent_changes: {
        type: 'string',
        description: 'Regulatory changes from the last 12 months that affect this business. Optional.',
      },
      upcoming_deadlines: {
        type: 'string',
        description: 'Newline-separated list of upcoming compliance deadlines',
      },
      action_items: {
        type: 'string',
        description: 'Newline-separated list of specific compliance action items, prioritized by urgency',
      },
      industry_warnings: {
        type: 'string',
        description: 'Industry-specific regulatory areas that need additional professional review. Optional.',
      },
    },
    required: ['filename', 'business_type', 'state', 'federal_requirements', 'state_requirements', 'action_items'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const businessType = args.business_type as string
  const state = args.state as string
  const employeeCount = (args.employee_count as string) || 'Not specified'
  const federalReqs = args.federal_requirements as string
  const stateReqs = args.state_requirements as string
  const localReqs = (args.local_requirements as string) || ''
  const recentChanges = (args.recent_changes as string) || ''
  const deadlines = (args.upcoming_deadlines as string) || ''
  const actionItems = args.action_items as string
  const industryWarnings = (args.industry_warnings as string) || ''

  if (!filename || !businessType || !state || !federalReqs || !stateReqs || !actionItems) {
    return 'Error: filename, business_type, state, federal_requirements, state_requirements, and action_items are required'
  }

  const briefing = `# Regulatory Compliance Briefing
## ${businessType} — ${state}

**Prepared**: ${new Date().toISOString().split('T')[0]}
**Employees**: ${employeeCount}
**Read time**: ~5 minutes

---

> **Disclaimer**: This briefing is for educational purposes only and does not constitute legal advice. Regulatory requirements change frequently and vary by jurisdiction. Consult a licensed attorney or compliance professional for your specific situation.

---

## Priority Action Items

Take these steps to ensure compliance:

${actionItems.split('\n').filter(Boolean).map((item, i) => `${i + 1}. ${item.trim()}`).join('\n')}

${deadlines ? `---

## Upcoming Deadlines

${deadlines.split('\n').filter(Boolean).map(d => `- ${d.trim()}`).join('\n')}` : ''}

${recentChanges ? `---

## Recent Regulatory Changes (Last 12 Months)

${recentChanges}` : ''}

---

## Federal Requirements

${federalReqs}

---

## ${state} State Requirements

${stateReqs}

${localReqs ? `---

## Local / Municipal Requirements

${localReqs}` : ''}

${industryWarnings ? `---

## Industry-Specific Warnings

These areas require additional professional review for your business type:

${industryWarnings}` : ''}

---

## Compliance Resources

- **SBA**: [sba.gov/business-guide](https://www.sba.gov/business-guide) — Federal business requirements
- **IRS**: [irs.gov/businesses/small-businesses-self-employed](https://www.irs.gov/businesses/small-businesses-self-employed) — Tax obligations
- **DOL**: [dol.gov/agencies/whd](https://www.dol.gov/agencies/whd) — Wage and hour laws
- **OSHA**: [osha.gov/smallbusiness](https://www.osha.gov/smallbusiness) — Workplace safety
- **State**: Search "[your state] secretary of state business" for state-specific registration

---

## Next Steps Checklist

- [ ] Review each requirement in this briefing
- [ ] Prioritize items with upcoming deadlines
- [ ] Consult a licensed attorney for industry-specific regulations
- [ ] Set calendar reminders for recurring filing deadlines
- [ ] Review this briefing quarterly as regulations change
- [ ] Keep copies of all licenses, permits, and registrations

---

*Generated by Compliance Briefing Agent — an open-source AI agent that helps small businesses understand their regulatory obligations. Not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, briefing, 'utf-8')
    return `Compliance briefing saved to output/${sanitized} (${briefing.length} characters)\n\nYour regulatory compliance briefing for ${businessType} in ${state} is ready.`
  } catch (err) {
    return `Briefing write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
