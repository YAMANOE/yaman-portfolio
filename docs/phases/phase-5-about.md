# Phase 5 — About page

**Goal:** one page that serves a recruiter, an admissions committee, and a client.

**Depends on:** Phase 0. Can run in parallel with Phase 2.

## Files you own

```
about.html
assets/about.css
data/profile.json
```

## Blocks

1. **Bio** — photo, five or six sentences. Who, where, what he builds.
2. **Now** — AI/ML Engineer in the 9xAI Program at HTU, working on government
   civic technology.
3. **Academic** — BSc Data Science and AI, Yarmouk University, 2025. Graduation
   project. The formal report delivered to a Jordanian government office. Research
   interests, written as a short paragraph. This block exists for master's
   applications and must read as serious, not decorative.
4. **Skills** — four plain lists: ML and deep learning, data, backend and
   full-stack, tools and deployment.
5. **Languages** — Arabic native, English professional.
6. **Contact** — email, LinkedIn, GitHub, CV download.

## Do

- Move identity content out of HTML into `data/profile.json`, same pattern as
  `data/projects.json`.
- Keep the bio under 120 words.

## Do not

- **No skill percentage bars, star ratings, or radar charts.** Nobody believes
  "Python 87%" and it reads as junior.
- No certificate wall. Three maximum, and only if they carry weight.
- No timeline of every course taken.

## Done when

- [ ] Every block renders from `data/profile.json`.
- [ ] The academic block reads as credible to an admissions reader.
- [ ] The CV link resolves.
- [ ] No skill is rendered as a percentage or a rating.

## Paste this to the agent

> Read AGENTS.md. Do Phase 5 from docs/phases/phase-5-about.md. Build about.html
> driven by a new data/profile.json. No skill bars, no ratings.
