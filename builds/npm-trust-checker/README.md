# npm Trust Checker

An AI agent that assesses the trustworthiness of npm packages before you install them. Checks registry data, GitHub repo health, known vulnerabilities, and malicious behavior reports — all in one prompt.

## Why This Exists

**In 2025, the Shai-Hulud worm backdoored 796 npm packages with 20 million weekly downloads.** Supply chain attacks are the #1 threat to JavaScript developers. Typosquatting, dependency confusion, and malicious install scripts are rampant.

`npm audit` only catches known CVEs after installation. Socket.dev costs money. npq is CLI-only. There's no simple web tool where you can type a package name and get a trust assessment before you run `npm install`.

## How It Works

```
"Should I install this-package?"
        |
        v
+---------------------+
|  1. REGISTRY CHECK  |  Downloads, versions, maintainers,
|  check_npm_registry  |  age, license, install scripts
+---------+-----------+
          |
          v
+---------------------+
|  2. SECURITY ASSESS |  CVEs, malware reports, GitHub
|  assess_security     |  repo health, community signals
+---------+-----------+
          |
          v
+---------------------+
|  3. TRUST REPORT    |  Score (1-10), risk factors,
|  write_trust_report  |  recommendation, alternatives
+---------------------+
        |
        v
   Trust report in ./output/
```

## What It Checks

| Category | What's Checked |
|----------|----------------|
| **Registry** | Weekly downloads, version count, age, maintainer count, license |
| **Risk Signals** | Install scripts, single maintainer, no repo URL, very new |
| **Security** | Known CVEs, malware reports, typosquatting alerts |
| **GitHub** | Stars, last push, archived status, community activity |
| **Community** | Reviews, recommendations, alternatives mentioned |

## Trust Scale

| Score | Meaning |
|-------|---------|
| 8-10 | Highly trusted — widely used, well-maintained |
| 5-7 | Moderate trust — looks okay, do basic diligence |
| 3-4 | Low trust — significant concerns, review carefully |
| 1-2 | Dangerous — do not install without manual audit |

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> npm-trust-checker
cd npm-trust-checker
npm install

# 2. Configure
cp .env.example .env
# Edit .env — set PROVIDER, MODEL, and API key

# 3. Run
npm run dev
# Open http://localhost:3000
```

## Example Prompts

- "Should I install left-pad?"
- "Is the package event-stream safe to use?"
- "Check the trust level of this package: colors"
- "I want to install a package called super-fast-json. Is it legit?"

## Output

Trust reports are saved to `./output/` as markdown with:
- Trust score (1-10) with color coding
- Risk factors and positive signals
- Security findings (CVEs, malware reports)
- Pre-install checklist
- Alternative packages if risky

## Built On

[Agentic Harness](https://github.com/your-org/agentic-harness) — a minimal, self-hosted AI agent framework with tool use and streaming.

## License

MIT
