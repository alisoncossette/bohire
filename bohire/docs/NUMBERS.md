# BoHire — Numbers

> Last updated: March 2026. All figures in USD. Conservative assumptions unless noted.

---

## Market Size

### TAM — Global Recruitment Market
- Global staffing & recruitment industry: **~$700B** (2025, Staffing Industry Analysts)
- HR technology software slice: **~$40B** (SaaS/tech tools for hiring)
- Verified identity + skills assessment sub-market: **~$8B** and growing 22% YoY
- AI-driven talent intelligence: projected **$15B by 2028**

**BoHire TAM: $8–15B** (verified skills / AI assessment layer of HR tech)

---

### SAM — US Knowledge Worker Hiring Market
- US staffing & recruitment: **~$180B** total
- US HR SaaS market: **~$12B**
- Target buyers: tech companies, startups, agencies hiring software engineers, designers, writers, analysts
- ~250,000 companies in the US hire knowledge workers regularly
- ~15,000 companies are likely early adopters (tech-forward, <5K employees, use ATS tools)

**BoHire SAM: ~$2.5B** (US knowledge worker hiring software spend)

---

### SOM — Realistic Capture

| Year | Paying Recruiters/Teams | ARR (base) | Market Share of SAM |
|------|------------------------|------------|---------------------|
| Y1   | 120                    | $420K      | 0.017%              |
| Y2   | 600                    | $2.4M      | 0.096%              |
| Y3   | 2,000                  | $9M        | 0.36%               |
| Y4   | 6,000                  | $28M       | 1.1%                |

These are achievable. Jack & Jill hit 49K candidates in 6 months with $20M. We're doing it on a fraction of the budget, with a defensible moat.

---

## Revenue Model

### Pricing Tiers

| Tier       | Price/mo     | Target Buyer                          | Included                                          |
|------------|-------------|---------------------------------------|---------------------------------------------------|
| **Starter**  | $299/mo      | Small startup, 1-5 recruiters        | 50 bolo requests/mo, basic AI assessment, 1 seat |
| **Growth**   | $799/mo      | Growing company, 6-20 recruiters     | 200 bolo requests/mo, full AI scoring, 5 seats   |
| **Enterprise** | $3K–$15K/mo | Recruiting agency or large company  | Unlimited requests, API access, custom integrations, SSO |

- **Annual discount:** 15% off for annual commit
- **Candidates:** Always free. Forever. Non-negotiable.

### Revenue Mix Assumption (Base Case)
- Y1: 70% Starter, 25% Growth, 5% Enterprise
- Y2: 50% Starter, 35% Growth, 15% Enterprise
- Y3+: Shift toward Growth/Enterprise as agencies adopt

---

## Unit Economics (Recruiter Customers)

### Customer Acquisition Cost (CAC)
- **Bottom-up (self-serve):** ~$150–$300 CAC via Product Hunt, community, content
- **Sales-assisted (Growth):** ~$800–$1,500 CAC via outbound + demos
- **Enterprise:** ~$5,000–$15,000 CAC via direct sales + legal/procurement cycles

Blended CAC estimate:
- Y1: **$400** (mostly self-serve)
- Y2: **$600** (more sales-assisted)
- Y3: **$900** (Enterprise mix increases)

### Lifetime Value (LTV)

| Tier       | Monthly Revenue | Avg Retention | LTV         |
|------------|----------------|---------------|-------------|
| Starter    | $299            | 18 months     | $5,382      |
| Growth     | $799            | 24 months     | $19,176     |
| Enterprise | $6,000 avg      | 36 months     | $216,000    |

Blended LTV (Y1–Y2 mix): **~$8,000**

### LTV:CAC Ratio
- Y1 blended: **~20:1** (self-serve is extremely efficient)
- Y2 blended: **~13:1** (target >3:1 for healthy SaaS)

### Payback Period
- Starter self-serve: **~2 months**
- Growth sales-assisted: **~4–6 months**
- Enterprise: **8–12 months** (typical)

**Gross Margin:** 75–80% at scale (AI inference costs drop; infra scales)

---

## Revenue Projections

### Y1 — Pre/Post-Seed (First 12 Months)

| Quarter | Paying Teams | MRR (end) | ARR Run Rate |
|---------|-------------|-----------|--------------|
| Q1      | 15          | $6K       | $72K         |
| Q2      | 45          | $18K      | $216K        |
| Q3      | 85          | $35K      | $420K        |
| Q4      | 120         | $52K      | $624K        |

**Y1 Revenue (cash collected): ~$280K**

### Y1–Y4 Annual Projections

|        | Conservative | Base     | Optimistic |
|--------|-------------|---------|------------|
| **Y1** | $180K       | $280K   | $450K      |
| **Y2** | $900K       | $2.4M   | $4.5M      |
| **Y3** | $3.5M       | $9M     | $18M       |
| **Y4** | $10M        | $28M    | $55M       |

**Key assumptions (base):**
- 120 paying teams by end Y1, 2x–3x YoY growth
- Blended ARPU grows from ~$430/mo (Y1) to ~$600/mo (Y4)
- Net revenue retention >110% by Y2 (expansion from Starter → Growth)

---

## Headcount & Cost

### Year 1 Team (6 people)
| Role                        | Annual Comp (cash) | Notes                       |
|-----------------------------|--------------------|-----------------------------|
| Co-Founder / CEO            | $80K               | Below market, equity-heavy  |
| Co-Founder / CTO            | $80K               | Below market, equity-heavy  |
| Full-Stack Engineer         | $130K              | Hire Q2                     |
| AI/ML Engineer              | $140K              | Hire Q2                     |
| Growth / Candidate Acq.     | $90K               | Hire Q3                     |
| Recruiter Sales (outbound)  | $80K base + comm   | Hire Q3                     |

**Y1 Total Payroll:** ~$600K annualized (hiring staggered = ~$420K cash burn)

### Year 2 Team (14 people, +8 hires)
| New Roles                          | Est. Annual Cost |
|------------------------------------|-----------------|
| 3x Engineers (full-stack + infra)  | $390K           |
| Product Manager                    | $130K           |
| 2x Sales (growth + enterprise)     | $220K           |
| Designer (UX/brand)                | $100K           |
| Customer Success                   | $85K            |
| Operations / Legal                 | $90K            |

**Y2 Total Payroll:** ~$1.9M

### Burn Rate (excluding revenue)

| Year | Monthly Burn (gross) | Annual Burn (gross) |
|------|---------------------|---------------------|
| Y1   | ~$75K               | ~$900K              |
| Y2   | ~$175K              | ~$2.1M              |

Infra/AI costs estimated at ~$8K/mo Y1, ~$25K/mo Y2.

---

## Runway Scenarios

### Raise: $1M Pre-Seed
- Gross burn: ~$75K/mo → **~13 months runway**
- Revenue offsets by Month 6: ~$15K/mo → effective burn ~$60K/mo → **~17 months**
- Enough to hit: 120 paying teams, seed traction, next raise

### Raise: $3M Seed
- Gross burn Y1: ~$75K/mo, Y2: ~$175K/mo
- Revenue by M18: ~$100K/mo
- Net burn ~$75K/mo at M18
- **~28–32 months runway** toward Series A at $9M ARR pace
- Enough to hit: $2M ARR, 500+ paying teams, full SF → NYC expansion

### Raise: $5M Seed
- Extends runway to **36+ months** with accelerated hiring
- Enables enterprise sales motion in Y2, API partnerships, agency deals
- Targets $5M ARR by end of Y3 → strong Series A ($20–30M at 6–8x ARR)

---

## Why These Numbers Are Defensible

- Jack & Jill: $20M seed, 49K candidates in 6 months — proves demand exists
- SeekOut raised $115M at $1.2B val — market rewards verticalized talent intelligence
- LinkedIn Recruiter: $500M+ ARR — proof that recruiters pay for access to talent supply
- BoHire has a **unique moat**: World ID verification + permission layer + actual code analysis. No competitor can replicate this without rebuilding from scratch.
- $299/mo is impulse-buy pricing for any recruiter who's been ghosted by a fake resume once.
