# STRIDE + Abuse Cases — Threat Analysis

> This analysis uses the standard **STRIDE** methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) extended with **Abuse Cases** (business logic abuse, workflow manipulation, feature misuse). The "A" column in tables below represents Abuse — a supplementary category covering threats where legitimate features are misused for unintended purposes. This is distinct from Elevation of Privilege (E), which covers authorization bypass.

## Exploitability Tiers

Threats are classified into three exploitability tiers based on the prerequisites an attacker needs:

| Tier | Label | Prerequisites | Assignment Rule |
|------|-------|---------------|----------------|
| **Tier 1** | Direct Exposure | `None` | Exploitable by unauthenticated external attacker with NO prior access. The prerequisite field MUST say `None`. |
| **Tier 2** | Conditional Risk | Single prerequisite: `Authenticated User`, `Privileged User`, `Internal Network`, or single `{Boundary} Access` | Requires exactly ONE form of access. The prerequisite field has ONE item. |
| **Tier 3** | Defense-in-Depth | `Host/OS Access`, `Admin Credentials`, `{Component} Compromise`, `Physical Access`, or MULTIPLE prerequisites joined with `+` | Requires significant prior breach, infrastructure access, or multiple combined prerequisites. |

## Summary

| Component | Link | S | T | R | I | D | E | A | Total | T1 | T2 | T3 | Risk |
|-----------|------|---|---|---|---|---|---|---|-------|----|----|----|------|
| ClientApp | [Link](#clientapp) | 0 | 1 | 0 | 2 | 1 | 1 | 1 | 6 | 2 | 2 | 2 | Moderate |
| AdminApp | [Link](#adminapp) | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 7 | 0 | 5 | 2 | Moderate |
| ServerApi | [Link](#serverapi) | 1 | 2 | 1 | 1 | 1 | 2 | 1 | 9 | 2 | 6 | 1 | Elevated |
| PostgreSQL | [Link](#postgresql) | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 6 | 0 | 4 | 2 | Moderate |
| Redis | [Link](#redis) | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 5 | 0 | 4 | 1 | Moderate |
| FirebaseAuth | [Link](#firebaseauth) | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 6 | 0 | 5 | 1 | Low |
| S3Storage | [Link](#s3storage) | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 6 | 0 | 5 | 1 | Moderate |
| Sentry | [Link](#sentry) | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 6 | 2 | 2 | 2 | Low |
| **Totals** | | **7** | **9** | **2** | **9** | **8** | **9** | **7** | **51** | **6** | **33** | **12** | |

---

## ClientApp

**Trust Boundary:** Application
**Role:** Public portfolio Next.js App Router presentation layer and inquiry submission portal
**Data Flows:** DF01, DF04, DF11
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T01.D | Denial of Service | Volumetric HTTP flooding against Next.js dynamic App Router routes causing compute starvation | None | DF01 | Rate limit at edge/reverse proxy and configure endpoint throttling | Open |
| T01.A | Abuse | Automated scraping bots flooding contact form endpoint with commercial spam inquiries | None | DF01 | Honeypot field and backend CAPTCHA/bot verification | Open |

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T01.T | Tampering | Injection of malformed or XSS payloads through contact form input fields | None | DF04 | Client-side Zod schema validation and string trimming | Mitigated |
| T01.I | Information Disclosure | Inadvertent leakage of backend environment variables into public client browser bundle | Local Process Access | DF01 | Next.js strictly isolates server-only variables without NEXT_PUBLIC_ prefix | Mitigated |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T01.I2 | Information Disclosure | Production secrets written into .env file during CI build baked into Docker container filesystem layers | Host/OS Access | DF01 | Exclude .env in .dockerignore and inject secrets at container runtime | Open |
| T01.E | Elevation of Privilege | Privilege escalation through vulnerable npm dependency within Next.js runtime container | Host/OS Access | DF01 | Container runs as non-root user portfolio (UID 1001) | Mitigated |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Spoofing | N/A — ClientApp is an anonymous public presentation website without local session issuance. |
| Repudiation | N/A — Public browsing actions do not carry contractual non-repudiation audit requirements. |

---

## AdminApp

**Trust Boundary:** Application
**Role:** Private content management studio frontend interface for portfolio management
**Data Flows:** DF02, DF03, DF05, DF12
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

*No Tier 1 threats identified.*

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T02.S | Spoofing | Replay of stolen Firebase ID token to access CMS management interface | Authenticated User | DF05 | Enforce short token TTLs and server-side session revocation checks | Open |
| T02.T | Tampering | Stored Cross-Site Scripting (XSS) in Markdown CMS editors executed in editor browser | Authenticated User | DF02 | React auto-escaping, DOMPurify, and strict Biome linter sanitization | Mitigated |
| T02.I | Information Disclosure | Unauthorized read access to draft portfolio projects and user messages | Authenticated User | DF05 | Backend RolesGuard restricts CMS data access to ADMIN and EDITOR roles | Mitigated |
| T02.E | Elevation of Privilege | Bypassing client-side route guards to render unauthorized administrative screens | Authenticated User | DF02 | Backend API authoritatively enforces RBAC on all mutation endpoints | Mitigated |
| T02.A | Abuse | Rapid mass-deletion or modification of CMS content by rogue editor account | Authenticated User | DF05 | Implement distributed rate limits and granular administrative audit logging | Open |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T02.R | Repudiation | Administrator denying content modifications or deletions performed in CMS | Admin Credentials + Host/OS Access | DF02 | AuditLogService records actor ID, entity ID, and timestamp in PostgreSQL | Mitigated |
| T02.D | Denial of Service | Memory exhaustion in client browser when rendering massive unpaginated datasets | Authenticated User + Local Process Access | DF02 | TanStack Table v8 server-side pagination with controlled limits | Mitigated |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| *None* | All 7 STRIDE-A categories are evaluated for AdminApp. |

---

## ServerApi

**Trust Boundary:** Application
**Role:** Authoritative NestJS REST backend handling authentication, RBAC, business logic, and database persistence
**Data Flows:** DF04, DF05, DF06, DF07, DF08, DF09, DF10
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T03.D | Denial of Service | Automated HTTP request flood on public contact submission endpoint exhausting database resources | None | DF04 | Enforce strict per-IP rate limiting and backend bot detection on contact routes | Open |
| T03.T | Tampering | Cross-origin framing or clickjacking due to disabled Content Security Policy in Helmet | None | DF04 | Configure Content Security Policy header in Helmet middleware | Open |

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T03.S | Spoofing | Spoofing client IP address via X-Forwarded-For header due to unconstrained trust proxy setting | Internal Network | DF04 | Restrict trust proxy to trusted reverse proxy CIDR blocks | Open |
| T03.T2 | Tampering | Registering arbitrary storage keys or unverified file metadata via media upload completion endpoint | Privileged User | DF09 | Validate S3 object existence and size using S3 HeadObject before saving | Open |
| T03.I | Information Disclosure | Leaking database errors, table schemas, or stack traces on unhandled exceptions | Authenticated User | DF05 | GlobalExceptionFilter intercepts exceptions and redacts 500 error traces | Mitigated |
| T03.E | Elevation of Privilege | Last administrator demoting own account to standard user causing system lockout | Privileged User | DF05 | Enforce self-demotion checks and ensure at least one active administrator remains | Open |
| T03.E2 | Elevation of Privilege | Bypassing session revocation checks when token is absent from Session database table | Authenticated User | DF05 | Enforce strict token existence check and maintain revocation list in Redis | Open |
| T03.A | Abuse | High-frequency password guessing or brute-force attempts bypassing in-memory throttler | Authenticated User | DF05 | Store throttler state in Redis with distributed persistent rate counters | Open |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T03.R | Repudiation | Failure to record security events or user modifications during database service failure | Host/OS Access | DF07 | Atomic database transactions wrap critical data updates with audit records | Mitigated |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| *None* | All 7 STRIDE-A categories are evaluated for ServerApi. |

---

## PostgreSQL

**Trust Boundary:** Storage
**Role:** Persistent relational database holding CMS domain content, user accounts, sessions, and audit records
**Data Flows:** DF07
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

*No Tier 1 threats identified.*

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T04.S | Spoofing | Unauthorized connection to PostgreSQL database port from compromised internal network node | Internal Network | DF07 | Require strong database authentication password and isolate database subnet | Mitigated |
| T04.T | Tampering | SQL Injection via raw SQL queries altering or deleting database records | Internal Network | DF07 | Prisma 7 ORM uses parameterized queries exclusively; raw unescaped SQL forbidden | Mitigated |
| T04.I | Information Disclosure | Eavesdropping on unencrypted database network traffic across local network | Internal Network | DF07 | Configure database connection with sslmode=require and enforce TLS encryption | Mitigated |
| T04.D | Denial of Service | Connection pool starvation due to synchronous session lookups on every API request | Internal Network | DF07 | Cache active session validation state in Redis with sensible TTL | Open |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T04.E | Elevation of Privilege | Database superuser privilege abuse to read local filesystem or execute OS commands | Admin Credentials + Host/OS Access | DF07 | Run PostgreSQL service under dedicated unprivileged system account with least privilege | Mitigated |
| T04.A | Abuse | Accidental schema reset or destructive migration execution dropping production tables | Admin Credentials + Host/OS Access | DF07 | Engineering policy and CI/CD enforce prisma migrate deploy; migrate reset prohibited | Mitigated |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Repudiation | N/A — Database operations are logged via application AuditLogService and database write-ahead logs (WAL). |

---

## Redis

**Trust Boundary:** Storage
**Role:** In-memory caching, session revocation tracking, and API rate-limiting store
**Data Flows:** DF08
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

*No Tier 1 threats identified.*

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T05.S | Spoofing | Unauthenticated command execution against Redis server when REDIS_PASSWORD is not set | Internal Network | DF08 | Enforce mandatory REDIS_PASSWORD and Redis ACL user authentication | Open |
| T05.T | Tampering | Cache poisoning modifying cached API responses or clearing session revocation keys | Internal Network | DF08 | Secure Redis access with authentication and validate cache data integrity | Open |
| T05.I | Information Disclosure | Unencrypted Redis communications exposing session hashes and rate limit data on local network | Internal Network | DF08 | Enable Redis TLS encryption for all client connections | Open |
| T05.D | Denial of Service | Redis service downtime crashing backend API requests | Internal Network | DF08 | CacheService implements fallback error handling to directly query PostgreSQL | Mitigated |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T05.E | Elevation of Privilege | Execution of dangerous Redis commands (CONFIG, FLUSHALL) compromising database host | Host/OS Access | DF08 | Disable dangerous commands via rename-command in redis.conf | Open |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Repudiation | N/A — Ephemeral cache store does not maintain formal non-repudiation audit trails. |
| Abuse | N/A — Redis is strictly an internal service-to-service cache with no direct user-facing API surface. |

---

## FirebaseAuth

**Trust Boundary:** Outside Boundary
**Role:** Managed Google Cloud authentication service issuing and verifying user ID tokens
**Data Flows:** DF03, DF06
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

*No Tier 1 threats identified.*

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T06.S | Spoofing | Credential stuffing or password brute-force against Firebase Authentication endpoint | Authenticated User | DF03 | Google Firebase Identity Platform enforces brute-force protection and account lockout | Platform |
| T06.T | Tampering | Forging JWT claims or signatures to impersonate administrators | Authenticated User | DF06 | FirebaseAuthGuard cryptographically verifies token signatures with Google public certs | Mitigated |
| T06.I | Information Disclosure | Leaking Firebase service account private key allowing full project administrative takeover | Internal Network | DF06 | FIREBASE_PRIVATE_KEY injected via secret environment variables and redacted from logs | Mitigated |
| T06.D | Denial of Service | Firebase API service outage or rate-limiting blocking administrator sign-in | Internal Network | DF06 | Google Cloud multi-region high availability and enterprise SLA | Platform |
| T06.E | Elevation of Privilege | Malicious user assigning self-proclaimed roles via Firebase custom user claims | Privileged User | DF06 | RolesGuard authoritatively checks database roles in PostgreSQL; Firebase claims ignored | Mitigated |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T06.A | Abuse | Unauthorized users signing up via Firebase client SDK to gain unauthorized system access | Host/OS Access | DF03 | Newly created users receive USER role with zero CMS permissions by default | Mitigated |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Repudiation | N/A — Authentication events are recorded in Google Cloud Audit Logs and local Session tables. |

---

## S3Storage

**Trust Boundary:** Outside Boundary
**Role:** AWS S3 cloud storage service hosting media files uploaded through presigned URLs
**Data Flows:** DF09
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

*No Tier 1 threats identified.*

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T07.S | Spoofing | Interception and unauthorized reuse of presigned PUT upload URL | Authenticated User | DF09 | Presigned URLs restricted to short 900-second TTL and specific randomized keys | Mitigated |
| T07.T | Tampering | Overwriting legitimate media files by uploading to existing storage keys | Authenticated User | DF09 | Keys generated using collision-resistant random UUIDv7 and timestamp prefixes | Mitigated |
| T07.I | Information Disclosure | Public enumeration of S3 bucket objects exposing unlinked administrative files | Internal Network | DF09 | S3 Block Public Access enabled; files served through CloudFront CDN with strict origins | Mitigated |
| T07.D | Denial of Service | Uploading excessively large files via presigned URL exhausting S3 storage quota | Privileged User | DF09 | Enforce Content-Length-Range restrictions in presigned URL policy | Open |
| T07.E | Elevation of Privilege | Uploading executable or malicious HTML/SVG files resulting in stored XSS via CDN | Privileged User | DF09 | Validate MIME types and enforce Content-Disposition: attachment for non-image assets | Open |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T07.A | Abuse | Replaying expired presigned upload URLs or tampering with S3 upload signatures | Admin Credentials + Host/OS Access | DF09 | AWS S3 cryptographically validates SigV4 signatures and rejects modified requests | Platform |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Repudiation | N/A — S3 storage operations are tracked via AWS CloudTrail and S3 server access logging. |

---

## Sentry

**Trust Boundary:** Outside Boundary
**Role:** Cloud error logging and application performance monitoring platform
**Data Flows:** DF10, DF11, DF12
**Pod Co-location:** N/A

### STRIDE-A Analysis

#### Tier 1 — Direct Exposure (No Prerequisites)

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T08.D | Denial of Service | Flooding public Sentry DSN endpoint with synthetic events exhausting error quotas | None | DF11 | Sentry edge rate limiting, event filtering, and client sampleRate limits | Platform |
| T08.A | Abuse | Injecting misleading crash reports to obscure active security attacks or generate alert fatigue | None | DF11 | Sentry allowed domains restrictions and server-side issue fingerprinting | Platform |

#### Tier 2 — Conditional Risk

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T08.I | Information Disclosure | Sensitive user credentials, Bearer tokens, or PII transmitted in Sentry breadcrumbs | Authenticated User | DF10 | Sentry beforeSend hook sanitizes headers, cookies, and removes sensitive payload data | Mitigated |
| T08.T | Tampering | Modifying Sentry configuration variables in runtime to suppress security alerting | Privileged User | DF10 | Sentry configuration is set via immutable environment variables at deployment | Mitigated |

#### Tier 3 — Defense-in-Depth

| ID | Category | Threat | Prerequisites | Affected Flow | Mitigation | Status |
|----|----------|--------|---------------|---------------|------------|--------|
| T08.S | Spoofing | Spoofing Sentry ingestion server via DNS hijacking to capture application exceptions | Host/OS Access | DF10 | Sentry SDK enforces TLS with strict certificate verification | Platform |
| T08.E | Elevation of Privilege | Leaking Sentry auth tokens in CI/CD pipeline allowing unauthorized access to project issues | Host/OS Access | DF10 | Protect SENTRY_AUTH_TOKEN in GitHub Actions Secrets and prevent layer leakage | Open |

#### Categories Not Applicable

| Category | Justification |
|----------|---------------|
| Repudiation | N/A — Sentry functions as an observational telemetry sink rather than an authoritative transaction log. |
