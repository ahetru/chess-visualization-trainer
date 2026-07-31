# InnerChess

Spring Boot 4 backend (`backend/`) + React frontend (`frontend/`).
Dev environment runs through `infra/docker-compose.yml`.

## Commands

- Backend tests: `make backend-test` (or `cd backend && ./mvnw test`)
- Frontend lint/typecheck: `cd frontend && npm run lint` and `npm run build`
- Full test suite: `make test` (note: `frontend-test` has no test script yet)
- Import puzzles: `make import-puzzles CSV_PATH=backend/data/<file>.csv PUZZLE_COUNT=<n>`

## Skills

At the start of a session, load the skills relevant to the task:

- `development-workflow` for how work is planned and committed.
- `java-springboot` for any backend (Spring Boot) or frontend (React) work.
- `understand-the-code` to track concepts the user struggles with and write
  learning-gap notes to the understand-the-code directory.
- `git-workflow` for any git operation (commits, branches, pull requests).

## Architecture

- Package-by-feature: each feature owns its controller, service, repository,
  DTO, mapper and exceptions (e.g. `com.ahetru.innerchess.chess.puzzle.*`).
- DTOs are Java records; constructor injection; `@ControllerAdvice` for errors.
- Frontend: API calls only through `src/api/` modules using the shared Axios
  instance in `src/api/client.ts`. No raw HTTP in components.
