# Research Log

Ongoing record of problems discovered, scored, and evaluated for the agent-factory pipeline.

---

## 2026-03-10 — Session 1

### Finding: Job Posting Scam Detector
- **Source**: Reddit (r/jobs, r/scams), FlexJobs survey, Indeed career advice, Hacker News
- **Signal**: 4 in 10 Americans received job scam texts in 2025 (Resume.org survey). LinkedIn job scams surging in 2026. AI-generated fake postings increasingly sophisticated. Constant complaints on Reddit about fake listings.
- **Current solutions**: Norton Genie (generic scam detector, not job-specific). Resumly AI (paid). Manual checklist articles. No free, focused, AI-powered job posting analyzer.
- **Agent design**: Tool 1 (GATHER): web_fetch to grab job posting page. Tool 2 (PROCESS): web_search to verify company existence, check domain, find reviews. Tool 3 (OUTPUT): file_write risk report with specific red flags.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | Total: 3/3
- **Status**: built (venture 6/6)
- **Notes**: Broad audience. Emotional appeal. Very testable — paste a URL, get a risk score. Red flags: vague descriptions, unrealistic salary, grammar issues, missing company info, generic email domains, payment requests. BUILD: TypeScript clean, Next.js build passes. 3 specialized tools: fetch_job_posting, verify_employer, generate_risk_report.

### Finding: Dependency Changelog Summarizer
- **Source**: DEV Community, npm/Renovate docs, HN developer tool wishes
- **Signal**: "Updating packages leads to questioning career choices at 2 AM." Developers miss breaking changes constantly. Dependabot/Renovate create PRs but don't summarize what changed.
- **Current solutions**: Dependabot (creates PRs, no summaries). Renovate Bot (same). Manual changelog reading. GitHub releases page (per-repo visits).
- **Agent design**: Tool 1 (GATHER): file_read package.json, web_fetch GitHub release notes. Tool 2 (PROCESS): Summarize changelogs, highlight breaking changes, rate urgency. Tool 3 (OUTPUT): file_write structured update report.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | Total: 3/3
- **Status**: built (venture 6/6)
- **Notes**: Clear gap vs existing tools. Dependabot tells you WHAT to update, not WHY or what breaks. Works with any package manager. BUILD: TypeScript clean, Next.js build passes. 3 tools: scan_dependencies, fetch_changelogs, write_update_report.

### Finding: GitHub Repo Health Scanner
- **Source**: GitHub topics (readme-score), NxCode tool, HN discussions
- **Signal**: Developers evaluate repos before adopting. Common: Is it maintained? Good docs? Active community? Responsive to issues?
- **Current solutions**: NxCode web tool (limited). GitHub Code Quality (preview, own repos only). readme-score (outdated). Manual evaluation (slow).
- **Agent design**: Tool 1 (GATHER): web_fetch GitHub repo page + API. Tool 2 (PROCESS): Score health (README, commits, issues, stars, license, CI). Tool 3 (OUTPUT): file_write health report.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | Total: 3/3
- **Status**: built (venture 6/6)
- **Notes**: Useful for any developer evaluating dependencies. Also for maintainers improving their repos. BUILD: TypeScript clean, Next.js build passes. 3 tools: fetch_repo_info, analyze_community, write_health_report.

### Finding: Landing Page Copy Auditor
- **Source**: Reddit (r/webdev, r/entrepreneur), HN, indie hacker communities
- **Signal**: Common pain — people want landing page feedback.
- **Current solutions**: Roastd.io (free). NxCode (free tier). Multiple free options emerging.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: deferred
- **Notes**: Gap closing fast. Roastd.io already does this well for free.

### Finding: Content Repurposer (Blog to Social)
- **Source**: Reddit marketing communities, Sprout Social
- **Signal**: 94% of marketers repurpose content.
- **Current solutions**: Planable (free, unlimited). Repurpose.io. Many free options.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Market saturated. Planable offers this free and unlimited.

### Finding: TOS/Privacy Policy Change Monitor
- **Source**: VentureBeat, TechCrunch, general web
- **Signal**: People care when TOS changes but specific tool request is niche.
- **Current solutions**: Visualping (general). TOSBack (shut down). No focused free tracker.
- **Score**: SIGNAL: 0 | GAP: 1 | FEASIBLE: 1 | Total: 2/3
- **Status**: deferred
- **Notes**: Gap exists but signal is weak.

### Finding: Freelance Contract Red Flag Reviewer
- **Source**: HN, Reddit freelancer communities
- **Signal**: Freelancers worry about contracts. Commercial tools expensive.
- **Current solutions**: Spellbook, Ironclad, goHeather (all expensive/enterprise).
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Doesn't leverage tools — just LLM text analysis. Base harness already does this.

---

## 2026-03-10 — Session 1 (Round 2)

### Finding: Company Briefing Generator (Interview Prep)
- **Source**: Reddit (r/jobs, r/cscareerquestions), The Interview Guys, Ohio State career services, Scale.jobs
- **Signal**: Every job seeker needs to research companies before interviews. Multiple guides (OSU, InterviewGuys) confirm this is standard advice. Reddit career communities constantly discuss this. People manually check 5-6 sources (website, Glassdoor, Crunchbase, news, LinkedIn, funding).
- **Current solutions**: Manual research (tedious, 15-20 min per company). No automated "one-click company briefing" tool exists. Glassdoor gives reviews but not a complete briefing. Crunchbase gives funding but requires account.
- **Agent design**: Tool 1 (GATHER): web_fetch company website + careers page. Tool 2 (PROCESS): web_search for Glassdoor reviews, recent news, funding, key people, culture. Tool 3 (OUTPUT): file_write one-page briefing with talking points.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | Total: 3/3
- **Status**: built (venture 6/6)
- **Notes**: Great companion to job-scam-detector. Same audience (job seekers). Extremely practical — saves 15-20 min of manual research per interview. Output is immediately usable.

### Finding: Startup Idea Validator
- **Source**: ValidatorAI, IdeaProof, FounderPal, DimeADozen, Reddit indie hacker communities
- **Signal**: Very high demand from indie hackers and entrepreneurs.
- **Current solutions**: ValidatorAI (free), IdeaProof (free), FounderPal (free), DimeADozen (free). Market is saturated with free tools.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: At least 5 free tools already do this well. No differentiation possible.

### Finding: Brand Mention Monitor
- **Source**: Reddit, Gumloop blog, marketing communities
- **Signal**: Small businesses want to track brand mentions.
- **Current solutions**: Google Alerts (free), Octolens, Alertly, Awario, BrandMentions. Well-served market.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Google Alerts is free and sufficient for most use cases.

### Finding: Email Deliverability Checker
- **Source**: Various spam check tool websites
- **Signal**: Email marketers care about deliverability.
- **Current solutions**: mail-tester.com, MailGenius, TestMailScore, IPQS, Unspam.email — all free.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Extremely well-served. 10+ free tools exist.

### Finding: Accessibility Audit Agent
- **Source**: W3C, AccessibilityChecker.org, WCAG compliance guides
- **Signal**: High regulatory pressure (European Accessibility Act June 2025, US gov April 2026).
- **Current solutions**: AccessibilityChecker.org, WAVE, axe, accessScan — many free tools.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Strong signal but gap is zero. Many mature free tools.

---

## Meta-Reflection — After builds 1-4

### What's working
- **GATHER → PROCESS → OUTPUT pattern is reliable.** Every agent follows the same 3-tool structure and it maps cleanly to real workflows.
- **Web search + web fetch is powerful.** DuckDuckGo HTML search + Readability content extraction cover most information-gathering needs without API keys.
- **Job seeker tools have high emotional appeal.** The job-scam-detector and company-briefing-agent are in the same "job seeker toolkit" and both generate README-worthy excitement. People FEEL the pain.
- **Developer tools build fast.** The dep-changelog-summarizer and repo-health-scanner use public APIs (npm, GitHub) that are well-structured and easy to parse.
- **Build process is smooth.** Copy seed, write 3 tools + config + route + README, type-check, build. Under 15 minutes per agent.

### What keeps failing
- **Most ideas are already well-served.** Out of 12 problems researched, only 4 had a real gap. The majority are saturated: landing page auditors, content repurposers, email spam checkers, business name generators, accessibility auditors, startup validators. Free tools are everywhere.
- **Reddit-specific tools are risky.** GummySearch shut down because Reddit denied API access. Any agent relying on Reddit data faces the same risk.
- **"Just LLM analysis" agents don't need the harness.** The contract reviewer idea failed because it's just text in → text out. The harness adds value when the TOOLS gather external data.

### Adjusted strategy
- **Focus on problems where data gathering is the bottleneck.** The harness excels when the agent needs to fetch from multiple web sources, cross-reference, and synthesize. Pure text analysis can be done in any chatbot.
- **Look for "compound search" problems.** Where someone would normally open 5+ tabs to research something, that's the sweet spot. Both the company-briefing and job-scam-detector hit this.
- **Explore B2B / developer tooling more.** The repo-health-scanner and dep-changelog-summarizer have the clearest tool utility. More developer-facing agents might score well.
- **Consider agents that use the GitHub API specifically.** It's free, well-documented, and data-rich. More can be built on top of it.
- **Try a different domain next.** 2 of 4 agents are job-seeker tools. Diversify into SaaS/business intelligence or developer ops.

---

## 2026-03-10 — Session 1 (Round 3)

### Finding: npm Package Trust Checker
- **Source**: Veracode blog, Shai-Hulud worm analysis, OWASP npm security cheat sheet, BrightCoding audit playbook, HackerNews
- **Signal**: Malicious npm packages surged to 2,168 reports in 2024, Snyk found 3,000+ in 2024 alone. Shai-Hulud worm (Sep+Nov 2025) backdoored 796 packages with 20M weekly downloads. CISA issued an alert. Typosquatting is rampant (@acitons/artifact got 206K downloads). Supply chain security is a top developer concern.
- **Current solutions**: npm audit (post-install only, CVEs only). npq (CLI, blocks on heuristics but requires install). Socket CLI (paid for teams). Snyk (free tier limited). OSSF Scorecard (GitHub-focused, complex). No simple "paste a package name, get a trust report" web tool.
- **Agent design**: Tool 1 (GATHER): Fetch npm registry data (downloads, versions, maintainers, publish dates). Tool 2 (PROCESS): Search for CVEs, check GitHub repo health, look for malicious behavior reports. Tool 3 (OUTPUT): Write a trust report with score and install recommendation.
- **Score**: SIGNAL: 1 | GAP: 1 | FEASIBLE: 1 | Total: 3/3
- **Status**: built (venture 6/6)
- **Notes**: Extremely timely given recent supply chain attacks. Developer-focused (diversifies from job-seeker tools). Uses both npm registry API and GitHub API — perfect for the harness.

### Finding: GitHub Issue Triage Agent
- **Source**: GitHub Agentic Workflows (Jan 2026), Dosu.dev, Probot, GitHub Docs
- **Signal**: Maintainers report 50-100 emails daily. Issue triage is a major pain.
- **Current solutions**: GitHub just launched AI issue triage workflow (Jan 2026). Dosu.dev automates this. Probot has a triage app. Multiple solutions emerging fast.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: GitHub's own AI triage launched in Jan 2026. Gap closed. Too many competitors entering.

### Finding: Twitter Thread Unroller
- **Source**: UnrollNow, ThreadReader, etc.
- **Signal**: Common need.
- **Current solutions**: UnrollNow, ThreadReader, PingThread, Twittethread, Xunroll — all free.
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: rejected
- **Notes**: Extremely well-served. 10+ free tools.

### Finding: arXiv Paper Summarizer
- **Source**: Emergent Mind, HN Show HN posts
- **Signal**: Researchers and developers want simplified paper explanations.
- **Current solutions**: Emergent Mind (free), semantic arXiv search tools, ChatGPT (general).
- **Score**: SIGNAL: 1 | GAP: 0 | FEASIBLE: 1 | Total: 2/3
- **Status**: deferred
- **Notes**: Emergent Mind does this well. Could revisit with a more specific angle (e.g., "explain this paper for a product manager").
