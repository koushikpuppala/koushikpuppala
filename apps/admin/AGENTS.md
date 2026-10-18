# Admin Application

## Overview

Private administrative CMS application. It manages portfolio content, projects, media, experience, education, services, social links, contact messages, and audit logs.

## Key files

| File                                                 | Owns                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| apps/admin/app/                                      | Routes only: each page renders one view from `src/components/<feature>`                         |
| apps/admin/src/actions/                              | API calls, one file per feature (`collection.ts` and `singleton.ts` hold the shared calls)      |
| apps/admin/src/components/shell/admin-shell.tsx      | Fixed sidebar, navigation, and top bar header                                                   |
| apps/admin/src/components/cms/collection-manager.tsx | Standardized collection views; the table's search, filters, sort and paging run in the API      |
| apps/admin/src/lib/use-server-list.ts                | `useServerList`: loads the page the table's URL describes, aborting superseded requests         |
| apps/admin/src/lib/use-collection-view.ts            | `useCollectionView`: list, dialog target, save, delete and publish for a CollectionManager view |
| apps/admin/src/lib/use-singleton-editor.ts           | `useSingletonEditor`: load, dirty state, save and publish for home, about and resume            |
| apps/admin/src/lib/use-form-dialog.ts                | `useFormDialog`: form state, save and error handling for every form dialog                      |
| apps/admin/src/components/form/                      | `FormDialog`, `Field`, `StringListField`, `CheckboxField`, `MediaField`, `PublishStateSelect`   |
| apps/admin/src/components/<feature>/                 | `<feature>-view.tsx` (state and table) and `<entity>-form-dialog.tsx` (the form)                |
| apps/admin/src/lib/api-client.ts                     | Authenticated API client communicating with backend                                             |
| apps/admin/src/constants/                            | API base URL (`NEXT_PUBLIC_BASE_URL`) and sidebar navigation                                    |
| apps/admin/src/styles/globals.css                    | Global styles and design tokens                                                                 |

## Commands

```bash
# Dev server
pnpm --filter admin dev

# Build
pnpm --filter admin build

# Lint
pnpm --filter admin lint
```

## Conventions

- All CMS functionality requires authenticated sessions verified by the backend.
- Backend authorization is authoritative; never rely solely on client role checks or hidden buttons.
- The API is the ONLY source of truth for business data; never use mock, sample, or fallback business data.
- Empty API responses render clear empty states, while errors render actionable error alerts with retry triggers.
- Use the built in DataTable controls for search, filters, pagination, and sorting rather than separate custom toolbars.
- Lists search, filter, sort and page in the API, never in the browser. A view calls `useServerList(<feature>Actions.list, LIST_OPTIONS)` (`src/lib/use-server-list.ts`); `toListQuery` (`src/lib/list-query.ts`) turns the table's URL parameters into the API's (`pageSize` to `limit`, `order` to `sortOrder`, column and filter ids to API fields). No `limit` is sent unless the editor changes the page size, so the API default of 10 applies. After a save, delete or publish toggle, call `reload()` rather than patching rows locally, so totals and page contents stay right.
- Every list request takes an `AbortSignal`. `useServerList` and `useLatestRequest` abort the request before the next one starts; `adminFetch` reports that as `{ aborted: true }` with no error, and loaders return early on it.
- Only columns the API whitelists in its `*_SORT_FIELDS` may be sortable (`sortable: true` on a `CollectionManager` column); any other `sortBy` is a 400.
- The media library and picker are grids, not tables: `useMediaLibrary` (`src/lib/use-media-library.ts`) searches in the API (debounced) and appends pages with "Load more".
- Sidebar remains fixed on the screen while main content scrolls smoothly.
- Types come from `packages/types`: API shapes from `types/api` (`ListResult`, `FetchResult`, `UserRecord`), enums from `types/enums`, and admin props and view state from `types/components/admin`. Never declare a type in this app.
- Same layout and conventions as apps/client: code lives in `src/`, imports are bare (`components/...`, `lib/...`, `actions/...`), and class names are joined with `classNames` from `utils/classNames`.
- `button`, `input`, `label` and `textarea` come from `packages/ui` (`ui/button`, ...), shared with apps/client. Only admin specific primitives (`badge`, `dialog`, `form-error`) live in `src/components/ui`.
- Components never call `adminFetch` directly; they call the feature's functions in `src/actions`.
- Every route has a `loading.tsx` that renders its page skeleton from `src/components/skeletons.tsx`, and each view shows the same skeleton on its first load (never placeholder values like 0). Reloads keep the current content on screen.
- While the saved session is checked, `AdminShell` renders `StudioBoot` (`src/components/shell/studio-boot.tsx`): the shell as a skeleton plus a status card driven by `stage` from `useAuth()` (`session`, `access`, `ready`, `signed-out`). A refused session keeps its reason in `accessError`, which the login page shows.

## Gotchas

- Client side checks alone do not grant administrative access; apps/server enforces all RBAC rules.
- `next.config.ts` sets `experimental.instantInsights.validationLevel: 'manual-warning'`: `AdminShell` renders pages only after client-side Firebase sign-in, so the server never renders them and implicit instant-navigation validation would flag every route as a dropped segment.
- Page content scrolls inside `<main>`, which is `relative` so absolutely positioned elements (such as `sr-only` text) stay inside it instead of stretching the document past the fixed shell.
- Destructive actions require confirmation dialogs before invoking server mutations.
- Form choices and dates use `Select` (`ui/select`) and `DatePicker` (`ui/date-picker`), never a native `<select>` or `type='date'`. End to end tests pick an option by clicking the button, then `page.getByRole('option', …)`.
- `DialogContent` defaults to `max-w-lg`; pass `max-w-*` in its `className` for a wider dialog (`classNames` merges them, so yours wins).
- Status badges use the `*-ink` text colors (`text-success-ink`, `text-warning-ink`, `text-destructive-ink`, from `packages/ui/style.css`), which keep 4.5:1 on the tinted fill in light mode.
- Sign in uses the Firebase client SDK (`src/lib/firebase.ts`, `src/lib/auth.tsx`). Set `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` and `NEXT_PUBLIC_FIREBASE_APP_ID` (build time values).
- `adminFetch` gets the token from the signed in Firebase user, so it only authenticates in the browser. Do not call it from server actions or `'use cache'` functions.
- The API rejects unknown fields. Send payloads through `pickFields(data, DTO_FIELDS.<entity>)` (`pickFields` from `src/lib/utils.ts`, `DTO_FIELDS` from `types/api`); `createCollectionActions` in `src/actions/collection.ts` does this for collections. A server contract test fails if `DTO_FIELDS` drifts from the DTOs.
- `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` connects sign in to the Firebase Auth emulator. It exists for apps/e2e and CI only; never set it in a deployment.
- Tests: `pnpm --filter admin test` (Vitest, React Testing Library, MSW in `test/`). The MSW server fails any request a test didn't declare.

## Agent skills

- [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js App Router and server actions
- [react](~/.agents/skills/react/): Modern React patterns and state handling
- [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS utility styling
- [ui-ux-pro-max](~/.agents/skills/ui-ux-pro-max/): Production grade CMS interfaces and UX density
- [vercel-composition-patterns](~/.agents/skills/vercel-composition-patterns/): Clean component composition and performance
- [web-design-guidelines](~/.agents/skills/web-design-guidelines/): Design review and UX best practices

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
