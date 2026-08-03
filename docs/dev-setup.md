# InnerChess — Developer Setup

InnerChess has **two run modes** for different purposes:

| Mode | Command | What it does | When to use |
|---|---|---|---|
| Local dev | `make dev` | Spring Boot + Vite natively on your machine | Daily development (hot-reload, debugger) |
| Docker stack | `make up` | Everything in containers (compose) | Integration checks, demo, or CI-like parity |

Both modes use the **same PostgreSQL database** — either a local instance or
the `db` service from the compose stack.

---

## Prerequisites

- **Java 21** (for `./mvnw spring-boot:run`)
- **Node 20** (for `npm run dev`)
- **Docker + Docker Compose** (for the compose stack and Testcontainers)
- Optional: `make` (GNU Make)

---

## 1. Local Development (`make dev`)

This is the primary workflow for writing code. Both servers run directly on
your machine with full hot-reload.

```bash
# 1. Start the database only (or use make dev, which calls backend-run directly)
make db-up

# 2. Import puzzles (first time only)
make import-puzzles

# 3. Start both servers
make dev
```

`make dev` launches:

- **Backend** (`./mvnw spring-boot:run`) on `http://localhost:8080` with the
  `local` Spring profile (connects to `localhost:5432`).
- **Frontend** (`npm run dev`) on `http://localhost:5173` with Vite HMR.

Press `Ctrl+C` to stop both. The `trap` + `wait` pattern ensures no orphan
processes linger.

### Frontend config

The frontend needs to know where the backend lives. Create a `.env` file (not
committed) from the example:

```bash
cp frontend/.env.example frontend/.env
# Default is http://localhost:8080 — change if your backend runs elsewhere.
```

`VITE_API_URL` is read by Vite at dev-server start and baked into the
production bundle. The Docker compose stack injects this variable explicitly
so the `.env.example` is purely documentation for local dev.

---

## 2. Docker Integration Stack (`make up`)

Builds and runs the full project in containers. No hot-reload — rebuild
needed on every change.

```bash
make up
```

The compose stack (`infra/docker-compose.yml`) starts four services:

| Service | Image / build | Port | Healthcheck |
|---|---|---|---|
| `db` | `postgres:16-alpine` | `5432` | `pg_isready` |
| `backend` | `backend/Dockerfile` | `8080` | `curl /api/puzzles/random` |
| `frontend` | `frontend/Dockerfile` | `5173` | `curl /` |
| `adminer` | `adminer:5` | `8081` | — |

Startup order: `db` → (healthy) → `backend` → (healthy) → `frontend`.

Adminer (a lightweight DB UI) is available at `http://localhost:8081` with:

- System: PostgreSQL
- Server: `db`
- Username / password: `innerchess` / `innerchess`

### Rebuilding after changes

```bash
make up          # rebuilds images with `--build` flag
make rebuild     # force-rebuild without cache
```

---

## 3. Database & Puzzles

### Starting the DB only

```bash
make db-up       # starts the db container (port 5432)
```

### Importing puzzles

Puzzles come from a Lichess CSV export. Place the CSV at
`backend/data/lichess_db_puzzle.csv`, then:

```bash
make import-puzzles CSV_PATH=backend/data/lichess_db_puzzle.csv PUZZLE_COUNT=500
```

Defaults: `CSV_PATH=data/lichess_db_puzzle.csv`, `PUZZLE_COUNT=500`.

The importer requires a running DB (`db-up` is called automatically).

### Wipe and re-create

```bash
make db-reset    # tears down DB volume, recreates a fresh one
```

---

## 4. Testing

```bash
make test            # backend + frontend
make backend-test    # backend only (Testcontainers, no local DB needed)
make frontend-test   # frontend only (vitest with jsdom)
```

Backend tests use **Testcontainers** — a real PostgreSQL container is
spawned per test class, so tests are fully isolated. Docker must be running
but the dev database is **not** needed.

Frontend tests run with **vitest** in a jsdom environment.

---

## 5. Make Targets Reference

| Target | Description |
|---|---|
| `make dev` | Start backend and frontend locally with hot-reload |
| `make up` | Build and start the full Docker stack |
| `make down` | Stop and remove containers |
| `make stop` | Stop containers (preserves containers) |
| `make logs` | Follow logs of all services |
| `make ps` | Show running containers and health status |
| `make rebuild` | Force-rebuild images without cache |
| `make clean` | Tear down project containers, volumes and images |
| `make db-up` | Start the database container only |
| `make db-reset` | Wipe the database volume and restart |
| `make import-puzzles` | Import puzzles from a Lichess CSV |
| `make backend-test` | Run Spring Boot tests (Testcontainers) |
| `make frontend-test` | Run vitest tests (jsdom) |
| `make test` | Run all tests |

---

## 6. Project Layout

```
.
├── backend/                  # Spring Boot 4 (Java 21)
│   ├── src/main/java/        # Application code
│   ├── src/main/resources/   # application.yaml, DB migrations
│   ├── src/test/java/        # Unit + integration tests
│   ├── Dockerfile            # Multi-stage: Maven build → JRE runtime
│   └── pom.xml
├── frontend/                 # React 19 + Vite + Tailwind
│   ├── src/                  # Application code
│   ├── Dockerfile            # Node 20, Vite dev server
│   ├── .env.example          # Documented VITE_API_URL template
│   └── package.json
├── docs/                     # Project documentation
│   └── dev-setup.md
├── infra/                    # Docker compose and tooling
│   └── docker-compose.yml
└── Makefile                  # All common tasks in one place
```
