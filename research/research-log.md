# Research Log

See `research/summary.md` for cumulative history.
See `research/archive/` for full session logs.

---

## 2026-03-10 — Session 3

### Research Round 1: Hunting TAM 4+ with non-trust-checker architectures

Searched 20+ problem areas across Reddit, HN, Product Hunt, GitHub trends, and general web.
Key finding: AI tool explosion in 2024-2025 filled almost every consumer-facing niche. GAP=0 remains the #1 kill reason.

### Finding: Property Tax Appeal Advisor ✅ QUEUED
- **Source**: Bankrate, CBS News, CNBC, Reddit property tax threads, Ownwell ($50M raise)
- **Signal**: 87M owner-occupied homes in US, avg $4,271/year in property taxes. Only 5% appeal but 30-94% success rate. Average savings $539-$774/year. Over 40% of homeowners could potentially save $100+/year.
- **Current solutions**: County-specific tools only (Cook County, Jefferson County). Ownwell is PAID (takes 25% of savings). PropGap.ai covers NJ only. TaxNetUSA has a comp tool. No comprehensive FREE tool that works across all states.
- **Agent design**: GATHER (property address → search Zillow/Redfin for comparable sales + county assessor for current assessment) → ANALYZE (compare assessment to market value, flag if overassessed) → GENERATE (county-specific appeal process with deadlines/forms + draft appeal letter)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 3 (87M homeowners) | Composite: 18
- **Status**: queued → building
- **Notes**: Different architecture from trust-checkers. Advisory + comparative analysis + document generation. Ownwell's $50M raise proves massive demand. $370B/year in property taxes paid = huge market. Previously researched in round 6 but never built.

### Rejected Ideas (this round)

| Idea | Reason | TAM |
|------|--------|-----|
| Personal data exposure scanner | GAP: partial — ExpressVPN, DeleteMe, Optery free scans exist as lead-gen | 4 |
| Tenant rights advisor | GAP: 0 — LeaseChat (U. Chicago), LeaseRights.ai, Renter Protector AI | 3 |
| Small business marketing audit | GAP: 0 — BuzzBoard, Thryv, Infoserve free audits. Same as rejected SEO audit | 3 |
| Complaint letter generator | GAP: 0 — Template.net, LogicBalls, Writecream, Easy-Peasy all free | 4 |
| Salary negotiation advisor | GAP: 0 — Career Agents free tool, Salary Wizard | 3 |
| Insurance policy analyzer | GAP: 0 — CoverageCheck, ScanPolicy, PolicyAdvisor.pro, ByteBeam all free | 4 |
| International money transfer comparison | GAP: 0 — CompareRemit, Monito, Wise, RemitAnalyst all free | 4 |
| Resume ATS optimizer | GAP: 0 — SkillSyncer, Novorésumé, ResyMatch, KudosWall, 10+ free | 4 |
| Parking ticket appeal generator | GAP: 0 — LogicBalls, Pardonn, Template.net all free | 3 |
| College financial aid comparison | GAP: 0 — College Raptor, Scholarships360, Road2College all free | 3 |
| Tariff lookup/calculator | GAP: 0 — Flexport Tariff Simulator, AMZ Prep, USITC official | 3 |
| Job offer total comp comparison | GAP: 0 — Levels.fyi, Career Agents, Salary.com all free | 3 |
| Food ingredient safety scanner | GAP: 0 — Yuka (8M users), Think Dirty, EWG Skin Deep | 4 |
| Utility bill audit | Location-specific; utility companies offer free audits | 4 |
| Consumer tariff impact calculator | GAP: 0 — TrumpTariffCalc.com, Speed Commerce, Budget Lab | 4 |
| EU AI Act compliance advisor | Too similar to regulatory-compliance-briefing already built | 3 |
| Flight delay compensation | All services take 25-50% commission; agent can't file claims | 4 |
| E-commerce review analyzer | GAP: 0 — ChatGPT/Perplexity do this natively; Fakespot exists | 3 |
| SEC 10-K filing summarizer | GAP: 0 — ChatGPT, Claude, Perplexity, Search10K, V7 Go all handle this | 3 |
| Freelance rate calculator | GAP: 0 — FreelanceHourlyRate.com, Upwork calculator, PineBill, 5+ free | 3 |
| Foreign credential recognition advisor | GAP: 0 — WES, NACES, country-specific gov tools exist | 3 |
| Digital nomad tax advisor | GAP: 0 — SafetyWing, Nomad Tax, Bright!Tax all have free guides | 2 |
| Healthcare cost estimator | GAP: 0 — Healthcare Bluebook, MDsave, GoodRx, CMS price transparency | 4 |
| Student loan repayment optimizer | GAP: 0 — StudentAid.gov, Chipper, Payitoff, NerdWallet all free | 3 |
| EV tax credit eligibility checker | GAP: 0 — FuelEconomy.gov official tool, Edmunds, KBB | 3 |
| Social Security benefit optimizer | GAP: 0 — SSA.gov calculator, AARP, Open Social Security (free) | 4 |

### Research Round 3: Hunting TAM 4+ with new search strategies

Tried fundamentally different angles: policy changes (DOGE), fragmented local data, professional niches, episodic problems, trending repos.

Key finding: Every consumer-facing "research and report" niche with TAM 4+ has GAP: 0 due to 2024-2025 AI explosion. Breakthrough came from labor/employment domain.

### Finding: Wage Rights Advisor ✅ QUEUED
- **Source**: EPI.org, DOL.gov, Northwestern research, KeeVee wage theft stats
- **Signal**: $50B/year in wage theft in US. 82M workers have experienced pay issues. $3,300/year avg loss per victim. Only $1.5B recovered in 2 years. DOL enforcement at 52-year low due to DOGE cuts. 1 in 3 workers can't accurately calculate overtime owed. Workers constantly search Reddit, legal forums for "am I owed overtime?"
- **Current solutions**: Simple overtime calculators (Clockify, Omnicalculator) do math only. OnPay has employee-vs-contractor checker (not exempt/non-exempt). DOL.gov has info but no interactive tool. No free AI tool combines FLSA exemption analysis + state wage law research + personalized back-pay calculation + filing guidance.
- **Agent design**: GATHER (user's job details: role, duties, salary, hours, state) → ANALYZE (determine exempt/non-exempt under FLSA duties tests + salary threshold; research state-specific overtime/wage rules; calculate potential owed wages) → GENERATE (personalized wage rights report with exemption analysis, calculations, state filing instructions, relevant authorities)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (82M+ workers affected) | Composite: 24
- **Status**: queued → building → SHIPPED
- **Notes**: First TAM 4 idea with genuine gap! NOT a trust-checker — legal research + calculation + advisory agent. Different architecture. The gap exists because existing tools are either simple calculators (no legal analysis) or law firm lead-gen (not free tools). Agent fills the middle: free, AI-powered, personalized wage rights analysis.

### Rejected Ideas (this round)

| Idea | Reason | TAM |
|------|--------|-----|
| School choice comparison tool | GAP: 0 — Niche, GreatSchools, SchoolDigger, Zelma (AI, Brown Univ) | 4 |
| Wedding vendor comparison | GAP: 0 — The Knot, Zola, WeddingWire all free | 3 |
| Product recall checker | GAP: 0 — Food Recalls app, FDA Recall Scanner, ScanRecall, Recalls.gov | 4 |
| HOA dispute advisor | GAP: 0 — LogicBalls HOA response, HOA Dominator Bot, Makeform | 3 |
| Used car buying advisor | GAP: 0 — CarGurus AI, LogicBalls, ChatGPT, 25% of buyers use AI tools | 4 |
| Small claims court guide | GAP: 0 — DoNotPay, LawConnect (free), state-specific AI guides | 3 |
| Government benefits eligibility checker | GAP: 0 — BenefitsCheckUp (2,500+ programs), BenefitKarma AI, USA.gov | 4 |
| Unclaimed money/property finder | GAP: 0 — Unclaimed.org, MissingMoney.com, state sites all free | 4 |
| Warranty expiration tracker | GAP: 0 — TrackWarranty, SlipCrate, Warrify, Warracker all free | 3 |
| Moving/relocation cost estimator | GAP: 0 — 3 Men Movers, North American, HireAHelper, Freightwaves | 4 |
| ADU feasibility checker | GAP: partial — FutureLot (21 states), ADU Pilot, Dwellito exist | 4 |
| DOGE personal impact checker | GAP: partial — CLASP tracker, CAP tool, but ephemeral/political | 4 |
| Veteran benefits navigator | GAP: 0 — VA Wayfinder, VeteranAi, VA Benefits Navigator, ChatGPT Plus for vets | 3 |
| Home inspection report analyzer | GAP: 0 — Ask Aunt Sally AI (free), HomeInsight AI | 3 |
| Medical bill negotiation advisor | GAP: 0 — Counterforce Health (free, 70%), FightHealthInsurance.com | 4 |
| Lemon law advisor | TAM: 0 — only 150K-176K vehicles/year qualify | 0 |
| Credit report error dispute | GAP: 0 — Kikoff AI (free), SmartDispute.ai, Dispute AI Pro | 4 |
| Business startup requirements by city | GAP: partial but TAM: 3 only (5M new businesses/year) | 3 |
| Home renovation permit checker | GAP: partial but TAM: 3 only (10M renovations/year) | 3 |
| Lease agreement analyzer | GAP: 0 — LeaseChat (UChicago), LeaseCheck, Galaxy.ai, goHeather | 4 |
| Traffic ticket contest advisor | GAP: 0 — TicketZap.ai, Traffic Ticket Buddy, TicketFight.ai | 4 |
| Insurance claim denial appeal | GAP: 0 — Counterforce Health (free), FightHealthInsurance.com | 4 |
| Startup idea validator | GAP: 0 — IdeaProof.io, ValidatorAI, FounderPal, RebeccAi all free | 3 |
| ToS/Privacy policy analyzer | GAP: 0 — PolicyPal, Privy AI, Policy Quick, iWeaver, 5+ free | 5 |
| Subscription value analyzer | GAP: partial — trackers exist (Rocket Money) but value analysis is subjective | 4 |
| Neighbor noise complaint advisor | Too niche, mainly legal advice articles | 2 |
| Elder care facility comparison | GAP: partial — Contour Care free AI search + A Place for Mom | 3 |
| Independent contractor misclassification | Too close to wage-rights-advisor already built | 3 |
| Apartment hunting comparison | GAP: 0 — Zillow, Apartments.com, Rent.com dominate | 4 |
| Drug interaction checker | GAP: 0 — Medscape (free), DrugBank, SUPP.AI, PatientNotes.ai | 4 |
| Scholarship finder/matcher | GAP: 0 — ScholarshipOwl, Fastweb, Orbit, multiple free AI tools | 3 |

### Finding: Data Broker Opt-Out Advisor ✅ QUEUED
- **Source**: Privacy Rights Clearinghouse, Incogni research, California DROP, Security.org study
- **Signal**: 2,500-4,000 data brokers in US. Profiles exist on 250M+ Americans with thousands of data points each. Only 6% of adults have used data removal services. Only 37% know what a data broker is. Would take 304+ hours to manually opt out. $21B in damage from leaked data.
- **Current solutions**: DeleteMe/Incogni are PAID ($8+/month). Optery has free scan but charges for removal. Blog guides exist (Incogni, DeleteMe, CyberNews) but are generic lists, not personalized. California DROP is CA-only. GitHub Big-Ass-Data-Broker-Opt-Out-List is static. No free AI tool generates personalized removal plans.
- **Agent design**: GATHER (user's name, state, data concerns) → SEARCH (research top data brokers + their opt-out processes) → ANALYZE (assess which brokers likely have user data based on profile) → GENERATE (personalized step-by-step removal plan with direct links, instructions per broker, priority ranking, time estimates)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (250M+ Americans with data on brokers) | Composite: 24
- **Status**: queued → building → SHIPPED
- **Notes**: NOT a trust-checker — privacy protection + document generation agent. Different from personal data exposure scanner (which FINDS data) because this GENERATES a removal action plan. Existing paid services ($8+/month) prove demand. Agent empowers users to do it themselves for free.

### Research Round 4: Continuing TAM 4+ hunt

Searched 15+ new problem areas: privacy settings optimizer, legal document generators, car accident advisor, new parent benefits, employee benefits optimizer, right to repair advisor, phishing detectors, environmental exposure reports, consumer dispute resolution.

Key finding: Consumer complaint/dispute resolution advisory is a genuine gap at TAM 4. CFPB complaints up 89.1% YoY, 20M+ households with unresolved ISP complaints, USA.gov has only a static directory (not AI-powered personalized guidance). No free tool combines complaint routing + rights research + complaint drafting + company research + escalation strategy.

### Finding: Consumer Complaint Resolution Advisor ✅ QUEUED
- **Source**: CFPB data (2.7M complaints in 2024, up 89.1% YoY), FTC (5.15M complaints), FairShake research, Consumer Federation of America, USA.gov
- **Signal**: 2.7M CFPB complaints in 2024 alone (up 89.1% YoY). 5.15M FTC complaints. 20M+ households with unresolved ISP complaints. Consumer litigation filings all up in 2025. CFPB being defunded by DOGE = consumers need self-help tools more than ever. Constant Reddit posts asking "who do I complain to about X?"
- **Current solutions**: USA.gov has static directory of agencies (not personalized). CFPB/FTC accept complaints but don't advise on strategy. FairShake helps with arbitration but charges a fee. Easy-Peasy/LogicBalls generate complaint letters but don't route or strategize. No free AI tool combines complaint routing + consumer rights research + company complaint history + draft letters + escalation strategy.
- **Agent design**: GATHER (user's complaint: company, product/service, issue, amount, state) → ANALYZE (classify complaint type, identify relevant agencies, research state-specific consumer rights) → RESEARCH (search company's complaint history on CFPB/BBB) → GENERATE (personalized resolution plan with prioritized agencies, draft complaint letters, escalation timeline, consumer rights summary)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (100M+ consumers with disputes annually) | Composite: 24
- **Status**: queued → building → SHIPPED
- **Notes**: NOT a trust-checker — advisory + research + document generation agent. Input is user's complaint (not an entity to verify). Closest architecture to wage-rights-advisor. Gap exists because existing tools are either agency-specific portals (CFPB, FTC), paid services (FairShake), or simple letter generators. Agent fills the middle: free, AI-powered, personalized complaint resolution strategy.

### Rejected Ideas (this round)

| Idea | Reason | TAM |
|------|--------|-----|
| Privacy settings optimizer | GAP: partial — Consumer Reports guides, Google/Facebook Privacy Checkup tools exist. Static but adequate. | 5 |
| Power of attorney / advance directive generator | GAP: 0 — Template.net, FreeWill, Rocket Lawyer, Lawyerz AI, AARP all free | 4 |
| Identity theft recovery planner | GAP: 0 — IdentityTheft.gov provides free personalized recovery plans (FTC) | 4 |
| Car accident advisor | GAP: partial — Mighty.com (free AI claims advisor), Gammill Law calculator | 4 |
| New parent benefits advisor | GAP: partial — PaidLeave.ai covers leave; but broader benefits covered by multiple tools | 3 |
| Employee benefits optimizer | Not feasible — needs employer-specific plan data the agent can't access | 4 |
| Rental deposit return advisor | TAM: 3 only (15M movers/year) — below threshold | 3 |
| Personal cybersecurity audit | GAP: partial — HaveIBeenPwned, Google Password Checkup cover key pieces | 4 |
| Environmental exposure report | GAP: partial — EPA MyEnvironment, TRI Tracker, How's My Waterway cover it | 4 |
| Right to repair advisor | GAP: partial — no dedicated tool but only 7 states with laws; low awareness | 4 |
| Phishing email detector | GAP: 0 — PhishingInspector (free AI), Keepnet Labs, CheckPhish, EasyDMARC | 5 |
| Customs import duty calculator | GAP: 0 — Flexport, AMZ Prep, SimplyDuty, TariffDutyCalculator all free | 4 |

### Research Round 5: Revisiting flight rights with new angle

Previously rejected "flight delay compensation" in round 1 because claim services take 25-50% commission and an agent can't file claims directly. Revisited with advisory-only angle: agent analyzes regulations, researches airline record, and generates personalized claim plans — the user files themselves and keeps 100%.

### Finding: Flight Rights Advisor ✅ QUEUED
- **Source**: US DOT 2024 Final Rule on Automatic Refunds, EU Regulation 261/2004, Canadian APPR, AirHelp annual report, DOT complaint data
- **Signal**: 900M+ passengers fly in the US annually. 2.2% of flights cancelled, 20%+ delayed. DOT received record complaints in 2024. EU261 eligible passengers leave €5B+ unclaimed annually — only 15% file. AirHelp raised $100M+ proving massive demand. New DOT 2024 rule means automatic refunds are now LAW but airlines still don't comply.
- **Current solutions**: AirHelp, Flightright, ClaimCompass all take 25-50% commission. Free letter generators (LogicBalls, Easy-Peasy) are generic — no route-based regulation analysis. DOT has complaint form but no guidance tool. No free AI tool combines route-based regulation analysis + disruption classification + airline record research + personalized claim plans with letters.
- **Agent design**: GATHER (flight details, route, disruption type) → ANALYZE (determine applicable regulations based on airports — US DOT, EU261, APPR; classify disruption; calculate compensation) → RESEARCH (search latest rights + airline complaint record) → GENERATE (comprehensive claim plan with airline letter, DOT complaint filing, EU261 NEB guidance, chargeback steps, escalation timeline)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (900M+ annual US passengers) | Composite: 24
- **Status**: queued → building → SHIPPED
- **Notes**: NOT a claim-filing service — advisory + document generation. The key insight is that the agent analyzes WHICH regulations apply based on the specific route (EU261 only for EU departure/arrival on EU carrier, APPR only for Canadian flights, etc.) which generic letter generators don't do. The regulation analysis tool contains airport mapping, extraordinary circumstances detection, and compensation calculation logic. Different from consumer-complaint-advisor because it's domain-specific with specialized legal knowledge.

---

## Reflection — After builds 12-16

### What's working
- **Advisory + document generation pattern** is the winning architecture for TAM 4+ ideas. Every build since #13 follows this: GATHER user's situation → ANALYZE against regulations/rules → RESEARCH current data → GENERATE personalized action plan with letters/filings. This is fundamentally different from the trust-checker pattern (builds 1-9) and reliably finds genuine gaps.
- **Domain-specific legal knowledge** in the analysis tool is the key differentiator. Generic tools (ChatGPT, letter generators) can't match the specificity of an agent that knows FLSA exemption tests (wage-rights), EU261 distance bands (flight-rights), or CFPB complaint routing (consumer-complaint). Encoding this knowledge directly in tool logic beats relying on the LLM to know it.
- **Revisiting rejected ideas with new angles** works. Flight rights was rejected in round 1 as "can't file claims" — revisited as advisory-only and became a strong TAM 4 build. The rejection log is a research asset, not a dead end.
- **Build speed** is solid: 4 specialized tools + config + route + README + validate + type-check + build in ~15 minutes per agent.

### What keeps failing
- **Finding TAM 4+ ideas with genuine gap** is increasingly hard. The 2024-2025 AI tool explosion filled almost every consumer niche. Rounds 1-3 rejected 50+ ideas at GAP: 0 before finding wage-rights-advisor. The hit rate is roughly 1 in 15-20 ideas researched.
- **TAM 5 remains elusive**. Every idea at TAM 5 (ToS analyzer, phishing detector, resume optimizer) has GAP: 0 because the enormous market attracted many competitors. TAM 4 with niche gaps is the sweet spot.
- **research/summary.md is stale** — still says 11 shipped and threshold 18. Needs update.

### Adjusted strategy
- Focus research on **regulated domains** where encoding specific legal/regulatory knowledge creates durable gap (tax, labor, consumer protection, healthcare billing, immigration). Generic AI can't match domain-specific tools.
- Look for **episodic high-stakes problems** where people are motivated to use a specialized tool: something just happened (flight cancelled, wage theft discovered, complaint ignored) and they need guidance NOW. These have higher engagement than ongoing/preventive tools.
- Consider **professional niches** (real estate agents, landlords, small business owners) where TAM 3 might be acceptable if the problem is intense enough — but only if composite would still meet threshold.
- Keep mining the rejected ideas list for new angles — what was rejected for one reason might work differently.

---

### Research Round 6: Hunting more TAM 4+ ideas

Searched 8 problem areas across regulated domains, episodic problems, and professional niches. Hit rate improving: 3 out of 8 are buildable (37%).

### Finding: Debt Collection Rights Advisor ✅ QUEUED
- **Source**: CFPB 2025 Annual Report, NCLC debt collection data, Upsolve FDCPA guides, SoloSuit market validation
- **Signal**: 70M+ Americans contacted by debt collectors annually (1 in 3 consumers). 1B+ collector contacts/year. CFPB received 207,800 debt collection complaints in 2024 (nearly 2x 2023). 56% of complaints allege collectors trying to collect debts not owed. 81% claim false debt amounts. 75% who requested cease-contact say collectors ignored them. SoloSuit charges $99-300 for dispute responses — proves demand.
- **Current solutions**: Free validation letter templates exist (Rocket Lawyer, Legal Templates) but require manual FDCPA knowledge. Upsolve has educational content but no interactive analysis. State statute of limitations charts exist on InCharge.org but aren't integrated. ALL AI tools in debt collection serve COLLECTORS (Skit.ai, Floatbot, Vodex) — ZERO serve consumers. No free AI tool analyzes collector communications for violations, generates customized dispute letters, or provides integrated state-specific guidance.
- **Agent design**: GATHER (collector details, debt info, communications received, state) → ANALYZE (identify FDCPA violations in communications, check statute of limitations, determine debt validation rights) → RESEARCH (search state-specific debt collection laws, consumer protection rules) → GENERATE (personalized dispute strategy with violation-flagged letters, cease-contact demands, statute of limitations defense, CFPB complaint filing guidance)
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (70M+ contacted by collectors annually) | Composite: 24
- **Status**: queued → building
- **Notes**: Fits the "episodic high-stakes" pattern perfectly — someone just got a threatening call/letter and needs guidance NOW. FDCPA rules are complex but well-defined, perfect for encoding in tool logic. All AI tools serve the collector side; consumer side is completely unserved by AI.

### Finding: Immigration Form Navigator ✅ QUEUED
- **Source**: USCIS data (10.4M forms FY2023), Docketwise green card stats, Feng Law filing mistakes analysis
- **Signal**: 10.4M forms filed annually (52% increase over decade). 44.4% of rejections caused by outdated form versions alone. Errors cost $1,500-$3,000+ in re-filing fees plus 1-2 years delay. EB-2 NIW approval collapsed from 96% to 43%.
- **Current solutions**: USCIS-GPT on YesChat (generic info only). ImmigrationHelp.org covers "some" forms. CitizenPath is freemium. No free AI tool systematically determines which form to file, walks through eligibility, or flags common mistakes.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (5-7M potential users annually) | Composite: 24
- **Status**: queued

### Finding: Disability/ADA Accommodation Advisor ✅ QUEUED
- **Source**: JAN data, ADA National Network, college disability stats
- **Signal**: 40M+ affected (15-17M students + 27-30M workers with disabilities). 25% of workers with disabilities have unmet accommodation needs. Only 37% of disabled students disclose to college.
- **Current solutions**: JAN (Job Accommodation Network) is phone/email only, not AI. No free interactive tool for accommodation request guidance, documentation help, or ADA rights analysis.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | TAM: 4 (40M+ affected) | Composite: 24
- **Status**: queued

### Rejected Ideas (this round)

| Idea | Reason | TAM |
|------|--------|-----|
| Medical billing error analyzer | GAP: 0 — OrbDoc, MedAudit, MedBill Analyzer, ClearBill, ChatGPT all free | 4 |
| Surprise medical bill dispute | GAP: 0 — No Surprises Act (2022) solved most cases; CMS help desk exists | 2 |
| Gig worker tax advisor | GAP: 0-1 — too close to freelancer-deduction-finder already built (#10) | 4 |
| Inheritance/probate navigator | TAM: 1-2 — only 2.8M deaths/year, most don't need complex probate | 1 |
| Nursing home quality advisor | TAM: 2-3 — only 1-2M annual admissions; CMS Nursing Home Compare exists | 2 |
