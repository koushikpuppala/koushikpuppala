# Shared Config Package

## Overview

Shared configuration package. It provides centralized TypeScript configurations and tooling presets for all workspaces.

## Key files

| File | Owns |
|---|---|
| packages/config/tsconfig.json | Base TypeScript compiler configuration |
| packages/config/tsconfig.next.json | Next.js TypeScript compiler preset |
| packages/config/tsconfig.nest.json | NestJS TypeScript compiler preset |

## Conventions

* Changes to shared configuration affect all consuming packages.
* Inspect all consumers before modifying compiler options or path aliases.
* Prefer the smallest compatible configuration change.

## Gotchas

* Avoid adding application specific configuration rules here.

## Agent skills

* [turborepo](~/.agents/skills/turborepo/): Workspace configuration and task dependencies

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
