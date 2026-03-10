# Validation Scenario

## Test Case: Aggressive Collector with Multiple Violations — Texas

**User prompt:**
> Midland Credit Management keeps calling me about a $3,200 credit card debt from Chase. They call 3-4 times a day, including at 7 AM. Last week they called my mother and told her I owe money. They also threatened to have me arrested if I don't pay. I never got a validation notice. My last payment on this was in June 2021. I live in Texas. My name is Jordan Williams.

## Expected Agent Behavior

1. **analyze_debt_situation** should:
   - Identify 4+ FDCPA violations:
     - Calls before 8 AM (§805(a)(1))
     - Excessive calls / harassment (§806(5), Reg F 7-in-7 rule)
     - Contacting third party and discussing debt (§805(b))
     - False threat of arrest (§807(4), §807(7))
     - Missing validation notice (§809(a))
   - Check Texas SOL for credit card (open-ended): 4 years
   - Note last payment June 2021 → SOL may have expired (4+ years ago)
   - Recommend validation letter, CFPB complaint, attorney consultation
   - Warn about not making any payment that could restart SOL

2. **search_debt_collection_laws** should:
   - Search for Texas-specific debt collection laws
   - Find Texas Finance Code Chapter 392 (Texas Debt Collection Act)
   - Find CFPB Regulation F rules

3. **research_collector_record** should:
   - Find Midland Credit Management's CFPB complaint history (they're one of the most-complained-about collectors)
   - Find BBB/consumer reviews
   - Find any FTC/state AG enforcement actions

4. **write_dispute_letter** should generate:
   - Debt validation demand letter citing all identified violations
   - Cease-and-desist letter
   - Credit bureau dispute letter
   - CFPB complaint filing instructions
   - Mention that debt may be time-barred (TX 4-year SOL, last payment June 2021)
   - Attorney referral for FDCPA case ($1,000+ per violation)

## Key Assertions

- Agent identifies ALL 5 violations (calls before 8 AM, excessive calls, third party contact, arrest threat, missing validation)
- Agent correctly identifies Texas credit card SOL as 4 years
- Agent flags the debt as potentially time-barred (June 2021 + 4 years = June 2025)
- Agent warns consumer NOT to make any payment or acknowledge the debt
- Agent recommends attorney consultation (multiple violations = strong FDCPA case)
- Disclaimer about not being legal advice is included
