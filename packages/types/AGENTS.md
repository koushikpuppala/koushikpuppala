# Shared Types Package Instructions

## Scope

These rules apply to `packages/types`.

## Purpose

Use this package for types/contracts that genuinely need to be shared across workspace boundaries.

## Rules

Do:

- Keep shared contracts application-independent.
- Prefer strong typing.
- Keep public contracts separate from server internals.
- Search for an existing type before creating a new one.

Do not:

- Move server-only implementation types here.
- Add application-specific UI types unnecessarily.
- Duplicate an existing domain contract.
- Create circular dependencies.

## API Contracts

When a type represents an API contract, ensure it matches actual backend behavior.

Do not update shared types merely to make TypeScript compile if the implementation does not match.

## Verification

After changing shared types, inspect all affected consumers and run relevant type checks/tests.
