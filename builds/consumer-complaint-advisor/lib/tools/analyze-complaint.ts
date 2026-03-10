import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'analyze_complaint',
  description:
    'Analyze a consumer complaint to classify it and identify the right agencies to file with. Takes the company name, product/service type, issue description, amount involved, and state. Returns complaint classification, relevant agencies ranked by effectiveness, applicable consumer protection laws, and recommended escalation strategy. Use this FIRST after gathering complaint details.',
  parameters: {
    type: 'object',
    properties: {
      company_name: {
        type: 'string',
        description: 'Name of the company the complaint is against',
      },
      product_or_service: {
        type: 'string',
        description: 'Type of product or service (e.g. "credit card", "internet service", "appliance", "car repair", "subscription")',
      },
      issue_description: {
        type: 'string',
        description: 'What happened — the core complaint in detail',
      },
      amount_involved: {
        type: 'string',
        description: 'Dollar amount involved, if applicable (e.g. "$500", "$2,300")',
      },
      state: {
        type: 'string',
        description: 'State where the consumer is located (e.g. "California", "TX")',
      },
      already_contacted_company: {
        type: 'string',
        description: 'Has the consumer already tried to resolve with the company? "yes" or "no"',
      },
      issue_category: {
        type: 'string',
        description: 'Category if known: "billing", "fraud", "defective_product", "service_failure", "contract_dispute", "deceptive_practices", "debt_collection", "privacy", "other"',
        enum: ['billing', 'fraud', 'defective_product', 'service_failure', 'contract_dispute', 'deceptive_practices', 'debt_collection', 'privacy', 'other'],
      },
    },
    required: ['company_name', 'issue_description', 'state'],
  },
}

interface AgencyRecommendation {
  name: string
  acronym: string
  relevance: 'PRIMARY' | 'SECONDARY' | 'OPTIONAL'
  reason: string
  filingUrl: string
  phone: string
}

function classifyComplaint(product: string, issue: string, category: string): string[] {
  const combined = `${product} ${issue} ${category}`.toLowerCase()
  const types: string[] = []

  if (/credit|loan|mortgage|bank|debit|check|saving|financ|interest rate|apr|fee|overdraft/.test(combined)) {
    types.push('FINANCIAL')
  }
  if (/debt collect|collector|collection agency|harass|calls about debt/.test(combined)) {
    types.push('DEBT_COLLECTION')
  }
  if (/internet|cable|phone|mobile|wireless|broadband|telecom|cell|carrier|data plan/.test(combined)) {
    types.push('TELECOM')
  }
  if (/scam|fraud|identity theft|phishing|fake|stolen|unauthorized charge/.test(combined)) {
    types.push('FRAUD')
  }
  if (/car|auto|vehicle|dealer|lemon|repair shop|mechanic/.test(combined)) {
    types.push('AUTO')
  }
  if (/health|medical|hospital|doctor|insurance claim|prescription|pharmacy/.test(combined)) {
    types.push('HEALTH')
  }
  if (/subscript|cancel|recurring|auto.?renew|free trial|membership/.test(combined)) {
    types.push('SUBSCRIPTION')
  }
  if (/privacy|data|personal info|breach|tracking|sold my data/.test(combined)) {
    types.push('PRIVACY')
  }
  if (/home|house|contractor|renovation|repair|plumb|electric|hvac|roof/.test(combined)) {
    types.push('HOME_SERVICES')
  }
  if (/product|defective|broken|recall|safety|injury|malfunction/.test(combined)) {
    types.push('PRODUCT_SAFETY')
  }
  if (/travel|airline|hotel|flight|booking|refund|cancel/.test(combined)) {
    types.push('TRAVEL')
  }
  if (/landlord|rent|lease|tenant|evict|deposit|housing/.test(combined)) {
    types.push('HOUSING')
  }
  if (/energy|utility|electric|gas|water|power/.test(combined)) {
    types.push('UTILITIES')
  }

  if (types.length === 0) types.push('GENERAL')
  return types
}

function getAgencies(types: string[], state: string): AgencyRecommendation[] {
  const agencies: AgencyRecommendation[] = []

  // Always recommend state AG
  agencies.push({
    name: `${state} Attorney General — Consumer Protection Division`,
    acronym: 'State AG',
    relevance: 'PRIMARY',
    reason: 'State attorneys general enforce state consumer protection laws and can investigate patterns of complaints against companies. Filing here creates a legal record.',
    filingUrl: 'https://www.usa.gov/state-consumer',
    phone: 'Search: "[state] attorney general consumer complaint"',
  })

  // FTC for most consumer issues
  agencies.push({
    name: 'Federal Trade Commission',
    acronym: 'FTC',
    relevance: types.includes('FRAUD') || types.includes('SUBSCRIPTION') || types.includes('DECEPTIVE') ? 'PRIMARY' : 'SECONDARY',
    reason: 'The FTC tracks consumer complaints nationally. While they don\'t resolve individual cases, high complaint volume triggers investigations. Filing here is always worthwhile.',
    filingUrl: 'https://reportfraud.ftc.gov/',
    phone: '1-877-FTC-HELP (1-877-382-4357)',
  })

  // CFPB for financial
  if (types.includes('FINANCIAL') || types.includes('DEBT_COLLECTION')) {
    agencies.push({
      name: 'Consumer Financial Protection Bureau',
      acronym: 'CFPB',
      relevance: 'PRIMARY',
      reason: 'The CFPB handles financial product complaints and REQUIRES companies to respond within 15 days. This is often the most effective agency for financial disputes — companies take CFPB complaints seriously.',
      filingUrl: 'https://www.consumerfinance.gov/complaint/',
      phone: '1-855-411-CFPB (1-855-411-2372)',
    })
  }

  // FCC for telecom
  if (types.includes('TELECOM')) {
    agencies.push({
      name: 'Federal Communications Commission',
      acronym: 'FCC',
      relevance: 'PRIMARY',
      reason: 'The FCC handles complaints about phone, internet, cable, and wireless services. Companies must respond to FCC complaints within 30 days.',
      filingUrl: 'https://consumercomplaints.fcc.gov/',
      phone: '1-888-225-5322',
    })
  }

  // DOT for travel/airlines
  if (types.includes('TRAVEL')) {
    agencies.push({
      name: 'Department of Transportation — Aviation Consumer Protection',
      acronym: 'DOT',
      relevance: 'PRIMARY',
      reason: 'The DOT handles airline complaints (cancellations, refunds, lost baggage, bumping). Airlines must respond to DOT complaints.',
      filingUrl: 'https://airconsumer.dot.gov/escomplaint/ConsumerForm.cfm',
      phone: '1-202-366-2220',
    })
  }

  // CPSC for product safety
  if (types.includes('PRODUCT_SAFETY')) {
    agencies.push({
      name: 'Consumer Product Safety Commission',
      acronym: 'CPSC',
      relevance: 'PRIMARY',
      reason: 'The CPSC handles complaints about unsafe or defective consumer products. They can mandate recalls and issue safety warnings.',
      filingUrl: 'https://www.saferproducts.gov/',
      phone: '1-800-638-2772',
    })
  }

  // HUD for housing
  if (types.includes('HOUSING')) {
    agencies.push({
      name: 'Department of Housing and Urban Development',
      acronym: 'HUD',
      relevance: 'SECONDARY',
      reason: 'HUD handles housing discrimination complaints and certain landlord/tenant issues involving federally-funded housing.',
      filingUrl: 'https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint',
      phone: '1-800-669-9777',
    })
  }

  // State insurance department for health/insurance
  if (types.includes('HEALTH')) {
    agencies.push({
      name: `${state} Department of Insurance`,
      acronym: 'State DOI',
      relevance: 'PRIMARY',
      reason: 'State insurance departments regulate insurance companies and can investigate denied claims, rate increases, and bad faith practices.',
      filingUrl: 'Search: "[state] department of insurance complaint"',
      phone: 'Search: "[state] department of insurance phone number"',
    })
  }

  // State licensing board for auto/home services
  if (types.includes('AUTO') || types.includes('HOME_SERVICES')) {
    agencies.push({
      name: `${state} Contractor/Auto Dealer Licensing Board`,
      acronym: 'State License Board',
      relevance: 'PRIMARY',
      reason: 'Licensed businesses (contractors, auto dealers, mechanics) can have their license suspended or revoked. This is a powerful lever.',
      filingUrl: 'Search: "[state] contractor license board complaint" or "[state] auto dealer complaint"',
      phone: 'Search: "[state] licensing board consumer complaint"',
    })
  }

  // State public utilities commission for utilities
  if (types.includes('UTILITIES')) {
    agencies.push({
      name: `${state} Public Utilities Commission`,
      acronym: 'State PUC',
      relevance: 'PRIMARY',
      reason: 'State utility commissions regulate gas, electric, and water companies. They can order refunds and investigate billing practices.',
      filingUrl: 'Search: "[state] public utilities commission complaint"',
      phone: 'Search: "[state] PUC consumer complaint phone"',
    })
  }

  // BBB always optional
  agencies.push({
    name: 'Better Business Bureau',
    acronym: 'BBB',
    relevance: 'OPTIONAL',
    reason: 'BBB is not a government agency and has no enforcement power. However, many companies respond to BBB complaints to maintain their rating. Worth trying as a low-effort option.',
    filingUrl: 'https://www.bbb.org/file-a-complaint',
    phone: 'Varies by local BBB',
  })

  return agencies
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const companyName = (args.company_name as string) || 'Unknown Company'
  const productOrService = (args.product_or_service as string) || ''
  const issueDescription = (args.issue_description as string) || ''
  const amountInvolved = (args.amount_involved as string) || 'Not specified'
  const state = (args.state as string) || 'Unknown'
  const alreadyContacted = ((args.already_contacted_company as string) || 'no').toLowerCase() === 'yes'
  const issueCategory = (args.issue_category as string) || 'other'

  const types = classifyComplaint(productOrService, issueDescription, issueCategory)
  const agencies = getAgencies(types, state)

  const primaryAgencies = agencies.filter(a => a.relevance === 'PRIMARY')
  const secondaryAgencies = agencies.filter(a => a.relevance === 'SECONDARY')
  const optionalAgencies = agencies.filter(a => a.relevance === 'OPTIONAL')

  const amount = amountInvolved.replace(/[^0-9.]/g, '')
  const amountNum = parseFloat(amount) || 0
  const smallClaimsEligible = amountNum > 0 && amountNum <= 10000

  const report: string[] = []

  report.push(`## Complaint Analysis: ${companyName}`)
  report.push(`**Type**: ${types.join(', ')}`)
  report.push(`**State**: ${state}`)
  report.push(`**Amount**: ${amountInvolved}`)
  report.push(`**Company contacted**: ${alreadyContacted ? 'Yes' : 'Not yet'}`)
  report.push('')

  // Escalation strategy
  report.push('### Recommended Escalation Strategy')
  if (!alreadyContacted) {
    report.push('**Step 1 — Contact the company first**')
    report.push('- Call or write the company directly. Ask for a supervisor or manager.')
    report.push('- State your complaint clearly and what resolution you want.')
    report.push('- **Keep records**: date, time, who you spoke to, what they said.')
    report.push('- Give them 7-14 days to respond before escalating.')
    report.push('')
  }

  report.push(`**${alreadyContacted ? 'Step 1' : 'Step 2'} — File with government agencies**`)
  report.push('File with these agencies (you can file with multiple simultaneously):')
  report.push('')

  if (primaryAgencies.length > 0) {
    report.push('#### Primary Agencies (file with ALL of these)')
    primaryAgencies.forEach((a, i) => {
      report.push(`${i + 1}. **${a.name}** (${a.acronym})`)
      report.push(`   - Why: ${a.reason}`)
      report.push(`   - File: ${a.filingUrl}`)
      report.push(`   - Phone: ${a.phone}`)
    })
    report.push('')
  }

  if (secondaryAgencies.length > 0) {
    report.push('#### Secondary Agencies (recommended)')
    secondaryAgencies.forEach((a, i) => {
      report.push(`${i + 1}. **${a.name}** (${a.acronym})`)
      report.push(`   - Why: ${a.reason}`)
      report.push(`   - File: ${a.filingUrl}`)
      report.push(`   - Phone: ${a.phone}`)
    })
    report.push('')
  }

  if (optionalAgencies.length > 0) {
    report.push('#### Optional (low-effort, may help)')
    optionalAgencies.forEach(a => {
      report.push(`- **${a.name}** (${a.acronym}) — ${a.reason} File: ${a.filingUrl}`)
    })
    report.push('')
  }

  // Small claims court
  if (smallClaimsEligible) {
    report.push(`**${alreadyContacted ? 'Step 2' : 'Step 3'} — Small Claims Court**`)
    report.push(`Your dispute amount ($${amountNum.toLocaleString()}) likely falls within small claims court limits in most states ($5,000-$25,000 depending on state).`)
    report.push('- No lawyer needed — you represent yourself')
    report.push('- Filing fee is typically $30-$75')
    report.push(`- Search: "${state} small claims court filing"`)
    report.push('')
  }

  report.push('### Next Steps')
  report.push('1. **Search for consumer rights** — use `search_consumer_rights` to find state-specific consumer protection laws for your situation')
  report.push('2. **Research company complaint history** — use `research_company_complaints` to check this company\'s complaint track record')
  report.push('3. **Generate resolution plan** — use `write_resolution_plan` to create complaint letters and a complete action plan')

  return report.join('\n')
}
