# Validation Test — Consumer Complaint Resolution Advisor

## Test Scenario

**Prompt**: "I signed up for a free trial of a streaming service called StreamMax. After the trial ended, they started charging me $14.99/month without my consent. I've tried to cancel online but their website has no cancel button — only a phone number that puts me on hold for 45+ minutes. It's been 3 months and they've charged me $44.97 total. I'm in Illinois."

## Expected Agent Behavior

1. **Asks clarifying questions** (optional — may proceed if enough detail given)
2. **Calls `analyze_complaint`** with:
   - company_name: "StreamMax"
   - product_or_service: "streaming subscription"
   - issue_description: about unauthorized charges and inability to cancel
   - amount_involved: "$44.97"
   - state: "Illinois"
   - issue_category: "subscription" or "billing"
3. **Calls `search_consumer_rights`** with:
   - state: "Illinois"
   - complaint_type: "subscription cancellation" or "deceptive billing"
4. **Calls `research_company_complaints`** with:
   - company_name: "StreamMax"
5. **Calls `write_resolution_plan`** to generate the final plan

## Expected Output Contains

- [ ] Identifies FTC as primary agency (FTC Click-to-Cancel Rule violation)
- [ ] Identifies Illinois AG as primary agency
- [ ] Mentions FTC Click-to-Cancel Rule (2025)
- [ ] Mentions credit card chargeback as fast resolution option
- [ ] Provides complaint letter template addressed to StreamMax
- [ ] Includes escalation timeline (Day 1, 15, 30, etc.)
- [ ] Mentions BBB as optional filing
- [ ] Notes the 60-day credit card dispute deadline
- [ ] Includes links to filing portals (reportfraud.ftc.gov, etc.)
- [ ] Saves a resolution plan file to output/

## Pass Criteria

- Agent uses at least 3 of 4 specialized tools
- Output includes agency recommendations with filing links
- Output includes a complaint letter template
- Saved file is a comprehensive, actionable resolution plan
- Agent correctly identifies this as a subscription/billing complaint
