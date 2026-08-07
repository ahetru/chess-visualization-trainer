# InnerChess — Project-specific rules

## Project context

Web app for training chess visualization. It is **not** a site to play chess
(no matchmaking, no live games between players). The goal is pedagogical:
improve the player's ability to visualize positions and variations mentally,
without relying permanently on the board display.

Exercise types are not all defined yet. Ideas under consideration (not fixed):

- **Blind move**: show a position, announce a move, ask the player to
  visualize/describe the resulting position.
- **Sequence without board**: play out several moves in notation from a
  starting FEN, ask for the final position.
- **Imagination puzzle**: classic tactical puzzle, but the board disappears
  after the first move.

Do **not** assume a specific exercise type is fixed — check with the user
before implementing a game mechanic that has not been explicitly validated.

### Tech stack

- **Backend**: Java, Spring Boot, Maven
- **Frontend**: React/Vite, TypeScript
- **Infra**: Docker Compose for local dev

## Skills

Domain skills each agent must load (in addition to the base skills declared
by the global config):

| Role | Domain skill |
|------|-------------|
| Backend | `java-springboot` |
| Frontend | `react-frontend` |
| Infra | (none) |

## Frontend: chess-specific

### Stack

| Concern | Choice | License |
|---------|--------|---------|
| Routing | React Router | MIT |
| Server state | TanStack Query | MIT |
| Client state | Zustand | MIT |
| Chess rules (UX-only) | chess.js | BSD-2-Clause |
| Board rendering | react-chessboard (v5) | MIT |
| Styling | Tailwind CSS | MIT |
| API validation | Zod | MIT |
| Testing | Vitest + React Testing Library | MIT |

Long-term intent: the app may become a **commercial product**, so all
dependencies must use permissive licenses (MIT, BSD, ISC). **No GPL/AGPL.**

### Role split: chess.js vs backend engine

- **Backend engine** = single source of truth. It decides whether a submitted
  move actually solves the exercise.
- **chess.js (frontend)** = local UX helper only, never authoritative:
  - filters legal squares for drag/drop and highlighting
  - detects pawn promotion locally to trigger the promotion dialog
  - parses FEN from the backend to initialize the board
  - generates SAN notation for move-history display
  - local check/checkmate/stalemate detection for visual cues
- Divergence between the two engines has no security impact — the backend
  rejects invalid moves.

### Board rendering

- Use `chess.js` + `react-chessboard` (both MIT, commercial-safe)
- **Do not use `chessground`** — GPL-3.0
- react-chessboard's default piece SVGs are CC BY-SA 3.0 (Wikimedia/Cburnett)
  — usable commercially but requires share-alike attribution

### Anti-FOUC

Inline script in `<head>` of `index.html` must set `data-theme` before first
paint, reading `localStorage.theme` then `prefers-color-scheme`.

## Agent workspace

Planning and cross-agent coordination live in
`~/projects/agents/innerchess/` (not in the app repo):

| Path | Purpose |
|------|---------|
| `tasks/<role>/` | Roadmaps and task notes per role |
| `tasks/global/` | Cross-cutting project tasks |
| `tickets/` | Inter-agent tickets (see `tickets/README.md`) |
| `references/` | Shared references (read when relevant) |

Rules:

1. **Tasks first** — check your role's task folder and `tasks/global/` before
   starting new work.
2. **Tickets first** — open tickets with `to: <your role>` take priority;
   follow `tickets/README.md`.
3. **Do not invent mechanics** — exercise types are not yet validated.
4. Keep all task/ticket content in **English**.

## Agent workspace confidentiality

The agent workspace `~/projects/agents/innerchess/` is an internal coordination
space. Its contents (tickets, task notes, references) must **not** appear in:

- Commit messages or any content tracked in the app repository
- Source code or code comments
- User-facing documentation
- Any output, log, or public artifact

## Design system (frontend)

When writing frontend code (React, TypeScript, CSS, components), read and apply
the project design system:

```
~/projects/agents/innerchess/references/frontend/design-system.md
```

All color, spacing, font size, and radius values must come from a token defined
in that document. Never use hardcoded values. If a need is not covered by
existing tokens, propose adding it to the document before using it.
