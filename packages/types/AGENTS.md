# Shared Types Package

## Overview

Shared TypeScript contracts package. It defines shared domain models, API payload types, and component prop definitions used across workspace boundaries.

## Key files

Every custom type in the repo is defined here, once. Import it with `import type` from the subpath that owns it.

| Subpath                   | Owns                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `types/enums`             | Database enums (`UserRole`, `AuditAction`, ...), re-exported as types from `@repo/prisma`    |
| `types/models`            | Published content models, media (`MediaFile`, `MediaAsset`), `MetadataRecord`                |
| `types/api`               | Response envelope, pagination and list results, `DTO_FIELDS`, users, contacts, health, audit |
| `types/auth`              | `AuthenticatedUser`, `RequestContext`, the admin session user and auth context               |
| `types/utils`             | Form and validation helpers used by packages/utils                                           |
| `types/components`        | Shared props (`ChildrenProps`, `ErrorPageProps`), DataTable options, and packages/ui props   |
| `types/components/admin`  | apps/admin props, list and form helpers, view state                                          |
| `types/components/client` | apps/client page and component props                                                         |
| `types/server`            | apps/server internals: config sections, storage, mail, audit params, Swagger options         |

`types/server`, `types/components/admin` and `types/components/client` are reached by subpath only; the root barrel (`types`) leaves them out.

## Commands

```bash
# Build types
pnpm --filter types build
```

## Conventions

- One definition per concept. Before adding a type, search this package; extend or derive (`Pick`, `Omit`, `&`) instead of copying fields.
- Name inline prop objects after their component: `({ title }: { title: string })` in `Hero` becomes `HeroProps`.
- A type that used to come from a runtime value (`typeof X`, `z.infer<typeof schema>`) is written out here, and the value checks itself against it: `as const satisfies readonly SortOrder[]`, `z.object({...}) satisfies z.ZodType<CreateUserPayload>`, or an annotation (`dataTableFeatures: DataTableFeatures`).
- Types only. `DTO_FIELDS` is the one runtime export; everything else is `export type`, so the server (CommonJS) and the Next apps erase these imports.
- Ensure shared types match actual backend API behavior.

## Gotchas

- `biome/no-local-type-declaration.grit` (wired into the root `biome.json`) fails `pnpm lint` on any `type`, `interface`, `enum` or object type outside this package. Its `includes` exempt tests (`*.test.ts(x)`, `*.spec.ts`, `*.e2e-spec.ts`, `apps/server/test`, `apps/e2e`), generated Prisma code, `environment.d.ts`, `apps/server/src/augmentations` (Express request fields) and `packages/prisma/src/seed.ts` with `src/seed/` (they can't import this package: `types` depends on `@repo/prisma`, so the reverse would be a cycle).
- Library types (`react`, `next`, `motion`, `@tanstack/react-table`, `@nestjs/common`, `zod`, `@repo/prisma`) are dev dependencies here and are only ever imported as types.
- `DataTableFeatures` spells out the features `dataTableFeatures` registers in packages/ui. Change both together; the annotation there fails if they differ.
- Do not update shared types merely to satisfy compilation if backend response shapes differ.
- Check all consumers across apps and packages after modifying contracts.
- `src/api/dto-fields.ts` (`DTO_FIELDS`) lists the fields each API DTO accepts. apps/admin sends payloads through it and an apps/server test keeps it equal to the DTO classes.
- This package is ESM (`"type": "module"`, bundler resolution); consumers read its source through Next or Vitest, and the server imports types only.

## Agent skills

- [typescript](~/.agents/skills/typescript/): Strong type definitions and shared contracts
- [contract-first](~/.agents/skills/contract-first/): Shared API contracts without field drift

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
