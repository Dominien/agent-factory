# Research Log

See `research/summary.md` for cumulative history.
See `research/archive/` for full session logs.

---

## 2026-03-10 — Session 6 (Round 11) — Targeted Idea Validation

Evaluated 8 specific non-trust-checker agent ideas across cover letters, business plans, competitive intelligence, RFPs, local SEO, wedding planning, financial health, and patent research.

### Idea 1: Cover Letter / Cold Email Generator — REJECTED (GAP: 0)

- **Search queries**: "free AI cover letter generator 2026", "free cold email generator AI tool 2026", "cover letter generator from job posting URL paste job description"
- **Existing free tools found**:
  - **Cover letters**: MAJC AI (free, no signup, accepts job URLs), Sheets Resume (unlimited, free), Enhancv (free, accepts resume + job ad), TripleTen (100% free), Cover Letter Copilot (free), Grammarly (free), Microsoft Word Copilot (free), Canva (free), Kickresume (free to try), BeamJobs (free)
  - **Cold emails**: Copy.ai (free forever plan, 2,000 words/mo), Mailmeteor (free), QuillBot (free), Klenty (free signup), Writecream (free forever), Folk.app (free, GPT-powered), SalesRobot (free)
  - **GitHub**: Cover-Letter.AI open-source project that scrapes job URLs + generates letters
- **GAP**: 0. This space is SATURATED. 10+ free cover letter generators, 7+ free cold email generators. Multiple already accept job posting URLs + resume input. An open-source version exists on GitHub.
- **TAM**: 3 (12.4M job seekers active monthly, 27 applications per seeker average)
- **Verdict**: **REJECTED**. Massive TAM but zero gap. Would compete with 15+ free tools that already do exactly this.

---

### Idea 2: Business Plan / Pitch Deck Generator — REJECTED (GAP: 0)

- **Search queries**: "free AI business plan generator 2026", "free AI business plan generator with market research financial projections complete", "business plan generator limitations missing market research real data"
- **Existing free tools found**:
  - BizPlanr (free, full business plan), Grammarly (free, includes market analysis + financial projections), Canva Magic Write (free, 50 queries/mo), PrometAI (free forever, 1 plan + 25 AI requests), Piktochart (free, 50 AI credits/mo), FounderPal (100% free, no email required), Yeschat (free, with financial projections + market insights), Easy-Peasy.AI (free), Superframeworks (free, no signup)
- **Key limitations of existing tools**: Financial projections are generic/hallucinated, market research uses stale LLM training data, 95% of real work still needs human input. LivePlan tested 15+ AI plan generators — all produced outputs requiring heavy edits. VentureKit "invented most of its information out of thin air."
- **GAP analysis**: While tools EXIST in abundance, they're all shallow — no tool does genuine live market research with web search + web fetch. They all just prompt an LLM. HOWEVER, even with live web research, the output still needs heavy human editing. The gap is in QUALITY, not existence.
- **GAP**: 0 (by count — 9+ free tools). Quality gap exists but doesn't justify building when so many alternatives exist.
- **TAM**: 3 (5.1M new businesses/year, only 33% write formal plans = 1.7M plans/year minimum)
- **Verdict**: **REJECTED**. The quality gap (live market research vs LLM hallucination) is real but doesn't overcome the sheer number of free alternatives. Users would see this as "another business plan generator" in a sea of 9+ free options.

---

### Idea 3: Competitive Intelligence Brief — REJECTED (GAP: 0)

- **Search queries**: "free competitive intelligence tool competitor analysis 2026", "free competitor analysis report generator AI automated", "competitive intelligence brief automated report pricing features positioning"
- **Existing free tools found**:
  - **Free report generators**: MyMap.ai (free), Junia.ai (free, SWOT + pricing), Taskade (free), iWeaver AI (free), CoSchedule (free), LogicBalls (free, no signup), ScoutNow (free)
  - **Free data tools**: Semrush (free tier), Similarweb (free, no account needed), Owler (free), ChatSpot/HubSpot (free for everyone)
  - **Paid but close**: Competely.ai ($39/mo, does real web crawling of competitor sites, 100+ data points, no free tier)
- **Key insight**: The free generators (Junia, Taskade, CoSchedule, etc.) are LLM-only — they don't do live web research. Competely.ai DOES do real web crawling but costs $39/mo with no free tier. The gap is "free tool that does REAL web research on competitors" vs "free tool that uses LLM to generate generic competitor text."
- **GAP**: 0 in terms of tool count (7+ free generators + 4+ free data tools). A quality gap exists (real web research vs LLM generation) but the aggregate free tool landscape is too crowded.
- **TAM**: 3 (36.2M small businesses in US)
- **Verdict**: **REJECTED**. Same problem as business plan generators — the free space is saturated with LLM-only tools. The quality differentiator (live web research) exists but 7+ free alternatives make discovery/positioning impossible.

---

### Idea 4: RFP Response Generator — REJECTED (GAP: 0)

- **Search queries**: "free AI RFP response tool proposal generator 2026", "free RFP response generator no enterprise pricing", "how many companies respond to RFPs per year"
- **Existing free tools found**:
  - LogicBalls (free, no signup, AI RFP response generation)
  - PowerRFP (free, includes AI RFP Generator)
  - DeepRFP (7-day free trial, no credit card)
  - AutoRFP.ai (uses previous responses to auto-complete 80% of RFPs)
  - MyPitchFlow (free trial, 3 proposals)
  - RFP Response Builder (free trial)
- **Key insight**: The RFP space is dominated by B2B enterprise tools ($500+/mo). Free options exist but are basic LLM text generators (LogicBalls) or limited trials. The REAL gap is: upload an actual RFP document + company knowledge base → get structured proposal. But this requires document parsing, company-specific context, and domain expertise that a generic agent can't provide well.
- **Previously rejected**: In Round 8, RFP Proposal Writer was already rejected with note "GAP: 0 — DeepRFP, AutoRFP, Responsive, Inventive AI"
- **GAP**: 0. Already rejected in prior research. Free tools exist (LogicBalls, PowerRFP). Enterprise tools dominate the serious end.
- **TAM**: 2 (average business submits 150 RFPs/year, but primarily mid-to-large enterprises)
- **Verdict**: **REJECTED**. Previously rejected. Free tools exist. Enterprise segment is well-served. Small businesses rarely deal with formal RFPs. Also fails TAM threshold (TAM 2 < required TAM 3).

---

### Idea 5: Local SEO Audit Agent — REJECTED (GAP: 0)

- **Search queries**: "free local SEO audit tool 2026", "local SEO audit tool Google Business Profile optimization free limitations", "free local SEO citation audit tool business listing check no signup"
- **Existing free tools found**:
  - **Comprehensive audit tools**: SEOptimer (free, 100+ data points), Seomator (free), AIOSEO Analyzer (free), The HOTH (free), Semrush (free tier)
  - **Local-specific audit**: Birdeye (free, scans 50+ directories), BrightLocal (free 14-day trial), Optuno (free local SEO report), WEB20 Ranker (free), Localo (free trial)
  - **GBP-specific**: Merchynt (free, 3 audits), Robot Speed GMB Analyzer (free, no signup, 25+ criteria), GMB Everywhere (free Chrome extension)
  - **Citation audit**: Free Local Citation Checker (50+ directories), Review Grower (60+ sites, free), Citation Builder Pro (free audit)
- **GAP**: 0. This is one of the most saturated niches I've found. 15+ free tools covering every sub-aspect: general SEO audit, local SEO audit, GBP audit, citation audit, NAP consistency check. Multiple require no signup.
- **TAM**: 3 (36.2M small businesses, 74% invest in SEO)
- **Verdict**: **REJECTED**. Massive TAM but zero gap. 15+ free tools already cover every aspect of local SEO auditing.

---

### Idea 6: Wedding Planning Research Agent — REJECTED (GAP: 0)

- **Search queries**: "free wedding planning tool AI 2026", "AI wedding vendor recommendation tool budget location personalized", "how many weddings per year United States"
- **Existing free tools found**:
  - **AI planning platforms**: Pearl Planner by David's Bridal (free, AI-powered, learns style/budget/location, vendor recommendations, vision boards, checklists, timelines, wedding websites), The Knot "Make it Yours" (free, scans 1M+ images, recommends vendors by style/location), Weddy (free tier, AI wedding planner app)
  - **Full planning suites**: Joy (free, all-in-one: website, registry, guest list, RSVP), WeddingAIssistant (free, no credit card), CelebRateAlly (free checklist generator)
  - **General tools**: Planning.wedding AI Agent (free, recommends vendors matching style/budget/location, updates when budget shifts)
- **Key insight**: Pearl Planner (David's Bridal) is a STRONG free competitor — it does exactly what this agent would do: takes couple's style + budget + location → recommends vendors + generates checklists + builds timelines. The Knot's AI also matches vendors by style/location. The wedding planning AI space exploded in 2025-2026.
- **GAP**: 0. Pearl Planner and The Knot together cover personalized vendor recommendations + budget tracking + timeline generation + wedding website. Both are free and from major brands with huge vendor databases.
- **TAM**: 3 (2M+ weddings/year, $66B market)
- **Verdict**: **REJECTED**. Pearl Planner (David's Bridal) and The Knot AI are direct, well-funded competitors with massive vendor databases. A new agent cannot compete with their vendor inventory data.

---

### Idea 7: Small Business Financial Health Check — VIABLE (GAP EXISTS)

- **Search queries**: "free business financial health check tool small business 2026", "small business financial benchmarking tool industry averages free"
- **Existing tools found**:
  - **Free assessment tools**: Hello Alice Business Health Score (assessment + recommendations, but more of a questionnaire than financial analysis), Maize Agency (free, basic assessment, results emailed), Phoenix Strategy Group (free benchmark tool), Acuity (free financial health score focused on bookkeeping errors)
  - **Free data sources**: BizStats.com (free financial ratios for 250 industries), ReadyRatios (free comparison against public companies), BDC (free workforce efficiency benchmarking), U.S. Census economic data (free, every 5 years)
  - **Paid tools**: QuickBooks, Xero, FreshBooks (accounting software with dashboard analytics, not specifically benchmarking agents)
- **GAP analysis**: The existing tools are either (a) generic questionnaires (Hello Alice, Maize), (b) raw data lookups requiring user interpretation (BizStats, ReadyRatios), or (c) accounting software that requires connecting your books. NO free tool takes simple inputs (monthly revenue, expenses, industry, business age) → fetches current industry benchmarks → generates a PERSONALIZED financial health report comparing you to peers with specific recommendations. The gap is the "personalized analysis report" layer.
- **GAP**: 1 (tools exist but none do the full INPUT → RESEARCH → ANALYSIS → REPORT pipeline for free)
- **TAM**: 3 (36.2M small businesses in US, only 33% have formal financial plans)
- **Agent design**: GATHER: gather-financials (revenue, COGS, expenses, margins, industry NAICS code, business age, employees) → RESEARCH: search-benchmarks (fetch industry averages from BizStats, Census, SBA data) → PROCESS: analyze-health (compare user metrics to benchmarks, compute ratios like current ratio, quick ratio, gross margin, net margin, debt-to-equity) + identify-risks (cash flow concerns, margin gaps, expense anomalies) → OUTPUT: write-health-report (grade A-F across 5 categories, comparison charts, specific action items, industry peer positioning)
- **Architecture type**: ANALYSIS + COMPARISON + GENERATION (not trust-checker)
- **Score**: DEMAND: 7 | GAP: 1 | TOOLS: 3 | TAM: 3 (36.2M small businesses)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 x 3 = 18 (meets threshold)
- **Risk**: Financial benchmarks may be stale (Census data is 5 years old). Industry averages are broad — a "restaurant" benchmark might not fit a food truck. Must include strong disclaimers. LLM-generated financial advice has liability concerns.
- **Status**: VIABLE — queued for evaluation

---

### Idea 8: Patent / Prior Art Researcher — VIABLE (GAP EXISTS)

- **Search queries**: "free patent search tool prior art search 2026", "free patent prior art search AI natural language invention description"
- **Existing free tools found**:
  - **Free patent search**: Google Patents (87M patents, 17 countries), USPTO Patent Public Search (official, full database), Espacenet (global coverage, legal status), PATENTSCOPE/WIPO (PCT applications)
  - **Free AI-powered**: PQAI (open-source, natural language input, concept extraction, unlimited searches, no tracking/logging, privacy-focused)
  - **Paid AI tools**: NLPatent (paid), Patlytics (paid), Solve Intelligence (paid), Cypris (paid enterprise)
- **GAP analysis**: PQAI is a strong free competitor — it does natural language → patent search with AI concept extraction. Google Patents and USPTO are comprehensive but require keyword expertise. The gap is NARROW. PQAI covers the "describe your invention in plain English → find similar patents" use case. However, PQAI does NOT: (1) generate a structured prior art assessment REPORT with patentability opinion, (2) search non-patent prior art like academic papers, products, and open-source projects comprehensively, (3) analyze claim-by-claim overlap with found references. The gap is in the ANALYSIS + REPORT layer, not the search layer.
- **GAP**: 1 (narrow — PQAI exists for search, but no free tool generates a comprehensive prior art assessment report with patentability analysis)
- **TAM**: 2 (346K patents granted/year in US, but inventors who do prior art searches before filing is a subset — perhaps 500K-1M searches/year including provisional filers and idea-stage inventors)
- **Agent design**: GATHER: describe-invention (natural language description, key features, technical domain) → RESEARCH: search-patents (query Google Patents API, USPTO, PQAI for similar patents) + search-prior-art (academic papers, product databases, open-source repos) → PROCESS: analyze-overlap (compare invention claims to found references, identify differentiators) + assess-patentability (novelty, non-obviousness based on prior art found) → OUTPUT: write-prior-art-report (found references with relevance scores, claim overlap analysis, patentability assessment, recommended next steps)
- **Architecture type**: RESEARCH + ANALYSIS + GENERATION (not trust-checker)
- **Score**: DEMAND: 6 | GAP: 1 (narrow) | TOOLS: 3 | TAM: 2 (346K patents/year, ~500K-1M searches)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ (narrow) | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 x 2 = 12 (BELOW threshold of 18)
- **Risk**: PQAI is a direct competitor for the search layer. Patent analysis requires legal expertise — LLM-generated patentability opinions have liability risk. Google Patents API access may be limited.
- **Status**: REJECTED — Below TAM threshold. TAM 2 gives projected composite of 12, below the required 18. PQAI also narrows the gap significantly.

---

### Round 11 Summary

| # | Idea | GAP | TAM | Projected Composite | Verdict |
|---|------|-----|-----|---------------------|---------|
| 1 | Cover Letter / Cold Email Generator | 0 | 3 | N/A | REJECTED — 15+ free tools |
| 2 | Business Plan / Pitch Deck Generator | 0 | 3 | N/A | REJECTED — 9+ free tools |
| 3 | Competitive Intelligence Brief | 0 | 3 | N/A | REJECTED — 7+ free generators + 4+ data tools |
| 4 | RFP Response Generator | 0 | 2 | N/A | REJECTED — previously rejected, GAP=0 |
| 5 | Local SEO Audit Agent | 0 | 3 | N/A | REJECTED — 15+ free tools, most saturated niche |
| 6 | Wedding Planning Research Agent | 0 | 3 | N/A | REJECTED — Pearl Planner, The Knot AI |
| 7 | Small Business Financial Health Check | 1 | 3 | 18 | VIABLE — queued |
| 8 | Patent / Prior Art Researcher | 1 | 2 | 12 | REJECTED — below threshold, PQAI covers search |

**Key insight**: 6 of 8 ideas are GAP=0. The "AI generator" pattern (cover letter, business plan, cold email, competitor report, SEO audit, wedding planning) is the most saturated space in free tools. Dozens of startups built free LLM wrappers in 2024-2025 for every common text generation task. The only viable candidate (#7) succeeds because financial BENCHMARKING + ANALYSIS is harder than text generation — it requires fetching real industry data and computing meaningful comparisons, not just prompting an LLM.

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

---

## 2026-03-10 — Session 5 (Round 10) — Final GAP Validation + Build

### Additional GAP Validation (web search)
- **Home Repair Cost Estimator**: **REJECTED (GAP=0)**. HomeGuide, Homewyse, HomeAdvisor, Thumbtack, Planner5D, Houzz, Angi ALL provide detailed free cost breakdowns. Thumbtack even accepts inspection report uploads. Too many free tools.
- **Local Permit Research**: **WEAKENED**. Govstream.ai PermitGuide and Permio/Mio AI exist as B2G tools. Not consumer-facing, but closing the gap. Also found CodeComply, CivCheck, PermitFlow, PermitZen.
- **Freelancer Tax Deduction Finder**: **GAP CONFIRMED**. Keeper Tax costs $20/mo (free trial only). FlyFin is paid + requires bank OAuth. FreeTaxUSA is a filing tool, not deduction finder. No free, no-bank-connection, conversational AI deduction guidance tool exists.
- **Benefits Eligibility Navigator**: Skipped — previously rejected in summary.md (GAP: 0).

### Decision: Build freelancer-deduction-finder
- Strongest GAP of all candidates
- TAM 3 (72M+ freelancers)
- Genuinely different architecture: PROFILE → ANALYZE → RECOMMEND
- Tools: search-deductions, analyze-profile, estimate-savings, write-deduction-report
- **Status**: SHIPPED

---

## 2026-03-10 — Session 6 (Round 11) — Fresh Research for Non-Trust-Checker Agents

Searched 50+ queries across Reddit, HN, and general web. Focus areas: content generation, data transformation, monitoring/diff, workflow automation. Excluded trust-checkers, scam-detectors, verification agents, cost estimators (all CLOSED patterns).

### TOP 5 FINDINGS

---

### Finding 1: Small Business Regulatory Compliance Briefing Agent
- **Source**: SBA, BBSI, ZenBusiness, Paychex, Reddit r/smallbusiness, r/entrepreneur
- **Signal**: 36.2M small businesses in US (SBA 2025). Regulatory landscape is described as "overwhelming" by multiple sources. In 2025 alone: Corporate Transparency Act (BOI reporting), payment platform IRS reporting threshold dropped to $2,500, state minimum wage changes in 20+ states, new paid leave laws in 3 states, new AI employment laws in CA/IL/CO taking effect 2026. Small businesses without legal counsel (the vast majority) have NO systematic way to stay current. Common Reddit complaint: "how do I know what regulations apply to my business?" California compliance costs alone ~$16K/year for small businesses.
- **Current solutions**: SBA.gov (generic guides, not personalized). ZenBusiness/LegalZoom (paid license reports, $99-199). Harbor Compliance Navigator AI (new, focused on licenses not ongoing regulatory changes). Compliance.ai (enterprise, expensive). Visualping (can monitor pages but you must know WHICH pages). LogicBalls (generates generic checklists, not industry+location-specific). GoSmarter AI (generic compliance checklists). No free tool takes business type + location + employee count → searches current regulatory databases → generates a PERSONALIZED compliance briefing with specific requirements, deadlines, and recent changes.
- **Agent design**: GATHER: gather-business-profile (business type/NAICS, state, city, employee count, revenue, industry flags) + search-regulations (web search for current state and federal requirements by business type) + fetch-regulatory-updates (pull recent changes from SBA, state labor depts, IRS) → PROCESS: match-requirements (filter regulations for this specific business) + prioritize-deadlines (rank by urgency) → OUTPUT: write-compliance-briefing (personalized report: licenses/permits needed, employment law requirements, tax obligations, upcoming deadlines, recent changes, links to official sources)
- **Architecture type**: DATA GATHERING + ANALYSIS + GENERATION
- **Score**: DEMAND: 9 | GAP: 1 | TOOLS: 4 | TAM: 3 (36.2M small businesses)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a closed pattern**: This is regulatory research + analysis + report generation. Not trust-checking, not scam detection, not cost estimation.
- **Risk**: Regulatory info is complex and jurisdiction-specific. LLM could hallucinate requirements. Strong disclaimers needed. Accuracy depends on public data quality. Value is in aggregation + personalization.
- **Status**: STRONG CANDIDATE — queued

---

### Finding 2: Business Insurance Coverage Advisor Agent
- **Source**: Reddit r/smallbusiness, r/insurance, r/entrepreneur, NerdWallet, SBA, U.S. Chamber
- **Signal**: 36.2M small businesses. Insurance is "consistently ranked among the most complex and stressful aspects of running a small business." Reddit shows owners overwhelmed by options — GL, BOP, workers' comp, E&O, cyber, D&O, commercial auto, EPLI. Average spend $100-200/mo but many underinsured or overpaying. Redditors: "I didn't know I needed that coverage until it was too late." Industry-specific requirements vary dramatically (restaurant vs consultancy vs construction vs ecommerce). "Between ACA, state requirements, and countless plan variations, even well-established owners find themselves overwhelmed."
- **Current solutions**: NerdWallet/Insureon (static comparison articles, not personalized). SBA (general guidance). Insurance brokers (require phone calls, sales pressure). CoverWallet/Embroker (lead gen, not free advisory). No free tool takes business type + size + industry + risks → researches applicable coverage types → generates personalized insurance recommendation report explaining WHAT you need, WHY, estimated cost ranges, and common mistakes.
- **Agent design**: GATHER: gather-business-profile (industry, state, revenue, employees, assets, risks) + research-coverage (search for industry-specific insurance requirements, state mandates, common claims) → PROCESS: match-coverage (required vs recommended vs optional for this business) + estimate-costs (average cost ranges by industry/size) + identify-gaps (common coverage gaps) → OUTPUT: write-insurance-advisory (personalized report: required vs recommended coverage, cost ranges, common mistakes, what to ask brokers, state mandates)
- **Architecture type**: ANALYSIS + RECOMMENDATION + GENERATION (same "advisory agent" pattern as freelancer-deduction-finder)
- **Score**: DEMAND: 8 | GAP: 1 | TOOLS: 3 | TAM: 3 (36.2M small businesses)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a closed pattern**: Advisory/recommendation agent. Not trust-checking, not cost estimation. Same pattern that worked for freelancer-deduction-finder — "based on YOUR situation, here's what you should do."
- **Risk**: Insurance regulations vary by state. Recommendations could be incomplete. Strong disclaimers needed. But value is in structured research + personalized guidance.
- **Status**: STRONG CANDIDATE — queued

---

### Finding 3: Supplier Sourcing Report Agent
- **Source**: Reddit r/smallbusiness, r/ecommerce, r/entrepreneur, Shopify, ThomasNet
- **Signal**: 36.2M small businesses, ~10M product-based. Finding and comparing suppliers is one of the most time-consuming startup tasks. Reddit constantly has "where do I find suppliers for X?" posts. Supplier search takes 2-4 weeks per product category. Must compare pricing, MOQ, lead times, certs across ThomasNet, Alibaba, Faire, Handshake, IndiaMART. Industry reports cost $300-$1,500 (Statista, IBISWorld). Commissioning market studies $5K-$15K.
- **Current solutions**: ThomasNet (directory, no comparison). Alibaba (marketplace, no analysis). Veridion/Scoutbee (enterprise, $$$). SpecLens (PDF spec comparison only). Accio (supplier discovery, limited free). No free tool takes product description + requirements → searches public supplier directories → generates structured comparison report with pricing ranges, MOQs, lead times, certifications, pros/cons.
- **Agent design**: GATHER: gather-requirements (product type, quantity, quality specs, budget, domestic/international, certs) + search-suppliers (web search ThomasNet, Alibaba, Faire, trade directories) + fetch-details (scrape pricing, MOQ, lead times, reviews) → PROCESS: compare-suppliers (normalize, rank by priorities) + assess-risk (review sentiment, company age) → OUTPUT: write-sourcing-report (comparison table + top 3 recommendations + negotiation tips + sampling next steps)
- **Architecture type**: DATA TRANSFORMATION + COMPARISON + GENERATION
- **Score**: DEMAND: 8 | GAP: 1 | TOOLS: 4 | TAM: 3 (~10M product-based small businesses)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a closed pattern**: Sourcing/comparison agent. Compares suppliers on business metrics (price, MOQ, lead time), not trust signals.
- **Risk**: Supplier data fragmented, pricing often requires RFQ. Works best for commodity/standard products. Quality depends on public data availability.
- **Status**: STRONG CANDIDATE — queued

---

### Finding 4: RFP / Proposal Response Drafter Agent
- **Source**: Reddit r/smallbusiness, r/freelance, RFP industry sites, SBA contracting guide
- **Signal**: Government spends $500B/year on contracts; 23% mandated for small businesses (~$115B). Average RFP response takes 20-40 hours. 90% of freelance proposals are discarded. Freelancers spend 2-3 hours per proposal with high rejection rates. 68% of proposal teams now use generative AI (doubled from 34% in one year). Small businesses that can't afford $75+/month for RFP tools do it manually.
- **Current solutions**: DeepRFP ($75/user/mo). AutoRFP.ai (paid). Arphie (paid, 80% time savings claimed). Responsive/Loopio (enterprise $1K+/mo). All paid, $50-150+/month minimum. Free trials 7-14 days only. No free, ongoing RFP/proposal drafting tool for small businesses/freelancers who submit proposals occasionally.
- **Agent design**: GATHER: gather-rfp-requirements (user pastes/describes RFP requirements) + gather-company-profile (capabilities, past work, team, differentiators) + research-context (web search for industry context, standards) → PROCESS: analyze-requirements (extract compliance needs, evaluation criteria, must-haves) + draft-sections (exec summary, technical approach, management plan, past performance, pricing rationale) → OUTPUT: write-proposal-draft (complete first draft with compliance matrix, formatted sections, persuasive narrative)
- **Architecture type**: CONTENT GENERATION + DATA TRANSFORMATION
- **Score**: DEMAND: 8 | GAP: 1 (all tools paid $50+/mo; no free option) | TOOLS: 3 | TAM: 3 (36.2M small businesses + 72M freelancers)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a closed pattern**: Content generation agent. Takes requirements + company profile → generates proposal draft. No verification, no trust scoring, no cost estimation.
- **Risk**: Quality depends on user-provided info. Generic proposals won't win contracts. But as a FIRST DRAFT tool (saving 60-80% of time), value proposition is strong.
- **Status**: STRONG CANDIDATE — queued

---

### Finding 5: Weekly Competitor Intelligence Briefing Agent
- **Source**: Reddit r/smallbusiness, r/entrepreneur, SingleGrain, competitive intelligence industry
- **Signal**: Small businesses spend 2-4 hours/week manually checking competitor websites, social media, pricing. Competitive intelligence tools cost $99-500+/month (Kompyte, Crayon, Klue). Visualping free tier: 5 pages/day, change detection only, no synthesis. SkhokhoAI offers daily briefings but B2B SaaS focused, paid. Reddit Pro is free but just conversation monitoring. No free tool that takes competitor list → fetches their websites/social → generates a synthesis report.
- **Current solutions**: Visualping (free: 5 pages, change detection only, no analysis). Competitors.app (paid $19+/mo per competitor). Kompyte/Crayon/Klue (enterprise $500+/mo). SkhokhoAI (paid). UptimeRobot (free: 50 pages, change detection, no synthesis). No free tool generates an analytical synthesis report from competitor data.
- **Agent design**: GATHER: gather-competitors (3-5 competitor names/URLs) + gather-focus (pricing, features, hiring, content, social) + fetch-competitor-data (web fetch key pages: pricing, features, about, blog, careers) → PROCESS: detect-changes (compare to last known state via file persistence) + analyze-signals (job postings → strategy, pricing changes → market positioning, content themes → priorities) → OUTPUT: write-intel-briefing (competitive digest: what changed, strategic implications, recommended responses, trends)
- **Architecture type**: MONITORING + ANALYSIS + GENERATION
- **Score**: DEMAND: 7 | GAP: 1 | TOOLS: 4 | TAM: 3 (36.2M small businesses)
- **Venture Score (research)**: SIGNAL ✓ | GAP ✓ | FEASIBLE ✓ → 3/3
- **Projected Composite**: 6 × 3 = 18 (meets threshold)
- **Why NOT a closed pattern**: Monitoring + analysis + report generation. No trust verification, no scam detection, no cost estimation.
- **Risk**: First run = snapshot, subsequent runs = diffs. Web scraping may be blocked. Persistence via filesystem is fragile. More complex architecture than typical agent.
- **Status**: MODERATE CANDIDATE — novel monitoring pattern but persistence adds complexity

---

### Additional Rejected Ideas (Round 11)

| Idea | Reason | TAM |
|------|--------|-----|
| Content Calendar Generator | GAP: 0 — Easy-Peasy, Predis.ai, Taskade, GravityWrite, Optimo, 10+ free | 3 |
| Competitive Landscape Report | GAP: 0 — LiveChat AI, GravityWrite, Junia AI, ScoutNow, Competely, 10+ free | 3 |
| Media Kit Generator | GAP: 0 — Beacons (free, auto-updating), PostEverywhere, Template.net | 3 |
| Market Research Report Gen | GAP: 0 — Optimo (free), PerfectAssistant, ChatGPT, Gemini Deep Research | 3 |
| Compliance Checklist Gen | GAP: 0 — LogicBalls (free, no signup), GoSmarter AI | 3 |
| Warranty Tracker | GAP: 0 — TrackWarranty app (free, AI receipt scanning) | 3 |
| Gov Contract Finder | GAP: 0 — SAM.gov (free), Sweetspot, SamSearch, BidScout AI, GCFinder | 3 |
| Teacher Differentiated Materials | GAP: 0 — Diffit (free, AI-powered, exact use case) | 3 |
| Etsy/Amazon Listing Optimizer | GAP: 0 — eRank (free), EHunt, InsightFactory, Etsy built-in AI | 3 |
| Local SEO Audit | GAP: 0 — GMB Everywhere Chrome ext, Merchynt, BrightLocal | 3 |
| SEO Website Audit | GAP: 0 — SEOptimer, Semrush free, AIOSEO, HOTH, 10+ free | 3 |
| Job Description Writer | GAP: 0 — Ongig, LinkedIn AI, countless free generators | 3 |
| Business Plan Generator | GAP: 0 — Bizplanr, 15MinutePlan.ai, Junia AI, Lumin (all free) | 3 |
| Relocation Research Agent | GAP: 0 — CityMatch.ai (free, AI-powered, direct competitor) | 3 |
| Home Repair Cost Estimator | GAP: 0 — HomeGuide, Homewyse, HomeAdvisor, Thumbtack, Angi | 3 |
| Grant Finder/Writer | GAP: 0 — GrantWatch AI, Grantable, Grantify, Granter | 2 |

### Round 11 Summary
- Searched 50+ queries across Reddit, HN, and general web
- Validated gaps by searching for 3+ existing free tools per idea
- 15 additional ideas rejected for GAP=0
- **Key insight**: The "advisory/guidance agent" pattern (pioneered by freelancer-deduction-finder) remains the strongest gap pattern. Tools that say "based on YOUR specific situation, here's what you should do" are less saturated than generic generators or comparison tools. The reason: guidance requires domain expertise + personalization + research synthesis, which is harder to template.
- **Strongest candidates** (in order):
  1. Regulatory Compliance Briefing — massive pain, no free personalized tool, 36.2M TAM
  2. Business Insurance Advisor — same advisory pattern as deduction-finder, clear gap
  3. Supplier Sourcing Report — data transformation from scattered sources, enterprise tools too expensive
  4. RFP / Proposal Response Drafter — all competitors paid $50+/mo, clear gap for free tool
  5. Competitor Intelligence Briefing — novel monitoring pattern, but persistence adds complexity
