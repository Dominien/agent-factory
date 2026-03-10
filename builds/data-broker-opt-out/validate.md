# Validation: Data Broker Opt-Out Advisor

## Test Scenario
User: "I live in California, I'm 38, own a home, registered voter, active on social media. Help me remove my data from data broker sites."

## Expected Behavior
1. Agent calls `assess_exposure` with profile details → returns prioritized list of 12-15+ brokers
2. Agent calls `search_data_brokers` for top brokers → finds current opt-out pages
3. Agent uses `web_fetch` to read actual opt-out instructions
4. Agent calls `write_removal_plan` → generates comprehensive removal plan

## Expected Output
- Markdown file with prioritized broker checklist
- HIGH priority brokers listed first (Spokeo, BeenVerified, WhitePages, etc.)
- Property-related brokers included (Zillow, RealtyTrac) since user is a homeowner
- CCPA rights mentioned since user is in California
- Step-by-step opt-out instructions with direct links
- Time estimates per broker
- Ongoing protection tips

## Pass Criteria
- [ ] `npm install && npm run dev` succeeds
- [ ] Agent asks clarifying questions OR proceeds with profile
- [ ] `assess_exposure` returns broker list with risk levels
- [ ] `search_data_brokers` finds relevant opt-out pages
- [ ] `write_removal_plan` generates a readable, actionable plan
- [ ] Output mentions California-specific privacy rights (CCPA/DELETE Act)
