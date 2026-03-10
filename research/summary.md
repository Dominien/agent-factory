# Research Summary

Cumulative history of agent-factory research. For full session details, see `research/archive/`.

## Stats
- Sessions: 6 | Findings: 97+ | Built: 11 | Rejected: 80+ | Deferred: 4
- Current threshold: **18** (venture 6 x TAM 3)
- Only build if projected composite (6 x TAM) >= 18 — TAM 3+ required (scale is uncapped: 4=100M-1B, 5=1B+)

## Shipped Agents
| Name | Venture | TAM | Composite | Description |
|------|---------|-----|-----------|-------------|
| job-scam-detector | 6 | 3 | 18 | Job posting scam analysis |
| rental-scam-detector | 6 | 3 | 18 | Rental listing scam detection |
| freelancer-deduction-finder | 6 | 3 | 18 | Freelancer tax deduction guidance (no bank OAuth) |
| regulatory-compliance-briefing | 6 | 3 | 18 | Personalized regulatory compliance briefings for SMBs |
| company-briefing-agent | 6 | 2 | 12 | Interview prep company briefings |
| contractor-trust-checker | 6 | 2 | 12 | Pre-hire contractor due diligence |
| dep-changelog-summarizer | 6 | 1 | 6 | Dependency changelog summaries |
| repo-health-scanner | 6 | 1 | 6 | GitHub repo health evaluation |
| npm-trust-checker | 6 | 1 | 6 | npm package trust assessment |
| bootcamp-evaluator | 6 | 1 | 6 | Bootcamp/course evaluation |
| haunted-domain-checker | 6 | 0 | 0 | Domain reputation audit |

## Key Patterns
- **"5-tab test"**: Agent succeeds when users would open 5+ browser tabs to solve manually
- **"Advisory agent" pattern**: gather user profile → match against rules/data → personalized report. New strongest template (freelancer-deduction-finder, regulatory-compliance-briefing).
- **GAP=0 is the #1 kill reason**: ~70/97 ideas died because free tools exist
- **"AI generator" space is saturated**: Cover letters, business plans, cold emails, SEO audits, competitor reports — dozens of free LLM wrappers launched 2024-2025
- **Developer tools build fastest**: Structured APIs (npm, GitHub) are predictable data sources
- **Pure text analysis doesn't need the harness**: Value is in multi-source data GATHERING
- **Build speed**: ~15 min per agent. Seed copy + tools + config + README is systematized.
- **TAM is customer discovery, not just a filter**: Estimating TAM forces a web search for real market data. If you can't find data supporting TAM 2+, the market isn't there.
- **STOP building trust-checkers/scam-detectors.** 7 of 11 shipped agents are this pattern. Portfolio is lopsided. Find genuinely different architectures: data transformation, monitoring, generation, analysis, automation.

## Rejected Ideas (one-liners)
| Idea | Reason | TAM |
|------|--------|-----|
| Landing Page Auditor | GAP: 0 — Roastd.io, NxCode | 2 |
| Content Repurposer | GAP: 0 — Planable free | 2 |
| Freelance Contract Reviewer | Just LLM text analysis | 1 |
| Startup Idea Validator | GAP: 0 — 5+ free tools | 1 |
| Brand Mention Monitor | GAP: 0 — Google Alerts | 2 |
| Email Deliverability Checker | GAP: 0 — 10+ free tools | 1 |
| Accessibility Audit | GAP: 0 — WAVE, axe, accessScan | 2 |
| GitHub Issue Triage | GAP: 0 — GitHub launched own AI triage | 0 |
| Twitter Thread Unroller | GAP: 0 — 10+ free tools | 2 |
| Privacy Policy Summarizer | GAP: 0 — ToS;DR | 3 |
| Social Media Calendar | GAP: 0 — Buffer, Hootsuite, Planable | 2 |
| API Mock Generator | GAP: 0 — Mockoon, Beeceptor, WireMock | 1 |
| Tech Stack Detector | GAP: 0 — Wappalyzer, BuiltWith | 1 |
| License Compatibility | GAP: 0 — license-checker, FLICT | 1 |
| SaaS Pricing Tracker | GAP: 0 — SaaS Price Pulse | 1 |
| Code Review Assistant | GAP: 0 — CodeRabbit, Copilot | 3 |
| .env / Secrets Management | GAP: 0 — Infisical | 2 |
| Used Car VIN Report | GAP: 0 — Carfax, NICB VINCheck | 3 |
| Investment/Crypto Scam | GAP: 0, not feasible — BrokerCheck | 3 |
| Charity Verification | GAP: 0 — IRS TEOS, Charity Navigator | 2 |
| Online Store Scam Checker | GAP: 0 — ScamAdviser (6.5M users) | 3 |
| FDA Recall Checker | GAP: 0 — Recalls.gov | 3 |
| Academic Credibility | GAP: 0 — Google Scholar | 0 |
| Competitor Analysis | GAP: 0 — 15+ tools | 2 |
| Travel Safety | GAP: 0 — State Dept, Riskline | 3 |
| Supplement Safety | GAP: 0, liability — FDA database | 2 |
| Doctor Credential Checker | GAP: 0 — DocInfo.org, Healthgrades | 3 |
| Neighborhood Researcher | GAP: 0 — AreaVibes, Niche.com | 3 |
| Natural Hazard Assessment | GAP: 0 — RiskFactor.com, ClimateCheck | 2 |
| Trademark Researcher | GAP: 0 — Trademarkia, USPTO | 2 |
| Auto Repair Quote Checker | GAP: 0 — RepairPal, AAA, Consumer Reports | 3 |
| Medical Bill Error Checker | GAP: 0 — FairMedBill, MedAudit, OrbDoc, BillMeLess | 3 |
| Puppy/Pet Scam Checker | TAM 2, PetScams.com exists | 2 |
| Subscription Cancellation Helper | Can't cancel for you; Pine AI exists | 3 |
| Landlord Reputation Checker | GAP: 0 — RateTheLandlord, OpenIgloo, 6+ platforms | 3 |
| Event Ticket Scam Checker | Dynamic QR codes make verification moot | 3 |
| Government Benefits Finder | GAP: 0 — USAGov benefit finder, BenefitsCheckUp | 3 |
| Counterfeit Product Checker | GAP: 0 — Fakespot, ReviewMeta | 3 |
| Elder Care Facility Checker | GAP: 0 — Medicare Care Compare, U.S. News | 3 |
| Wage Theft Detector | Not agent pattern; legal/calculator | 3 |
| Online Pharmacy Verifier | GAP: 0 — NABP, FDA BeSafeRx, LegitScript | 3 |
| Tax Preparer Verifier | IRS PTIN directory; narrow gap | 3 |
| Influencer Fake Follower Checker | GAP: 0 — HypeAuditor, Modash, 10+ free | 3 |
| Scholarship Scam Checker | FTC/Fastweb guidance; narrow market | 2 |
| Small Business License Finder | GAP: 0 — SBA license/permit finder | 2 |
| Roofing Storm Chaser Checker | Same pattern as contractor-trust-checker | 2 |
| Contractor Quote Comparison | GAP: 0 — BidCompareAI, Quoterly | 3 |
| Lease Agreement Analyzer | GAP: 0 — LeaseLogic, LeaseAI, goHeather | 3 |
| Meal Planning / Grocery Agent | GAP: 0 — Ollie, MealFlow, 12+ apps | 3 |
| Google Review Response Gen | GAP: 0 — Zapier workflow, EmbedSocial | 3 |
| GBP Post Generator | GAP: 0 — MaxAI, Easy-Peasy, GBPPromote | 3 |
| Product Listing Optimizer | GAP: 0 — Etsy AI, 13+ tools, Amazon tools | 3 |
| Subscription Tracker | GAP: 0 — Rocket Money, Pine AI, TrackMySubs | 3 |
| Price Monitoring / Deal Alert | GAP: 0 — Honey, Flipp, CamelCamelCamel, 12+ | 3 |
| Home Maintenance Schedule | GAP: 0 — Dib, HomeLedger, Oply, BrightNest | 3 |
| Privacy Policy / ToS Generator | GAP: 0 — TermsFeed, Termly, FreePrivacyPolicy | 3 |
| Business Name Generator | GAP: 0 — Looka, Namelix, Shopify, 10+ free | 3 |
| Grant Finder / Writer | GAP: 0 — GrantWatch AI, Grantable, Grantify | 2 |
| Appliance Repair vs Replace | GAP: 0 — repairorreplace.app, iFixit FixBot | 3 |
| Health Insurance Plan Compare | GAP: 0 — JambaCare, HealthBird, Healthcare.gov | 3 |
| Reseller Item Value Checker | GAP: 0 — Underpriced app | 2 |
| Used Car Value Checker | GAP: 0 — KBB, Edmunds, Carfax | 3 |
| Solar Panel ROI Calculator | GAP: 0 — EnergySage, Project Sunroof, PVWatts | 3 |
| Energy Rebate Finder | GAP: 0 — ENERGY STAR Rebate Finder, DSIRE | 3 |
| Building Permit Requirements | GAP: 0 — CodeComply, CivCheck, PermitFlow | 3 |
| RFP Proposal Writer | GAP: 0 — DeepRFP, AutoRFP, Responsive | 2 |
| Open Source Alternative Finder | GAP: 0 — OpenAlternative, osalt.com, AlternativeTo | 2 |
| Recipe Dietary Converter | GAP: 0 — Recipe Revamped, The Allergy Chef | 3 |
| Credit Card Rewards Optimizer | GAP: 0 — Card Caddie, Kudos Dream Wallet | 3 |
| Product Review Synthesizer | GAP: 0 — ChatGPT/Perplexity do this natively | 3 |
| HOA Rules Decoder | TAM 2; niche pain | 2 |
| Moving Checklist Generator | GAP: 0 — Template.net AI generator, Vertex42 | 3 |
| Academic Paper Summarizer | GAP: 0 — Explainpaper, Elicit, Consensus | 1 |
| Medical Bill Explainer/Appeal | GAP: 0 — MedAudit, FairMedBill, OrbDoc, BillMeLess | 3 |
| Cover Letter / Cold Email Gen | GAP: 0 — MAJC AI, 15+ free tools | 3 |
| Business Plan / Pitch Deck Gen | GAP: 0 — Bizplanr, FounderPal, 9+ free | 3 |
| Competitive Intelligence Brief | GAP: 0 — MyMap.ai, Junia.ai, 7+ free gen + 4+ data | 3 |
| RFP Response Generator | GAP: 0 — LogicBalls, PowerRFP; prev. rejected | 2 |
| Local SEO Audit Agent | GAP: 0 — 15+ free tools, most saturated niche | 3 |
| Wedding Planning Research | GAP: 0 — Pearl Planner, The Knot AI | 3 |
| Patent / Prior Art Researcher | Below threshold (TAM 2 = composite 12); PQAI exists | 2 |
| Content Calendar Generator | GAP: 0 — Easy-Peasy, Predis.ai, Taskade, 10+ free | 3 |
| Competitive Landscape Report | GAP: 0 — LiveChat AI, GravityWrite, Junia AI, 10+ | 3 |
| Media Kit Generator | GAP: 0 — Beacons (free, auto-updating) | 3 |
| Market Research Report Gen | GAP: 0 — Optimo, Gemini Deep Research | 3 |
| Compliance Checklist Gen | GAP: 0 — LogicBalls, GoSmarter AI | 3 |
| Warranty Tracker | GAP: 0 — TrackWarranty app (free, AI scanning) | 3 |
| Gov Contract Finder | GAP: 0 — SAM.gov, Sweetspot, BidScout AI | 3 |
| Teacher Materials Differentiator | GAP: 0 — Diffit (free, exact use case) | 3 |
| Etsy/Amazon Listing Optimizer | GAP: 0 — eRank, EHunt, InsightFactory | 3 |
| SEO Website Audit | GAP: 0 — SEOptimer, Semrush free, 10+ free | 3 |
| Job Description Writer | GAP: 0 — Ongig, LinkedIn AI, many free | 3 |
| Relocation Research Agent | GAP: 0 — CityMatch.ai (free, direct competitor) | 3 |
| Home Repair Cost Estimator | GAP: 0 — HomeGuide, Homewyse, Thumbtack, Angi | 3 |

## Deferred Ideas
| Idea | Reason | TAM |
|------|--------|-----|
| TOS/Privacy Change Monitor | Weak signal | 1 |
| arXiv Paper Summarizer | Emergent Mind covers it | 1 |
| Benefits Eligibility Navigator | LEO (Link Health) + Nava Labs narrowing gap | 3 |
| Cell Phone Plan Optimizer | WhistleOut narrows gap; plan data changes constantly | 3 |

## Meta-Reflections
See `research/archive/session-2026-03-10.md` for full reflection text.
Last updated after build #11 (regulatory-compliance-briefing).
