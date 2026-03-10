import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_daycare_report',
  description:
    'Generate and save a daycare trust report. Includes a trust score (1-10), red/green flags, and an enroll/caution recommendation. Always end here.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the report (e.g. "bright-horizons-report.md")',
      },
      facility_name: {
        type: 'string',
        description: 'The daycare or childcare center name',
      },
      location: {
        type: 'string',
        description: 'Where the facility is located',
      },
      trust_score: {
        type: 'string',
        description: 'Trust score from 1 (avoid) to 10 (highly trusted)',
      },
      recommendation: {
        type: 'string',
        description: 'Recommendation: ENROLL / VISIT FIRST / AVOID',
      },
      red_flags: {
        type: 'string',
        description: 'Newline-separated list of red flags and concerns',
      },
      green_flags: {
        type: 'string',
        description: 'Newline-separated list of positive trust signals',
      },
      license_status: {
        type: 'string',
        description: 'Summary of license verification findings',
      },
      review_summary: {
        type: 'string',
        description: 'Summary of parent reviews across platforms',
      },
      violation_summary: {
        type: 'string',
        description: 'Summary of inspection violations if any found',
      },
      details: {
        type: 'string',
        description: 'Detailed analysis explaining the trust assessment',
      },
    },
    required: ['filename', 'facility_name', 'trust_score', 'recommendation', 'red_flags', 'green_flags', 'details'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const facilityName = args.facility_name as string
  const location = (args.location as string) || 'Not specified'
  const trustScore = args.trust_score as string
  const recommendation = args.recommendation as string
  const redFlags = args.red_flags as string
  const greenFlags = args.green_flags as string
  const licenseStatus = (args.license_status as string) || 'See details below.'
  const reviewSummary = (args.review_summary as string) || 'See details below.'
  const violationSummary = (args.violation_summary as string) || 'No violations found in search.'
  const details = args.details as string

  if (!filename || !facilityName || !trustScore || !recommendation || !details) {
    return 'Error: filename, facility_name, trust_score, recommendation, and details are required'
  }

  const score = parseInt(trustScore, 10)
  const emoji = score >= 7 ? '\ud83d\udfe2' : score >= 4 ? '\ud83d\udfe1' : '\ud83d\udd34'
  const label = score >= 7 ? 'TRUSTED' : score >= 4 ? 'SOME CONCERNS' : 'HIGH RISK'

  const report = `# Daycare Trust Report: ${facilityName}

## ${emoji} Trust Score: ${trustScore}/10 \u2014 ${label}

| Field | Value |
|-------|-------|
| **Facility** | ${facilityName} |
| **Location** | ${location} |
| **Recommendation** | **${recommendation}** |
| **Generated** | ${new Date().toISOString().split('T')[0]} |

---

## Red Flags

${redFlags.split('\n').filter(Boolean).map(f => `- \u26a0\ufe0f ${f.trim()}`).join('\n') || '- None identified'}

## Green Flags

${greenFlags.split('\n').filter(Boolean).map(s => `- \u2705 ${s.trim()}`).join('\n') || '- None identified'}

## License Status

${licenseStatus}

## Inspection & Violations

${violationSummary}

## Parent Reviews

${reviewSummary}

## Detailed Analysis

${details}

---

## Before You Enroll: Checklist

${score >= 7 ? `This facility appears trustworthy. Standard precautions:
- [ ] Visit the facility in person (unannounced drop-in visits are a good sign if allowed)
- [ ] Ask about staff-to-child ratios (compare against your state's requirements)
- [ ] Ask about staff qualifications, turnover, and background check policies
- [ ] Request a copy of the most recent state inspection report
- [ ] Ask about their sick child policy and emergency procedures
- [ ] Review the parent handbook and fee agreement carefully
- [ ] Talk to current parents if possible
- [ ] Check that the facility is clean, well-maintained, and age-appropriate
- [ ] Ask about curriculum, daily schedules, and outdoor play time` :
score >= 4 ? `This facility has some concerns. Before enrolling:
- [ ] Visit the facility multiple times, including unannounced
- [ ] Verify the license directly with your state licensing agency
- [ ] Request the full inspection history (not just the most recent)
- [ ] Ask pointed questions about any violations or complaints you found
- [ ] Talk to multiple current and former parents
- [ ] Ask about staff turnover rates (high turnover is a warning sign)
- [ ] Verify staff-to-child ratios meet or exceed state minimums
- [ ] Check if the director has an early childhood education degree or CDA
- [ ] Get the full fee schedule and cancellation policy in writing
- [ ] Trust your instincts \u2014 if something feels off during a visit, keep looking` :
`This facility has significant trust issues. Recommended actions:
- [ ] DO NOT enroll without resolving the red flags above
- [ ] Contact your state childcare licensing agency to verify current status
- [ ] If violations are serious (abuse, neglect, safety), report to:
  - Your state childcare licensing agency
  - Child Protective Services (if abuse/neglect suspected)
  - Local law enforcement (if criminal conduct suspected)
- [ ] Research at least 3 alternative facilities in your area
- [ ] Use your state's childcare resource and referral agency for vetted options
- [ ] Check Childcare.gov for licensed providers in your area
- [ ] Consider home-based licensed family childcare as an alternative`}

---

## State Licensing Resources

Every state has a childcare licensing database. Search for your state at:
- **Childcare.gov** \u2014 Federal resource linking to all 50 state licensing agencies
- **NAEYC.org** \u2014 Check if a facility has NAEYC accreditation (gold standard)
- **Your state's HHS or OCFS website** \u2014 Inspection reports and violation history

---

## Common Daycare Red Flags

1. **No license or expired license** \u2014 Operating without a valid state license is illegal in most states
2. **Repeated serious violations** \u2014 Patterns of health, safety, or supervision failures
3. **High staff turnover** \u2014 Inconsistent caregivers affect child development
4. **No background checks** \u2014 All staff should pass criminal background checks
5. **Poor ratios** \u2014 Too many children per caregiver increases risk
6. **No curriculum** \u2014 Quality programs have structured learning activities
7. **Resistance to drop-in visits** \u2014 Good facilities welcome unannounced parent visits
8. **Pressure to sign immediately** \u2014 Quality programs don't need high-pressure sales

---

*Generated by Daycare Trust Checker \u2014 an open-source AI agent for childcare due diligence*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    return `Trust report saved to output/${sanitized} (${report.length} characters)\n\nSummary: ${emoji} ${label} (${trustScore}/10) \u2014 ${recommendation}`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
