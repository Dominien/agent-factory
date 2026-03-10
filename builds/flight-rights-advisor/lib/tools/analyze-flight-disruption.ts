import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'analyze_flight_disruption',
  description:
    'Analyze a flight disruption to determine passenger rights, eligible compensation, and applicable regulations. Takes flight details including airline, route, delay/cancellation info, and date. Returns which regulations apply (US DOT, EU261, Canadian APPR), compensation eligibility, estimated amounts, and recommended actions. Use this FIRST after gathering flight disruption details.',
  parameters: {
    type: 'object',
    properties: {
      airline: {
        type: 'string',
        description: 'Airline name (e.g. "United Airlines", "Ryanair", "Air Canada")',
      },
      flight_number: {
        type: 'string',
        description: 'Flight number if known (e.g. "UA1234")',
      },
      departure_airport: {
        type: 'string',
        description: 'Departure airport code or city (e.g. "JFK", "London Heathrow", "LHR")',
      },
      arrival_airport: {
        type: 'string',
        description: 'Arrival airport code or city (e.g. "LAX", "Paris CDG")',
      },
      disruption_type: {
        type: 'string',
        description: 'Type of disruption',
        enum: ['cancellation', 'delay', 'denied_boarding', 'downgrade', 'lost_baggage', 'delayed_baggage'],
      },
      delay_hours: {
        type: 'string',
        description: 'How many hours delayed at arrival (e.g. "3", "5.5", "overnight")',
      },
      flight_date: {
        type: 'string',
        description: 'Date of the flight (e.g. "2026-03-01")',
      },
      reason_given: {
        type: 'string',
        description: 'Reason the airline gave for the disruption (e.g. "weather", "mechanical", "crew shortage", "air traffic control")',
      },
      ticket_price: {
        type: 'string',
        description: 'Ticket price paid (e.g. "$450", "€300")',
      },
      paid_with_credit_card: {
        type: 'string',
        description: 'Was the ticket purchased with a credit card? "yes" or "no"',
      },
      rebooked: {
        type: 'string',
        description: 'Were you rebooked on another flight? "yes" or "no"',
      },
      refund_offered: {
        type: 'string',
        description: 'Was a refund or voucher offered? Describe what was offered.',
      },
    },
    required: ['airline', 'departure_airport', 'arrival_airport', 'disruption_type'],
  },
}

// EU/EEA countries for EU261 determination
const EU_EEA_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO',
  'SK', 'SI', 'ES', 'SE', 'CH', 'GB', // UK retained EU261 post-Brexit as UK261
])

// Major EU/EEA airport codes mapping
const EU_AIRPORTS: Record<string, string> = {
  'LHR': 'GB', 'LGW': 'GB', 'STN': 'GB', 'MAN': 'GB', 'EDI': 'GB',
  'CDG': 'FR', 'ORY': 'FR', 'NCE': 'FR', 'LYS': 'FR',
  'FRA': 'DE', 'MUC': 'DE', 'BER': 'DE', 'DUS': 'DE', 'HAM': 'DE',
  'AMS': 'NL', 'BCN': 'ES', 'MAD': 'ES', 'FCO': 'IT', 'MXP': 'IT',
  'LIS': 'PT', 'ATH': 'GR', 'VIE': 'AT', 'BRU': 'BE', 'CPH': 'DK',
  'OSL': 'NO', 'ARN': 'SE', 'HEL': 'FI', 'DUB': 'IE', 'ZRH': 'CH',
  'PRG': 'CZ', 'WAW': 'PL', 'BUD': 'HU', 'OTP': 'RO', 'SOF': 'BG',
}

const CANADIAN_AIRPORTS = new Set([
  'YYZ', 'YVR', 'YUL', 'YYC', 'YEG', 'YOW', 'YWG', 'YHZ',
])

function isEUAirport(code: string): boolean {
  const upper = code.toUpperCase().trim()
  if (EU_AIRPORTS[upper]) return true
  // Check if the code looks like a known EU airport
  return false
}

function isCanadianAirport(code: string): boolean {
  return CANADIAN_AIRPORTS.has(code.toUpperCase().trim())
}

function isUSAirport(code: string): boolean {
  const upper = code.toUpperCase().trim()
  // Most US airports start with K (ICAO) or have well-known 3-letter codes
  const knownUS = ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MCO', 'MIA',
    'BOS', 'EWR', 'IAD', 'IAH', 'PHX', 'MSP', 'DTW', 'CLT', 'LAS', 'PHL',
    'SLC', 'SAN', 'TPA', 'PDX', 'HNL', 'AUS', 'BNA', 'RDU', 'MCI', 'STL',
    'IND', 'CLE', 'PIT', 'CMH', 'OAK', 'SJC', 'SMF', 'BUF', 'ABQ', 'OMA']
  return knownUS.includes(upper)
}

function parseDelayHours(delayStr: string): number {
  if (!delayStr) return 0
  const cleaned = delayStr.toLowerCase().replace(/[^0-9.]/g, ' ').trim()
  if (delayStr.toLowerCase().includes('overnight')) return 12
  if (delayStr.toLowerCase().includes('day')) return 24
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function isExtraordinaryCircumstance(reason: string): boolean {
  const r = reason.toLowerCase()
  return /weather|storm|snow|ice|fog|volcanic|earthquake|tsunami|strike|terror|security threat|air traffic control|atc|political instability|pandemic/.test(r)
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const airline = (args.airline as string) || 'Unknown Airline'
  const flightNumber = (args.flight_number as string) || ''
  const departure = (args.departure_airport as string) || ''
  const arrival = (args.arrival_airport as string) || ''
  const disruptionType = (args.disruption_type as string) || 'delay'
  const delayStr = (args.delay_hours as string) || '0'
  const flightDate = (args.flight_date as string) || ''
  const reasonGiven = (args.reason_given as string) || ''
  const ticketPrice = (args.ticket_price as string) || ''
  const paidWithCC = ((args.paid_with_credit_card as string) || '').toLowerCase() === 'yes'
  const rebooked = ((args.rebooked as string) || '').toLowerCase() === 'yes'
  const refundOffered = (args.refund_offered as string) || ''

  const delayHours = parseDelayHours(delayStr)
  const depCode = departure.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3)
  const arrCode = arrival.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3)

  const depIsEU = isEUAirport(depCode)
  const arrIsEU = isEUAirport(arrCode)
  const depIsUS = isUSAirport(depCode)
  const arrIsUS = isUSAirport(arrCode)
  const depIsCA = isCanadianAirport(depCode)
  const arrIsCA = isCanadianAirport(arrCode)

  const isExtraordinary = reasonGiven ? isExtraordinaryCircumstance(reasonGiven) : false

  const report: string[] = []
  report.push(`## Flight Disruption Analysis`)
  report.push(`**Airline**: ${airline}${flightNumber ? ` (${flightNumber})` : ''}`)
  report.push(`**Route**: ${departure} → ${arrival}`)
  report.push(`**Disruption**: ${disruptionType.replace(/_/g, ' ')}${delayHours > 0 ? ` (${delayHours} hours)` : ''}`)
  if (reasonGiven) report.push(`**Reason given**: ${reasonGiven}`)
  if (flightDate) report.push(`**Date**: ${flightDate}`)
  report.push('')

  // Determine applicable regulations
  const applicableRegs: string[] = []

  // US DOT rules
  if (depIsUS || arrIsUS) {
    applicableRegs.push('US_DOT')
  }

  // EU261 (or UK261)
  // Applies if: departing from EU/EEA/UK, OR arriving at EU/EEA/UK on EU/EEA/UK carrier
  if (depIsEU || (arrIsEU && depIsEU)) {
    applicableRegs.push('EU261')
  }

  // Canadian APPR
  if (depIsCA || arrIsCA) {
    applicableRegs.push('CANADA_APPR')
  }

  if (applicableRegs.length === 0) {
    applicableRegs.push('GENERAL')
  }

  // --- US DOT Analysis ---
  if (applicableRegs.includes('US_DOT')) {
    report.push('### US DOT Regulations (Apply to your flight)')
    report.push('')

    if (disruptionType === 'cancellation') {
      report.push('**Automatic Refund Right (2024 DOT Rule):**')
      report.push('- Airlines MUST automatically refund you in the original form of payment for cancelled flights')
      report.push('- You do NOT have to accept a voucher or rebooking — cash/credit refund is your right')
      report.push('- Refund must be issued within **7 business days** (credit card) or **20 days** (other payment)')
      report.push('- This applies even if you were rebooked, IF the rebooking doesn\'t work for you')
      report.push('')
    }

    if (disruptionType === 'delay' && delayHours >= 3) {
      report.push('**Significant Delay — Refund Rights:**')
      report.push(`- A delay of ${delayHours} hours qualifies as a "significant change" under DOT rules`)
      report.push('- For domestic flights: delays of **3+ hours** are considered significant')
      report.push('- For international flights: delays of **6+ hours** are considered significant')
      report.push('- If the delay is significant, you are entitled to a **full refund** if you choose not to fly')
      report.push('- Airlines cannot force you to accept a voucher or rebooking')
      report.push('')
    }

    if (disruptionType === 'denied_boarding') {
      report.push('**Denied Boarding Compensation (Involuntary Bumping):**')
      report.push('- If you were involuntarily denied boarding due to overbooking:')
      report.push('  - **1-2 hours delay to destination**: 200% of one-way fare (max $775)')
      report.push('  - **2+ hours delay**: 400% of one-way fare (max $1,550)')
      report.push('  - **No alternative flight**: 400% of one-way fare (max $1,550)')
      report.push('- This is CASH compensation, not a voucher')
      report.push('- You keep your ticket for future travel AND get compensation')
      report.push('')
    }

    if (disruptionType === 'lost_baggage' || disruptionType === 'delayed_baggage') {
      report.push('**Baggage Rights:**')
      report.push('- **Delayed baggage**: Refund of checked bag fee if not delivered within 12 hours (domestic) or 15-30 hours (international)')
      report.push('- **Lost baggage**: Airlines liable for up to $3,800 for domestic flights')
      report.push('- **Reasonable expenses**: Airlines should reimburse for essential items purchased during delay')
      report.push('')
    }

    if (disruptionType === 'downgrade') {
      report.push('**Downgrade Rights:**')
      report.push('- Airlines must refund the fare difference if you\'re involuntarily downgraded')
      report.push('- Under the 2024 DOT rule, this refund must be automatic')
      report.push('')
    }
  }

  // --- EU261 Analysis ---
  if (applicableRegs.includes('EU261')) {
    report.push('### EU Regulation 261/2004 (Applies to your flight)')
    report.push('')
    report.push('**EU261 applies because**: Your flight departs from an EU/EEA/UK airport' + (arrIsEU ? ' and arrives in the EU/EEA/UK' : '') + '.')
    report.push('')

    if (isExtraordinary) {
      report.push(`**⚠️ Extraordinary Circumstances**: The reason "${reasonGiven}" may qualify as an extraordinary circumstance, which can exempt the airline from compensation (but NOT from care/assistance obligations).`)
      report.push('')
    }

    if (disruptionType === 'cancellation' || (disruptionType === 'delay' && delayHours >= 3)) {
      report.push('**EU261 Compensation (if not extraordinary circumstances):**')
      report.push('| Flight Distance | Compensation |')
      report.push('|-----------------|-------------|')
      report.push('| Up to 1,500 km | €250 |')
      report.push('| 1,500-3,500 km | €400 |')
      report.push('| Over 3,500 km | €600 |')
      report.push('')
      report.push('This is **in addition to** any refund. You get BOTH the compensation AND your ticket refund.')
      report.push('')
    }

    if (disruptionType === 'denied_boarding') {
      report.push('**EU261 Denied Boarding Compensation:**')
      report.push('- Same compensation scale as above (€250-€600 based on distance)')
      report.push('- PLUS choice of: refund, re-routing, or return flight')
      report.push('- PLUS meals and refreshments, hotel if overnight')
      report.push('')
    }

    report.push('**Right to Care (all disruptions 2+ hours):**')
    report.push('- Meals and refreshments proportionate to waiting time')
    report.push('- 2 phone calls, emails, or faxes')
    report.push('- Hotel accommodation if overnight stay required')
    report.push('- Transport between airport and hotel')
    report.push('')
  }

  // --- Canadian APPR ---
  if (applicableRegs.includes('CANADA_APPR')) {
    report.push('### Canadian Air Passenger Protection Regulations (APPR)')
    report.push('')

    if (disruptionType === 'cancellation' || (disruptionType === 'delay' && delayHours >= 3)) {
      report.push('**APPR Compensation (if within airline control, not safety-related):**')
      report.push('| Delay Length | Large Carrier | Small Carrier |')
      report.push('|-------------|---------------|---------------|')
      report.push('| 3-6 hours | $400 CAD | $125 CAD |')
      report.push('| 6-9 hours | $700 CAD | $250 CAD |')
      report.push('| 9+ hours | $1,000 CAD | $500 CAD |')
      report.push('')
    }

    report.push('**Right to rebooking or refund**: If disruption is within airline control.')
    report.push('')
  }

  // --- General / No specific regulation ---
  if (applicableRegs.includes('GENERAL')) {
    report.push('### Applicable Rights')
    report.push('Your flight may not be covered by specific compensation regulations (US DOT, EU261, or Canadian APPR).')
    report.push('However, you may still have rights under:')
    report.push('- The airline\'s own contract of carriage (conditions of carriage)')
    report.push('- Your country\'s general consumer protection laws')
    report.push('- Your credit card\'s purchase protection or travel insurance')
    report.push('')
  }

  // Credit card chargeback advice
  if (paidWithCC) {
    report.push('### Credit Card Chargeback Option')
    report.push('Since you paid by credit card, you have an additional powerful option:')
    report.push('- File a **chargeback** (dispute) with your credit card company')
    report.push('- You have **60 days from the statement date** under the Fair Credit Billing Act')
    report.push('- Reason: services not provided as described/purchased')
    report.push('- This is often faster than waiting for the airline to process a refund')
    report.push('')
  }

  // Summary and next steps
  report.push('### Summary')

  const rights: string[] = []
  if (disruptionType === 'cancellation' || (disruptionType === 'delay' && delayHours >= 3)) {
    rights.push('Full refund in original payment method')
  }
  if (applicableRegs.includes('EU261') && !isExtraordinary && (disruptionType === 'cancellation' || delayHours >= 3)) {
    rights.push('EU261 compensation (€250-€600)')
  }
  if (applicableRegs.includes('CANADA_APPR') && (disruptionType === 'cancellation' || delayHours >= 3)) {
    rights.push('APPR compensation ($125-$1,000 CAD)')
  }
  if (disruptionType === 'denied_boarding') {
    rights.push('Denied boarding compensation (200-400% of fare or €250-€600)')
  }
  if (paidWithCC) {
    rights.push('Credit card chargeback option')
  }

  if (rights.length > 0) {
    report.push('**You may be entitled to:**')
    rights.forEach(r => report.push(`- ✅ ${r}`))
  } else {
    report.push('**Your specific entitlements depend on the regulation and circumstances. Use the research tools to get more details.**')
  }
  report.push('')

  report.push('### Next Steps')
  report.push('1. **Search for current airline rights** — use `search_airline_rights` to find the latest regulations and any recent rule changes')
  report.push('2. **Research airline record** — use `research_airline_record` to check this airline\'s complaint history and on-time performance')
  report.push('3. **Generate claim plan** — use `write_claim_plan` to create claim letters and a complete action plan')

  return report.join('\n')
}
