# AI Agent Engineering Workflow

This repository follows a disciplined AI-assisted engineering workflow.

## Philosophy

AI agents can implement code quickly, but speed does not replace engineering judgment.

The agent should:

- Inspect before changing.
- Think before implementing.
- Preserve architecture.
- Verify before claiming success.
- Review correctness, not only functionality.
- Preserve durable context between sessions.
- Maintain visual consistency across UI work.

## Core Loop

```text
/scope → /architect → /develop → /test → /check verify → /check review → Ship
                                    ↑
                    /debug  (when something breaks)
```

## Where the skills live

The workflow skills (`/scope`, `/architect`, `/develop`, `/test`, `/debug`, `/check`, `/review`, `/audit`) are installed per developer in `~/.claude/skills/`, not in this repository. `.claude/skills/` in the repository only holds links to skills shipped by dependencies (TanStack Table), and its contents are not committed. A contributor without the workflow skills follows the same steps by hand.

## Context

- `AGENTS.md` (root and per package) is the durable project context every skill reads first. When a change adds a rule, a required setting or a gotcha, update the nearest `AGENTS.md` in the same change. `CLAUDE.md` only imports it.
- Claude Code's own memory keeps personal preferences between sessions. Anything the whole team needs belongs in `AGENTS.md` instead.
- `/audit` bootstraps or fills gaps in the `AGENTS.md` files. It never overwrites curated lines.

## Skills

### `/scope`

Turns a product idea into a coarse scope in `docs/scope/` and keeps it current: plan the next slice, enroll one feature, or run with no argument to reconcile after shipping.

### `/architect`

Use before meaningful feature work, or when `/develop` says a decision is owed. It asks questions, recommends an answer and writes a build spec to `docs/specs/`.

Expected output:

- Problem understanding
- Relevant constraints
- Affected boundaries (client, admin, server, packages)
- Implementation plan
- Verification plan

Do not use a full architecture ceremony for trivial changes.

### `/develop`

Builds a feature from an approved spec plus `AGENTS.md`. If something load bearing is undecided, it stops and routes to `/architect`.

### `/test`

Writes tests for uncommitted changes, picking the layer from the table in `AGENTS.md` (unit, component, contract, API integration, end to end). Never mock what an integration or end to end test can exercise for real.

### `/debug`

Use when a test fails for an unclear reason or behavior is wrong. It runs a loop: reproduce, localize, form one hypothesis, test it, fix the root cause, verify. It makes the smallest fix and adds a regression test.

Do not repeatedly patch symptoms. If the cause is a flawed decision rather than a coding mistake, go back to `/architect`.

### `/check`

```text
/check verify
```

Drives the real app to prove the change against the spec.

```text
/check review
```

A senior code review on a fresh model that did not write the code. Run it before opening a pull request. Both write to `docs/reviews/`, which is excluded locally (`.git/info/exclude`) and never committed.

### `/review`

After building a feature: plan alignment, system integrity, production readiness. A working implementation is not automatically a correct implementation.

### Security

- `/security-best-practices` reviews the code against framework specific guidance and writes a report. Keep reports with live findings out of the repository: it is public.
- `/security-scan` audits the Claude Code configuration (`.claude/`, `CLAUDE.md`, MCP servers, hooks).

## Verification

Before calling any change done:

1. `pnpm lint`
2. `pnpm build` (or the affected apps)
3. `pnpm test`
4. When the change crosses the API, the database or the browser: `docker compose -f docker-compose.test.yml up -d --wait`, then `pnpm --filter server test:e2e` and `pnpm --filter e2e test:e2e`

Report failures as they are. CI (`.github/workflows/test.yml`) runs the same layers on every pull request.

## Practical Workflow

### Feature

```text
/architect
      ↓
/develop
      ↓
/test
      ↓
Verify (lint, build, tests)
      ↓
/check verify
      ↓
/check review
      ↓
Update AGENTS.md if a rule changed
```

### Bug

```text
/debug
      ↓
Reproduce
      ↓
Root-cause fix + regression test
      ↓
Verify (lint, build, tests)
```

### Small Change

```text
Inspect
  ↓
Implement
  ↓
Verify
```

Do not over-process trivial work.

## Source

This document describes how the installed skills fit into the project's engineering process. The skill definitions themselves are authoritative; when they change, update this file to match.
