# Shared UI Package Instructions

## Scope

These rules apply to `packages/ui`.

## Purpose

`packages/ui` contains reusable, application-independent UI components.

## Before Creating a Component

Search:

1. `packages/ui`
2. `apps/client`
3. `apps/admin`

Determine whether an existing component can be reused or extended.

Do not create duplicate components.

## Component Design

Prefer:

- Accessible semantic HTML
- Clear component APIs
- Strong TypeScript types
- Responsive behavior
- Existing design tokens
- Tailwind CSS v4
- Existing project patterns

Avoid application-specific business logic.

Do not make components dependent on backend services.

## Styling

Follow existing Tailwind conventions.

Do not introduce another styling framework.

Do not add arbitrary custom CSS when existing Tailwind/component patterns are sufficient.

## Accessibility

Consider:

- Keyboard navigation
- Focus states
- Labels
- Semantic structure
- Disabled states
- Error states
- Reduced motion

## Verification

For meaningful UI changes:

- Check responsive behavior.
- Check loading/empty/error/success states where applicable.
- Check keyboard interaction.
- Run relevant type/lint checks.
- Use `/imprint` after building a meaningful component when the skill is available.
