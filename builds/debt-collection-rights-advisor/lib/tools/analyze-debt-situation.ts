import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'analyze_debt_situation',
  description:
    'Analyze a consumer\'s debt collection situation to identify FDCPA violations, determine rights, and assess dispute options. Takes details about the debt, collector communications, and consumer\'s state. Returns violation analysis, statute of limitations info, and recommended actions. Use this as the FIRST step when a user describes their debt collection problem.',
  parameters: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'Consumer\'s state of residence (e.g. "California", "TX")',
      },
      debt_type: {
        type: 'string',
        description: 'Type of debt: "credit_card", "medical", "student_loan", "auto", "mortgage", "personal_loan", "utility", "other"',
      },
      debt_amount: {
        type: 'string',
        description: 'Amount the collector claims is owed',
      },
      original_creditor: {
        type: 'string',
        description: 'Name of the original creditor (if known)',
      },
      collector_name: {
        type: 'string',
        description: 'Name of the collection agency',
      },
      last_payment_date: {
        type: 'string',
        description: 'Approximate date of last payment on the debt (e.g. "2022-06", "about 3 years ago")',
      },
      collector_behavior: {
        type: 'string',
        description: 'Describe how the collector has contacted you and what they said/did. Include: frequency of calls, time of day, threats made, what they told you, whether they contacted your employer/family, whether they sent a written validation notice within 5 days of first contact.',
      },
      communication_method: {
        type: 'string',
        description: 'How collector contacted you: "phone", "letter", "text", "email", "voicemail", "multiple"',
      },
      has_validation_notice: {
        type: 'string',
        description: '"yes" if you received a written validation notice within 5 days of first contact, "no" if not, "unsure" if unknown',
      },
      disputed_before: {
        type: 'string',
        description: '"yes" or "no" — have you already disputed this debt?',
      },
    },
    required: ['state', 'collector_behavior'],
  },
}

// Statute of limitations by state (in years) for different debt types
// Format: { written: number, oral: number, promissory: number, openEnded: number }
const SOL_BY_STATE: Record<string, { written: number; oral: number; promissory: number; openEnded: number }> = {
  AL: { written: 6, oral: 6, promissory: 6, openEnded: 3 },
  AK: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  AZ: { written: 6, oral: 3, promissory: 6, openEnded: 3 },
  AR: { written: 5, oral: 3, promissory: 5, openEnded: 3 },
  CA: { written: 4, oral: 2, promissory: 4, openEnded: 4 },
  CO: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  CT: { written: 6, oral: 3, promissory: 6, openEnded: 3 },
  DE: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  DC: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  FL: { written: 5, oral: 4, promissory: 5, openEnded: 4 },
  GA: { written: 6, oral: 4, promissory: 6, openEnded: 4 },
  HI: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  ID: { written: 5, oral: 4, promissory: 5, openEnded: 4 },
  IL: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
  IN: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  IA: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
  KS: { written: 5, oral: 3, promissory: 5, openEnded: 3 },
  KY: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
  LA: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  ME: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  MD: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  MA: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  MI: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  MN: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  MS: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  MO: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
  MT: { written: 5, oral: 3, promissory: 5, openEnded: 3 },
  NE: { written: 5, oral: 4, promissory: 5, openEnded: 4 },
  NV: { written: 6, oral: 4, promissory: 6, openEnded: 4 },
  NH: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  NJ: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  NM: { written: 6, oral: 4, promissory: 6, openEnded: 4 },
  NY: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  NC: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  ND: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  OH: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  OK: { written: 5, oral: 3, promissory: 5, openEnded: 3 },
  OR: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  PA: { written: 4, oral: 4, promissory: 4, openEnded: 4 },
  RI: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
  SC: { written: 3, oral: 3, promissory: 3, openEnded: 3 },
  SD: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  TN: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  TX: { written: 4, oral: 4, promissory: 4, openEnded: 4 },
  UT: { written: 6, oral: 4, promissory: 6, openEnded: 4 },
  VT: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  VA: { written: 5, oral: 3, promissory: 5, openEnded: 3 },
  WA: { written: 6, oral: 3, promissory: 6, openEnded: 3 },
  WV: { written: 6, oral: 5, promissory: 6, openEnded: 5 },
  WI: { written: 6, oral: 6, promissory: 6, openEnded: 6 },
  WY: { written: 5, oral: 5, promissory: 5, openEnded: 5 },
}

const STATE_ABBREV: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY', 'district of columbia': 'DC',
}

function normalizeState(input: string): string {
  const trimmed = input.trim()
  if (trimmed.length === 2) return trimmed.toUpperCase()
  return STATE_ABBREV[trimmed.toLowerCase()] || trimmed.toUpperCase().slice(0, 2)
}

function getDebtSOLCategory(debtType: string): 'written' | 'oral' | 'promissory' | 'openEnded' {
  switch (debtType.toLowerCase()) {
    case 'credit_card': return 'openEnded'
    case 'medical': return 'written'
    case 'student_loan': return 'written'
    case 'auto': return 'written'
    case 'mortgage': return 'written'
    case 'personal_loan': return 'written'
    case 'utility': return 'written'
    default: return 'written'
  }
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const state = normalizeState((args.state as string) || '')
  const debtType = (args.debt_type as string) || 'other'
  const debtAmount = (args.debt_amount as string) || 'unknown'
  const originalCreditor = (args.original_creditor as string) || 'unknown'
  const collectorName = (args.collector_name as string) || 'the collection agency'
  const lastPayment = (args.last_payment_date as string) || ''
  const behavior = (args.collector_behavior as string) || ''
  const commMethod = (args.communication_method as string) || 'unknown'
  const hasValidation = ((args.has_validation_notice as string) || 'unsure').toLowerCase()
  const disputedBefore = ((args.disputed_before as string) || 'no').toLowerCase() === 'yes'

  if (!state || !behavior) {
    return 'Error: state and collector_behavior are required'
  }

  const results: string[] = []
  results.push('## Debt Collection Situation Analysis')
  results.push('')
  results.push(`**State**: ${state}`)
  results.push(`**Debt type**: ${debtType}`)
  results.push(`**Claimed amount**: ${debtAmount}`)
  results.push(`**Original creditor**: ${originalCreditor}`)
  results.push(`**Collection agency**: ${collectorName}`)
  results.push(`**Communication method**: ${commMethod}`)
  results.push('')

  // FDCPA Violation Analysis
  results.push('### FDCPA Violation Analysis')
  results.push('')
  const violations: string[] = []
  const behaviorLower = behavior.toLowerCase()

  // Check for common violations
  if (behaviorLower.includes('threaten') || behaviorLower.includes('arrest') || behaviorLower.includes('jail') || behaviorLower.includes('prison') || behaviorLower.includes('criminal')) {
    violations.push('**False threat of arrest/criminal action** (§807(4), §807(7)) — Debt collectors CANNOT threaten you with arrest, criminal prosecution, or imprisonment. Consumer debt is a civil matter, not criminal.')
  }
  if (behaviorLower.includes('sue') || behaviorLower.includes('lawsuit') || behaviorLower.includes('court')) {
    violations.push('**Threat of legal action** (§807(5)) — If the collector threatens to sue but has no actual intention or ability to do so (e.g., debt is past statute of limitations), this is a violation.')
  }
  if (behaviorLower.includes('employer') || behaviorLower.includes('boss') || behaviorLower.includes('work') || behaviorLower.includes('coworker')) {
    violations.push('**Contacting employer** (§804(2), §805(b)) — Collectors can only contact your employer to verify location info (once). They CANNOT discuss your debt with your employer or contact your workplace repeatedly.')
  }
  if (behaviorLower.includes('family') || behaviorLower.includes('relative') || behaviorLower.includes('neighbor') || behaviorLower.includes('friend') || behaviorLower.includes('parent') || behaviorLower.includes('spouse')) {
    violations.push('**Contacting third parties** (§805(b)) — Collectors can only contact third parties ONCE to get your contact info. They CANNOT discuss your debt with family, friends, or neighbors.')
  }
  if (behaviorLower.includes('early morning') || behaviorLower.includes('late night') || behaviorLower.includes('before 8') || behaviorLower.includes('after 9') || behaviorLower.includes('midnight') || behaviorLower.includes('6 am') || behaviorLower.includes('7 am') || behaviorLower.includes('10 pm') || behaviorLower.includes('11 pm')) {
    violations.push('**Calls at prohibited times** (§805(a)(1)) — Collectors CANNOT call before 8:00 AM or after 9:00 PM in YOUR time zone.')
  }
  if (behaviorLower.includes('multiple times') || behaviorLower.includes('keeps calling') || behaviorLower.includes('calls every') || behaviorLower.includes('harass') || behaviorLower.includes('won\'t stop') || behaviorLower.includes('constant') || behaviorLower.includes('nonstop') || behaviorLower.includes('excessive')) {
    violations.push('**Harassment through excessive calls** (§806(5)) — Repeatedly calling with the intent to annoy, abuse, or harass is prohibited. Under Regulation F, collectors generally cannot call more than 7 times within 7 days on a specific debt.')
  }
  if (behaviorLower.includes('profan') || behaviorLower.includes('obscen') || behaviorLower.includes('curs') || behaviorLower.includes('swear') || behaviorLower.includes('abusi') || behaviorLower.includes('insult')) {
    violations.push('**Abusive or profane language** (§806(2)) — Using obscene, profane, or abusive language is prohibited.')
  }
  if (behaviorLower.includes('credit report') || behaviorLower.includes('credit score') || behaviorLower.includes('ruin your credit') || behaviorLower.includes('destroy your credit')) {
    violations.push('**False credit reporting threats** (§807(8)) — While collectors CAN report debts to credit bureaus, threatening to falsely report or misrepresent your debt status is a violation.')
  }
  if (behaviorLower.includes('garnish') || behaviorLower.includes('seize') || behaviorLower.includes('take your') || behaviorLower.includes('lien') || behaviorLower.includes('freeze your account')) {
    violations.push('**False threats of seizure** (§807(4)) — Threatening to seize property, garnish wages, or freeze accounts without a court judgment is a violation (unless they already have a judgment).')
  }
  if (behaviorLower.includes('different amount') || behaviorLower.includes('more than') || behaviorLower.includes('added fees') || behaviorLower.includes('interest') || behaviorLower.includes('inflate')) {
    violations.push('**False representation of debt amount** (§807(2)(A)) — Misrepresenting the amount owed, adding unauthorized fees, or inflating the balance is prohibited.')
  }
  if (behaviorLower.includes('didn\'t identify') || behaviorLower.includes('didn\'t say who') || behaviorLower.includes('wouldn\'t tell') || behaviorLower.includes('no name') || behaviorLower.includes('refused to identify')) {
    violations.push('**Failure to identify** (§807(11)) — Collectors MUST identify themselves as debt collectors in every communication.')
  }

  // Validation notice check
  if (hasValidation === 'no') {
    violations.push('**Missing validation notice** (§809(a)) — Collectors MUST send a written validation notice within 5 days of their first contact. This notice must include: the amount of debt, the name of the creditor, and a statement of your right to dispute within 30 days.')
  }

  if (violations.length > 0) {
    results.push(`**⚠️ ${violations.length} potential FDCPA violation(s) identified:**`)
    results.push('')
    violations.forEach((v, i) => {
      results.push(`${i + 1}. ${v}`)
    })
  } else {
    results.push('No clear FDCPA violations detected from the description provided. However, document all future interactions carefully — violations often become apparent over time.')
  }
  results.push('')

  // Statute of Limitations
  results.push('### Statute of Limitations Analysis')
  results.push('')
  const solData = SOL_BY_STATE[state]
  if (solData) {
    const category = getDebtSOLCategory(debtType)
    const solYears = solData[category]
    results.push(`**${state} statute of limitations for ${debtType} debt**: ${solYears} years`)
    results.push('')

    if (lastPayment) {
      results.push(`**Last payment**: ${lastPayment}`)
      results.push('')
      results.push('⚠️ **CRITICAL WARNING**: If the statute of limitations has expired, the collector CANNOT sue you for this debt. However:')
      results.push('- Making ANY payment (even $1) can **restart** the statute of limitations in many states')
      results.push('- Acknowledging the debt in writing may also restart it')
      results.push('- The debt can still appear on your credit report for up to 7 years from original delinquency')
      results.push('- Time-barred debts cannot be sued upon, but collectors can still ASK you to pay')
    } else {
      results.push('**Last payment date unknown** — determine this before responding to the collector. It\'s critical for assessing whether the debt is time-barred.')
    }
  } else {
    results.push(`Could not find statute of limitations data for "${state}". Use \`search_debt_collection_laws\` to research your state's specific rules.`)
  }
  results.push('')

  // Your Rights Summary
  results.push('### Your Rights Under the FDCPA')
  results.push('')
  results.push('1. **Right to demand validation** (§809) — You have 30 days from the first contact to send a written dispute demanding the collector prove the debt is yours and the amount is correct. They MUST stop collection until they provide validation.')
  results.push('2. **Right to cease contact** (§805(c)) — You can send a written letter demanding the collector stop all contact. After receiving it, they can only contact you to confirm receipt or notify of legal action.')
  results.push('3. **Right to dispute** — You can dispute any debt you believe is inaccurate, not yours, or already paid.')
  results.push('4. **Right to sue** (§813) — If a collector violates the FDCPA, you can sue them for up to $1,000 in statutory damages PLUS actual damages PLUS attorney\'s fees. You have 1 year from the violation to file suit.')
  results.push('5. **Right to privacy** — Collectors cannot discuss your debt with anyone except you, your spouse, your attorney, or a credit reporting agency.')
  if (!disputedBefore) {
    results.push('')
    results.push('**⏰ TIME-SENSITIVE**: If this is the first contact, you have **30 days** to send a written dispute/validation request. Do this ASAP — it forces the collector to prove the debt is valid before continuing collection.')
  }
  results.push('')

  // Recommended Actions
  results.push('### Recommended Actions')
  results.push('')
  const actions: string[] = []

  if (!disputedBefore) {
    actions.push('**Send a debt validation letter** — This is your #1 priority. Use `write_dispute_letter` to generate one. The collector must stop collection and provide proof of the debt.')
  }
  if (violations.length > 0) {
    actions.push(`**Document all violations** — You have ${violations.length} potential violation(s). Save all voicemails, texts, letters, and call logs. These are evidence for a CFPB complaint or lawsuit.`)
    actions.push('**File a CFPB complaint** — Report the violations at consumerfinance.gov/complaint. The CFPB forwards to the collector and they must respond.')
    actions.push('**Consider consulting a consumer rights attorney** — FDCPA cases are taken on contingency (no upfront cost). You could recover $1,000+ in statutory damages per violation plus attorney\'s fees.')
  }
  if (solData) {
    const category = getDebtSOLCategory(debtType)
    const solYears = solData[category]
    actions.push(`**Check if debt is time-barred** — The statute of limitations in ${state} for ${debtType} debt is ${solYears} years. If the last payment was more than ${solYears} years ago, the collector cannot sue you. Do NOT make any payment or acknowledge the debt in writing.`)
  }
  actions.push('**Use `search_debt_collection_laws`** to research your state\'s specific consumer protection laws beyond the federal FDCPA.')
  actions.push('**Use `write_dispute_letter`** to generate personalized dispute letters incorporating the violations identified above.')

  actions.forEach((a, i) => {
    results.push(`${i + 1}. ${a}`)
  })
  results.push('')

  // Disclaimer
  results.push('---')
  results.push('**Disclaimer**: This analysis is for informational purposes only and is NOT legal advice. The FDCPA is complex and state laws vary. For disputes involving large amounts or multiple violations, consult a consumer rights attorney — many take FDCPA cases on contingency (no upfront cost to you).')

  return results.join('\n')
}
