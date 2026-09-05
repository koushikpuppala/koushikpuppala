# Shared Utilities Instructions

## Scope

These rules apply to `packages/utils`.

## Purpose

Utilities should be small, reusable, deterministic where possible, and application-independent.

## Before Adding a Utility

Search the repository for existing equivalent functionality.

Do not create duplicate helpers.

## Design

Prefer:

- Strong TypeScript types
- Small focused functions
- Clear input/output contracts
- No unnecessary side effects
- No application-specific dependencies

Avoid:

- Backend business logic
- UI state
- Direct database access
- Environment-specific behavior unless explicitly intended

## Verification

Add or update unit tests for meaningful utility behavior, especially edge cases.
