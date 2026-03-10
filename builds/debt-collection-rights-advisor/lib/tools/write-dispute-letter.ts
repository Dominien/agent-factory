import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'write_dispute_letter',
  description:
    'Generate and save personalized debt collection dispute letters and a comprehensive defense strategy. Includes debt validation demand letter, cease-and-desist letter, CFPB complaint filing guide, and violation-based counterclaim guidance. Always use this as the final step after analyzing the situation and researching laws.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename for the plan (e.g. "debt-dispute-midland-march2026.md")',
      },
      consumer_name: {
        type: 'string',
        description: 'Consumer\'s name',
      },
      collector_name: {
        type: 'string',
        description: 'Name of the debt collection agency',
      },
      collector_address: {
        type: 'string',
        description: 'Collector\'s mailing address (if known)',
      },
      account_number: {
        type: 'string',
        description: 'Account or reference number from the collector',
      },
      debt_amount: {
        type: 'string',
        description: 'Amount the collector claims is owed',
      },
      original_creditor: {
        type: 'string',
        description: 'Name of the original creditor',
      },
      state: {
        type: 'string',
        description: 'Consumer\'s state',
      },
      situation_analysis: {
        type: 'string',
        description: 'Results from analyze_debt_situation as markdown',
      },
      violations_found: {
        type: 'string',
        description: 'List of FDCPA violations identified',
      },
      state_law_research: {
        type: 'string',
        description: 'Summary of applicable state-specific laws from search_debt_collection_laws',
      },
      collector_research: {
        type: 'string',
        description: 'Summary of collector complaint history from research_collector_record',
      },
      statute_of_limitations_expired: {
        type: 'string',
        description: '"yes", "no", or "unknown"',
      },
      letter_type: {
        type: 'string',
        description: '"validation" (demand proof of debt), "cease" (stop contact), "dispute" (challenge accuracy), or "all" (generate all letters)',
      },
    },
    required: ['filename', 'collector_name'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const consumerName = (args.consumer_name as string) || '[Your Name]'
  const collectorName = (args.collector_name as string) || 'Collection Agency'
  const collectorAddress = (args.collector_address as string) || '[Collector Address — find on their letter or search online]'
  const accountNumber = (args.account_number as string) || '[Account/Reference Number]'
  const debtAmount = (args.debt_amount as string) || '[Claimed Amount]'
  const originalCreditor = (args.original_creditor as string) || '[Original Creditor]'
  const state = (args.state as string) || '[Your State]'
  const situationAnalysis = (args.situation_analysis as string) || ''
  const violationsFound = (args.violations_found as string) || ''
  const stateLawResearch = (args.state_law_research as string) || ''
  const collectorResearch = (args.collector_research as string) || ''
  const solExpired = ((args.statute_of_limitations_expired as string) || 'unknown').toLowerCase()
  const letterType = ((args.letter_type as string) || 'all').toLowerCase()

  if (!filename || !collectorName) {
    return 'Error: filename and collector_name are required'
  }

  const today = new Date().toISOString().split('T')[0]
  const hasViolations = violationsFound && violationsFound.length > 10
  const isTimeBared = solExpired === 'yes'

  const showValidation = letterType === 'all' || letterType === 'validation'
  const showCease = letterType === 'all' || letterType === 'cease'
  const showDispute = letterType === 'all' || letterType === 'dispute'

  const report = `# Debt Collection Defense Plan
## ${consumerName} vs. ${collectorName}

**Prepared**: ${today}
**Account/Reference**: ${accountNumber}
**Claimed amount**: ${debtAmount}
**Original creditor**: ${originalCreditor}
**State**: ${state}

---

## Important Disclaimer

**This plan is for informational purposes only. It is NOT legal advice.** Debt collection law is complex and varies by state. For disputes involving large amounts or FDCPA violations, consider consulting a consumer rights attorney — many take these cases on contingency (no upfront cost). You have the right to consult an attorney at any time.

---

${situationAnalysis ? `## Your Situation Analysis

${situationAnalysis}

---

` : ''}${violationsFound ? `## FDCPA Violations Identified

${violationsFound}

${hasViolations ? '**You may be entitled to $1,000 in statutory damages per violation, plus actual damages and attorney\'s fees under FDCPA §813.**' : ''}

---

` : ''}${stateLawResearch ? `## State-Specific Laws (${state})

${stateLawResearch}

---

` : ''}${collectorResearch ? `## ${collectorName} — Complaint Record

${collectorResearch}

---

` : ''}## Defense Strategy — Step by Step

### Step 1: Document Everything (Do This Now)

- [ ] Save ALL letters, texts, emails from the collector
- [ ] Save ALL voicemails — do NOT delete them
- [ ] Start a call log: date, time, what was said, who called
- [ ] Note the date of first contact from this collector
- [ ] Check your credit reports for this debt (AnnualCreditReport.com — free)
- [ ] Determine the date of your last payment on this debt
- [ ] **DO NOT** acknowledge the debt verbally or in writing until you've sent a validation letter
- [ ] **DO NOT** make any payment — even $1 can restart the statute of limitations

### Step 2: Send Your Letters

Send ALL letters via **Certified Mail, Return Receipt Requested** (USPS). This proves the collector received them. Keep copies of everything.

${showValidation ? `---

## LETTER 1: Debt Validation Demand

**Send this FIRST — within 30 days of the collector's first contact.**

Under FDCPA §809, the collector MUST stop collection and provide proof of the debt after receiving this letter. If they continue collecting without validating, that's an additional violation.

---

${consumerName}
[Your Address]
[City, State ZIP]

${today}

${collectorName}
${collectorAddress}

**SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED**

**RE: Debt Validation Request — Account ${accountNumber}**

Dear ${collectorName}:

I am writing in response to your communication regarding an alleged debt in the amount of ${debtAmount}, referenced under account number ${accountNumber}.

**I am exercising my rights under the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. §1692g, to formally dispute this debt and demand validation.**

Please provide the following within 30 days:

1. **Proof that I owe this debt** — A signed contract, application, or agreement bearing my signature that creates an obligation to pay this specific debt
2. **Full accounting** — An itemized statement showing the principal, all interest, fees, and charges, and how the current balance of ${debtAmount} was calculated
3. **Chain of ownership** — Documentation showing how ${collectorName} acquired this debt, including assignment agreements from ${originalCreditor} through each subsequent purchaser
4. **Licensing verification** — Proof that ${collectorName} is licensed to collect debts in the state of ${state}
5. **Original creditor confirmation** — The name and address of the original creditor, if different from ${collectorName}

**Until you provide this validation, you must cease all collection activity** on this account, including:
- Telephone calls, texts, emails, and letters
- Reporting to credit reporting agencies
- Any legal action

${isTimeBared ? `**NOTICE REGARDING STATUTE OF LIMITATIONS**: I believe this debt may be beyond the statute of limitations in ${state}. If this is a time-barred debt, you are required to inform me that you cannot sue me for this debt and that any payment I make may restart the statute of limitations.

` : ''}${hasViolations ? `**NOTICE OF FDCPA VIOLATIONS**: I have documented violations of the FDCPA in your collection practices. I reserve all rights under FDCPA §813 to seek statutory damages, actual damages, and attorney's fees for these violations.

` : ''}This letter is not an acknowledgment that I owe this debt. I am exercising my legal rights under federal law.

Sincerely,

${consumerName}

---
` : ''}
${showCease ? `
## LETTER 2: Cease and Desist Communication

**Send this if you want the collector to stop ALL contact. They can only contact you after this to confirm receipt or notify of legal action.**

---

${consumerName}
[Your Address]
[City, State ZIP]

${today}

${collectorName}
${collectorAddress}

**SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED**

**RE: Cease Communication Demand — Account ${accountNumber}**

Dear ${collectorName}:

Pursuant to my rights under the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. §1692c(c), **I demand that you immediately cease all further communication with me** regarding the alleged debt referenced under account number ${accountNumber}.

This includes all telephone calls, text messages, emails, letters, and any other form of contact.

Under the FDCPA, after receiving this letter, you may only contact me to:
1. Confirm that you will cease further communication
2. Notify me that you or the creditor intend to invoke a specific legal remedy

Any contact beyond these limited exceptions will constitute an additional FDCPA violation, for which I will pursue all available legal remedies.

${hasViolations ? 'I have already documented FDCPA violations in your collection practices and reserve all rights under §813.\n\n' : ''}Sincerely,

${consumerName}

---
` : ''}
${showDispute ? `
## LETTER 3: Credit Bureau Dispute

**Send this to ALL three credit bureaus if the debt appears on your credit report.**

---

${consumerName}
[Your Address]
[City, State ZIP]

${today}

[Credit Bureau Name]
[Address — see below]

**RE: Dispute of Inaccurate Information — Account ${accountNumber}**

Dear Sir/Madam:

I am writing to dispute the following information on my credit report. Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. §1681i, I request that you investigate and correct this inaccuracy.

**Disputed Item:**
- Creditor/Collection Agency: ${collectorName}
- Account Number: ${accountNumber}
- Reported Amount: ${debtAmount}
- Original Creditor: ${originalCreditor}

**Reason for Dispute:**
I have requested validation of this debt from ${collectorName} under FDCPA §809 and they have ${hasViolations ? 'committed FDCPA violations in their collection practices and ' : ''}not provided adequate validation. This debt should not appear on my credit report without proper verification.

Please investigate this matter and remove any inaccurate information within 30 days as required by the FCRA.

Enclosed: Copy of my debt validation demand letter to ${collectorName}${hasViolations ? ', documentation of FDCPA violations' : ''}

Sincerely,

${consumerName}

---

**Credit Bureau Addresses:**

- **Equifax**: P.O. Box 740241, Atlanta, GA 30374-0241
  - Online: equifax.com/personal/credit-report-services/credit-dispute/
- **Experian**: P.O. Box 4500, Allen, TX 75013
  - Online: experian.com/disputes/main.html
- **TransUnion**: P.O. Box 2000, Chester, PA 19016
  - Online: transunion.com/credit-disputes/dispute-your-credit

---
` : ''}
## Step 3: File Regulatory Complaints

### CFPB Complaint (Federal)
1. Go to: https://www.consumerfinance.gov/complaint/
2. Select "Debt collection" as the product
3. Describe the violations and your experience
4. Attach copies of your letters and any evidence
5. The CFPB will forward to ${collectorName} — they MUST respond within 15 days
6. CFPB complaints create a permanent public record

### State Attorney General Complaint
1. Search: "${state} attorney general consumer complaint"
2. Most states have online complaint forms
3. Include the same information as your CFPB complaint
4. Some states have additional debt collection laws beyond the FDCPA

### FTC Report
1. Go to: https://reportfraud.ftc.gov/
2. Report the debt collector's practices
3. The FTC uses complaint data to identify patterns and bring enforcement actions

${hasViolations ? `## Step 4: Consider Legal Action

**You may have a strong FDCPA case.** Here's why:

- FDCPA §813 allows you to recover **$1,000 in statutory damages** per lawsuit
- Plus **actual damages** (stress, lost wages, medical costs from harassment)
- Plus **attorney's fees** — the collector pays YOUR lawyer if you win
- Most consumer rights attorneys take FDCPA cases on **contingency** (no upfront cost)

**How to find an attorney:**
1. National Association of Consumer Advocates: https://www.consumeradvocates.org/find-attorney
2. Your state bar association's lawyer referral service
3. Search: "FDCPA attorney ${state}" or "consumer rights lawyer ${state}"
4. Legal aid organizations (if low income): https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help

` : ''}## Escalation Timeline

| Day | Action |
|-----|--------|
| Day 1 | Document everything, send validation demand letter (certified mail) |
| Day 5 | File CFPB complaint if violations occurred |
| Day 30 | If no validation received: collector must stop collection |
| Day 35 | If collector continues without validating: file additional CFPB complaint |
| Day 45 | Send credit bureau disputes if debt on credit report |
| Day 60 | If violations documented: consult FDCPA attorney |
| Day 90 | Follow up on CFPB/AG complaints |

---

## Know Your Rights — Quick Reference

### What Debt Collectors CANNOT Do
- Call before 8 AM or after 9 PM in your time zone
- Call more than 7 times within 7 days on a single debt (Regulation F)
- Contact you at work if you've told them your employer prohibits it
- Discuss your debt with family, friends, neighbors, or coworkers
- Threaten arrest, jail, or criminal prosecution for consumer debt
- Threaten to garnish wages or seize property without a court judgment
- Use obscene, profane, or abusive language
- Misrepresent the amount owed or add unauthorized fees
- Continue collecting after you send a validation request (until they validate)
- Contact you after you send a cease-and-desist letter (except to confirm receipt or notify of legal action)

### What Debt Collectors MUST Do
- Send a written validation notice within 5 days of first contact
- Identify themselves as debt collectors in every communication
- Tell you the amount of debt, name of creditor, and your right to dispute
- Stop collection when you dispute until they provide validation
- Honor cease-and-desist requests

### What You Should NEVER Do
- Acknowledge the debt verbally or in writing before validation
- Make any payment (even $1) — this can restart the statute of limitations
- Provide personal information (SSN, bank account, employer details) over the phone
- Agree to a payment plan before getting the debt validated
- Ignore the situation — your rights have time limits

---

## Helpful Resources

- **CFPB Debt Collection Portal**: https://www.consumerfinance.gov/consumer-tools/debt-collection/
- **CFPB Complaint Form**: https://www.consumerfinance.gov/complaint/
- **FTC Debt Collection FAQ**: https://consumer.ftc.gov/articles/debt-collection-faqs
- **FDCPA Full Text**: https://www.law.cornell.edu/uscode/text/15/chapter-41/subchapter-V
- **NACA Attorney Finder**: https://www.consumeradvocates.org/find-attorney
- **Annual Credit Report**: https://www.annualcreditreport.com/
- **Legal Aid Finder**: https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help
- **Upsolve FDCPA Guide**: https://upsolve.org/learn/fdcpa-violations/

---

*Generated by Debt Collection Rights Advisor — a free, open-source AI agent that helps consumers understand their rights under the FDCPA. Not legal advice.*
`

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, report, 'utf-8')
    const letterTypes = [
      showValidation ? 'validation demand' : '',
      showCease ? 'cease-and-desist' : '',
      showDispute ? 'credit bureau dispute' : '',
    ].filter(Boolean).join(', ')
    return `Defense plan saved to output/${sanitized} (${report.length} characters)\n\nYour debt collection defense plan against ${collectorName} is ready! It includes ${letterTypes} letters, ${hasViolations ? 'FDCPA violation documentation, ' : ''}CFPB complaint filing instructions, and an escalation timeline.`
  } catch (err) {
    return `Report write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
