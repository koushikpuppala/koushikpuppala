# Shared Configuration Package Instructions

## Scope

These rules apply to `packages/config`.

## Purpose

This package contains shared TypeScript/tooling configuration.

## Rules

Before modifying shared configuration:

1. Search all consumers.
2. Identify the affected workspaces.
3. Determine whether the change is intentional for all consumers.
4. Prefer the smallest compatible change.

Do not make application-specific configuration changes in shared configuration unless the architecture requires it.

Be especially careful with:

- TypeScript configuration
- Linting
- Formatting
- Build configuration
- Module resolution

Verify all materially affected packages after changing shared configuration.
