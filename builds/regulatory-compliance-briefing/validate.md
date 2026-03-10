# Validation Test: Regulatory Compliance Briefing Agent

## Test Scenario

**User prompt**: "I'm opening a small restaurant in Austin, Texas. I'll have about 12 employees and expect annual revenue around $800K. I want to serve beer and wine. What regulations do I need to comply with?"

## Expected Agent Behavior

1. **search_regulations** called with business_type "restaurant" and state "Texas" → returns regulatory sources
2. **search_regulations** called again with category "employment law" or "food service" for deeper results
3. **fetch_regulatory_details** called on Texas DSHS food establishment page or SBA restaurant guide
4. **web_search** used to find TABC beer/wine permit requirements, recent Texas employment law changes
5. **write_compliance_briefing** called with comprehensive requirements → saves report to output/

## Expected Output

A markdown report in `output/` containing:

### Federal Requirements
- [ ] EIN registration with IRS
- [ ] FLSA compliance (minimum wage, overtime for 12 employees)
- [ ] OSHA workplace safety requirements
- [ ] ADA accessibility compliance
- [ ] I-9 employment eligibility verification
- [ ] IRS Form 941 quarterly employment tax
- [ ] 1099 reporting for contractors
- [ ] Corporate Transparency Act BOI reporting
- [ ] FDA Food Safety Modernization Act basics

### Texas State Requirements
- [ ] Texas food establishment license (DSHS)
- [ ] Texas sales tax permit (Comptroller)
- [ ] TABC beer and wine permit
- [ ] Texas workers' compensation (not mandatory but common)
- [ ] Texas Payday Law compliance
- [ ] State employment tax (SUI/SUTA)

### Local (Austin) Requirements
- [ ] City of Austin food establishment permit
- [ ] Health department inspections
- [ ] Business license / certificate of occupancy

### Report Quality
- [ ] Deadlines listed for key filings
- [ ] Penalties mentioned for non-compliance
- [ ] Recent regulatory changes flagged
- [ ] Official source links included
- [ ] Disclaimer about not being legal advice
- [ ] Prioritized action items

## Pass Criteria

- [ ] `npm install && npm run dev` succeeds
- [ ] Agent identifies 10+ applicable regulations across federal/state/local
- [ ] Report includes IRS, DOL/FLSA, OSHA, and state-specific requirements
- [ ] TABC alcohol requirements addressed
- [ ] Disclaimer is included
- [ ] Report saved to output/ directory
