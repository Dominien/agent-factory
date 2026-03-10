# Validation: Company Briefing Agent

## Test Scenario 1: Well-known tech company

**Prompt**: "I'm interviewing at Stripe for Senior Software Engineer"

**Expected behavior**:
1. fetch_company_profile fetches stripe.com, extracts payment platform info
2. research_company_reputation finds Glassdoor reviews, recent news, funding history, leadership
3. write_briefing produces a briefing with talking points about payments infrastructure

**Expected output**: Structured briefing mentioning Patrick Collison, payment processing, developer tools

## Test Scenario 2: Startup with limited info

**Prompt**: "Brief me on a small startup called TinyWidget Inc"

**Expected behavior**:
1. fetch_company_profile searches for the company, may find limited info
2. research_company_reputation may find limited results
3. write_briefing produces a briefing with caveats about limited data

## Test Scenario 3: Role-specific briefing

**Prompt**: "Research Anthropic for me — I have a product manager interview next week"

**Expected behavior**:
1. Fetches anthropic.com, extracts AI safety mission
2. Researches reputation, recent Claude model launches, funding
3. Produces briefing with PM-specific talking points and questions

## Validation Checklist

- [ ] All 3 tools execute without errors
- [ ] Tool chain: profile -> reputation -> briefing
- [ ] Talking points are specific to the company (not generic)
- [ ] Questions reference actual company initiatives
- [ ] Reports saved to ./output/
