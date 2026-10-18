# Shared UI Package

## Overview

Reusable component library. It provides application independent UI primitives, interactive components, data tables, dialogs, and design token styling.

## Key files

| File                                              | Owns                                                                                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| packages/ui/src/designs/data-table.tsx            | Reusable DataTable component with built in search, filters, and pagination                                                                           |
| packages/ui/src/designs/                          | DataTable parts: `filter-control`, `date-range-filter`, `column-visibility-menu`, `data-table-pagination`, `use-table-url-sync`, `data-table-styles` |
| packages/ui/src/designs/table.tsx                 | Accessible table element primitives                                                                                                                  |
| packages/ui/src/empty-state.tsx                   | Shared empty state (icon, title, hint, optional action), used by DataTable                                                                           |
| packages/ui/src/icon-button.tsx                   | Icon only action button (neutral, primary, danger), used for row actions                                                                             |
| packages/ui/src/skeleton.tsx                      | `Skeleton`, `SkeletonText` and `LoadingRegion` for page loading states                                                                               |
| packages/ui/src/select.tsx                        | `Select`: Headless UI Listbox, labelled by `<Label htmlFor>` like a native select                                                                    |
| packages/ui/src/date-picker.tsx                   | `DatePicker`: react-date-range Calendar in a popover, `YYYY-MM-DD` values                                                                            |
| packages/ui/src/keyboard-focus.tsx                | `KeyboardFocus`: sets `html[data-keyboard]` while the Tab key is in use                                                                              |
| packages/ui/src/logo.tsx                          | `LogoGlyph` and `LogoMark` (image in `src/assets/logo.png`), used by both apps                                                                       |
| packages/ui/src/{button,input,label,textarea}.tsx | Form primitives shared by apps/client and apps/admin                                                                                                 |
| packages/ui/style.css                             | Shared Tailwind CSS styling imports                                                                                                                  |

## Commands

```bash
# Type check
pnpm --filter ui check-types

# Lint
pnpm --filter ui lint

# Tests (Vitest, src/**/*.test.ts(x))
pnpm --filter ui test
```

## Conventions

- Components must stay reusable and application independent.
- Avoid embedding application specific business logic or backend calls in UI components.
- Use Tailwind CSS v4 and existing design tokens.
- Support keyboard navigation, focus indicators, and accessible labels.

## Gotchas

- Search packages/ui before creating a new component to avoid duplication.
- Component prop types live in `packages/types/src/components/ui` (`types/components`), never in the component file.
- Test components across mobile, tablet, and desktop viewports.
- DataTable runs on TanStack Table v9, which only enables features that are registered. `dataTableFeatures` in `designs/data-table.tsx` registers filtering, global search, visibility, sorting and pagination, plus the filter and sort functions TanStack's `'auto'` mode can pick. Type columns as `DataTableColumnDef<Row>` from `types/components`, not TanStack's `ColumnDef`. `DataTableFeatures` (packages/types) spells out the same feature set; keep the two in step (the annotation on `dataTableFeatures` fails if they differ). Using a new table API (for example row selection) means registering its feature there first.
- DataTable columns are not sortable unless they set `enableSorting: true` (`defaultColumn` turns it off). Only opt in columns the API whitelists in its `*_SORT_FIELDS`, or columns a `manualSorting={false}` table sorts in the browser.
- DataTable controls follow the expensewise table: transparent, `border-foreground/10`, `shadow`, `hover:bg-foreground/5`, `rounded-lg px-3 py-2 text-sm font-medium` (the `CONTROL`, `PAGER`, `PANEL` and `OPTION` constants). Row actions use `IconButton` from `ui/icon-button`, whose `aria-label` is required.
- DataTable `emptyState` is shown only when no search, filter or date range is active.
- Focus indicators use the `focus-ring:` variant (style.css), never `focus:` or `focus-visible:`. It applies only while `KeyboardFocus` (mounted in each root layout) marks keyboard use, so clicks and taps never draw a ring.
- Never use a native `<select>` or `type='date'` input: use `Select` (`ui/select`) and `DatePicker` (`ui/date-picker`). Their panels render in a portal at `z-60`, above dialogs.
- Loading states use the `skeleton` utility in `style.css` (a shimmer that stops under `prefers-reduced-motion`) through `Skeleton` / `SkeletonText`. Wrap a page's placeholders in one `LoadingRegion` so screen readers hear a single "Loading …" message.

## Agent skills

- [tailwind-design-system](~/.agents/skills/tailwind-design-system/): Design tokens and reusable component libraries
- [web-component-design](~/.agents/skills/web-component-design/): Reusable component architecture and composition
- [accessibility](~/.agents/skills/accessibility/): Inclusive digital components and accessible traits

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
