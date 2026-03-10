# Validation: npm Trust Checker

## Test Scenario 1: Well-known trusted package

**Prompt**: "Should I install express?"

**Expected behavior**:
1. check_npm_registry returns: millions of downloads, many versions, MIT license, expressjs org
2. assess_package_security finds: active GitHub, many stars, no malware reports
3. write_trust_report: Score 9-10 (SAFE)

## Test Scenario 2: Known malicious/compromised package

**Prompt**: "Is event-stream safe to use?"

**Expected behavior**:
1. check_npm_registry returns: package data (was compromised in 2018)
2. assess_package_security finds: references to the 2018 supply chain attack
3. write_trust_report: Score with historical context, recommend caution

## Test Scenario 3: Unknown/suspicious package

**Prompt**: "Check super-fast-json-parser-v2"

**Expected behavior**:
1. check_npm_registry: likely 404 or very low downloads
2. assess_package_security: no community trust signals
3. write_trust_report: Low score, recommend against or suggest alternatives

## Validation Checklist

- [ ] check_npm_registry correctly parses npm registry API
- [ ] assess_package_security finds relevant security info
- [ ] write_trust_report produces well-scored reports
- [ ] Trust scores are calibrated (express=high, unknown=low)
- [ ] Reports saved to ./output/
