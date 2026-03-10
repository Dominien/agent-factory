import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'analyze_employment',
  description:
    'Analyze employment details to determine FLSA exempt/non-exempt status and identify potential wage violations. Takes job role, duties, salary, hours, and state. Returns exemption analysis, potential violations, and recommended next steps. Use this AFTER gathering the user\'s employment details.',
  parameters: {
    type: 'object',
    properties: {
      job_title: {
        type: 'string',
        description: 'The employee\'s job title',
      },
      job_duties: {
        type: 'string',
        description: 'Description of primary job duties and responsibilities',
      },
      pay_type: {
        type: 'string',
        description: 'How the employee is paid: "salary", "hourly", or "commission"',
        enum: ['salary', 'hourly', 'commission'],
      },
      pay_amount: {
        type: 'string',
        description: 'Pay amount (e.g. "$50,000/year", "$18/hour")',
      },
      hours_per_week: {
        type: 'string',
        description: 'Typical hours worked per week (e.g. "45", "50-55")',
      },
      state: {
        type: 'string',
        description: 'State where the employee works (e.g. "California", "TX")',
      },
      manages_others: {
        type: 'string',
        description: 'Does the employee manage 2+ other employees? "yes" or "no"',
      },
      has_hiring_authority: {
        type: 'string',
        description: 'Can the employee hire/fire or recommend hiring/firing? "yes" or "no"',
      },
      uses_independent_judgment: {
        type: 'string',
        description: 'Does the role require independent judgment on significant matters? "yes" or "no"',
      },
      industry: {
        type: 'string',
        description: 'Industry or business type (e.g. "restaurant", "tech", "retail", "healthcare")',
      },
    },
    required: ['job_title', 'pay_type', 'pay_amount', 'hours_per_week', 'state'],
  },
}

function parsePay(payAmount: string, payType: string): { annual: number; weekly: number; hourly: number } {
  const cleaned = payAmount.replace(/[,$]/g, '').toLowerCase()
  let annual = 0

  if (cleaned.includes('/hour') || cleaned.includes('per hour') || cleaned.includes('/hr')) {
    const hourly = parseFloat(cleaned)
    annual = hourly * 2080 // 40 hrs * 52 weeks
    return { annual, weekly: annual / 52, hourly }
  }

  if (cleaned.includes('/year') || cleaned.includes('per year') || cleaned.includes('/yr') || cleaned.includes('annually')) {
    annual = parseFloat(cleaned)
  } else if (cleaned.includes('/month') || cleaned.includes('per month')) {
    annual = parseFloat(cleaned) * 12
  } else if (cleaned.includes('/week') || cleaned.includes('per week')) {
    annual = parseFloat(cleaned) * 52
  } else {
    // Assume annual if > 1000, hourly if < 200
    const num = parseFloat(cleaned)
    if (num > 1000) {
      annual = num
    } else {
      annual = num * 2080
    }
  }

  return {
    annual,
    weekly: annual / 52,
    hourly: annual / 2080,
  }
}

function parseHours(hoursStr: string): number {
  const cleaned = hoursStr.replace(/[^0-9.-]/g, ' ').trim()
  const parts = cleaned.split(/[\s-]+/).map(Number).filter(n => !isNaN(n))
  if (parts.length === 0) return 40
  if (parts.length === 1) return parts[0]
  return (parts[0] + parts[1]) / 2 // average of range
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const jobTitle = (args.job_title as string) || 'Unknown'
  const jobDuties = (args.job_duties as string) || ''
  const payType = (args.pay_type as string) || 'hourly'
  const payAmount = (args.pay_amount as string) || '0'
  const hoursStr = (args.hours_per_week as string) || '40'
  const state = (args.state as string) || 'Unknown'
  const managesOthers = ((args.manages_others as string) || 'no').toLowerCase() === 'yes'
  const hasHiringAuth = ((args.has_hiring_authority as string) || 'no').toLowerCase() === 'yes'
  const usesJudgment = ((args.uses_independent_judgment as string) || 'no').toLowerCase() === 'yes'
  const industry = (args.industry as string) || ''

  const pay = parsePay(payAmount, payType)
  const hoursPerWeek = parseHours(hoursStr)
  const overtimeHours = Math.max(0, hoursPerWeek - 40)

  // FLSA salary threshold (2024-present)
  const FLSA_WEEKLY_THRESHOLD = 684 // $35,568/year
  const FLSA_HCE_THRESHOLD = 107432 // Highly compensated employee

  // Exemption analysis
  const meetsSalaryThreshold = pay.weekly >= FLSA_WEEKLY_THRESHOLD
  const isPaidSalary = payType === 'salary'
  const isHCE = pay.annual >= FLSA_HCE_THRESHOLD

  // Duties tests (simplified)
  const meetsExecutiveDuties = managesOthers && hasHiringAuth
  const meetsAdminDuties = usesJudgment && !managesOthers
  const meetsProfessionalDuties = usesJudgment && (
    jobTitle.toLowerCase().includes('engineer') ||
    jobTitle.toLowerCase().includes('lawyer') ||
    jobTitle.toLowerCase().includes('doctor') ||
    jobTitle.toLowerCase().includes('accountant') ||
    jobTitle.toLowerCase().includes('architect') ||
    jobTitle.toLowerCase().includes('teacher') ||
    jobTitle.toLowerCase().includes('professor')
  )

  // Determine likely exemption status
  let exemptionStatus: 'LIKELY_EXEMPT' | 'LIKELY_NON_EXEMPT' | 'BORDERLINE' = 'LIKELY_NON_EXEMPT'
  let exemptionReason = ''

  if (!isPaidSalary && payType !== 'commission') {
    exemptionStatus = 'LIKELY_NON_EXEMPT'
    exemptionReason = 'Paid hourly — hourly employees are almost always entitled to overtime under FLSA.'
  } else if (!meetsSalaryThreshold) {
    exemptionStatus = 'LIKELY_NON_EXEMPT'
    exemptionReason = `Weekly salary ($${pay.weekly.toFixed(0)}) is below the FLSA threshold of $${FLSA_WEEKLY_THRESHOLD}/week ($35,568/year). Employees below this threshold are entitled to overtime regardless of duties.`
  } else if (isHCE) {
    exemptionStatus = 'LIKELY_EXEMPT'
    exemptionReason = `Annual compensation ($${pay.annual.toLocaleString()}) exceeds the Highly Compensated Employee (HCE) threshold of $${FLSA_HCE_THRESHOLD.toLocaleString()}. HCEs with at least one exempt duty are generally exempt.`
  } else if (meetsExecutiveDuties) {
    exemptionStatus = 'LIKELY_EXEMPT'
    exemptionReason = 'Meets salary threshold AND executive duties test (manages 2+ employees, has hiring/firing authority).'
  } else if (meetsAdminDuties) {
    exemptionStatus = 'BORDERLINE'
    exemptionReason = 'Meets salary threshold and may meet administrative duties test. The "independent judgment on significant matters" test is the most commonly disputed. Needs careful analysis of actual day-to-day duties.'
  } else if (meetsProfessionalDuties) {
    exemptionStatus = 'LIKELY_EXEMPT'
    exemptionReason = 'Meets salary threshold AND likely qualifies for the learned professional exemption based on job title/duties.'
  } else if (meetsSalaryThreshold && isPaidSalary) {
    exemptionStatus = 'BORDERLINE'
    exemptionReason = 'Meets salary threshold but duties may not qualify for any FLSA exemption. Being salaried does NOT automatically make you exempt — your duties must also qualify.'
  }

  // Potential violations
  const violations: string[] = []

  if (exemptionStatus === 'LIKELY_NON_EXEMPT' && overtimeHours > 0) {
    const weeklyOT = overtimeHours * pay.hourly * 0.5 // the extra half-time
    const annualOT = weeklyOT * 52
    violations.push(`**Potential unpaid overtime**: Working ${hoursPerWeek} hours/week (${overtimeHours} overtime hours) as a likely non-exempt employee. Estimated unpaid overtime: ~$${weeklyOT.toFixed(0)}/week ($${annualOT.toLocaleString()}/year).`)
  }

  if (exemptionStatus === 'BORDERLINE' && overtimeHours > 0) {
    const weeklyOT = overtimeHours * pay.hourly * 0.5
    const annualOT = weeklyOT * 52
    violations.push(`**Possible unpaid overtime**: If you are non-exempt (your duties don't qualify for exemption), you may be owed overtime. Estimated: ~$${weeklyOT.toFixed(0)}/week ($${annualOT.toLocaleString()}/year).`)
  }

  if (isPaidSalary && !meetsSalaryThreshold && overtimeHours > 0) {
    violations.push(`**Misclassification risk**: Being paid salary below $${FLSA_WEEKLY_THRESHOLD}/week does NOT make you exempt. You are entitled to overtime regardless of job title or duties.`)
  }

  // States with daily overtime or stricter rules
  const dailyOvertimeStates = ['california', 'alaska', 'nevada', 'colorado']
  const stateLC = state.toLowerCase()
  const hasDailyOT = dailyOvertimeStates.some(s => stateLC.includes(s))

  if (hasDailyOT) {
    violations.push(`**State daily overtime**: ${state} has daily overtime rules (typically >8 hours/day). Federal FLSA only requires weekly overtime (>40 hours). Your state provides additional protections.`)
  }

  // Build report
  const report: string[] = []

  report.push(`## Employment Analysis: ${jobTitle}`)
  report.push(`**State**: ${state}`)
  report.push(`**Pay**: ${payAmount} (${payType}) — $${pay.annual.toLocaleString()}/year, $${pay.weekly.toFixed(0)}/week`)
  report.push(`**Hours**: ${hoursPerWeek} hours/week (${overtimeHours > 0 ? `${overtimeHours} overtime hours` : 'no overtime'})`)
  report.push('')

  report.push(`### FLSA Exemption Status: **${exemptionStatus.replace(/_/g, ' ')}**`)
  report.push(exemptionReason)
  report.push('')

  report.push('### Key FLSA Thresholds')
  report.push(`- Salary threshold: $684/week ($35,568/year) — You: $${pay.weekly.toFixed(0)}/week ${meetsSalaryThreshold ? '✅ Above' : '❌ Below'}`)
  report.push(`- Paid on salary basis: ${isPaidSalary ? '✅ Yes' : '❌ No (hourly)'}`)
  report.push(`- HCE threshold ($107,432): ${isHCE ? '✅ Above' : 'Below'}`)
  report.push('')

  if (violations.length > 0) {
    report.push('### ⚠️ Potential Violations Found')
    violations.forEach(v => report.push(`- ${v}`))
    report.push('')
  } else {
    report.push('### ✅ No Obvious Violations Detected')
    report.push('Based on the information provided, your classification and pay appear consistent with FLSA requirements. However, state-specific rules may provide additional protections.')
    report.push('')
  }

  report.push('### Next Steps')
  report.push('1. **Search for state-specific wage laws** — use `search_wage_laws` to find overtime, minimum wage, and meal break rules for your state')
  report.push('2. **Fetch relevant DOL pages** — use `web_fetch` to read detailed FLSA guidance')
  report.push('3. **Calculate total owed** — use `calculate_owed_wages` if violations were found')
  report.push('4. **Generate report** — use `write_wage_report` to create a comprehensive analysis')

  return report.join('\n')
}
