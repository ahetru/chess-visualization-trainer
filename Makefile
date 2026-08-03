# =========================
# INNERCHESS - MAKEFILE
# =========================

COMPOSE=infra/docker-compose.yml

# -------------------------
# DOCKER
# -------------------------

up:
	docker compose -f $(COMPOSE) up --build

down:
	docker compose -f $(COMPOSE) down

stop:
	docker compose -f $(COMPOSE) stop

logs:
	docker compose -f $(COMPOSE) logs -f

ps:
	docker compose -f $(COMPOSE) ps

rebuild:
	docker compose -f $(COMPOSE) build --no-cache

# Project-scoped cleanup: removes this project's containers, networks,
# named volumes (including the dev database) and locally built images.
clean:
	docker compose -f $(COMPOSE) down -v --rmi local --remove-orphans

# -------------------------
# BACKEND (Spring Boot)
# -------------------------

backend-build:
	cd backend && ./mvnw clean package

backend-test:
	cd backend && ./mvnw test

backend-run:
	cd backend && ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local"

# -------------------------
# FRONTEND
# -------------------------

frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-test:
	cd frontend && npm test

# -------------------------
# LOCAL DEV (sans docker backend/frontend)
# -------------------------

dev:
	$(MAKE) backend-run & $(MAKE) frontend-dev

# -------------------------
# DATABASE
# -------------------------

db-reset:
	docker compose -f $(COMPOSE) down -v
	docker compose -f $(COMPOSE) up -d db

db-up:
	docker compose -f $(COMPOSE) up -d db

# -------------------------
# PUZZLE IMPORT
# -------------------------

CSV_PATH ?= data/lichess_db_puzzle.csv
PUZZLE_COUNT ?= 500

import-puzzles: db-up
	cd backend && ./mvnw spring-boot:run \
		-Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local,import-puzzles" \
		-Dspring-boot.run.arguments="$(CSV_PATH) $(PUZZLE_COUNT)"

# -------------------------
# FULL TEST
# -------------------------

test:
	$(MAKE) backend-test
	$(MAKE) frontend-test

.PHONY: up down stop logs ps rebuild clean \
	backend-build backend-test backend-run \
	frontend-install frontend-dev frontend-build frontend-test \
	dev db-reset test import-puzzles