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

clean:
	docker system prune -f

# -------------------------
# BACKEND (Spring Boot)
# -------------------------

backend-build:
	cd backend && mvn clean package

backend-test:
	cd backend && mvn test

backend-run:
	cd backend && mvn spring-boot:run

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
	make backend-run & make frontend-dev

# -------------------------
# DATABASE
# -------------------------

db-reset:
	docker compose -f $(COMPOSE) down -v
	docker compose -f $(COMPOSE) up db

# -------------------------
# FULL TEST
# -------------------------

test:
	make backend-test
	make frontend-test