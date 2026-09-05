# 📘 Comprehensive Project Guide & Architecture Overview

Welcome to the **Koushik Puppala Monorepo** repository! This document serves as a complete reference manual for human developers and AI coding agents joining the project.

---

## 1. Executive Summary & Purpose

This repository is the full-stack monorepo for Koushik Puppala's personal website and Content Management System (CMS) platform (`koushikpuppala.com`).

### Core Platform Components:
* **Public Portfolio Website** (`apps/client`): Public-facing personal website showcasing bio, projects, career experience, education, services, social links, and contact forms.
* **Administrative CMS** (`apps/admin`): Private control panel for managing portfolio content, media uploads, user permissions, audit logs, and system metrics.
* **API Backend Server** (`apps/server`): Authoritative NestJS REST API managing authentication, authorization, business logic, PostgreSQL database access, Redis caching, AWS S3 storage, and external services.
* **Shared Workspace Packages** (`packages/`): Shared database ORM client, reusable React components, utility functions, TypeScript configurations, and contract type definitions.

---

## 2. Monorepo Structure & Workspace Topology

The repository uses **pnpm workspaces** and **Turborepo** (`turbo.json`) for package management and task execution.

```text
.
├── apps/
│   ├── client/          # Public Website (Next.js 16, React 19, Tailwind CSS v4, Motion, PWA)
│   ├── admin/           # Private CMS (Next.js 16, React 19, Shared UI, Sentry)
│   └── server/          # Authoritative API Server (NestJS 11, Express, Swagger, AWS S3, Redis)
├── packages/
│   ├── prisma/          # Database Client (Prisma 7 ORM & Modular PostgreSQL Schema)
│   ├── ui/              # Component Library (Buttons, Cards, Data Tables, Tailwind Styles)
│   ├── utils/           # Shared Utilities (classNames, formatDate, random helpers)
│   ├── config/          # Common TSConfig Presets (Next, Nest, Node, React)
│   └── types/           # Shared TypeScript Definitions & UI Props Contracts
├── docs/                # Architecture Diagrams & Project Guidelines
├── AGENTS.md            # Mandatory Engineering Instructions for AI Agents
├── PROJECT_OVERVIEW.md  # Comprehensive Project Reference (This File)
├── pnpm-workspace.yaml  # Monorepo Workspace Configuration
└── turbo.json           # Turborepo Task Pipeline Config
```

---

## 3. Technology Stack

| Category | Technologies & Tools |
| :--- | :--- |
| **Monorepo Engine** | pnpm, Turborepo 2.x |
| **Languages** | TypeScript 6.0 |
| **Frontend Stack** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Motion (`motion`), Headless UI |
| **Backend Stack** | NestJS 11, Express, NestJS Swagger / Redoc, Throttler (Rate Limiting), Event Emitter |
| **Database & ORM** | PostgreSQL, Prisma 7 ORM (Multi-file modular schema under `packages/prisma/prisma/schema/`) |
| **Caching & Storage** | Redis (`ioredis`), AWS S3 SDK (Presigned Upload URLs) |
| **Authentication** | Firebase Authentication, Firebase Admin SDK |
| **Monitoring & Logs** | Sentry (Next.js & NestJS), Winston Logger (Daily Rotate File), Custom Audit Logs & API Metrics |
| **Code Quality** | Biome (`@biomejs/biome`), Prettier (with Tailwind CSS plugin), Jest |

---

## 4. Application Responsibilities & Boundaries

### 🌐 `apps/client` (Public Portfolio)
* **Domain**: `koushikpuppala.com`
* **Purpose**: Public website showcasing personal profile, skills, timeline, projects, and contact forms.
* **Strict Rule**: Public-only interface. No administrative routes (`/admin`, `/dashboard`), CMS components, or privileged API calls are permitted in `apps/client`.

### 🔐 `apps/admin` (Private CMS)
* **Domain**: `admin.koushikpuppala.com`
* **Purpose**: Private administrative CMS app for authorized users.
* **Features**: Portfolio content management, project gallery editing, media upload manager, audit log views, system analytics, and session revocation.

### ⚙️ `apps/server` (Backend REST API)
* **Purpose**: Authoritative business logic, authentication, database operations, and security boundary.
* **Core Modules**:
  * `AuthModule` / `SessionService`: Authentication endpoints, login token exchange, session tracking, and session revocation.
  * `UserModule` / `UserService`: User synchronization, RBAC role management, and user administration.
  * `HomeModule`: Home profile content CRUD and publication control.
  * `MediaModule`: Media upload presigned URL generation and asset metadata indexing.
  * `AuditLogModule`: Security and system mutation audit logging.
  * `ApiMetricModule`: API response times and request analytics tracking.
  * `HealthModule`: System health checks and status endpoints.
  * `RedisModule` & `DatabaseModule`: Infrastructure providers for Redis caching and PostgreSQL database access.

---

## 5. Database Schema & Data Models (`packages/prisma`)

The database uses Prisma 7 with PostgreSQL. Schemas are modularized inside `packages/prisma/prisma/schema/*.prisma`:

```text
packages/prisma/prisma/schema/
├── user.prisma             # User accounts, authentication metadata, and role/status enums
├── session.prisma          # Active login sessions and token hash revocation records
├── audit-log.prisma        # Security audit trail (LOGIN, LOGOUT, CREATE, UPDATE, DELETE)
├── home.prisma             # Homepage content (title, separator, subtitles, content, profile image)
├── about.prisma            # Bio and personal description records
├── education.prisma        # Academic credentials and mentor history
├── experience.prisma       # Professional work experience and roles
├── project.prisma          # Project showcases, tags, repo links, and live URLs
├── project-gallery.prisma  # Screenshots and media assets linked to projects
├── service.prisma          # Offered technical services and descriptions
├── resume.prisma           # Resume information and download link references
├── social.prisma           # Social media profiles and URLs
├── media.prisma            # AWS S3 media asset metadata (file path, mime type, size, dimensions)
├── contact.prisma          # Contact form submissions and status
├── api-metric.prisma       # API endpoint latency and HTTP status code tracking
└── metadata.prisma         # Global site metadata, SEO settings, and feature flags
```

### Core Database Enums:
* `UserRole`: `ADMIN` (Full administrative control), `EDITOR` (Content management access), `USER` (Standard account).
* `UserStatus`: `ACTIVE`, `INACTIVE`, `SUSPENDED`.
* `AuthProvider`: `GOOGLE`, `GITHUB`, `PASSWORD`.

---

## 6. Authentication & Security Architecture

```text
Client Request (Bearer <Firebase_ID_Token>)
  │
  ▼
NestJS Middleware (RequestIdMiddleware, RequestContextMiddleware)
  │
  ▼
FirebaseAuthGuard (Global APP_GUARD)
  ├── Extract Bearer token from Authorization header
  ├── Verify token via Firebase Admin SDK (FirebaseService.verifyIdToken)
  ├── Verify session is active & not revoked (SessionService.isSessionRevoked)
  ├── Resolve application user from PostgreSQL by firebaseUid
  ├── Verify user.status === UserStatus.ACTIVE
  └── Attach AuthenticatedUser context to Request (req.user)
  │
  ▼
RolesGuard (Global APP_GUARD)
  ├── Allow if route has @Public() decorator
  ├── Allow if route has no @Roles(...) specified
  ├── Allow if user.role === UserRole.ADMIN (Admin override)
  └── Check if requiredRoles.includes(user.role) -> Allow or throw 403 Forbidden
```

---

## 7. Key Developer & Agent Guidelines

For developers and AI agents working in this repository:

1. **Inspect First**: Always inspect existing implementations and patterns before adding new code.
2. **Respect Boundaries**: Keep business logic in `apps/server`. UI applications (`apps/client`, `apps/admin`) consume backend APIs.
3. **Use Workspace Packages**:
   * Import Prisma models from `@repo/prisma`.
   * Import UI components from `ui` or `ui/designs/*`.
   * Import utility functions from `utils`.
4. **Backend Authorization is Authoritative**: Never rely on frontend-only role checks or hidden UI elements for security.
5. **No Credentials in Code**: Secrets (`DATABASE_URL`, `FIREBASE_PRIVATE_KEY`, `AWS_SECRET_ACCESS_KEY`) belong strictly in `.env.*.local` files and must never reach client bundles.

---

## 8. Common Workspace Commands

```bash
# Start dev servers across all workspace apps
pnpm dev

# Build all applications and packages
pnpm build

# Execute Jest unit test suite
pnpm test

# Run linter and formatting checks
pnpm lint
pnpm format
```

---

*This guide is maintained for team onboarding and agent context resolution.*
