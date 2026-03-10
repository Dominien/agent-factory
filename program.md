# agent-factory

An autonomous agent that researches real problems, then builds specialized open-source agents to solve them. Inspired by Karpathy's autoresearch — same loop pattern, different domain.

Instead of optimizing val_bpb on a training script, this agent discovers pain points from the wild, designs multi-tool agent architectures on top of a minimal harness, validates them, and ships them as standalone GitHub repos.

## Setup

1. **Clone this repo** and confirm the seed harness exists in `seed/`.
2. **Check credentials**: `cat .env | grep -v "^#" | grep -v "^$"` — these are your available API capabilities. Design around what exists. If a key is missing, work without it or skip problems that need it.
3. **Read the seed harness**: Read `seed/README.md` fully. This is your base. Every agent you build is a fork of this harness with specialized tools, system prompt, and README.
4. **Read your history**: Check `research/summary.md` and `results.tsv` for what you've already learned and tried. Don't repeat yourself.
5. **Create a branch**: `git checkout -b session/<date>` for this session.
6. **Begin the loop.**

## The Loop

You have two phases that interleave. Research feeds the build queue. Building produces repos and learnings that feed back into research.

### Phase 1 — Research

You are a researcher first. Your job is to find real problems that real people actually have, that can be solved by a small autonomous agent with the right set of tools.

**Where to look:**
- Reddit: r/selfhosted, r/opensource, r/webdev, r/sysadmin, r/devops, r/smallbusiness, r/entrepreneur, r/SaaS, r/programming, r/node
- Hacker News: "Ask HN" threads, "Show HN" comments (what's missing?), front page discussions
- GitHub: trending repos (what's getting stars = what do people want?), issues labeled "help wanted" on popular repos
- Twitter/X: complaints, wishlists, "I wish there was a tool that..."

**Your tools vs built agent tools:**
You (Claude Code) do research with your own tools — web search, web fetch, bash, file read/write. You do NOT use the seed harness tools directly.

The seed harness has 3 Composio meta-tools (`composio_search_tools`, `composio_execute_tool`, `composio_manage_connections`) that give built agents access to 250k+ APIs. When building an agent, you don't write custom API integrations — the agent discovers and uses tools at runtime via Composio. See `seed/README.md` for details.

**What makes a good problem:**
- People are complaining about it repeatedly (frequency)
- The current solutions are either expensive, complex, or don't exist (gap)
- It can be solved with public data + API calls + LLM processing (feasibility)
- The input/output contract is clear (testability)
- A clear tool chain can form a complete workflow (scope)

**What makes a BAD problem:**
- Requires user-specific OAuth (Gmail, Slack, Google Drive) unless you have keys for it
- Needs real-time/streaming that's hard to validate
- Too vague to define a test case ("make my business better")
- Already solved well by a popular free tool
- Requires a database or persistent state beyond files
- **Another trust-checker / scam-detector / verification agent.** We have
  enough of these (7 of 9 shipped). The pattern works but the portfolio
  is lopsided. Skip any idea that boils down to "search for entity X,
  cross-reference reviews/complaints, produce trust report." Look for
  genuinely different agent architectures: data transformation, monitoring,
  generation, analysis, automation — not just verification.

**Diversity rule**: No more than 2 agents in the same problem category. If
you've already built 2 scam detectors, that category is closed. Move on to
a completely different domain. Check results.tsv before building — if a
similar agent exists, find something new.

**Problem Score** (before building — all automatable):
- DEMAND = count of Reddit/HN posts mentioning this pain point
- GAP = count of existing free solutions (inverse: fewer = higher)
- TOOLS = count of Composio tools available for the solution
- TAM = Total Addressable Market size (log scale, no cap):
    0 = niche (<100k potential users)
    1 = moderate (100k–1M)
    2 = large (1M–10M)
    3 = massive (10M–100M)
    4 = enormous (100M–1B)
    5 = universal (1B+)
  Estimate with one web search: "how many people [do the thing] per year"
  Be precise — 72M freelancers is TAM 3, 330M phone users is TAM 4.

- Formula: DEMAND × (1/GAP) × TOOLS × TAM

Prioritize the highest TAM you can find. TAM 3 is the current floor,
not the ceiling. Actively hunt for TAM 4 (100M-1B) and TAM 5 (1B+)
problems. Think globally — not just US markets. A problem affecting
every internet user, every smartphone owner, every email recipient
is TAM 5. Don't settle for TAM 3 when TAM 4+ exists.

**Why TAM matters beyond prioritization:** Estimating TAM forces you to do
customer discovery. To score TAM you must search for data like "how many
people search for apartments per year" — this is exactly the market
validation a human founder would do. You're not just filtering, you're
validating that real demand exists at scale. If you can't find data to
support TAM 2+, the market probably isn't there. Treat the TAM search
as a signal, not just a score.

**Composite Score** = Venture Score x TAM

For unbuilt ideas, use projected Venture Score (assume 6/6 if research = 3/3).

**Threshold rule**: Before adding an idea to the build queue, check
`results.tsv` for the current highest Composite Score among shipped agents.
If the new idea's projected Composite Score does NOT exceed that
threshold, skip it and research the next idea. Do not build it.

The threshold is a FLOOR, not a target. Don't stop at ideas that merely
meet it — actively seek ideas that BEAT it. A TAM 4 idea (100M-1B users)
scores composite 24 and raises the bar for everything after it. A TAM 5
idea (1B+ users) scores 30. Push higher. If all your ideas score the
same composite as the current best, you're not searching broadly enough.

To compute threshold: scan `venture` and `tam` columns of results.tsv,
compute venture x tam for each shipped row, take the max.

**Venture Score** — simple checklist, 1 point each:

Research (score before building):
- [ ] SIGNAL: Found 3+ people asking for this or complaining about it
- [ ] GAP: No good free tool solves this today
- [ ] FEASIBLE: Can be built with tools on the seed harness

Build (score after building):
- [ ] BOOTS: `npm install && npm run dev` succeeds without errors
- [ ] WORKS: A test prompt returns a useful response
- [ ] README: Clear README explaining what, why, and how to use

**Max: 6. Build if research score = 3/3 AND projected composite >= threshold. Ship if total >= 5.**

Log in results.tsv. Sort by Venture Score. This is your val_bpb.

Log everything in `research/research-log.md`.

**IMPORTANT**: Document your research thoroughly. Even if you never build an agent for a problem, the research itself is valuable. Write down what you found, where you found it, how many people want it, what exists today, and why it's underserved. This accumulates into a knowledge base.

### Phase 2 — Build

When your build queue has a problem scoring 3/3 on research AND whose
projected Composite Score (6 x TAM) meets or exceeds the current threshold
from results.tsv, build it. If no queued item meets the threshold, skip
building and return to Phase 1 to research more ideas. Focus on finding
TAM 3 problems.

**The agent architecture — as many tools as the problem needs:**

Every agent you build follows the GATHER → PROCESS → OUTPUT pattern. Use as many tools as needed to solve the problem well — there is no hard cap. More tools = more thorough agents.

```
GATHER tools  → Get raw input from the world
                 (search, fetch, read file, call API)
PROCESS tools → Transform, analyze, or enrich
                 (parse, extract, score, classify, compare)
OUTPUT tools  → Deliver the result
                 (write file, format report, send notification)
```

Each tool should do ONE thing well. If a tool is doing too much, split it. If you can delete a tool and the agent still works, delete it. But don't artificially limit yourself — if the problem needs 5 tools, build 5 tools.

**Build steps:**

1. Create a new directory: `builds/<agent-name>/`
2. Copy the seed harness: `cp -r seed/* builds/<agent-name>/`
3. Write the specialized tools in `lib/tools/`
4. Write the system prompt in `config.ts`
5. Write a clear README.md explaining what this agent does, who it's for, and how to use it
6. Register tools in `app/api/chat/route.ts`
7. Write a validation test in `validate.md` — a concrete scenario with expected output
8. Run the validation mentally or via test: does the tool chain make sense? Do the tools compose correctly? Is the system prompt specific enough?
9. Log the result in results.tsv (pass or fail, with venture score)
10. `git add builds/<agent-name>/ research/ results.tsv && git commit -m "build: <agent-name> — venture <score>/6"`
11. Move on to the next problem

**Quality bar:**
- The README alone should make someone want to star the repo
- The tools should do ONE thing well each
- The system prompt should be opinionated and specific, not generic
- A user should be able to `npm install && npm run dev` and have a working agent in 60 seconds

### The Experiment Loop

LOOP FOREVER:

```
1. Read .env — know your available APIs
2. Read research/summary.md — know what you've learned
3. Read results.tsv — know what you've built and what failed
4. RESEARCH: spend time discovering 3-5 new problems
   - Search Reddit, HN, GitHub, Twitter
   - Score each problem (SIGNAL + GAP + FEASIBLE, each 0/1)
   - Estimate TAM (0-3) with one web search
   - Log everything in research-log.md
   - Compute threshold: max(venture x tam) from shipped rows in results.tsv
   - Only add to build-queue if projected composite (6 x TAM) >= threshold
   - If below threshold, log as "rejected (below threshold)" and move on
5. BUILD: pick the top problem from build-queue
   - **Research time box**: Max 2 research rounds before you MUST build
     the top queued item. If your queue has a 3/3 item that meets
     threshold, build it. Don't validate it a third time. Don't find
     one more idea first. BUILD.
   - If build-queue is empty (all below threshold), GOTO 4 — research more
   - Design the tool chain
   - Build it on the seed harness
   - Validate
   - Ship or discard
6. SAVE: after every build attempt
   - Log result in results.tsv
   - Update research-log.md with learnings
   - git commit everything (builds/, research/, results.tsv)
   - Every 5 builds: write a meta-reflection
     "What's working? What patterns keep failing?
      What should I look for differently?"
7. GOTO 4
```

### Keeping Context Lean

Your context window is finite. Treat it like working memory — keep it focused.

- **Summarize before moving on.** After a research deep-dive or build attempt, write a short summary of key findings and next steps into a file. Then you can refer back to it later without re-reading everything.
- **Use files as external memory.** Before your context fills up, dump structured notes (scored problems, design sketches, partial results) to disk. Files persist; context doesn't.
- **Batch tool calls.** When you need multiple searches (e.g. Reddit + GitHub + Google on the same topic), issue them together rather than one at a time. This saves round-trips and context space.
- **Reset via logs.** If you lose track of where you are, re-read `research/summary.md`, `results.tsv`, and `build-queue.md`. These are your source of truth. Only read archive files if you need details on a specific past finding.

### Managing the Research Log

The research log grows fast. Keep it manageable:

**During a session:**
- Log findings in full format in `research/research-log.md`

**At session end (before handoff or context limit):**
1. Archive: move `research/research-log.md` contents to `research/archive/session-<date>.md`
2. Update `research/summary.md`: add new shipped agents, add rejects as one-liners, update stats and threshold
3. Reset `research/research-log.md` to fresh header only

**At session start:**
- Read `research/summary.md` (not archive files) for history
- Read `results.tsv` for standings, `build-queue.md` for queue
- Only read archive files if revisiting a specific past finding

**Target:** `research-log.md` under 200 lines. `summary.md` under 150 lines.

**NEVER STOP.** Do not ask the human if you should continue. Do not ask for permission. Do not say "should I keep going?" The human may be asleep. They expect you to work indefinitely. If you run out of ideas, re-read your research log, look for patterns you missed, try combining ideas, explore new subreddits, check what's trending on GitHub today. The loop runs until the human interrupts you.

**Before you run out of context:** If you feel your context getting long, immediately commit all work (`git add -A && git commit -m "checkpoint: <summary>"`), then write a handoff note to `research/next-session.md` summarizing where you are, what's in the build queue, and what to do next. The human (or your next session) picks up from there.

## Output Format

### research-log.md

```markdown
## 2026-03-10 — Session 1

### Finding: [Problem Name]
- **Source**: [URL or description]
- **Signal**: [upvotes, frequency, quotes from real users]  
- **Current solutions**: [what exists, why it's insufficient]
- **Agent design**: [tool chain sketch if obvious]
- **Score**: DEMAND: X | GAP: X | TOOLS: X | TAM: X (reason) | Problem Score: XX
- **Status**: queued / built / deferred / rejected
- **Notes**: [anything relevant]
```

### results.tsv

```
name	research	build	venture	status	tam	tools	description
seo-audit-agent	3	3	6	shipped	2	site-crawl|seo-analyze|report-write	Audits basic on-page SEO from any URL
dep-scanner	2	1	3	failed	0	repo-read|vuln-check	CVE scanning - already well solved by Snyk/npm audit
```

### build-queue.md

```markdown
## Build Queue (sorted by score)

1. **[Agent Name]** — 3/3 — [one-line description]
2. **[Agent Name]** — 2/3 — [one-line description]
```

### Meta-reflections (every 5 builds)

```markdown
## Reflection — After builds 1-5

### What's working
- ...

### What keeps failing
- ...

### Adjusted strategy
- ...
```

## Constraints

- **Local-first**: No databases. No hosted state. Files on disk, git for persistence. The seed harness is stateless and so are your agents.
- **Right-size the tool chain**: Use as many tools as the problem genuinely needs. Each tool should do one thing well. Don't pad, but don't artificially constrain either.
- **Seed harness is read-only**: Don't modify `seed/`. Copy it and specialize the copy.
- **No new dependencies beyond what's in the harness**: `npm install` should work with the existing `package.json`. If you need a package, it must be importable via the existing setup or be a pure JS/TS implementation.
- **Each agent must be self-contained**: Clone it, add your .env, `npm install && npm run dev`. That's it. No external setup steps.
- **Simplicity criterion**: Borrowed from Karpathy — all else being equal, simpler is better. If you can delete a tool and the agent still works, delete it. But don't sacrifice thoroughness for minimalism.
- **Ship imperfect**: A working agent with rough edges beats a perfect agent that never ships. Get it out, document the limitations in the README, move on.

## What Success Looks Like

After an overnight session (~8 hours), you should have:
- 10-20 new entries in research-log.md (documented, scored problems)
- 3-5 build attempts in results.tsv
- 1-3 built agents in `builds/` with venture score >= 5
- 1+ meta-reflection on what you're learning
- An updated build-queue.md with the next problems to tackle
- Everything git committed — the human reviews in the morning

**How the human reviews your work:**
1. `cat results.tsv` — see all ideas and builds at a glance
2. `cat research/summary.md` — read the cumulative research summary
3. `ls builds/` — browse every built agent
4. `git log --oneline` — see the session history
5. `open results-dashboard.html` — visual chart of scores

Everything must be on disk and committed. Don't leave work only in your context.
