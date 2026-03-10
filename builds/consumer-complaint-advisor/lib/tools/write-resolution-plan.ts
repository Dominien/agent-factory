import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_resolution_plan',
  description:
    'Generate and save a comprehensive consumer complaint resolution plan. Includes complaint letters for each recommended agency, escalation timeline, consumer rights summary, and step-by-step instructions. Always use this as the final step after analyzing the complaint, researching rights, and investigating the company.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the plan (e.g. "complaint-plan-comcast.md")',
      },
      consumer_name: {
        type: 'string',
        description: 'Consumer\'s name (for personalizing complaint letters)',
      },
      company_name: {
        type: 'string',
        description: 'Company the complaint is against',
      },
      state: {
        type: 'string',
        description: 'Consumer\'s state',
      },
      complaint_summary: {
        type: 'string',
        description: 'Summary of the complaint (what happened)',
      },
      amount_involved: {
        type: 'string',
        description: 'Dollar amount involved, if applicable',
      },
      desired_resolution: {
        type: 'string',
        description: 'What the consumer wants (refund, repair, account correction, etc.)',
      },
      agencies_to_file_with: {
        type: 'string',
        description: 'Comma-separated list of agencies to file with, from the analysis',
      },
      consumer_rights_summary: {
        type: 'string',
        description: 'Applicable consumer rights and laws found during research, as markdown',
      },
      company_complaint_history: {
        type: 'string',
        description: 'Summary of company\'s complaint history and patterns found during research',
      },
      escalation_notes: {
        type: 'string',
        description: 'Any additional escalation strategies or notes',
      },
    },
    required: ['filename', 'company_name', 'state', 'complaint_summary'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const consumerName = (args.consumer_name as string) || '[Your Name]'
  const companyName = (args.company_name as string) || 'Unknown Company'
  const state = (args.state as string) || 'Unknown'
  const complaintSummary = (args.complaint_summary as string) || ''
  const amountInvolved = (args.amount_involved as string) || 'Not specified'
  const desiredResolution = (args.desired_resolution as string) || 'Full resolution of the issue'
  const agenciesToFileWith = (args.agencies_to_file_with as string) || ''
  const consumerRightsSummary = (args.consumer_rights_summary as string) || 'See your state attorney general website for consumer protection laws.'
  const companyHistory = (args.company_complaint_history as string) || 'Not researched'
  const escalationNotes = (args.escalation_notes as string) || ''

  if (!filename || !companyName || !state || !complaintSummary) {
    return 'Error: filename, company_name, state, and complaint_summary are required'
  }

  const today = new Date().toISOString().split('T')[0]
  const agencies = agenciesToFileWith.split(',').map(a => a.trim()).filter(Boolean)

  const report = `# Consumer Complaint Resolution Plan
## ${consumerName} vs. ${companyName}

**Prepared**: ${today}
**State**: ${state}
**Amount in dispute**: ${amountInvolved}
**Desired resolution**: ${desiredResolution}

---

## Important Disclaimer

**This plan is for informational purposes only. It is NOT legal advice.** Consumer protection laws vary by state and situation. For complex disputes or large amounts, consider consulting a consumer protection attorney. Many offer free consultations. Find one at [NACA](https://www.consumeradvocates.org/find-an-attorney) (National Association of Consumer Advocates).

---

## Your Complaint

${complaintSummary}

---

## Your Consumer Rights

${consumerRightsSummary}

---

## Company Background

${companyHistory}

---

## Resolution Plan — Step by Step

### Step 1: Document Everything (Do This Now)

Before taking any action, gather and preserve evidence:

- [ ] Save all receipts, invoices, and proof of payment
- [ ] Screenshot or save all communications (emails, chat logs, texts)
- [ ] Write down dates, times, and names of anyone you spoke with
- [ ] Take photos/videos of any defective product or poor work
- [ ] Save a copy of any contract, agreement, or terms of service
- [ ] If you paid by credit card, save the statement showing the charge

### Step 2: Send a Formal Complaint Letter to ${companyName}

Send via **certified mail** (USPS, return receipt requested) so you have proof they received it. Also send via email for speed.

**Template:**

---

${consumerName}
[Your Address]
[City, State ZIP]
[Your Email]
[Your Phone]

${today}

${companyName}
[Company Address — find on their website or your receipt]

**RE: Formal Consumer Complaint — ${amountInvolved !== 'Not specified' ? `$${amountInvolved.replace(/[^0-9.]/g, '')} Dispute` : 'Resolution Requested'}**

Dear ${companyName} Customer Service / Management:

I am writing to formally complain about the following issue with your product/service:

${complaintSummary}

I am requesting the following resolution: **${desiredResolution}**.

Please respond to this complaint within **15 business days**. If I do not receive a satisfactory response, I intend to file formal complaints with the following agencies:
${agencies.length > 0 ? agencies.map(a => `- ${a}`).join('\n') : '- [State] Attorney General\n- Federal Trade Commission\n- Better Business Bureau'}

I have documented all communications and transactions related to this matter.

Under ${state} consumer protection law, ${state === 'California' ? 'the Consumer Legal Remedies Act (CLRA) and Unfair Competition Law (UCL) protect' : 'state unfair and deceptive practices statutes protect'} consumers against deceptive business practices. I reserve all rights under applicable federal and state consumer protection laws.

Sincerely,

${consumerName}

---

### Step 3: File Government Complaints (If Company Doesn't Resolve in 15 Days)

File with ALL recommended agencies simultaneously — this creates maximum pressure:

${agencies.length > 0 ? agencies.map((a, i) => {
    let url = ''
    if (a.includes('FTC')) url = 'https://reportfraud.ftc.gov/'
    else if (a.includes('CFPB')) url = 'https://www.consumerfinance.gov/complaint/'
    else if (a.includes('FCC')) url = 'https://consumercomplaints.fcc.gov/'
    else if (a.includes('BBB')) url = 'https://www.bbb.org/file-a-complaint'
    else if (a.includes('AG') || a.includes('Attorney General')) url = 'https://www.usa.gov/state-consumer'
    else if (a.includes('DOT')) url = 'https://airconsumer.dot.gov/escomplaint/ConsumerForm.cfm'
    else if (a.includes('CPSC')) url = 'https://www.saferproducts.gov/'
    else url = 'Search for filing link'

    return `**${i + 1}. ${a}**
   - File at: ${url}
   - Include: Your complaint letter, all evidence, company's response (or lack thereof)
   - Tip: Reference the complaint number from each agency in subsequent filings`
  }).join('\n\n') : `**1. ${state} Attorney General**
   - File at: https://www.usa.gov/state-consumer
   - Find your state's consumer complaint form

**2. Federal Trade Commission (FTC)**
   - File at: https://reportfraud.ftc.gov/

**3. Better Business Bureau (BBB)**
   - File at: https://www.bbb.org/file-a-complaint`}

### Step 4: Credit Card Chargeback (If You Paid by Credit Card)

If you paid by credit card and the company won't resolve your complaint:

1. Call your credit card company and request a **chargeback** (dispute the charge)
2. You have **60 days from the statement date** to dispute under the Fair Credit Billing Act
3. Explain what happened and provide your evidence
4. The credit card company will investigate and may reverse the charge
5. This is often the fastest way to get your money back

### Step 5: Small Claims Court (Last Resort)

If nothing else works and the amount justifies it:

1. File in ${state} small claims court (limits vary by state, typically $5,000-$25,000)
2. Filing fee is usually $30-$75
3. No lawyer needed — you represent yourself
4. Bring all your documentation and evidence
5. Search: "${state} small claims court how to file"

${escalationNotes ? `### Additional Escalation Strategies

${escalationNotes}
` : ''}
---

## Escalation Timeline

| Day | Action |
|-----|--------|
| Day 1 | Document everything, send formal complaint letter |
| Day 15 | If no response: file with all government agencies |
| Day 30 | If no resolution: file credit card chargeback (if applicable) |
| Day 45 | If still unresolved: consider small claims court |
| Day 60 | Credit card dispute deadline — file by this date if you haven't already |

---

## Helpful Resources

- **${state} Attorney General Consumer Protection**: [usa.gov/state-consumer](https://www.usa.gov/state-consumer)
- **FTC Consumer Advice**: [consumer.ftc.gov](https://consumer.ftc.gov/)
- **CFPB Complaint Portal**: [consumerfinance.gov/complaint](https://www.consumerfinance.gov/complaint/)
- **NACA Attorney Directory**: [consumeradvocates.org](https://www.consumeradvocates.org/find-an-attorney)
- **Consumer Action Handbook**: [usa.gov/consumer](https://www.usa.gov/consumer)
- **Small Claims Court Guide**: Search "${state} small claims court guide"

---

## Tips for Effective Complaints

1. **Be specific**: Include dates, amounts, names, and reference numbers
2. **Be factual**: Stick to what happened, avoid emotional language
3. **State what you want**: Be clear about the resolution you're seeking
4. **Reference laws**: Cite specific consumer protection laws (listed above)
5. **Set deadlines**: Give the company a specific timeframe to respond
6. **Keep records**: Save copies of everything you send and receive
7. **Follow up**: If you don't hear back, follow up in writing
8. **File everywhere**: The more agencies that receive your complaint, the more pressure on the company

---

*Generated by Consumer Complaint Resolution Advisor — a free, open-source AI agent that helps consumers navigate the complaint process and fight for their rights. Not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    return `Resolution plan saved to output/${sanitized} (${report.length} characters)\n\nYour complaint resolution plan against ${companyName} in ${state} is ready! The plan includes a complaint letter template, agency filing instructions, escalation timeline, and tips for effective complaints.`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
