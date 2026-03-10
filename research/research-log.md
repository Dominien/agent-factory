# Research Log

See `research/summary.md` for cumulative history.
See `research/archive/` for full session logs.

---

## 2026-03-10 — Session 4 (Round 7)

### Finding: Moving Company Trust Checker
- **Source**: MovingScam.com, FTC Consumer Alert (Sep 2024), BBB, NerdWallet, ConsumerAffairs
- **Signal**: 26-41M Americans move per year. Moving fraud cases up 35% since 2024. Average victim loses $2,800. FTC issued consumer alert. BBB issues scam alerts. "Hostage" situations (holding belongings until you pay more) are common. MovingScam.com community exists for victims.
- **Current solutions**: FMCSA Protect Your Move (DOT# lookup — bare-bones, just shows if company is authorized). MovingScam.com is informational/community. BBB has listings but no aggregated trust report. No free tool combines DOT verification + BBB status + review aggregation + complaint patterns + insurance check into a single report.
- **Agent design**: search-mover (find company info by name/location) → verify-mover (check FMCSA DOT#, BBB, insurance status) → analyze-reviews (aggregate reviews from Google/Yelp/BBB, detect complaint patterns) → write-mover-report (trust score + red flags + recommendation)
- **Score**: DEMAND: 7 | GAP: 1 | TOOLS: 4 | TAM: 3 (26-41M moves/year) | Problem Score: 84
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Status**: queued

### Rejected Ideas (Round 7)

| Idea | Reason | TAM |
|------|--------|-----|
| Auto Repair Quote Checker | GAP: 0 — RepairPal, AAA Estimate Tool, Consumer Reports | 3 |
| Medical Bill Error Checker | GAP: 0 — FairMedBill, MedBillChecker, OrbDoc, Goodbill | 3 |
| Puppy/Pet Scam Checker | TAM 2 at best (~3.5M purchases/yr), PetScams.com exists | 2 |
| Subscription Cancellation Helper | Can't cancel for you; Pine AI exists | 3 |
| Landlord Reputation Checker | GAP: 0 — RateTheLandlord, OpenIgloo, RateMyLandlord, WYL, 6+ platforms | 3 |
| Event Ticket Scam Checker | Dynamic QR codes make verification moot; venue-specific | 3 |
| Government Benefits Finder | GAP: 0 — USAGov benefit finder, BenefitsCheckUp.org | 3 |
| Counterfeit Product Checker | GAP: 0 — Fakespot, ReviewMeta | 3 |
| Elder Care Facility Checker | GAP: 0 — Medicare Care Compare, U.S. News ratings | 3 |
| Wage Theft Detector | Not agent pattern; more legal/calculator | 3 |
| Online Pharmacy Verifier | GAP: 0 — NABP, FDA BeSafeRx, PharmacyChecker, LegitScript | 3 |
| Tax Preparer Verifier | IRS has PTIN directory; narrow gap | 3 |
| Influencer Fake Follower Checker | GAP: 0 — HypeAuditor, Modash, Upfluence, Collabstr, 10+ free tools | 3 |
| Scholarship Scam Checker | FTC/Fastweb guidance exists; narrow market | 2 |
| Small Business License Finder | GAP: 0 — SBA license/permit finder | 2 |
| Roofing Storm Chaser Checker | Same pattern as contractor-trust-checker already built | 2 |

### Notes
- GAP=0 continues to kill most TAM 3 ideas (12/16 rejected for this reason)
- The "trust checker / verifier" archetype remains strongest for finding gaps
- Crowdfunding verification is a clear gap — no automated tool exists despite 200M+ donors
- Moving company trust checking has a clear gap — FMCSA lookup is too bare-bones
- Both fit the proven GATHER → PROCESS → OUTPUT pattern
- **CONSTRAINT**: No more trust-checkers. Moving Company Trust Checker is queued but violates the diversity rule. Research pivoting to non-trust-checker architectures.

---

## 2026-03-10 — Session 4 (Round 8) — Non-Trust-Checker Research

Searched Reddit (r/smallbusiness, r/entrepreneur, r/freelance, r/sidehustle, r/personalfinance, r/homeowners, r/homeimprovement) and general web for pain points solvable by agents with DIFFERENT architectures: data transformation, monitoring, generation, analysis, comparison, automation.

### TOP 5 FINDINGS

---

### Finding 1: Benefits Eligibility Navigator Agent
- **Source**: Reddit r/personalfinance, NCOA, Link Health, USAGov, multiple advocacy orgs
- **Signal**: $140 billion in critical federal benefits go unclaimed annually (Link Health, 2025). 3 out of 5 eligible older adults don't receive SNAP. Millions miss EITC. Medicare Savings Programs go unclaimed by 2-3 million eligible people ($3.96-5.94B annually). Reddit threads about "didn't know I qualified" are common in r/personalfinance, r/povertyfinance, r/assistance. Benefits.gov exists but is clunky government form — not conversational, doesn't explain trade-offs, doesn't handle benefits cliff analysis.
- **Current solutions**: Benefits.gov (government tool, basic questionnaire, clunky UX). BenefitsCheckUp.org (NCOA — seniors only). SSA.gov eligibility screener (SSI only). No free tool that takes a conversational approach: "tell me about your situation" → comprehensive scan of ALL programs → personalized report with dollar amounts + application links + benefits cliff warnings.
- **Agent design**: GATHER: gather-user-profile (income, household, state, age, disabilities, veteran status) → PROCESS: scan-federal-programs (SNAP, Medicaid, EITC, CHIP, Lifeline, LIHEAP, WIC, SSI, Section 8, Pell Grants) + scan-state-programs (state-specific by zip code) + analyze-benefits-cliff (model income thresholds and cliff effects) → OUTPUT: write-eligibility-report (eligible programs, estimated dollar value, application links, cliff warnings)
- **Architecture type**: ANALYSIS + GENERATION (not trust-checker)
- **Score**: DEMAND: 9 | GAP: 1 (benefits.gov exists but limited, no conversational AI tool) | TOOLS: 4 | TAM: 3 (tens of millions eligible)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a trust-checker**: This is a data-gathering + eligibility analysis + report generation agent. It doesn't verify trust or detect scams — it matches user profiles against public program criteria and generates personalized recommendations.
- **Risk**: Benefits eligibility rules are complex and change. LLM could hallucinate eligibility. Needs strong disclaimers. Must rely on public data sources (benefits.gov API, state program pages).
- **Status**: STRONG CANDIDATE — queued for evaluation

---

### Finding 2: Freelancer Tax Deduction Finder Agent
- **Source**: Reddit r/freelance, r/sidehustle, r/personalfinance, FlyFin, TurboTax forums
- **Signal**: 72-76 million Americans freelance in some capacity (MBO Partners 2025). Freelancers without systematic expense tracking miss an average of $2,400 in legitimate deductions annually. 54% experience delayed payments. FlyFin claims average savings of $7,800. Reddit regularly has threads about "what can I deduct" and "missed deductions." Self-employed spend hours categorizing expenses for Schedule C.
- **Current solutions**: FlyFin ($0-$16/mo, requires bank account connection — OAuth). TurboTax Self-Employed ($129+). Keeper Tax (free tier limited). taxr.ai (found $5,200 in missed deductions for one user). Most tools require bank account OAuth to work well.
- **Agent design**: GATHER: gather-business-profile (industry, work type, home office?, vehicle?, travel?) + gather-expense-categories (what they spend on) → PROCESS: match-deductions (IRS Schedule C categories, industry-specific deductions, home office rules, vehicle deduction methods, health insurance, retirement contributions) + estimate-savings (calculate potential savings per deduction) → OUTPUT: write-deduction-report (complete list of applicable deductions with IRS references, estimated dollar savings, common mistakes to avoid)
- **Architecture type**: ANALYSIS + GENERATION (not trust-checker)
- **Score**: DEMAND: 8 | GAP: 1 (tools exist but require OAuth/bank connection — this is a guidance agent, not a tracking tool) | TOOLS: 3 | TAM: 3 (72M+ freelancers)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ (guidance agent without OAuth is the gap) | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a trust-checker**: This is a personalized analysis agent. It matches user profile against IRS deduction rules and generates a comprehensive report of what they can deduct and how much they might save.
- **Risk**: Tax rules are complex and change annually. Must include strong disclaimers ("not tax advice"). Cannot access actual bank data without OAuth — works as a guidance/education tool.
- **Status**: STRONG CANDIDATE — queued for evaluation

---

### Finding 3: Home Repair Cost Estimator Agent
- **Source**: Reddit r/homeimprovement, r/homeowners, HomeAdvisor, Angi, NerdWallet
- **Signal**: ~130M homeowner households in US. Reddit r/homeimprovement (3.5M members) constantly has posts asking "how much should X cost?" and "is this quote fair?" Contractor quotes vary by 100%+ for the same job. Homeowners have no baseline for what's reasonable. One thread: "I've seen as much as a 100% difference between high and low bids." Average homeowner does 2-3 home repairs/improvements per year.
- **Current solutions**: HomeAdvisor Cost Guide (basic ranges, not location-adjusted). Angi (requires sharing contact info, leads to contractors calling you). Fixr.com (basic calculator). No free tool takes project description + location → researches current local pricing data → generates a detailed cost breakdown with line items + red flags to watch for + negotiation tips.
- **Agent design**: GATHER: gather-project-details (description, scope, materials, location/zip) + research-local-costs (search for current pricing data by region and project type) → PROCESS: estimate-costs (break down labor, materials, permits, overhead, profit margin) + analyze-quote (if user has a quote, compare it to estimates) → OUTPUT: write-cost-report (detailed breakdown, fair price range, red flags, questions to ask contractor, negotiation tips)
- **Architecture type**: ANALYSIS + COMPARISON (not trust-checker)
- **Score**: DEMAND: 9 | GAP: 1 (existing tools are basic calculators, not LLM-powered analysis) | TOOLS: 3 | TAM: 3 (130M+ homeowner households)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a trust-checker**: This does not verify a contractor's trustworthiness. It estimates what a project SHOULD cost based on public pricing data. It's a cost analysis / comparison agent.
- **Risk**: Pricing data varies enormously by region. LLM estimates may be imprecise. Must include ranges and disclaimers. Value is in structured breakdown + red flag analysis, not precise numbers.
- **Status**: STRONG CANDIDATE — queued for evaluation

---

### Finding 4: Relocation Research Agent
- **Source**: Reddit r/IWantOut, r/SameGrassButGreener, r/personalfinance, U.S. Census, PODS, Allied Van Lines
- **Signal**: ~26 million Americans move per year (Census 2024). ~4.5 million move to a new state. Reddit r/SameGrassButGreener (500K+ members) is entirely dedicated to "where should I move?" questions. People spend hours researching cost of living, schools, crime, weather, job markets. "Neighborhood matters more than city" is common advice — but comparing neighborhoods across cities is extremely tedious.
- **Current solutions**: CityMatch.ai (exists but limited — compares cities, not neighborhoods; paid tiers). Niche.com (ranking lists but not personalized). Numbeo (cost of living only). AreaVibes (livability scores). No free tool that takes your priorities + constraints → researches multiple cities/neighborhoods → generates a personalized comparison report with pros/cons + cost analysis + school ratings + commute times.
- **Agent design**: GATHER: gather-priorities (budget, climate, job industry, school age children, commute tolerance, lifestyle priorities) + research-cities (fetch cost of living, crime stats, school ratings, job market data, weather data for candidate locations) → PROCESS: score-locations (weighted scoring across user priorities) + compare-neighborhoods (drill into specific neighborhoods within top cities) → OUTPUT: write-relocation-report (ranked recommendations with detailed pros/cons, cost comparison, school data, lifestyle fit analysis)
- **Architecture type**: COMPARISON + GENERATION (not trust-checker)
- **Score**: DEMAND: 8 | GAP: 1 (CityMatch.ai emerging but limited/paid; no free comprehensive agent) | TOOLS: 4 | TAM: 3 (26M moves/year)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a trust-checker**: This is a multi-source data comparison and recommendation agent. It gathers data from public sources, scores/ranks against user preferences, and generates a personalized research report.
- **Risk**: Data freshness (crime stats, school ratings may lag). Quality depends on publicly available APIs and web data. CityMatch.ai is an emerging competitor.
- **Status**: MODERATE CANDIDATE — CityMatch.ai narrows the gap

---

### Finding 5: Cell Phone / Internet Plan Optimizer Agent
- **Source**: Reddit r/NoContract, r/personalfinance, CNBC, WhistleOut, NerdWallet
- **Signal**: Average US cell phone bill is $141/month (JD Power 2025). Family plans average ~$200/month. Reddit r/NoContract (600K+ members) is dedicated to finding cheaper plans. Common posts: "What plan should I get?", "Am I overpaying?", "Confused by unlimited plans." Switching carriers can save 30-50%. The "unlimited doesn't mean unlimited" confusion is pervasive.
- **Current solutions**: WhistleOut (plan comparison site — useful but not personalized to YOUR usage). BestPhonePlans.net (comparison tables). Coverage map tools (signal quality only). No free tool takes your current plan + actual usage (GB data, minutes, texts) + location → searches current plan offerings → generates a personalized recommendation with estimated savings + coverage comparison + switch instructions.
- **Agent design**: GATHER: gather-current-plan (carrier, plan name, monthly cost, contract status) + gather-usage (data GB/month, minutes, texts, hotspot needs, international) + gather-preferences (coverage priority, budget, family lines, phone financing) → PROCESS: search-plans (fetch current offerings from major and MVNO carriers) + compare-plans (match usage to plan tiers, calculate true cost including fees/taxes) + estimate-savings (compare current spend to recommended alternatives) → OUTPUT: write-plan-report (top 3 recommendations with estimated monthly savings, coverage comparison, pros/cons, how to switch)
- **Architecture type**: COMPARISON + OPTIMIZATION (not trust-checker)
- **Score**: DEMAND: 7 | GAP: 1 (WhistleOut exists but not conversational/personalized AI agent) | TOOLS: 3 | TAM: 3 (330M+ cell phone users in US)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a trust-checker**: This is a cost optimization / comparison agent. It doesn't verify anything — it finds you a cheaper plan based on your actual usage.
- **Risk**: Plan data changes frequently. Carrier websites may be hard to scrape. MVNO landscape is fragmented. WhistleOut is an established competitor (though not AI-conversational).
- **Status**: MODERATE CANDIDATE — WhistleOut narrows gap somewhat

---

### Additional Rejected Ideas (Round 8)

| Idea | Reason | TAM |
|------|--------|-----|
| Contractor Quote Comparison Tool | GAP: 0 — BidCompareAI (GreatBuildz), Quoterly | 3 |
| Medical Bill Error Checker | GAP: 0 — FairMedBill, MedAudit, BillMeLess, MedBillChecker, OrbDoc | 3 |
| Lease Agreement Analyzer | GAP: 0 — LeaseLogic, LeaseAI, goHeather, TurboTenant | 3 |
| Meal Planning / Grocery Agent | GAP: 0 — Ollie, MealFlow, Nourishing Meals, 12+ apps | 3 |
| Google Review Response Generator | GAP: 0 — Zapier workflow, EmbedSocial, Chrome extensions | 3 |
| GBP Post Generator | GAP: 0 — MaxAI, Easy-Peasy, GBPPromote, Circleboom, OneUp | 3 |
| Product Listing Optimizer | GAP: 0 — Etsy built-in AI, 13+ Etsy AI tools, Amazon tools | 3 |
| Subscription Tracker | GAP: 0 — Rocket Money, Pine AI, TrackMySubs | 3 |
| Price Monitoring / Deal Alert | GAP: 0 — Honey, Flipp, CamelCamelCamel, 12+ tools | 3 |
| Home Maintenance Schedule App | GAP: 0 — Dib, HomeLedger, Oply, BrightNest, HomeZada | 3 |
| Privacy Policy / ToS Generator | GAP: 0 — TermsFeed, Termly, FreePrivacyPolicy | 3 |
| Business Name Generator | GAP: 0 — Looka, Namelix, Shopify, Wix, 10+ free tools | 3 |
| Grant Finder / Writer | GAP: 0 — GrantWatch AI, Grantable, Grantify, Granter | 2 |
| Appliance Repair vs Replace | GAP: 0 — repairorreplace.app, iFixit FixBot | 3 |
| Health Insurance Plan Compare | GAP: 0 — JambaCare, HealthBird, Care Compare, Healthcare.gov | 3 |
| Reseller Item Value Checker | GAP: 0 — Underpriced app | 2 |
| Used Car Value Checker | GAP: 0 — KBB, Edmunds, Carfax (already rejected) | 3 |
| Solar Panel ROI Calculator | GAP: 0 — EnergySage, Project Sunroof, PVWatts | 3 |
| Energy Rebate Finder | GAP: 0 — Energy Rebate Calculator, ENERGY STAR Rebate Finder, Rewiring America, DSIRE | 3 |
| Building Permit Requirements | GAP: 0 — CodeComply, CivCheck, PermitFlow, PermitZen | 3 |
| RFP Proposal Writer | GAP: 0 — DeepRFP, AutoRFP, Responsive, Inventive AI | 2 |
| Open Source Alternative Finder | GAP: 0 — OpenAlternative, osalt.com, AlternativeTo | 2 |

### Session 4 (Round 8) Summary
- Searched 6 subreddit categories + general Reddit searches across 40+ queries
- Validated gaps by searching for existing tools in each category
- **Key insight**: The consumer/homeowner/freelancer space is MORE crowded than the developer tool space. Almost every obvious pain point has 3-10 free tools already.
- **Strongest non-trust-checker candidates** (in order):
  1. Benefits Eligibility Navigator — largest dollar impact ($140B unclaimed), gap exists (benefits.gov is clunky)
  2. Freelancer Tax Deduction Finder — massive TAM (72M+), gap for NO-OAuth guidance agent
  3. Home Repair Cost Estimator — universal problem, gap for LLM-powered analysis vs basic calculators
  4. Relocation Research Agent — strong subreddit signal (r/SameGrassButGreener 500K+), CityMatch.ai emerging
  5. Cell Phone Plan Optimizer — massive TAM (330M+), WhistleOut is the main competitor

---

## 2026-03-10 — Session 4 (Round 9) — Deep Validation of Top 5 Candidates

Conducted extensive web research across Hacker News, Reddit, GitHub trending, and general consumer pain points to validate/invalidate the Round 8 candidates. Searched 30+ queries across HN "Ask HN" threads, GitHub trending repos, consumer frustration forums, and existing tool landscapes.

### Validation Results

#### Finding 1 (RE-EVALUATED): Benefits Eligibility Navigator Agent
- **GAP UPDATE**: LEO by Link Health is an AI chatbot that already guides patients through SNAP, WIC, Lifeline applications. Nava Labs is piloting an AI chatbot for benefits navigators. Servos has an AI-based integrated eligibility platform with conversational interface. USAGov benefit finder covers 1,000+ programs.
- **GAP STATUS**: NARROWING. LEO (Link Health) is specifically aimed at healthcare/low-income. Nava is government-facing (helps navigators, not end users directly). Neither is a comprehensive free consumer-facing tool that covers ALL programs with personalized dollar-value estimates + benefits cliff analysis. The gap still exists for a COMPREHENSIVE all-programs agent, but it's smaller than initially assessed.
- **REVISED ASSESSMENT**: Still viable but GAP is weaker. LEO + Nava are early-stage competitors. The differentiation would be: (1) covers ALL programs not just healthcare, (2) estimates dollar values, (3) models benefits cliff. Risk: complex eligibility rules could cause harmful hallucinations.
- **Status**: QUEUED — still strongest candidate

#### Finding 2 (RE-EVALUATED): Freelancer Tax Deduction Finder Agent
- **GAP UPDATE**: FlyFin requires bank account linking. Keeper requires bank connection (free 14-day trial only). TaxGPT exists as a general AI tax assistant. Cash App Taxes is free but not specifically a deduction finder. QuickBooks has comprehensive guides.
- **GAP STATUS**: EXISTS. No free, no-OAuth, conversational AI agent that takes business profile → generates personalized deduction checklist with estimated savings. The guidance tools (QuickBooks, blog posts) are static articles. The AI tools (FlyFin, Keeper) require bank OAuth. The gap is for an interactive, personalized deduction finder that works WITHOUT connecting bank accounts.
- **REVISED ASSESSMENT**: Still strong. The no-OAuth constraint is the key differentiator.
- **Status**: QUEUED — strong candidate

#### Finding 3 (RE-EVALUATED): Home Repair Cost Estimator Agent
- **GAP UPDATE**: HomeAdvisor, Angi, Fixr, Homewyse, RemodelingCalculator, Remodelum, Block Renovation, Decor8 AI all offer cost estimation. Some (Remodelum, Block Renovation) use zip-code-level pricing from real projects. Decor8 AI uses AI + regional pricing.
- **GAP STATUS**: NARROWING. The basic "what does X cost" space is well-served by calculators. The gap is for: (1) natural language project description → detailed breakdown, (2) "is this quote fair?" analysis with line-item comparison, (3) red flags + negotiation tips. This is more nuanced than a simple calculator.
- **REVISED ASSESSMENT**: Moderate. Many calculators exist. The LLM advantage is in nuanced analysis of specific quotes and generating personalized advice, not raw cost estimation.
- **Status**: QUEUED — moderate candidate

#### Finding 4 (RE-EVALUATED): Relocation Research Agent
- **GAP UPDATE**: CityMatch.ai compares 100+ cities with AI-powered match scores. NerdWallet, Numbeo, BestPlaces.net, SmartAsset, MoneyGeek, ERI all offer free cost-of-living calculators. CityVibeCheck compares by ZIP code. A Hacker News Show HN built an interactive map comparing cost of living by US county.
- **GAP STATUS**: NARROW. CityMatch.ai is a direct competitor. The existing cost-of-living calculators are numerous and free. The remaining gap is for a CONVERSATIONAL agent that takes priorities → generates a personalized multi-city comparison report (not just cost, but schools, crime, weather, commute, lifestyle fit). But CityMatch.ai is moving into this space.
- **REVISED ASSESSMENT**: Weakened. CityMatch.ai + numerous free calculators narrow the gap significantly.
- **Status**: DEFERRED — gap too narrow given CityMatch.ai

#### Finding 5 (RE-EVALUATED): Cell Phone / Internet Plan Optimizer Agent
- **GAP UPDATE**: WhistleOut offers daily-updated plan comparison by area. BestPhonePlans.net compares. HighSpeedOptions allows plan comparison. These are comparison TABLES, not conversational agents. 14% of US adults willing to switch ISPs. Average cell bill $141/mo, families ~$200/mo. r/NoContract has 600K+ members.
- **GAP STATUS**: EXISTS but narrow. WhistleOut is comprehensive but not conversational. The gap is for: input your ACTUAL usage → get personalized recommendation with estimated savings. WhistleOut does some of this but it's a traditional comparison site, not an AI agent.
- **REVISED ASSESSMENT**: Moderate. The plan data is the hard part — carriers change plans constantly. The LLM advantage is in personalized analysis + recommendations.
- **Status**: QUEUED — moderate candidate

### New Ideas from Round 9 Research

#### Finding 6 (NEW): Medical Bill Explainer + Appeal Letter Agent
- **Source**: HN thread about $195K hospital bill reduced to $33K using Claude. Tom's Hardware, Fox News, Medium all covered the story. 3 out of 4 medical bills contain errors (Medical Billing Advocates of America). 40% of Americans confused by medical bills (YouGov/AKASA). 57% have been surprised by a bill (NORC). Denial appeal success rate: 41%.
- **Signal**: VERY STRONG. The $195K→$33K story went viral on HN. Multiple HN threads about surprise billing. The Medical Billing Advocates stat (75% of bills have errors) is widely cited. 40% of 330M Americans = 132M people confused by medical bills.
- **Current solutions**: OrbDoc (free CPT code checker), MedAudit (free upload + AI analysis), FairMedBill (launched Feb 2026, HIPAA-compliant, 10-engine detection), BillMeLess (AI-powered). These are emerging tools but MOST are very new (2025-2026 launches).
- **GAP STATUS**: CLOSING FAST. MedAudit and FairMedBill are strong new entrants. OrbDoc is free. However, none combine all three: (1) plain-English bill explanation, (2) error detection, AND (3) appeal/dispute letter generation in a single free conversational agent.
- **REVISED ASSESSMENT**: The GAP was strong 6 months ago but is closing. MedAudit + FairMedBill + OrbDoc together cover most of the use case. Marked as rejected (GAP: 0 in aggregate).
- **Status**: REJECTED — GAP: 0 in aggregate (MedAudit, FairMedBill, OrbDoc, BillMeLess)

#### Additional Rejected Ideas (Round 9)

| Idea | Reason | TAM |
|------|--------|-----|
| Recipe Dietary Converter | GAP: 0 — Recipe Revamped, Recipe Converter Chrome ext, The Allergy Chef | 3 |
| Credit Card Rewards Optimizer | GAP: 0 — Card Caddie (free, HN Show HN), Kudos Dream Wallet, Wallaby | 3 |
| Product Review Synthesizer | GAP: 0 — ChatGPT/Perplexity already do this; 56% of consumers use AI for shopping | 3 |
| HOA Rules Decoder | TAM 2 at best (~75M in HOAs but niche pain); not enough signal | 2 |
| Moving Checklist Generator | GAP: 0 — Template.net AI generator (free, no signup), Legal Templates, Vertex42 | 3 |
| Academic Paper Summarizer | GAP: 0 — Explainpaper, Emergent Mind, Elicit, Consensus (already rejected) | 1 |

### Round 9 Summary — Final Ranking

After deep validation, the **revised ranking** of non-trust-checker candidates:

1. **Freelancer Tax Deduction Finder** — STRONGEST. 72M+ freelancers, no free no-OAuth AI guidance agent exists. FlyFin/Keeper require bank connection. The gap for "tell me about your business → here are your deductions + estimated savings" is real and unfilled. Architecture: ANALYSIS + GENERATION.

2. **Benefits Eligibility Navigator** — STRONG but riskier. $140B unclaimed, gap exists but LEO (Link Health) and Nava Labs are entering the space. Our differentiation: comprehensive ALL-programs coverage + dollar estimates + cliff analysis. Risk: eligibility rules are complex, hallucination risk is high, competitors are well-funded.

3. **Home Repair Cost Estimator** — MODERATE. Universal problem (130M homeowner households), but many calculators exist. The LLM edge is in natural-language project description → nuanced breakdown + quote fairness analysis. Not just "what does X cost" but "is THIS quote fair?"

4. **Cell Phone Plan Optimizer** — MODERATE. Massive TAM (330M+), WhistleOut is the main competitor but not conversational AI. The hard part is keeping plan data current.

5. ~~Relocation Research Agent~~ — DEFERRED. CityMatch.ai + 10+ free calculators narrow the gap too much.
