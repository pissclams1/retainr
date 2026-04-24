# retainr

Agency intelligence platform for small digital marketing agencies. Vite + React frontend, Supabase backend (Edge Functions, Auth, pg_cron), Anthropic API for report generation.

## gstack

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted development workflows.

**Install:** `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`

Requires `bun`: `curl -fsSL https://bun.sh/install | bash`

**For all web browsing, use `/browse` — never use `mcp__claude-in-chrome__*` tools.**

### Available skills

| Skill | Purpose |
|---|---|
| `/browse` | Headless browser for QA and live site testing |
| `/qa` | Full QA run with browser automation |
| `/qa-only` | QA without code changes |
| `/review` | Code review |
| `/ship` | Pre-deployment checklist and deploy |
| `/land-and-deploy` | Land PR and deploy |
| `/canary` | Monitor deployment for regressions |
| `/cso` | 14-phase security audit |
| `/design-shotgun` | Generate design mockup variants |
| `/design-html` | Design-to-code generation |
| `/design-review` | Design review |
| `/design-consultation` | Design consultation |
| `/plan-eng-review` | Engineering plan review |
| `/plan-ceo-review` | Executive plan review |
| `/plan-design-review` | Design plan review |
| `/office-hours` | Open-ended advice and review |
| `/investigate` | Deep investigation of an issue |
| `/retro` | Sprint retrospective |
| `/document-release` | Generate release notes |
| `/learn` | Learn about a codebase or topic |
| `/autoplan` | Auto-generate an implementation plan |
| `/benchmark` | Benchmark model performance |
| `/freeze` / `/unfreeze` | Freeze/unfreeze files from edits |
| `/careful` | Extra-careful mode for risky changes |
| `/gstack-upgrade` | Upgrade gstack to latest |
| `/setup-browser-cookies` | Import browser cookies for authenticated testing |
| `/setup-deploy` | Configure deployment settings |
| `/setup-gbrain` | Configure gstack brain |
