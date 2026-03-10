# Regulatory Compliance Briefing Agent

An AI agent that generates personalized regulatory compliance briefings for small businesses. Tell it your business type, state, and size, and it researches applicable federal, state, and local regulations — producing a prioritized report with deadlines, penalties, and action items.

**36.2 million US small businesses** face an overwhelming regulatory landscape. Most don't have legal counsel and don't know what regulations apply to them. This agent fills the gap between the generic guidance on SBA.gov and expensive compliance services ($99-199+).

## Who Is This For?

- Small business owners starting a new venture
- Existing businesses expanding to a new state
- Entrepreneurs unsure what licenses and permits they need
- Business owners who want to check they're not missing obligations
- Anyone asking "what regulations apply to my business?"

## What It Does

```
You: "I'm opening a small restaurant in Austin, Texas with 12 employees."

Agent: *searches Texas restaurant regulations*
       *fetches state health department requirements*
       *researches federal employment law thresholds*
       *checks recent regulatory changes*

Output: A comprehensive compliance briefing covering:
        - Texas food establishment license requirements
        - TABC alcohol permit (if applicable)
        - Federal FLSA, OSHA, ADA requirements for 12 employees
        - IRS employment tax obligations
        - Austin-specific health permits and inspections
        - Upcoming deadlines and action items
```

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> regulatory-compliance-briefing
cd regulatory-compliance-briefing
npm install

# 2. Configure
cp .env.example .env
# Edit .env — set PROVIDER, MODEL, and API key

# 3. Run
npm run dev
# Open http://localhost:3000
```

## Tools

| Tool | What It Does |
|------|-------------|
| `search_regulations` | Searches for federal, state, and local regulations by business type + location |
| `fetch_regulatory_details` | Fetches government/regulatory pages and extracts specific requirements |
| `write_compliance_briefing` | Generates a prioritized compliance report saved to `output/` |
| `web_search` | General web search for supplementary regulatory info |
| `web_fetch` | Fetches any web page for detailed content |

## What It Covers

### Federal
- IRS tax obligations (EIN, quarterly taxes, 1099 thresholds, employment tax)
- Employment law (FLSA, FMLA, ADA, EEOC, OSHA, I-9)
- Corporate Transparency Act (BOI reporting)
- Industry-specific (FDA, FTC, HIPAA, PCI-DSS, EPA)

### State
- Business registration and licenses
- State tax obligations (income, sales, franchise)
- Employment laws (minimum wage, paid leave, workers' comp)
- Industry-specific licenses and permits
- State privacy laws (CCPA, etc.)

### Local
- City/county business licenses
- Zoning compliance
- Health department permits
- Fire inspections

## Example Prompts

- "I'm starting a daycare center in California with 5 employees."
- "I run an ecommerce store from Florida, no employees, selling nationwide."
- "I'm opening a construction company in New York with 25 employees."
- "What federal regulations apply to a SaaS company with 50 employees?"

## Limitations

- **Not legal advice.** This is educational guidance. Consult an attorney for your specific situation.
- **Regulatory landscapes change constantly.** Requirements researched in real-time but may lag updates.
- **Cannot guarantee completeness.** Complex businesses (healthcare, finance, food manufacturing) should consult specialized compliance professionals.
- **Federal focus with state coverage.** Local (city/county) requirements are less comprehensive.

## Architecture

```
User describes business
        |
        v
+---------------------+
|  search_regulations  | --> Find applicable federal + state regulations
+----------+----------+
           v
+-------------------------+
| fetch_regulatory_details | --> Extract specifics from government pages
+----------+--------------+
           v
+---------------------+
|  web_search/fetch    | --> Cross-reference recent changes
+----------+----------+
           v
+----------------------------+
| write_compliance_briefing   | --> Prioritized report with deadlines + action items
+----------------------------+
```

## License

MIT
