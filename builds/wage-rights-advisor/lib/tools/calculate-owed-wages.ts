import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'calculate_owed_wages',
  description:
    'Calculate potential unpaid wages and overtime owed to an employee. Considers federal FLSA rules and state-specific overtime rules. Computes back-pay for a specified period. Use this after determining the employee is likely non-exempt and working overtime.',
  parameters: {
    type: 'object',
    properties: {
      hourly_rate: {
        type: 'string',
        description: 'Regular hourly rate (or calculate from salary: annual/2080). e.g. "$25"',
      },
      hours_per_week: {
        type: 'string',
        description: 'Average hours worked per week (e.g. "50")',
      },
      overtime_rate_multiplier: {
        type: 'string',
        description: 'Overtime rate multiplier (default "1.5" for time-and-a-half). Use "2.0" for double time if applicable.',
      },
      weeks_affected: {
        type: 'string',
        description: 'Number of weeks affected (e.g. "52" for one year, "104" for two years). FLSA allows 2-year lookback (3 years for willful violations).',
      },
      state: {
        type: 'string',
        description: 'State where work was performed',
      },
      daily_overtime_threshold: {
        type: 'string',
        description: 'If the state has daily overtime, the daily threshold in hours (e.g. "8" for California). Leave empty for federal weekly-only overtime.',
      },
      avg_daily_hours: {
        type: 'string',
        description: 'Average hours worked per day (needed for daily overtime calculation). e.g. "9.5"',
      },
      additional_violations: {
        type: 'string',
        description: 'Any additional wage violations found (e.g. "unpaid meal breaks: 30 min/day, minimum wage violation: paid $6.50 vs $7.25 state minimum")',
      },
    },
    required: ['hourly_rate', 'hours_per_week', 'weeks_affected'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const hourlyRate = parseFloat(((args.hourly_rate as string) || '0').replace(/[$,]/g, ''))
  const hoursPerWeek = parseFloat((args.hours_per_week as string) || '40')
  const otMultiplier = parseFloat((args.overtime_rate_multiplier as string) || '1.5')
  const weeksAffected = parseFloat((args.weeks_affected as string) || '52')
  const state = (args.state as string) || 'Federal'
  const dailyOtThreshold = args.daily_overtime_threshold ? parseFloat(args.daily_overtime_threshold as string) : null
  const avgDailyHours = args.avg_daily_hours ? parseFloat(args.avg_daily_hours as string) : null
  const additionalViolations = (args.additional_violations as string) || ''

  if (hourlyRate <= 0) return 'Error: hourly_rate must be a positive number'
  if (hoursPerWeek <= 0) return 'Error: hours_per_week must be a positive number'

  const overtimeHoursPerWeek = Math.max(0, hoursPerWeek - 40)
  const otPremium = hourlyRate * (otMultiplier - 1) // The extra amount per OT hour
  const weeklyOtOwed = overtimeHoursPerWeek * otPremium
  const totalOtOwed = weeklyOtOwed * weeksAffected

  // Daily overtime calculation (for states like California)
  let dailyOtOwed = 0
  let dailyOtNote = ''
  if (dailyOtThreshold && avgDailyHours && avgDailyHours > dailyOtThreshold) {
    const dailyOtHours = avgDailyHours - dailyOtThreshold
    const workDaysPerWeek = hoursPerWeek / avgDailyHours
    const weeklyDailyOt = dailyOtHours * workDaysPerWeek * otPremium
    dailyOtOwed = weeklyDailyOt * weeksAffected
    dailyOtNote = `\n- Daily overtime (>${dailyOtThreshold}h/day): ${dailyOtHours.toFixed(1)} OT hours/day × ${workDaysPerWeek.toFixed(1)} days × $${otPremium.toFixed(2)} premium = $${weeklyDailyOt.toFixed(2)}/week`
  }

  // Liquidated damages (FLSA allows equal amount as damages)
  const liquidatedDamages = totalOtOwed + dailyOtOwed

  // Statute of limitations
  const twoYearMax = weeklyOtOwed * Math.min(weeksAffected, 104)
  const threeYearMax = weeklyOtOwed * Math.min(weeksAffected, 156)

  const report: string[] = []
  report.push('## Unpaid Wages Calculation')
  report.push('')
  report.push('### Input')
  report.push(`- Regular hourly rate: $${hourlyRate.toFixed(2)}`)
  report.push(`- Hours worked per week: ${hoursPerWeek}`)
  report.push(`- Overtime hours per week: ${overtimeHoursPerWeek}`)
  report.push(`- Overtime rate: ${otMultiplier}x ($${(hourlyRate * otMultiplier).toFixed(2)}/hour)`)
  report.push(`- Period: ${weeksAffected} weeks (${(weeksAffected / 52).toFixed(1)} years)`)
  report.push(`- State: ${state}`)
  report.push('')

  report.push('### Weekly Overtime Calculation')
  report.push(`- ${overtimeHoursPerWeek} OT hours × $${otPremium.toFixed(2)} premium = **$${weeklyOtOwed.toFixed(2)}/week**`)
  if (dailyOtNote) report.push(dailyOtNote)
  report.push('')

  report.push('### Total Estimated Back-Pay')
  report.push(`| Period | Unpaid Overtime | Liquidated Damages | **Total** |`)
  report.push(`|--------|----------------|-------------------|-----------|`)

  if (weeksAffected <= 104) {
    const total = (totalOtOwed + dailyOtOwed) * 2
    report.push(`| ${weeksAffected} weeks | $${(totalOtOwed + dailyOtOwed).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | $${(totalOtOwed + dailyOtOwed).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | **$${total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}** |`)
  } else {
    const twoYearTotal = twoYearMax * 2
    const threeYearTotal = threeYearMax * 2
    report.push(`| 2-year lookback | $${twoYearMax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | $${twoYearMax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | **$${twoYearTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}** |`)
    report.push(`| 3-year lookback (willful) | $${threeYearMax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | $${threeYearMax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | **$${threeYearTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}** |`)
  }
  report.push('')

  if (additionalViolations) {
    report.push('### Additional Violations')
    report.push(additionalViolations)
    report.push('')
  }

  report.push('### Important Notes')
  report.push('- **Liquidated damages**: Under FLSA, employees can recover an EQUAL amount in liquidated damages (doubling the back-pay) unless the employer proves good faith.')
  report.push('- **2-year lookback**: Standard statute of limitations for FLSA claims.')
  report.push('- **3-year lookback**: Available if the violation was "willful" (employer knew or should have known it was violating the law).')
  report.push('- **State laws may provide MORE**: Some states allow longer lookback periods, higher damages, or additional penalties.')
  report.push('- **Attorney fees**: FLSA requires employers to pay the employee\'s attorney fees if the employee prevails.')
  report.push('')
  report.push('⚠️ These are estimates based on the information provided. Actual amounts may vary. Consult an employment attorney for a precise calculation.')

  return report.join('\n')
}
