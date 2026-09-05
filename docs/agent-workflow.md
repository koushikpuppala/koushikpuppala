# AI Agent Engineering Workflow

This repository follows a disciplined AI-assisted engineering workflow.

## Philosophy

AI agents can implement code quickly, but speed does not replace engineering judgment.

The agent should:

- Inspect before changing.
- Think before implementing.
- Preserve architecture.
- Verify before claiming success.
- Review correctness, not only functionality.
- Preserve durable context between sessions.
- Maintain visual consistency across UI work.

## Core Loop

```text
/architect → Build → /review → Ship
                 ↓
/imprint  (after UI components)
                 ↓
/remember (start/end sessions)
                 ↓
/recover  (when something breaks)
```

## Skills

### `/architect`

Use before meaningful feature work.

Think through the implementation as a senior engineer.

Expected output:

- Problem understanding
- Relevant constraints
- Architecture considerations
- Affected boundaries
- Implementation plan
- Verification plan

Do not use a full architecture ceremony for trivial changes.

### `/remember`

Use at the start and end of meaningful sessions.

```text
/remember restore
```

Restores durable project context.

```text
/remember save
```

Persists useful context for future sessions.

Memory should prioritize:

- Decisions
- Constraints
- Current architecture
- Important implementation details
- Unfinished work
- Known issues

Avoid storing unnecessary noise.

### `/review`

Use after meaningful feature work.

Review:

1. Plan alignment
2. System integrity
3. Production readiness

A working implementation is not automatically a correct implementation.

### `/recover`

Use when a problem occurs.

Classify it before patching:

```text
Targeted fix
    Isolated failure with a clear root cause.

Hard reset
    The session/context has become polluted and continuing would
    likely produce more patches instead of a clean solution.

Rethink
    The foundation or design is wrong and debugging cannot fix it.
```

Do not repeatedly patch symptoms.

### `/imprint`

Use after meaningful UI component work.

```text
/imprint
```

Capture the recently built component's visual patterns.

```text
/imprint [file]
```

Capture patterns from a specific file.

```text
/imprint audit
```

Audit the codebase and establish a UI consistency baseline.

## Practical Workflow

### Feature

```text
/remember restore
      ↓
/architect
      ↓
Implement
      ↓
/imprint       ← UI work
      ↓
/review
      ↓
Verify / test
      ↓
/remember save
```

### Bug

```text
/remember restore
      ↓
/recover
      ↓
Reproduce
      ↓
Root-cause fix
      ↓
Test
      ↓
Review / verify
      ↓
/remember save
```

### Small Change

```text
Inspect
  ↓
Implement
  ↓
Verify
```

Do not over-process trivial work.

## Source

The workflow is based on the JSM Skills model provided for this repository. The repository should use the actual installed skill definitions when available; this document describes how those skills fit into the project's engineering process and does not replace the skill implementations.
