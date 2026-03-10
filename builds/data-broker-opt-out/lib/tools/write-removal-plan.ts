import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_removal_plan',
  description:
    'Generate and save a comprehensive, personalized data broker removal plan. Includes a prioritized checklist of brokers, step-by-step opt-out instructions for each, state-specific rights, and maintenance tips. Always use this as the final step after researching all relevant broker opt-out processes.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the plan (e.g. "data-removal-plan.md")',
      },
      user_name: {
        type: 'string',
        description: 'User\'s first name (for personalization)',
      },
      state: {
        type: 'string',
        description: 'User\'s state of residence',
      },
      exposure_summary: {
        type: 'string',
        description: 'Summary of the user\'s data broker exposure assessment as markdown',
      },
      broker_instructions: {
        type: 'string',
        description: 'Detailed opt-out instructions for each broker, as markdown. Include broker name, direct link, step-by-step process, and estimated time.',
      },
      state_rights: {
        type: 'string',
        description: 'State-specific privacy rights and data broker laws (e.g. CCPA for California)',
      },
      total_estimated_time: {
        type: 'string',
        description: 'Total estimated time to complete all opt-outs',
      },
      total_brokers: {
        type: 'string',
        description: 'Total number of brokers in the removal plan',
      },
    },
    required: ['filename', 'broker_instructions'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const userName = (args.user_name as string) || 'there'
  const state = (args.state as string) || 'your state'
  const exposureSummary = (args.exposure_summary as string) || ''
  const brokerInstructions = args.broker_instructions as string
  const stateRights = (args.state_rights as string) || ''
  const totalTime = (args.total_estimated_time as string) || '2-4 hours'
  const totalBrokers = (args.total_brokers as string) || 'multiple'

  if (!filename || !brokerInstructions) {
    return 'Error: filename and broker_instructions are required'
  }

  const today = new Date().toISOString().split('T')[0]

  const report = `# Personal Data Removal Plan
## Your Step-by-Step Guide to Removing Your Data from Broker Sites

**Prepared**: ${today}
**For**: ${userName}
**State**: ${state}
**Total Brokers**: ${totalBrokers}
**Estimated Total Time**: ${totalTime}

---

## Why This Matters

- Data brokers collect and sell your personal information — name, address, phone, email, relatives, income estimates, and more
- This data is used for targeted advertising, background checks, spam calls, phishing attacks, and identity theft
- There are **2,500-4,000 data brokers** in the US alone
- Paid removal services charge $8-15/month — but you can do it yourself for free
- This guide gives you step-by-step instructions for the brokers most likely to have your data

---

${exposureSummary ? `## Your Exposure Assessment\n\n${exposureSummary}\n\n---\n\n` : ''}## Removal Instructions

**How to use this checklist:**
1. Work through each broker in order (high priority first)
2. Check off each one as you complete it ☐ → ☑
3. Set a calendar reminder to re-check in 30 days (some brokers re-add data)
4. Plan to spend ${totalTime} total — you can spread this across multiple sessions

${brokerInstructions}

---

${stateRights ? `## Your Privacy Rights in ${state}\n\n${stateRights}\n\n---\n\n` : ''}## After You've Opted Out

### Immediate Steps
1. **Set a 30-day reminder** — Check each broker again in 30 days to verify removal
2. **Check for re-listing** — Some brokers re-add data from public records. You may need to opt out again
3. **Google yourself** — Search your name + city to find other sites that list your info
4. **Set up Google Alerts** — Create an alert for your full name to catch new listings

### Ongoing Protection
1. **Use a P.O. Box** — When possible, use a P.O. Box instead of your home address for non-essential services
2. **Use email aliases** — Services like SimpleLogin or Apple Hide My Email create throwaway addresses
3. **Freeze your credit** — Free at all three bureaus (Equifax, Experian, TransUnion) — prevents identity theft
4. **Limit social media exposure** — Review privacy settings on Facebook, LinkedIn, Instagram
5. **Voter registration** — If your state allows, request your voter registration be confidential
6. **Re-do this process yearly** — Data brokers continuously collect new data

### Free Tools to Help
- **Google "Results About You"** — Google lets you request removal of personal info from search results ([support.google.com](https://support.google.com/websearch/answer/12719076))
- **Have I Been Pwned** — Check if your email was in a data breach ([haveibeenpwned.com](https://haveibeenpwned.com))
- **Privacy Rights Clearinghouse** — Database of data brokers ([privacyrights.org/data-brokers](https://privacyrights.org/data-brokers))
- **California DELETE Act (DROP)** — If you're in CA, use the state's one-stop opt-out tool ([privacy.ca.gov/drop](https://privacy.ca.gov/drop))

---

## Key Facts About Data Brokers

- **It's legal** — In most states, data brokers can collect and sell your data without your consent
- **It's reversible** — You have the right to opt out of most data broker sites
- **It's temporary** — Brokers often re-collect data, so you may need to repeat the process
- **California leads** — The California Consumer Privacy Act (CCPA) gives CA residents the strongest rights
- **More states joining** — Virginia, Colorado, Connecticut, Utah, and others have passed privacy laws
- **You can't remove everything** — Some public records (court filings, property deeds) are maintained by government agencies and can't be removed from official sources

---

## Resources

- **Privacy Rights Clearinghouse**: [privacyrights.org](https://privacyrights.org) — Consumer privacy advocacy and data broker database
- **EFF Surveillance Self-Defense**: [ssd.eff.org](https://ssd.eff.org) — Digital privacy guides from the Electronic Frontier Foundation
- **FTC Privacy Guidance**: [consumer.ftc.gov/identity-theft-and-online-security](https://consumer.ftc.gov/identity-theft-and-online-security)
- **Data Broker Opt-Out List (GitHub)**: [github.com/yaelwrites/Big-Ass-Data-Broker-Opt-Out-List](https://github.com/yaelwrites/Big-Ass-Data-Broker-Opt-Out-List) — Community-maintained comprehensive list

---

*Generated by Data Broker Opt-Out Advisor — a free, open-source AI agent that helps you take control of your personal data. This is not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    return `Removal plan saved to output/${sanitized} (${report.length} characters)\n\nYour personalized data removal plan for ${totalBrokers} brokers is ready! Estimated time: ${totalTime}.`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
