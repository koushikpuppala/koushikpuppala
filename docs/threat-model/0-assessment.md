# Security Assessment

---

## Report Files

| File | Description |
|------|-------------|
| [0-assessment.md](0-assessment.md) | This document — executive summary, risk rating, action plan, metadata |
| [0.1-architecture.md](0.1-architecture.md) | Architecture overview, components, scenarios, tech stack |
| [1-threatmodel.md](1-threatmodel.md) | Threat model DFD diagram with element, flow, and boundary tables |
| [1.1-threatmodel.mmd](1.1-threatmodel.mmd) | Pure Mermaid DFD source file |
| [2-stride-analysis.md](2-stride-analysis.md) | Full STRIDE-A analysis for all components |
| [3-findings.md](3-findings.md) | Prioritized security findings with remediation |

---

## Executive Summary

This security assessment evaluates the full-stack digital presence monorepo comprising a public-facing portfolio website (`apps/client`), an administrative content management studio (`apps/admin`), an authoritative NestJS backend REST API (`apps/server`), and shared workspace packages (`packages/*`). The system is architected around modern web standards (Next.js 16 App Router, React 19, Tailwind CSS v4) coupled with an authoritative server tier running NestJS 11 with Prisma 7 ORM, PostgreSQL 17, Redis, Firebase Authentication, and AWS S3 cloud media storage.

The primary security architecture follows a zero-trust model where frontend applications have zero direct database access and must interact exclusively with the authoritative NestJS API. Authentication is anchored by Firebase ID Bearer token verification with server-side revocation checks, while role-based authorization (RBAC) is enforced authoritatively against database records in PostgreSQL via NestJS guards. Input sanitization is applied globally using `ValidationPipe` with strict class-validator transfer objects.

The analysis covers 10 system elements across 2 trust boundaries.

### Risk Rating: Elevated

The overall security risk posture is rated as **Elevated**. While core authentication and database parameterized access are strongly constructed, critical gaps exist at the perimeter and in supporting infrastructure. Specifically, the unauthenticated public contact submission endpoint lacks dedicated rate limiting and server-side CAPTCHA verification, exposing the database to compute and storage denial-of-service. Content Security Policy is globally disabled in Helmet headers. In the backend infrastructure, Redis transport lacks mandatory authentication and TLS encryption, user management allows self-demotion/last-admin account lockout, media uploads lack S3 object existence verification, and the CI/CD pipeline writes production secrets into `.env` files that get baked into Docker image layers while using unpinned GitHub Actions and disabled SSH host key verification.

> **Note on threat counts:** This analysis identified 51 threats across 8 components. This count reflects comprehensive STRIDE-A coverage, not systemic insecurity. Of these, **6 are directly exploitable** without prerequisites (Tier 1). The remaining 45 represent conditional risks and defense-in-depth considerations.

---

## Action Summary

| Tier | Description | Threats | Findings | Priority |
|------|-------------|---------|----------|----------|
| [Tier 1](3-findings.md#tier-1--direct-exposure-no-prerequisites) | Directly exploitable | 6 | 2 | 🔴 Critical Risk |
| [Tier 2](3-findings.md#tier-2--conditional-risk-authenticated--single-prerequisite) | Requires authenticated access | 33 | 5 | 🟠 Elevated Risk |
| [Tier 3](3-findings.md#tier-3--defense-in-depth-prior-compromise--host-access) | Requires prior compromise | 12 | 3 | 🟡 Moderate Risk |
| **Total** | | **51** | **10** | |

### Priority by Tier and CVSS Score (Top 10)

| Finding | Tier | CVSS Score | SDL Severity | Title |
|---------|------|------------|-------------|-------|
| [FIND-01](3-findings.md#find-01-unauthenticated-public-contact-endpoint-lacks-dedicated-rate-limiting-and-backend-captcha-verification) | T1 | 7.1 | Important | Unauthenticated Public Contact Endpoint Lacks Dedicated Rate Limiting and Backend CAPTCHA Verification |
| [FIND-02](3-findings.md#find-02-content-security-policy-csp-explicitly-disabled-in-helmet-configuration) | T1 | 5.3 | Moderate | Content Security Policy (CSP) Explicitly Disabled in Helmet Configuration |
| [FIND-03](3-findings.md#find-03-unauthenticated-redis-transport-and-optional-authentication-configuration) | T2 | 7.1 | Important | Unauthenticated Redis Transport and Optional Authentication Configuration |
| [FIND-04](3-findings.md#find-04-missing-self-demotion-and-last-admin-account-protection-in-user-management) | T2 | 5.9 | Important | Missing Self-Demotion and Last-Admin Account Protection in User Management |
| [FIND-05](3-findings.md#find-05-global-in-memory-rate-limiter-lacks-distributed-redis-store-and-resets-on-restarts) | T2 | 5.3 | Moderate | Global In-Memory Rate Limiter Lacks Distributed Redis Store and Resets on Restarts |
| [FIND-06](3-findings.md#find-06-media-upload-completion-lacks-server-side-s3-object-existence-and-size-verification) | T2 | 5.1 | Moderate | Media Upload Completion Lacks Server-Side S3 Object Existence and Size Verification |
| [FIND-07](3-findings.md#find-07-session-revocation-verification-relies-on-uncached-postgresql-queries-with-default-allow-on-unregistered-tokens) | T2 | 5.1 | Moderate | Session Revocation Verification Relies on Uncached PostgreSQL Queries with Default-Allow on Unregistered Tokens |
| [FIND-08](3-findings.md#find-08-deployment-ssh-host-key-verification-disabled-in-cicd-workflow) | T3 | 7.0 | Important | Deployment SSH Host Key Verification Disabled in CI/CD Workflow |
| [FIND-09](3-findings.md#find-09-production-secrets-written-to-env-file-inside-cicd-runner-and-baked-into-docker-image-layers) | T3 | 6.8 | Important | Production Secrets Written to `.env` File Inside CI/CD Runner and Baked into Docker Image Layers |
| [FIND-10](3-findings.md#find-10-third-party-github-actions-unpinned-to-immutable-commit-shas) | T3 | 6.8 | Moderate | Third-Party GitHub Actions Unpinned to Immutable Commit SHAs |

### Quick Wins

| Finding | Title | Why Quick |
|---------|-------|-----------|
| [FIND-01](3-findings.md#find-01-unauthenticated-public-contact-endpoint-lacks-dedicated-rate-limiting-and-backend-captcha-verification) | Unauthenticated Public Contact Endpoint Lacks Dedicated Rate Limiting and Backend CAPTCHA Verification | Adding `@Throttle({ default: { limit: 5, ttl: 60_000 } })` decorator in `contact.controller.ts` requires only 3 lines of code. |
| [FIND-02](3-findings.md#find-02-content-security-policy-csp-explicitly-disabled-in-helmet-configuration) | Content Security Policy (CSP) Explicitly Disabled in Helmet Configuration | Configuring CSP directives in `main.ts` takes under 15 lines of configuration without modifying business logic. |
| [FIND-03](3-findings.md#find-03-unauthenticated-redis-transport-and-optional-authentication-configuration) | Unauthenticated Redis Transport and Optional Authentication Configuration | Updating `configuration.ts` to require `REDIS_PASSWORD` in production takes a single line modification. |
| [FIND-04](3-findings.md#find-04-missing-self-demotion-and-last-admin-account-protection-in-user-management) | Missing Self-Demotion and Last-Admin Account Protection in User Management | Adding `if (id === actorId)` and `prisma.user.count()` validation checks in `user.service.ts` takes under 20 lines of defensive code. |
| [FIND-08](3-findings.md#find-08-deployment-ssh-host-key-verification-disabled-in-cicd-workflow) | Deployment SSH Host Key Verification Disabled in CI/CD Workflow | Storing the EC2 host fingerprint in `EC2_KNOWN_HOSTS` and removing `-o StrictHostKeyChecking=no` takes 5 minutes in `production.yml`. |
| [FIND-09](3-findings.md#find-09-production-secrets-written-to-env-file-inside-cicd-runner-and-baked-into-docker-image-layers) | Production Secrets Written to `.env` File Inside CI/CD Runner and Baked into Docker Image Layers | Adding `.env` to `.dockerignore` takes 1 line of configuration and instantly prevents layer baking. |
| [FIND-10](3-findings.md#find-10-third-party-github-actions-unpinned-to-immutable-commit-shas) | Third-Party GitHub Actions Unpinned to Immutable Commit SHAs | Replacing `@master` tags with full 40-character commit SHAs in GitHub Actions takes under 15 minutes. |

---

## Analysis Context & Assumptions

### Analysis Scope
| Constraint | Description |
|------------|-------------|
| Scope | Full monorepo repository (`apps/client`, `apps/admin`, `apps/server`, `packages/*`, `.github/workflows`) |
| Excluded | Third-party cloud infrastructure internals (Google Firebase core servers, AWS S3 internal storage hardware) |
| Focus Areas | Authentication & authorization barriers, public input ingestion, token session handling, secret management, CI/CD pipeline integrity, data storage security |

### Infrastructure Context
| Category | Discovered from Codebase | Findings Affected |
|----------|--------------------------|-------------------|
| API Framework | NestJS 11 with Express platform ([apps/server/src/main.ts](apps/server/src/main.ts)) | [FIND-01](3-findings.md#find-01-unauthenticated-public-contact-endpoint-lacks-dedicated-rate-limiting-and-backend-captcha-verification), [FIND-02](3-findings.md#find-02-content-security-policy-csp-explicitly-disabled-in-helmet-configuration), [FIND-05](3-findings.md#find-05-global-in-memory-rate-limiter-lacks-distributed-redis-store-and-resets-on-restarts) |
| Authentication | Firebase Admin SDK ID token Bearer verification ([apps/server/src/common/guards/firebase-auth.guard.ts](apps/server/src/common/guards/firebase-auth.guard.ts)) | [FIND-07](3-findings.md#find-07-session-revocation-verification-relies-on-uncached-postgresql-queries-with-default-allow-on-unregistered-tokens) |
| Authorization | Database-backed RBAC with ADMIN / EDITOR roles ([apps/server/src/common/guards/roles.guard.ts](apps/server/src/common/guards/roles.guard.ts)) | [FIND-04](3-findings.md#find-04-missing-self-demotion-and-last-admin-account-protection-in-user-management) |
| Relational Storage | PostgreSQL 17 managed via Prisma 7 ORM ([packages/prisma/prisma/schema/schema.prisma](packages/prisma/prisma/schema/schema.prisma)) | [FIND-01](3-findings.md#find-01-unauthenticated-public-contact-endpoint-lacks-dedicated-rate-limiting-and-backend-captcha-verification), [FIND-07](3-findings.md#find-07-session-revocation-verification-relies-on-uncached-postgresql-queries-with-default-allow-on-unregistered-tokens) |
| Caching Store | Redis via `ioredis` with graceful degradation ([apps/server/src/redis/redis.service.ts](apps/server/src/redis/redis.service.ts)) | [FIND-03](3-findings.md#find-03-unauthenticated-redis-transport-and-optional-authentication-configuration), [FIND-05](3-findings.md#find-05-global-in-memory-rate-limiter-lacks-distributed-redis-store-and-resets-on-restarts) |
| Asset Storage | AWS S3 with presigned upload URLs ([apps/server/src/modules/media/media.service.ts](apps/server/src/modules/media/media.service.ts)) | [FIND-06](3-findings.md#find-06-media-upload-completion-lacks-server-side-s3-object-existence-and-size-verification) |
| Containerization | Multi-stage Dockerfile running as non-root user `portfolio:koushikpuppala` ([Dockerfile](Dockerfile)) | [FIND-09](3-findings.md#find-09-production-secrets-written-to-env-file-inside-cicd-runner-and-baked-into-docker-image-layers) |
| CI/CD Pipeline | GitHub Actions building multi-arch Docker image and deploying to AWS EC2 via SSH ([.github/workflows/production.yml](.github/workflows/production.yml)) | [FIND-08](3-findings.md#find-08-deployment-ssh-host-key-verification-disabled-in-cicd-workflow), [FIND-09](3-findings.md#find-09-production-secrets-written-to-env-file-inside-cicd-runner-and-baked-into-docker-image-layers), [FIND-10](3-findings.md#find-10-third-party-github-actions-unpinned-to-immutable-commit-shas) |

### Needs Verification
| Item | Question | What to Check | Why Uncertain |
|------|----------|---------------|---------------|
| Reverse Proxy CIDR | Does the production EC2 deployment run behind Cloudflare or Nginx reverse proxy? | Inspect EC2 Nginx or ALB configuration | `app.set('trust proxy', 1)` in `main.ts` expects an upstream reverse proxy, which must restrict header rewriting. |
| S3 Bucket Policy | Is S3 Block Public Access fully enabled on `koushikpuppala-media`? | AWS S3 Bucket permissions in AWS Console | Infrastructure is defined outside repository source code. |
| Redis Network Isolation | Is Redis port 6379 bound strictly to `127.0.0.1` on the production EC2 host? | EC2 security groups and `redis.conf` bind directive | Host-level daemon configuration is managed outside git. |

### Finding Overrides
| Finding ID | Original Severity | Override | Justification | New Status |
|------------|-------------------|----------|---------------|------------|
| — | — | — | No overrides applied. Update this section after review. | — |

### Additional Notes

No additional notes.

---

## References Consulted

### Security Standards
| Standard | URL | How Used |
|----------|-----|----------|
| Microsoft SDL Bug Bar | https://www.microsoft.com/en-us/msrc/sdlbugbar | Severity classification (Critical / Important / Moderate / Low) |
| OWASP Top 10:2025 | https://owasp.org/Top10/2025/ | Threat and vulnerability categorization |
| CVSS 4.0 | https://www.first.org/cvss/v4.0/specification-document | Objective vulnerability risk scoring |
| CWE | https://cwe.mitre.org/ | Standardized software weakness classification |
| STRIDE-A | https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats | Threat enumeration across elements and data flows |

### Component Documentation
| Component | Documentation URL | Relevant Section |
|-----------|------------------|------------------|
| NestJS Throttler | https://docs.nestjs.com/security/rate-limiting | Distributed Redis storage adapter configuration |
| Helmet Security | https://helmetjs.github.io/ | Content Security Policy directives |
| AWS S3 Presigned URLs | https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html | Verification of object existence and size constraints |
| GitHub Actions Security | https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions | Using third-party actions and pinning to full commit SHAs |
| Redis Security | https://redis.io/docs/latest/operate/oss_and_stack/management/security/ | Redis ACLs, password authentication, and TLS encryption |

---

## Report Metadata

| Field | Value |
|-------|-------|
| Source Location | `/home/koushikpuppala/personal/koushikpuppala` |
| Git Repository | `git@github.com:koushikpuppala/koushikpuppala.git` |
| Git Branch | `revamp/6.x` |
| Git Commit | `c1a2a16` (`2026-09-20 17:38:39 +0000`) |
| Model | `Antigravity Agent` |
| Machine Name | `sandbox` |
| Analysis Started | `2026-09-26 18:22:24 UTC` |
| Analysis Completed | `2026-09-26 18:35:00 UTC` |
| Duration | `12m 36s` |
| Output Folder | `threat-model-20260926-182224` |
| Prompt | `/threat-model-analyst` |

---

## Classification Reference

| Classification | Values |
|---------------|--------|
| **Exploitability Tiers** | **T1** Direct Exposure (no prerequisites) · **T2** Conditional Risk (single prerequisite) · **T3** Defense-in-Depth (multiple prerequisites or infrastructure access) |
| **STRIDE + Abuse** | **S** Spoofing · **T** Tampering · **R** Repudiation · **I** Information Disclosure · **D** Denial of Service · **E** Elevation of Privilege · **A** Abuse (feature misuse) |
| **SDL Severity** | `Critical` · `Important` · `Moderate` · `Low` |
| **Remediation Effort** | `Low` · `Medium` · `High` |
| **Mitigation Type** | `Redesign` · `Standard Mitigation` · `Custom Mitigation` · `Existing Control` · `Accept Risk` · `Transfer Risk` |
| **Threat Status** | `Open` · `Mitigated` · `Platform` |
| **Incremental Tags** | `[Existing]` · `[Fixed]` · `[Partial]` · `[New]` · `[Removed]` (incremental reports only) |
| **CVSS** | CVSS 4.0 vector with `CVSS:4.0/` prefix |
| **CWE** | Hyperlinked CWE ID (e.g., [CWE-306](https://cwe.mitre.org/data/definitions/306.html)) |
| **OWASP** | OWASP Top 10:2025 mapping (e.g., A01:2025 – Broken Access Control) |
