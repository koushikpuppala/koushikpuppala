# Shared Types Package

## Overview

Shared TypeScript contracts package. It defines shared domain models, API payload types, and component prop definitions used across workspace boundaries.

## Key files

| File | Owns |
|---|---|
| packages/types/src/index.ts | Package entry point exporting all shared contracts |
| packages/types/src/models/index.ts | Domain entity interfaces and payload models |
| packages/types/src/components/index.ts | Component prop contracts including DataTable types |

## Commands

```bash
# Build types
pnpm --filter types build
```

## Conventions

* Keep shared contracts application independent.
* Prefer strong typing; avoid any.
* Keep public contracts distinct from internal server implementation details.
* Ensure shared types match actual backend API behavior.

## Gotchas

* Do not update shared types merely to satisfy compilation if backend response shapes differ.
* Check all consumers across apps and packages after modifying contracts.

## Agent skills

* [typescript](~/.agents/skills/typescript/): Strong type definitions and shared contracts
* [contract-first](~/.agents/skills/contract-first/): Shared API contracts without field drift

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
