import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_claim_plan',
  description:
    'Generate and save a comprehensive flight rights claim plan. Includes claim letters to the airline, DOT complaint filing instructions, EU261 claim guidance if applicable, credit card chargeback steps, and escalation timeline. Always use this as the final step after analyzing the disruption and researching rights.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the plan (e.g. "flight-claim-united-march2026.md")',
      },
      passenger_name: {
        type: 'string',
        description: 'Passenger name',
      },
      airline: {
        type: 'string',
        description: 'Airline name',
      },
      flight_details: {
        type: 'string',
        description: 'Flight number, route, date, and disruption summary',
      },
      disruption_analysis: {
        type: 'string',
        description: 'Results from analyze_flight_disruption as markdown',
      },
      applicable_regulations: {
        type: 'string',
        description: 'Which regulations apply (e.g. "US DOT, EU261")',
      },
      compensation_estimate: {
        type: 'string',
        description: 'Estimated compensation/refund amount',
      },
      rights_research: {
        type: 'string',
        description: 'Summary of applicable passenger rights found during research',
      },
      airline_record: {
        type: 'string',
        description: 'Summary of airline complaint history and record',
      },
      ticket_price: {
        type: 'string',
        description: 'Original ticket price',
      },
      paid_with_credit_card: {
        type: 'string',
        description: '"yes" or "no"',
      },
    },
    required: ['filename', 'airline', 'flight_details'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const passengerName = (args.passenger_name as string) || '[Your Name]'
  const airline = (args.airline as string) || 'Unknown Airline'
  const flightDetails = (args.flight_details as string) || ''
  const disruptionAnalysis = (args.disruption_analysis as string) || ''
  const applicableRegs = (args.applicable_regulations as string) || 'US DOT'
  const compensationEstimate = (args.compensation_estimate as string) || 'See analysis above'
  const rightsResearch = (args.rights_research as string) || ''
  const airlineRecord = (args.airline_record as string) || ''
  const ticketPrice = (args.ticket_price as string) || '[ticket price]'
  const paidWithCC = ((args.paid_with_credit_card as string) || '').toLowerCase() === 'yes'

  if (!filename || !airline || !flightDetails) {
    return 'Error: filename, airline, and flight_details are required'
  }

  const today = new Date().toISOString().split('T')[0]
  const hasEU261 = applicableRegs.toLowerCase().includes('eu261')
  const hasUSDOT = applicableRegs.toLowerCase().includes('us') || applicableRegs.toLowerCase().includes('dot')
  const hasAPPR = applicableRegs.toLowerCase().includes('appr') || applicableRegs.toLowerCase().includes('canad')

  const report = `# Flight Rights Claim Plan
## ${passengerName} — ${airline}

**Prepared**: ${today}
**Flight**: ${flightDetails}
**Applicable regulations**: ${applicableRegs}
**Estimated compensation/refund**: ${compensationEstimate}

---

## Important Disclaimer

**This plan is for informational purposes only. It is NOT legal advice.** Airline passenger rights are complex and evolving. This analysis is based on current regulations as of the date above. For disputes involving large amounts, consider consulting a consumer rights attorney or using an established claim service.

---

## Your Disruption Analysis

${disruptionAnalysis || 'See the analysis provided by the flight disruption analyzer.'}

---

${rightsResearch ? `## Applicable Rights & Regulations

${rightsResearch}

---

` : ''}${airlineRecord ? `## ${airline} — Complaint Record

${airlineRecord}

---

` : ''}## Claim Plan — Step by Step

### Step 1: Document Everything (Do This Now)

- [ ] Save your booking confirmation and e-ticket
- [ ] Screenshot the airline's notification of delay/cancellation (app, email, text)
- [ ] Take photos of departure boards showing the delay/cancellation
- [ ] Keep receipts for any expenses incurred (meals, hotel, transport)
- [ ] Note the reason given by airline staff for the disruption
- [ ] Save boarding passes (original and any rebooking)
- [ ] Check FlightAware or FlightRadar24 for flight status records

### Step 2: Claim from ${airline} Directly

Send the following claim letter via the airline's **official complaint form** AND via **email** to their customer service:

---

**CLAIM LETTER TO ${airline.toUpperCase()}**

${passengerName}
[Your Address]
[Your Email]
[Your Phone]

${today}

${airline} Customer Relations
[Find address on airline website or Google "${airline} customer relations address"]

**RE: Formal Claim for Compensation/Refund — ${flightDetails}**

Dear ${airline} Customer Relations:

I am writing to formally claim compensation and/or a refund for the following flight disruption:

**Flight details**: ${flightDetails}

${hasUSDOT ? `Under the US Department of Transportation's final rule on airline refunds (effective 2024), I am entitled to an automatic refund in my original form of payment for this disruption. Refunds must be issued within 7 business days for credit card purchases and 20 calendar days for other payment methods.

` : ''}${hasEU261 ? `Under EU Regulation 261/2004, I am entitled to:
- Monetary compensation of up to €600 depending on flight distance
- A full refund of my ticket if I choose not to travel
- Right to care (meals, accommodation, communication) during the disruption

This right applies regardless of whether I purchased a "non-refundable" ticket.

` : ''}${hasAPPR ? `Under the Canadian Air Passenger Protection Regulations (APPR), I am entitled to compensation of up to $1,000 CAD for disruptions within the airline's control.

` : ''}I am requesting:
1. A **full refund** of my ticket price (${ticketPrice}) in my original form of payment
2. **Compensation** as required under applicable regulations
3. **Reimbursement** for any reasonable expenses incurred due to this disruption

Please respond to this claim within **14 days**. If I do not receive a satisfactory response, I will:
- File a formal complaint with the US Department of Transportation
${hasEU261 ? '- Pursue my claim through the applicable National Enforcement Body under EU261\n' : ''}- Initiate a credit card chargeback for services not provided
- Consider legal action through small claims court

I have attached/enclosed my booking confirmation, disruption notification, and expense receipts.

Sincerely,

${passengerName}
[Booking reference/confirmation number]

---

### Step 3: File DOT Complaint (If Airline Doesn't Respond in 14 Days)

${hasUSDOT ? `The US DOT takes airline complaints seriously. Filing creates an official record and airlines must respond.

**How to file:**
1. Go to: https://airconsumer.dot.gov/escomplaint/ConsumerForm.cfm
2. Select "Refund" or "Flight Problem" as the category
3. Include your flight details, what happened, and what the airline's response was
4. Attach your claim letter and any evidence
5. The DOT will forward your complaint to the airline

**Alternative**: Call the DOT Aviation Consumer Protection Division at **1-202-366-2220**
` : 'Your flight may not be directly covered by US DOT, but you can still file a complaint if the airline operates in the US.'}

${hasEU261 ? `### Step 3b: File EU261 Claim with National Enforcement Body

If your flight departed from or arrived in the EU:
1. Identify the correct National Enforcement Body (NEB) for the country of departure
2. File a complaint — this is free and the NEB can order the airline to pay
3. Common NEBs:
   - **UK**: Civil Aviation Authority (CAA) — https://www.caa.co.uk/passengers/resolving-travel-problems/
   - **Germany**: Luftfahrt-Bundesamt — https://www.lba.de/EN/
   - **France**: DGAC — https://www.ecologie.gouv.fr/en
   - **Spain**: AESA — https://www.seguridadaerea.gob.es/en

**Alternative**: European Small Claims Procedure for amounts up to €5,000 across EU borders.
` : ''}
${paidWithCC ? `### Step 4: Credit Card Chargeback

This is often the fastest way to get your money back:

1. **Call your credit card company** and request a chargeback/dispute
2. **Reason**: "Services not provided as described" or "Cancelled service"
3. **Deadline**: 60 days from the statement date (Fair Credit Billing Act)
4. **Provide**: Booking confirmation, cancellation/delay notification, claim letter to airline
5. The credit card company will investigate and may reverse the charge
6. **Important**: You can pursue BOTH a chargeback AND airline compensation — they cover different things
` : `### Step 4: Payment Dispute

Contact your payment provider to dispute the charge for services not delivered.
`}

### Step 5: Escalation Options

If nothing else works:

1. **Social media**: Tweet/post at ${airline}'s official accounts — airlines often respond faster publicly
2. **Executive email**: Find the CEO's email (search "${airline} CEO email" — ExecThread, Elliott.org often list these)
3. **Small claims court**: File for the refund amount + compensation + expenses
4. **Consumer advocacy**: Contact Elliott.org (free consumer advocacy), your state AG, or local consumer protection office

---

## Escalation Timeline

| Day | Action |
|-----|--------|
| Day 1 | Document everything, send claim letter to ${airline} |
| Day 14 | If no response: file DOT complaint${hasEU261 ? ' + NEB complaint' : ''} |
| Day 21 | If no resolution: ${paidWithCC ? 'initiate credit card chargeback' : 'escalate via social media'} |
| Day 30 | If still unresolved: consider small claims court |
| Day 60 | **Credit card dispute deadline** — file by this date if you haven't |

---

## Know Your Rights — Quick Reference

### What Airlines CANNOT Do
- Force you to accept a voucher instead of a cash refund (US DOT rule)
- Deny compensation for "operational" reasons under EU261 (crew shortage, mechanical = airline's fault)
- Charge you for a checked bag that was significantly delayed
- Refuse to provide meals/accommodation during long delays (EU261)

### What Airlines MUST Do
- Issue automatic refunds for cancelled flights (US DOT 2024 rule)
- Refund within 7 business days (credit card) or 20 days (other)
- Provide denied boarding compensation in cash, not vouchers
- Disclose the reason for cancellation/delay

---

## Helpful Resources

- **US DOT Air Consumer**: https://www.transportation.gov/airconsumer
- **DOT Complaint Form**: https://airconsumer.dot.gov/escomplaint/ConsumerForm.cfm
- **DOT Airline Dashboard**: https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard
- **Elliott.org Consumer Advocacy**: https://elliott.org/ (free help with airline disputes)
- **FlightAware**: https://www.flightaware.com/ (flight status records for evidence)
${hasEU261 ? '- **EU261 Official Text**: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32004R0261\n- **AirHelp Eligibility Checker**: https://www.airhelp.com/ (free check, but charges to claim)\n' : ''}${hasAPPR ? '- **Canadian APPR**: https://otc-cta.gc.ca/eng/air-passenger-protection\n' : ''}
---

*Generated by Flight Rights Advisor — a free, open-source AI agent that helps airline passengers understand their rights and claim compensation. Not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    return `Claim plan saved to output/${sanitized} (${report.length} characters)\n\nYour flight rights claim plan against ${airline} is ready! It includes a claim letter, DOT filing instructions, ${hasEU261 ? 'EU261 guidance, ' : ''}${paidWithCC ? 'chargeback steps, ' : ''}and an escalation timeline.`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
