# Validation Scenario

## Test Case: United Airlines Cancellation — Chicago to London

**User prompt:**
> My United Airlines flight UA 880 from Chicago O'Hare (ORD) to London Heathrow (LHR) on March 8, 2026 was cancelled with only 2 days notice. They offered a $500 travel voucher but I paid $1,200 for the ticket with my Chase Sapphire credit card. I want a cash refund, not a voucher. My name is Alex Rivera.

## Expected Agent Behavior

1. **analyze_flight_disruption** should:
   - Identify this as a transatlantic route (ORD → LHR)
   - Flag both US DOT and EU261 as applicable (departing US, arriving EU)
   - Classify as cancellation with less than 14 days notice
   - Calculate EU261 compensation: €600 (over 3500km)
   - Note US DOT automatic refund entitlement for original payment method
   - Flag that airline cannot force voucher acceptance

2. **search_airline_rights** should:
   - Search for US DOT automatic refund rules
   - Search for EU261 cancellation compensation
   - Find current United Airlines refund/compensation policies

3. **research_airline_record** should:
   - Find United's DOT complaint history
   - Find United's on-time performance and cancellation rates
   - Find consumer reports about United's refund processing

4. **write_claim_plan** should generate a plan with:
   - Claim letter to United Airlines citing both US DOT and EU261
   - DOT complaint filing instructions with link
   - EU261 NEB filing guidance (UK CAA for LHR)
   - Credit card chargeback steps for Chase Sapphire
   - Escalation timeline (Day 1 → Day 60)
   - Documentation checklist
   - Estimated total: $1,200 refund + €600 EU261 compensation

## Key Assertions

- Agent identifies BOTH US DOT and EU261 apply (not just one)
- Agent correctly states airline CANNOT force voucher over cash refund
- Agent mentions the 7-business-day refund deadline for credit card purchases
- Agent includes credit card chargeback as an option (paid with Chase Sapphire)
- Agent generates actionable claim letter with specific regulatory citations
- Disclaimer about not being legal advice is included
