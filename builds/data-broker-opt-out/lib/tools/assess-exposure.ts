import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'assess_exposure',
  description:
    'Assess a user\'s likely data broker exposure based on their profile. Returns a prioritized list of data brokers that likely have the user\'s data, categorized by type and risk level. Use this early in the conversation after gathering the user\'s basic info.',
  parameters: {
    type: 'object',
    properties: {
      has_owned_property: {
        type: 'string',
        description: 'Has the user ever owned property? "yes", "no", or "unknown"',
      },
      has_been_in_court_records: {
        type: 'string',
        description: 'Has the user been involved in any court cases (civil, traffic, etc.)? "yes", "no", or "unknown"',
      },
      has_social_media: {
        type: 'string',
        description: 'Does the user have social media accounts? "yes", "no", or "unknown"',
      },
      has_voted: {
        type: 'string',
        description: 'Is the user a registered voter? "yes", "no", or "unknown"',
      },
      age_range: {
        type: 'string',
        description: 'User\'s age range: "18-25", "26-35", "36-50", "51-65", "65+"',
      },
      state: {
        type: 'string',
        description: 'User\'s state of residence',
      },
    },
    required: [],
  },
}

interface BrokerInfo {
  name: string
  type: string
  dataTypes: string[]
  risk: 'HIGH' | 'MEDIUM' | 'LOW'
  optOutDifficulty: 'EASY' | 'MODERATE' | 'HARD'
  optOutMethod: string
  estimatedTime: string
  notes: string
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const hasProperty = ((args.has_owned_property as string) || 'unknown').toLowerCase()
  const hasCourtRecords = ((args.has_been_in_court_records as string) || 'unknown').toLowerCase()
  const hasSocialMedia = ((args.has_social_media as string) || 'yes').toLowerCase()
  const hasVoted = ((args.has_voted as string) || 'unknown').toLowerCase()
  const ageRange = (args.age_range as string) || 'unknown'
  const state = (args.state as string) || 'Unknown'

  // Top data brokers — everyone is likely on these
  const universalBrokers: BrokerInfo[] = [
    {
      name: 'Spokeo',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'email', 'relatives', 'social media'],
      risk: 'HIGH',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online form — search for your profile, then click opt-out link',
      estimatedTime: '5 minutes',
      notes: 'One of the largest people search sites. Aggregates from public records, social media, and other brokers.',
    },
    {
      name: 'BeenVerified',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'email', 'criminal records', 'assets'],
      risk: 'HIGH',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online form at beenverified.com/faq/opt-out',
      estimatedTime: '5 minutes',
      notes: 'Also operates PeopleLooker and NumberGuru.',
    },
    {
      name: 'WhitePages / Whitepages Premium',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'relatives', 'neighbors'],
      risk: 'HIGH',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Online — requires phone verification',
      estimatedTime: '10 minutes',
      notes: 'One of the oldest people search sites. Very widely used.',
    },
    {
      name: 'Intelius',
      type: 'People Search / Background Check',
      dataTypes: ['name', 'address', 'phone', 'criminal records', 'court records'],
      risk: 'HIGH',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Online form — requires identity verification',
      estimatedTime: '10 minutes',
      notes: 'Owns several other people search sites (Zabasearch, PeopleFinder).',
    },
    {
      name: 'TruePeopleSearch',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'email', 'relatives'],
      risk: 'HIGH',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online — find your listing, click "Remove This Record"',
      estimatedTime: '5 minutes',
      notes: 'Free people search with no account needed. Very popular.',
    },
    {
      name: 'FastPeopleSearch',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'email', 'age'],
      risk: 'HIGH',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online — find your listing, click "Remove My Record"',
      estimatedTime: '3 minutes',
      notes: 'Free, no login required to search.',
    },
    {
      name: 'ThatsThem',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'email', 'IP address'],
      risk: 'MEDIUM',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online form — find your listing, click opt-out',
      estimatedTime: '5 minutes',
      notes: 'Also shows IP address lookups.',
    },
    {
      name: 'USSearch',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'background info'],
      risk: 'MEDIUM',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Email request to privacy@ussearch.com',
      estimatedTime: '10 minutes + wait',
      notes: 'Response may take a few days.',
    },
    {
      name: 'Radaris',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'court records', 'business records'],
      risk: 'HIGH',
      optOutDifficulty: 'HARD',
      optOutMethod: 'Requires creating an account, then submitting removal request',
      estimatedTime: '15 minutes',
      notes: 'Known for making opt-out difficult. May require ID verification.',
    },
    {
      name: 'PeopleFinder',
      type: 'People Search',
      dataTypes: ['name', 'address', 'phone', 'age', 'relatives'],
      risk: 'HIGH',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Online form at peoplefinder.com/optout',
      estimatedTime: '10 minutes',
      notes: 'Owned by Intelius group.',
    },
  ]

  // Conditional brokers based on profile
  const conditionalBrokers: BrokerInfo[] = []

  if (hasProperty === 'yes') {
    conditionalBrokers.push({
      name: 'Zillow / Realtor.com',
      type: 'Property Records',
      dataTypes: ['name', 'property address', 'purchase price', 'property details'],
      risk: 'MEDIUM',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Claim your home on Zillow, then adjust privacy settings',
      estimatedTime: '15 minutes',
      notes: 'Property records are public, but you can manage your profile.',
    })
    conditionalBrokers.push({
      name: 'RealtyTrac / ATTOM Data',
      type: 'Property Records',
      dataTypes: ['name', 'property details', 'tax records', 'foreclosure data'],
      risk: 'MEDIUM',
      optOutDifficulty: 'HARD',
      optOutMethod: 'Email privacy request',
      estimatedTime: '15 minutes + wait',
      notes: 'Public record data — harder to remove.',
    })
  }

  if (hasCourtRecords === 'yes') {
    conditionalBrokers.push({
      name: 'PACER / Court Records',
      type: 'Court Records',
      dataTypes: ['name', 'case details', 'filing information'],
      risk: 'HIGH',
      optOutDifficulty: 'HARD',
      optOutMethod: 'Court records are public — focus on removing from aggregator sites instead',
      estimatedTime: 'N/A',
      notes: 'Court records themselves can\'t be removed, but aggregator listings can.',
    })
  }

  if (hasSocialMedia === 'yes') {
    conditionalBrokers.push({
      name: 'Pipl',
      type: 'Identity Resolution',
      dataTypes: ['name', 'email', 'social profiles', 'phone', 'employment'],
      risk: 'HIGH',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Email pipl.com privacy team for removal',
      estimatedTime: '10 minutes + wait',
      notes: 'Aggregates social media profiles into identity profiles.',
    })
  }

  // Marketing data brokers (everyone)
  const marketingBrokers: BrokerInfo[] = [
    {
      name: 'Acxiom',
      type: 'Marketing Data',
      dataTypes: ['name', 'address', 'demographics', 'purchase behavior', 'interests'],
      risk: 'MEDIUM',
      optOutDifficulty: 'EASY',
      optOutMethod: 'Online at aboutthedata.com — review and opt out',
      estimatedTime: '10 minutes',
      notes: 'One of the largest marketing data brokers. Claims data on 2.5 billion consumers globally.',
    },
    {
      name: 'Oracle Data Cloud (Datalogix)',
      type: 'Marketing Data',
      dataTypes: ['purchase data', 'demographics', 'interests', 'device IDs'],
      risk: 'MEDIUM',
      optOutDifficulty: 'MODERATE',
      optOutMethod: 'Online opt-out via Oracle privacy portal',
      estimatedTime: '10 minutes',
      notes: 'Links offline purchases to online identities.',
    },
    {
      name: 'LexisNexis',
      type: 'Public Records / Risk Assessment',
      dataTypes: ['name', 'address', 'SSN history', 'employment', 'court records', 'licenses'],
      risk: 'HIGH',
      optOutDifficulty: 'HARD',
      optOutMethod: 'Written request via mail or online consumer disclosure request',
      estimatedTime: '20 minutes + mail',
      notes: 'Has very deep records. Used by law enforcement and insurers.',
    },
  ]

  // Build the report
  const allBrokers = [...universalBrokers, ...conditionalBrokers, ...marketingBrokers]
  const highRisk = allBrokers.filter(b => b.risk === 'HIGH')
  const medRisk = allBrokers.filter(b => b.risk === 'MEDIUM')

  const report: string[] = []
  report.push('## Data Broker Exposure Assessment')
  report.push('')
  report.push(`**State**: ${state}`)
  report.push(`**Estimated brokers with your data**: ${allBrokers.length}+ (this covers major brokers only; thousands more exist)`)
  report.push(`**Estimated total opt-out time**: ${allBrokers.reduce((sum, b) => sum + parseInt(b.estimatedTime) || 10, 0)} minutes`)
  report.push('')

  report.push('### 🔴 HIGH Priority (Remove First)')
  report.push('')
  report.push('| # | Broker | Type | Opt-Out Difficulty | Est. Time |')
  report.push('|---|--------|------|-------------------|-----------|')
  highRisk.forEach((b, i) => {
    report.push(`| ${i + 1} | **${b.name}** | ${b.type} | ${b.optOutDifficulty} | ${b.estimatedTime} |`)
  })
  report.push('')

  report.push('### 🟡 MEDIUM Priority')
  report.push('')
  report.push('| # | Broker | Type | Opt-Out Difficulty | Est. Time |')
  report.push('|---|--------|------|-------------------|-----------|')
  medRisk.forEach((b, i) => {
    report.push(`| ${i + 1} | **${b.name}** | ${b.type} | ${b.optOutDifficulty} | ${b.estimatedTime} |`)
  })
  report.push('')

  report.push('### Next Steps')
  report.push('1. Use `search_data_brokers` to find the opt-out page for each HIGH priority broker')
  report.push('2. Use `web_fetch` to read each broker\'s opt-out instructions')
  report.push('3. Use `write_removal_plan` to generate a comprehensive, step-by-step removal guide')

  return report.join('\n')
}
