# Security Findings

---

## Tier 1 — Direct Exposure (No Prerequisites)

### FIND-01: Unauthenticated Public Contact Endpoint Lacks Dedicated Rate Limiting and Backend CAPTCHA Verification

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Important |
| CVSS 4.0 | 7.1 (CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-770](https://cwe.mitre.org/data/definitions/770.html): Allocation of Resources Without Limits or Throttling |
| OWASP | A05:2025 – Security Misconfiguration |
| Exploitation Prerequisites | None |
| Exploitability Tier | Tier 1 — Direct Exposure (No Prerequisites) |
| Remediation Effort | Low |
| Mitigation Type | Custom Mitigation |
| Component | ServerApi |
| Related Threats | [T01.D](2-stride-analysis.md#clientapp), [T01.A](2-stride-analysis.md#clientapp), [T03.D](2-stride-analysis.md#serverapi) |

#### Description

The public contact inquiry endpoint (`POST /api/v1/contacts`) is annotated with `@Public()`, bypassing the authoritative `FirebaseAuthGuard`. However, it relies solely on the global in-memory rate limiter configured for 1,000 requests per 60-second window across the entire application. The endpoint does not implement a dedicated, restrictive per-IP rate limit, nor does it verify an anti-automation mechanism such as Google reCAPTCHA or Cloudflare Turnstile on the backend. An automated attacker can flood the endpoint with tens of thousands of spam contact submissions, exhausting PostgreSQL database storage, exhausting database connection pools, and contaminating administrator message inboxes.

#### Evidence

**Prerequisite basis:** The endpoint is marked with `@Public()` in `apps/server/src/modules/contact/contact.controller.ts:28-29` and binds to the external network interface `0.0.0.0:8080`, allowing unauthenticated requests over the internet without credentials.

Specific code evidence:
- `apps/server/src/modules/contact/contact.controller.ts:28-41`:
  ```typescript
  @Public()
  @Post()
  async submit(@Body() dto: CreateContactDto, @Req() req: Request) {
    const ip = req.context?.ip || req.ip
    const userAgent = req.headers['user-agent']
    return this.contactService.submit(dto, ip, userAgent)
  }
  ```
- `apps/server/src/app.module.ts:77`:
  ```typescript
  ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
  ```
- `apps/server/src/modules/contact/contact.service.ts:17-39`: Persists submissions directly to PostgreSQL via `this.prisma.contact.create()` without checking any CAPTCHA challenge token.

#### Remediation

1. Apply NestJS `@Throttle({ default: { limit: 5, ttl: 60_000 } })` decorator directly to `ContactController.submit()` to limit public submissions to 5 requests per minute per IP address.
2. Require a valid `recaptchaToken` or Cloudflare Turnstile token in `CreateContactDto` and validate it server-side against the reCAPTCHA verification API (`RECAPTCHA_SECRET_KEY`) before creating database records.
3. Introduce an optional hidden honeypot field in the submission payload; if populated, silently discard the inquiry.

#### Verification

Issue 10 consecutive `POST /api/v1/contacts` requests from a single IP address using `curl`. Verify that the 6th request receives HTTP `429 Too Many Requests`. Submit a payload without a valid reCAPTCHA token and verify that the endpoint returns HTTP `400 Bad Request`.

---

### FIND-02: Content Security Policy (CSP) Explicitly Disabled in Helmet Configuration

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Moderate |
| CVSS 4.0 | 5.3 (CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N) |
| CWE | [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html): Improper Restriction of Rendered UI Layers or Frames |
| OWASP | A02:2025 – Sensitive Data Exposure / Cryptographic Failures / Insecure Design |
| Exploitation Prerequisites | None |
| Exploitability Tier | Tier 1 — Direct Exposure (No Prerequisites) |
| Remediation Effort | Low |
| Mitigation Type | Standard Mitigation |
| Component | ServerApi |
| Related Threats | [T03.T](2-stride-analysis.md#serverapi) |

#### Description

The NestJS backend API initializes `helmet` HTTP security middleware in `main.ts`, but explicitly disables `contentSecurityPolicy` and `crossOriginEmbedderPolicy` (`contentSecurityPolicy: false, crossOriginEmbedderPolicy: false`). When API endpoints return HTML responses (such as Swagger OpenAPI documentation at `/api/docs` or unhandled error pages), the browser renders them without a Content Security Policy header. This increases exposure to cross-site scripting (XSS), cross-origin frame injection, and clickjacking attacks targeting administrators viewing API documentation or error outputs.

#### Evidence

**Prerequisite basis:** The Express application instance is exposed on `0.0.0.0:8080` with globally applied Helmet middleware in `apps/server/src/main.ts:44-50`, affecting all public and authenticated HTTP responses.

Specific code evidence:
- `apps/server/src/main.ts:44-50`:
  ```typescript
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )
  ```

#### Remediation

1. Enable Helmet's default Content Security Policy or configure an explicit policy tailored for REST APIs and Swagger UI:
   ```typescript
   app.use(
     helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           scriptSrc: ["'self'", "'unsafe-inline'"],
           styleSrc: ["'self'", "'unsafe-inline'"],
           imgSrc: ["'self'", 'data:', 'https:'],
         },
       },
       crossOriginEmbedderPolicy: false,
       crossOriginResourcePolicy: { policy: 'cross-origin' },
     }),
   )
   ```
2. If Swagger UI requires relaxed directives, scope the relaxed CSP specifically to the `/api/docs` route while maintaining a strict `default-src 'none'` CSP on all `/api/v1/*` REST endpoints.

#### Verification

Send an HTTP request via `curl -I http://localhost:8080/api/v1/contacts` and inspect response headers. Verify that `Content-Security-Policy` header is present and includes valid security directives.

---

## Tier 2 — Conditional Risk (Authenticated / Single Prerequisite)

### FIND-03: Unauthenticated Redis Transport and Optional Authentication Configuration

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Important |
| CVSS 4.0 | 7.1 (CVSS:4.0/AV:A/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-306](https://cwe.mitre.org/data/definitions/306.html): Missing Authentication for Critical Function |
| OWASP | A02:2025 – Sensitive Data Exposure / Cryptographic Failures / Insecure Design |
| Exploitation Prerequisites | Internal Network |
| Exploitability Tier | Tier 2 — Conditional Risk (Single Prerequisite) |
| Remediation Effort | Low |
| Mitigation Type | Standard Mitigation |
| Component | Redis |
| Related Threats | [T05.S](2-stride-analysis.md#redis), [T05.T](2-stride-analysis.md#redis), [T05.I](2-stride-analysis.md#redis), [T05.E](2-stride-analysis.md#redis) |

#### Description

The Redis configuration in `apps/server/src/config/configuration.ts` treats `REDIS_PASSWORD` as optional (`this.optional('REDIS_PASSWORD')`) and defaults the connection host to an external domain name (`server.koushikpuppala.com`) or port 6379 without enforcing TLS encryption (`tls` option is not configured in `ioredis` options). If the Redis instance is provisioned without a password or exposed across an unsegmented internal network, any adjacent compromised process or network attacker can connect directly to Redis, flush cache stores, poison cached API responses, inspect session hashes, or execute dangerous administrative commands (`CONFIG`, `FLUSHALL`).

#### Evidence

**Prerequisite basis:** Redis listens on port 6379 and is reachable by components sharing the host network or internal docker bridge, as documented in the Component Exposure Table (`127.0.0.1:6379`, Reachability: Internal Only).

Specific code evidence:
- `apps/server/src/config/configuration.ts:47-57`:
  ```typescript
  this.redis = {
    host: this.get('REDIS_HOST', 'server.koushikpuppala.com'),
    port: this.number('REDIS_PORT', 6379),
    username: this.optional('REDIS_USERNAME'),
    password: this.optional('REDIS_PASSWORD'),
    db: this.number('REDIS_DB', 0),
    keepAlive: this.number('REDIS_KEEP_ALIVE', 30_000),
    lazyConnect: this.boolean('REDIS_LAZY_CONNECT', true),
    connectTimeout: this.number('REDIS_CONNECT_TIMEOUT', 10_000),
    maxRetriesPerRequest: this.number('REDIS_MAX_RETRIES_PER_REQUEST', 3),
  }
  ```
- `apps/server/src/redis/redis.service.ts:16`: Directly passes `this.config.redis` to `new Redis(this.config.redis)` without validating that authentication credentials or TLS parameters are set.

#### Remediation

1. Require `REDIS_PASSWORD` in production environments by changing `this.optional('REDIS_PASSWORD')` to `this.required('REDIS_PASSWORD')` when `NODE_ENV === 'production'`.
2. Add support for TLS encryption by enabling `tls: {}` in `ioredis` options when connecting over remote or non-loopback host interfaces.
3. Configure `redis.conf` with `rename-command CONFIG ""` and `rename-command FLUSHALL ""` to prevent execution of destructive commands.

#### Verification

Attempt to connect to Redis without specifying a password using `redis-cli -h localhost -p 6379 ping`. Verify that the server responds with `(error) NOAUTH Authentication required`. Confirm backend logs show successful connection only when valid credentials are provided.

---

### FIND-04: Missing Self-Demotion and Last-Admin Account Protection in User Management

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Important |
| CVSS 4.0 | 5.9 (CVSS:4.0/AV:N/AC:L/AT:N/PR:H/UI:N/VC:N/VI:L/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-284](https://cwe.mitre.org/data/definitions/284.html): Improper Access Control |
| OWASP | A01:2025 – Broken Access Control |
| Exploitation Prerequisites | Privileged User |
| Exploitability Tier | Tier 2 — Conditional Risk (Single Prerequisite) |
| Remediation Effort | Low |
| Mitigation Type | Custom Mitigation |
| Component | ServerApi |
| Related Threats | [T03.E](2-stride-analysis.md#serverapi) |

#### Description

The administrative user modification method (`UserService.adminUpdate`) allows an administrator to update any user's role (`dto.role`) or account status (`dto.status`). However, the service logic lacks safety checks to prevent an administrator from demoting their own account to `USER` or setting their own status to `INACTIVE`. Furthermore, it does not check whether the target account is the sole active `ADMIN` in the database. If an administrator accidentally demotes themselves or deactivates the last remaining administrative account, all administrative capabilities across the CMS studio are lost, resulting in complete denial of administrative access requiring manual database intervention.

#### Evidence

**Prerequisite basis:** The endpoint requires an authenticated user possessing the `ADMIN` role (`@Roles(UserRole.ADMIN)` enforced by `RolesGuard`), fulfilling the Privileged User prerequisite.

Specific code evidence:
- `apps/server/src/modules/user/user.service.ts:452-466`:
  ```typescript
  if (dto.role) data.role = dto.role
  if (dto.status) data.status = dto.status
  ```
- Neither `UserService.adminUpdate` nor `UserController.update` verifies whether `id === actorId` when modifying roles, nor do they query `prisma.user.count({ where: { role: UserRole.ADMIN, status: UserStatus.ACTIVE } })` before applying demotion or deactivation.

#### Remediation

1. In `UserService.adminUpdate`, check if `id === actorId` when `dto.role` or `dto.status` is provided. If attempting self-demotion or self-deactivation, throw a `BadRequestException('Administrators cannot demote or deactivate their own account')`.
2. If modifying another user with `role === UserRole.ADMIN`, verify the system retains at least one active administrator:
   ```typescript
   if (user.role === UserRole.ADMIN && (dto.role !== UserRole.ADMIN || dto.status === UserStatus.INACTIVE)) {
     const adminCount = await this.prisma.user.count({
       where: { role: UserRole.ADMIN, status: UserStatus.ACTIVE, id: { not: id } }
     })
     if (adminCount === 0) {
       throw new BadRequestException('Cannot demote or deactivate the last remaining active administrator')
     }
   }
   ```

#### Verification

Authenticate as the sole administrator and send `PATCH /api/v1/users/{self-id}` with `{"role": "USER"}`. Verify that the API rejects the request with HTTP `400 Bad Request` and error message indicating self-demotion is prohibited.

---

### FIND-05: Global In-Memory Rate Limiter Lacks Distributed Redis Store and Resets on Restarts

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Moderate |
| CVSS 4.0 | 5.3 (CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N) |
| CWE | [CWE-400](https://cwe.mitre.org/data/definitions/400.html): Uncontrolled Resource Consumption |
| OWASP | A10:2025 – Uncontrolled Resource Consumption / Mishandled Limits |
| Exploitation Prerequisites | Authenticated User |
| Exploitability Tier | Tier 2 — Conditional Risk (Single Prerequisite) |
| Remediation Effort | Medium |
| Mitigation Type | Standard Mitigation |
| Component | ServerApi |
| Related Threats | [T02.A](2-stride-analysis.md#adminapp), [T03.S](2-stride-analysis.md#serverapi), [T03.A](2-stride-analysis.md#serverapi) |

#### Description

The NestJS application registers `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])` backed by default in-memory storage. In-memory rate limiting stores hit counts in local process RAM. Consequently, when the backend service restarts, deploys a new container, or scales horizontally to multiple cluster worker processes or container instances, rate counters immediately reset to zero. Furthermore, attackers distributing requests across multiple backend replicas bypass throttling entirely. The 1,000 requests per minute threshold is also overly generous for state-changing administrative operations.

#### Evidence

**Prerequisite basis:** Attackers authenticated as standard or administrative users can send sustained bursts of API mutations, satisfying the Authenticated User prerequisite.

Specific code evidence:
- `apps/server/src/app.module.ts:77-80`:
  ```typescript
  ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
  // ...
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  ```
- No distributed storage adapter (such as `@nest-lab/throttler-storage-redis` or `ioredis`) is configured in `ThrottlerModule.forRoot()`.

#### Remediation

1. Install `@nest-lab/throttler-storage-redis` and integrate Redis as the backing store for `ThrottlerModule`:
   ```typescript
   ThrottlerModule.forRootAsync({
     imports: [ConfigModule],
     inject: [ConfigService],
     useFactory: (config: ConfigService) => ({
       throttlers: [{ ttl: 60_000, limit: 100 }],
       storage: new ThrottlerStorageRedisService(config.redis),
     }),
   })
   ```
2. Define named rate limit tiers (e.g., `public`, `standard`, `sensitive`) and apply stricter limits to sensitive routes such as authentication sessions, user role changes, and media uploads.

#### Verification

Send 100 rapid requests to an API endpoint across two separate container instances or worker processes. Verify that request counts accumulate in a single shared Redis key (`throttle:*`) and that the 101st request returns HTTP `429 Too Many Requests` regardless of which container processed the request.

---

### FIND-06: Media Upload Completion Lacks Server-Side S3 Object Existence and Size Verification

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Moderate |
| CVSS 4.0 | 5.1 (CVSS:4.0/AV:N/AC:L/AT:N/PR:H/UI:N/VC:N/VI:L/VA:L/SC:N/SI:N/SA:N) |
| CWE | [CWE-345](https://cwe.mitre.org/data/definitions/345.html): Insufficient Verification of Data Authenticity |
| OWASP | A08:2025 – Software and Data Integrity Failures |
| Exploitation Prerequisites | Privileged User |
| Exploitability Tier | Tier 2 — Conditional Risk (Single Prerequisite) |
| Remediation Effort | Medium |
| Mitigation Type | Custom Mitigation |
| Component | ServerApi |
| Related Threats | [T03.T2](2-stride-analysis.md#serverapi), [T07.D](2-stride-analysis.md#s3storage), [T07.E](2-stride-analysis.md#s3storage) |

#### Description

The media upload workflow operates in two phases: first requesting a presigned S3 upload URL via `getPresignedUrl`, then finalizing the record in PostgreSQL via `completeUpload`. However, `MediaService.completeUpload` accepts the user-supplied `storageKey`, `size`, and `mimeType` directly from the request body and writes the record into the database without executing an AWS S3 `HeadObject` check. A rogue or compromised administrative account can register non-existent storage keys, inject spoofed file sizes or MIME types, or attach malicious storage paths without ever uploading a valid file to S3, polluting the media repository and breaking client frontend rendering.

#### Evidence

**Prerequisite basis:** The media completion endpoint requires an authenticated session with administrative/editor privileges, fulfilling the Privileged User prerequisite.

Specific code evidence:
- `apps/server/src/modules/media/media.service.ts:61-90`:
  ```typescript
  async completeUpload(dto: CompleteMediaUploadDto, userId?: string, actor = 'admin') {
    const extension = extname(dto.originalName).toLowerCase().replace('.', '')
    const fileName = dto.storageKey.split('/').pop() ?? dto.originalName
    // ...
    const media = await this.prisma.media.create({
      data: {
        type: dto.type,
        fileName,
        size: dto.size,
        mimeType: dto.mimeType,
        storageKey: dto.storageKey,
        // ...
      }
    })
    return media
  }
  ```
- No S3 `HeadObjectCommand` call is performed to verify that the object exists in AWS S3 and that the actual S3 object byte size matches `dto.size`.

#### Remediation

1. Inject AWS S3 client into `MediaService` and invoke `HeadObjectCommand` before creating the database record:
   ```typescript
   const s3Object = await this.s3Client.send(
     new HeadObjectCommand({
       Bucket: this.config.aws.s3Bucket,
       Key: dto.storageKey,
     })
   )
   if (!s3Object.ContentLength || s3Object.ContentLength !== dto.size) {
     throw new BadRequestException('Uploaded file size mismatch or object not found in S3')
   }
   ```
2. Verify that `s3Object.ContentType` matches or is compatible with `dto.mimeType`.

#### Verification

Call `POST /api/v1/media/complete` providing a fabricated `storageKey` that does not exist in S3. Verify that the server rejects the request with HTTP `400 Bad Request` and does not insert a record into the `Media` table.

---

### FIND-07: Session Revocation Verification Relies on Uncached PostgreSQL Queries with Default-Allow on Unregistered Tokens

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Moderate |
| CVSS 4.0 | 5.1 (CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N) |
| CWE | [CWE-613](https://cwe.mitre.org/data/definitions/613.html): Insufficient Session Expiration |
| OWASP | A07:2025 – Identification and Authentication Failures |
| Exploitation Prerequisites | Authenticated User |
| Exploitability Tier | Tier 2 — Conditional Risk (Single Prerequisite) |
| Remediation Effort | Medium |
| Mitigation Type | Custom Mitigation |
| Component | ServerApi |
| Related Threats | [T02.S](2-stride-analysis.md#adminapp), [T03.E2](2-stride-analysis.md#serverapi), [T04.D](2-stride-analysis.md#postgresql) |

#### Description

The session management service (`SessionService.isSessionRevoked`) checks token revocation status by executing a direct SQL query against PostgreSQL on every protected API call (`findUnique({ where: { tokenHash } })`). This design introduces two distinct security and operational risks:
1. **Default-allow behavior on missing sessions:** If `session` is `null` (because a valid Firebase ID token was obtained outside the standard login endpoint or the session record was purged), the method returns `false` (i.e., NOT revoked), allowing access rather than denying access.
2. **Database connection starvation:** Bypassing Redis cache for token revocation forces a synchronous PostgreSQL lookup on every single authenticated HTTP request, exposing the database connection pool to starvation under high traffic.

#### Evidence

**Prerequisite basis:** An attacker holding a valid Firebase ID token (obtained via client authentication or token replay) accesses protected backend endpoints, fulfilling the Authenticated User prerequisite.

Specific code evidence:
- `apps/server/src/modules/auth/session.service.ts:80-92`:
  ```typescript
  async isSessionRevoked(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token)
    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      select: { revoked: true, expiresAt: true },
    })

    if (!session) return false
    if (session.revoked) return true
    if (session.expiresAt < new Date()) return true

    return false
  }
  ```
- `apps/server/src/common/guards/firebase-auth.guard.ts:95-97`:
  ```typescript
  const isRevoked = await this.sessionService.isSessionRevoked(token)
  if (isRevoked) throw new UnauthorizedException('Session has been revoked')
  ```

#### Remediation

1. Maintain an active token revocation blocklist in Redis (`session:revoked:{tokenHash}`) with a TTL equal to the remaining Firebase token lifespan (maximum 1 hour).
2. Query Redis first before falling back to PostgreSQL.
3. In strict session mode, reject tokens whose session is missing from the database, or record active session tokens upon initial verification.

#### Verification

Invoke a protected endpoint with an unrevoked token and verify via Redis monitor that the session lookup checks Redis cache. Revoke the session via `POST /api/v1/auth/logout`, then issue an API call with the token and confirm it returns HTTP `401 Unauthorized`.

---

## Tier 3 — Defense-in-Depth (Prior Compromise / Host Access)

### FIND-08: Deployment SSH Host Key Verification Disabled in CI/CD Workflow

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Important |
| CVSS 4.0 | 7.0 (CVSS:4.0/AV:A/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-295](https://cwe.mitre.org/data/definitions/295.html): Improper Certificate or Key Validation |
| OWASP | A08:2025 – Software and Data Integrity Failures |
| Exploitation Prerequisites | Internal Network |
| Exploitability Tier | Tier 3 — Defense-in-Depth (Prior Compromise / Host Access) |
| Remediation Effort | Low |
| Mitigation Type | Standard Mitigation |
| Component | ServerApi |
| Related Threats | [T04.S](2-stride-analysis.md#postgresql) |

#### Description

The GitHub Actions production deployment workflow connects to the production AWS EC2 instance over SSH to pull Docker images and restart containers. However, the SSH command explicitly disables host key checking using `-o StrictHostKeyChecking=no`. An active network adversary positioning themselves between the GitHub Actions runner and the EC2 target (via DNS spoofing, ARP cache poisoning, or BGP hijacking) can intercept the connection, conduct a Man-in-the-Middle (MitM) attack, and capture administrative deployment commands or redirect commands to an attacker-controlled host.

#### Evidence

**Prerequisite basis:** Requires man-in-the-middle positioning on the network path between GitHub hosted runners and the AWS EC2 instance, matching the Internal Network / Network Adversary prerequisite.

Specific code evidence:
- `.github/workflows/production.yml:144-147`:
  ```yaml
  - name: Deploy to EC2
    run: |
      ssh -o StrictHostKeyChecking=no ${{ vars.EC2_USER }}@${{ vars.EC2_HOST }} << 'EOF'
        # Pull the latest Docker image
  ```

#### Remediation

1. Retrieve the EC2 instance's public SSH host key fingerprint and store it in GitHub Actions Secrets as `EC2_KNOWN_HOSTS`.
2. Configure `ssh-keyscan` or write the host key into `~/.ssh/known_hosts` prior to connecting:
   ```yaml
   - name: Configure SSH known hosts
     run: |
       mkdir -p ~/.ssh
       echo "${{ secrets.EC2_KNOWN_HOSTS }}" >> ~/.ssh/known_hosts
       chmod 644 ~/.ssh/known_hosts
   - name: Deploy to EC2
     run: |
       ssh ${{ vars.EC2_USER }}@${{ vars.EC2_HOST }} << 'EOF'
   ```
3. Remove `-o StrictHostKeyChecking=no` entirely.

#### Verification

Trigger a CI/CD deployment and verify from runner logs that SSH connects successfully using the verified `known_hosts` entry without disabling host key checking. Attempt connection to a host with a mismatched fingerprint and verify SSH aborts with a host key verification error.

---

### FIND-09: Production Secrets Written to `.env` File Inside CI/CD Runner and Baked into Docker Image Layers

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Important |
| CVSS 4.0 | 6.8 (CVSS:4.0/AV:L/AC:L/AT:N/PR:H/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-538](https://cwe.mitre.org/data/definitions/538.html): Insertion of Sensitive Information into Externally-Accessible File or Directory |
| OWASP | A04:2025 – Insecure Design / Cryptographic Failures |
| Exploitation Prerequisites | Host/OS Access |
| Exploitability Tier | Tier 3 — Defense-in-Depth (Prior Compromise / Host Access) |
| Remediation Effort | Low |
| Mitigation Type | Standard Mitigation |
| Component | ServerApi |
| Related Threats | [T01.I2](2-stride-analysis.md#clientapp), [T08.E](2-stride-analysis.md#sentry) |

#### Description

The CI/CD workflow (`production.yml`) generates a `.env` file directly on the runner workspace filesystem containing database credentials, Sentry authentication tokens, and reCAPTCHA secrets. Subsequently, the Docker build step runs `docker/build-push-action`, copying the workspace into the Docker container via `COPY . .` in `Dockerfile`. Because `.dockerignore` excludes `**/.env*.local` but does NOT exclude `.env`, the plaintext secrets file is copied into the intermediate `builder` image layer. Anyone with read access to the Docker image repository or container layer cache can extract database passwords and administrative tokens using `docker history` or filesystem inspection tools.

#### Evidence

**Prerequisite basis:** Requires access to the container image registry, intermediate build cache, or runner filesystem, fulfilling the Host/OS Access prerequisite.

Specific code evidence:
- `.github/workflows/production.yml:53-71`:
  ```yaml
  - name: Create .env file
    run: |
      echo "USER=${{ secrets.USER }}" >> .env
      echo "PASS=${{ secrets.PASS }}" >> .env
      echo "DATABASE=${{ secrets.DATABASE }}" >> .env
      echo "SENTRY_AUTH_TOKEN=${{ secrets.SENTRY_AUTH_TOKEN }}" >> .env
      echo "RECAPTCHA_SECRET_KEY=${{ secrets.RECAPTCHA_SECRET_KEY }}" >> .env
  ```
- `Dockerfile:31`:
  ```dockerfile
  COPY . .
  ```
- `.dockerignore:32`:
  ```text
  **/.env*.local
  ```
  Note that `.env` itself is absent from `.dockerignore`.

#### Remediation

1. Add `.env` explicitly to `.dockerignore`:
   ```text
   .env
   .env.*
   ```
2. Avoid generating a `.env` file during CI builds. Instead, use Docker BuildKit secret mounts (`--secret id=mysecret,src=.env`) or pass required build arguments strictly for public non-sensitive variables.
3. Inject runtime secrets exclusively at container launch time on EC2 using environment files or AWS Secrets Manager.

#### Verification

Build the Docker image using `docker build -t test-build .` and run `docker history --no-trunc test-build`. Inspect layer files with `docker run --rm test-build ls -la /app` to confirm no `.env` file exists within the image layers.

---

### FIND-10: Third-Party GitHub Actions Unpinned to Immutable Commit SHAs

| Attribute | Value |
|-----------|-------|
| SDL Bugbar Severity | Moderate |
| CVSS 4.0 | 6.8 (CVSS:4.0/AV:N/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N) |
| CWE | [CWE-1357](https://cwe.mitre.org/data/definitions/1357.html): Reliance on Insufficiently Trustworthy Component |
| OWASP | A03:2025 – Supply Chain Vulnerabilities / Software and Data Integrity |
| Exploitation Prerequisites | Host/OS Access |
| Exploitability Tier | Tier 3 — Defense-in-Depth (Prior Compromise / Host Access) |
| Remediation Effort | Low |
| Mitigation Type | Standard Mitigation |
| Component | ServerApi |
| Related Threats | [T01.E](2-stride-analysis.md#clientapp) |

#### Description

The GitHub Actions workflows (`production.yml` and `developement.yml`) reference external third-party actions using mutable branch tags such as `@master` (e.g., `actions/checkout@master`, `docker/setup-qemu-action@master`, `docker/setup-buildx-action@master`, `docker/login-action@master`, `docker/build-push-action@master`, `webfactory/ssh-agent@master`). If a malicious maintainer or upstream account compromise modifies the `@master` branch on any of these external repositories, attacker-controlled code can execute inside the privileged GitHub Actions runner environment, exfiltrating GitHub secrets (EC2 SSH private keys, Sentry tokens, database passwords) and compromising the production deployment pipeline.

#### Evidence

**Prerequisite basis:** Requires compromise of upstream third-party GitHub Action repositories or tags, fulfilling the Supply Chain / Host Access prerequisite.

Specific code evidence:
- `.github/workflows/production.yml:50,79,87,95,105,115,139`:
  ```yaml
  uses: actions/checkout@master
  uses: docker/setup-qemu-action@master
  uses: docker/setup-buildx-action@master
  uses: docker/login-action@master
  uses: docker/build-push-action@master
  uses: webfactory/ssh-agent@master
  ```

#### Remediation

1. Pin all GitHub Actions to immutable full 40-character commit SHAs with inline version comments:
   ```yaml
   - name: Checkout Repository
     uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
   - name: Set up QEMU
     uses: docker/setup-qemu-action@49b3bc8e6bdd4460b0f490b31a70c14f085cb2cb # v3.3.0
   - name: Set up SSH key for EC2
     uses: webfactory/ssh-agent@dc588b651fe13675774614f8e6a936a468676387 # v0.9.0
   ```
2. Configure Dependabot to automatically monitor and submit pull requests for action SHA updates.

#### Verification

Inspect `.github/workflows/production.yml` and verify every `uses:` declaration references a 40-character SHA hash. Run a workflow dry run or linter like `actionlint` to ensure all action references resolve successfully.

---

## Threat Coverage Verification

| Threat ID | Finding ID | Status |
|-----------|------------|--------|
| T01.D | FIND-01 | ✅ Covered (FIND-01) |
| T01.A | FIND-01 | ✅ Covered (FIND-01) |
| T01.T | — | 🔄 Mitigated by Platform |
| T01.I | — | 🔄 Mitigated by Platform |
| T01.I2 | FIND-09 | ✅ Covered (FIND-09) |
| T01.E | FIND-10 | ✅ Covered (FIND-10) |
| T02.S | FIND-07 | ✅ Covered (FIND-07) |
| T02.T | — | 🔄 Mitigated by Platform |
| T02.I | — | 🔄 Mitigated by Platform |
| T02.E | — | 🔄 Mitigated by Platform |
| T02.A | FIND-05 | ✅ Covered (FIND-05) |
| T02.R | — | 🔄 Mitigated by Platform |
| T02.D | — | 🔄 Mitigated by Platform |
| T03.D | FIND-01 | ✅ Covered (FIND-01) |
| T03.T | FIND-02 | ✅ Covered (FIND-02) |
| T03.S | FIND-05 | ✅ Covered (FIND-05) |
| T03.T2 | FIND-06 | ✅ Covered (FIND-06) |
| T03.I | — | 🔄 Mitigated by Platform |
| T03.E | FIND-04 | ✅ Covered (FIND-04) |
| T03.E2 | FIND-07 | ✅ Covered (FIND-07) |
| T03.A | FIND-05 | ✅ Covered (FIND-05) |
| T03.R | — | 🔄 Mitigated by Platform |
| T04.S | FIND-08 | ✅ Covered (FIND-08) |
| T04.T | — | 🔄 Mitigated by Platform |
| T04.I | — | 🔄 Mitigated by Platform |
| T04.D | FIND-07 | ✅ Covered (FIND-07) |
| T04.E | — | 🔄 Mitigated by Platform |
| T04.A | — | 🔄 Mitigated by Platform |
| T05.S | FIND-03 | ✅ Covered (FIND-03) |
| T05.T | FIND-03 | ✅ Covered (FIND-03) |
| T05.I | FIND-03 | ✅ Covered (FIND-03) |
| T05.D | — | 🔄 Mitigated by Platform |
| T05.E | FIND-03 | ✅ Covered (FIND-03) |
| T06.S | — | 🔄 Mitigated by Platform |
| T06.T | — | 🔄 Mitigated by Platform |
| T06.I | — | 🔄 Mitigated by Platform |
| T06.D | — | 🔄 Mitigated by Platform |
| T06.E | — | 🔄 Mitigated by Platform |
| T06.A | — | 🔄 Mitigated by Platform |
| T07.S | — | 🔄 Mitigated by Platform |
| T07.T | — | 🔄 Mitigated by Platform |
| T07.I | — | 🔄 Mitigated by Platform |
| T07.D | FIND-06 | ✅ Covered (FIND-06) |
| T07.E | FIND-06 | ✅ Covered (FIND-06) |
| T07.A | — | 🔄 Mitigated by Platform |
| T08.D | — | 🔄 Mitigated by Platform |
| T08.A | — | 🔄 Mitigated by Platform |
| T08.I | — | 🔄 Mitigated by Platform |
| T08.T | — | 🔄 Mitigated by Platform |
| T08.S | — | 🔄 Mitigated by Platform |
| T08.E | FIND-09 | ✅ Covered (FIND-09) |
