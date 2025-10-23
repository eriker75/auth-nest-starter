# Docker compose file names
COMPOSE_DEV_FILE=docker-compose.dev.yml
COMPOSE_PROD_FILE=docker-compose.prod.yml
COMPOSE_SERVICES_FILE=docker-compose.services.yml

# Project name for docker-compose
PROJECT_NAME=onenglish

# Development commands
up-dev:
	@echo "Starting containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev up --build

down-dev:
	@echo "Stopping containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down

logs-dev:
	@echo "Showing logs of containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f

restart-dev:
	@echo "Restarting containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev restart

build-dev:
	@echo "Building images in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev build

clean-dev:
	@echo "Cleaning containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down --volumes

destroy-dev:
	@echo "Destroying containers in development mode..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down --volumes --rmi all

# Commands for services (infrastructure only - for local development)
up-services:
	@echo "Starting services (PostgreSQL, MongoDB, Redis, PgAdmin, Mongo Express)..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services up

down-services:
	@echo "Stopping services..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services down

logs-services:
	@echo "Showing logs of services..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services logs -f

restart-services:
	@echo "Restarting services..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services restart

ps-services:
	@echo "Showing status of services..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services ps

clean-services:
	@echo "Cleaning services and volumes..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services down --volumes

# Production commands
up-prod:
	@echo "Starting containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod up -d --build

down-prod:
	@echo "Stopping containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down

logs-prod:
	@echo "Showing logs of containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f

restart-prod:
	@echo "Restarting containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod restart

build-prod:
	@echo "Building images in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod build

clean-prod:
	@echo "Cleaning containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down --volumes

destroy-prod:
	@echo "Destroying containers in production mode..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down --volumes --rmi all

# Database commands (Development)
migrate-dev:
	@echo "Running Prisma migrations in development..."
	docker exec -it nestjs_backend npx prisma migrate dev

migrate-deploy-dev:
	@echo "Running Prisma migrations (deploy) in development..."
	docker exec -it nestjs_backend npx prisma migrate deploy

generate-dev:
	@echo "Generating Prisma client in development..."
	docker exec -it nestjs_backend npx prisma generate

studio-dev:
	@echo "Opening Prisma Studio in development..."
	docker exec -it nestjs_backend npx prisma studio

seed-dev:
	@echo "Running seed in development..."
	docker exec -it nestjs_backend npm run seed

# Database commands (Production)
migrate-prod:
	@echo "Running Prisma migrations in production..."
	docker exec -it nestjs_backend npx prisma migrate deploy

generate-prod:
	@echo "Generating Prisma client in production..."
	docker exec -it nestjs_backend npx prisma generate

seed-prod:
	@echo "Running seed in production..."
	docker exec -it nestjs_backend npm run seed

# Shell commands
shell-backend-dev:
	@echo "Accessing backend shell in development..."
	docker exec -it nestjs_backend sh

shell-postgres-dev:
	@echo "Accessing PostgreSQL shell in development..."
	docker exec -it postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

shell-mongo-dev:
	@echo "Accessing MongoDB shell in development..."
	docker exec -it mongo mongosh -u $(MONGO_USERNAME) -p $(MONGO_PASSWORD)

shell-redis-dev:
	@echo "Accessing Redis shell in development..."
	docker exec -it redis redis-cli

# Specific logs commands (Development)
logs-backend-dev:
	@echo "Showing backend logs in development..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f backend

logs-postgres-dev:
	@echo "Showing PostgreSQL logs in development..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f postgres

logs-mongo-dev:
	@echo "Showing MongoDB logs in development..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f mongo

logs-redis-dev:
	@echo "Showing Redis logs in development..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f redis

# Specific logs commands (Production)
logs-backend-prod:
	@echo "Showing backend logs in production..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f backend

logs-postgres-prod:
	@echo "Showing PostgreSQL logs in production..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f postgres

logs-mongo-prod:
	@echo "Showing MongoDB logs in production..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f mongo

# Useful commands
ps-dev:
	@echo "Showing status of containers in development..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev ps

ps-prod:
	@echo "Showing status of containers in production..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod ps

stats:
	@echo "Showing resource usage statistics..."
	docker stats

prune:
	@echo "Cleaning unused Docker resources..."
	docker system prune -a --volumes

# Default command
.PHONY: help
help:
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║          OneEnglish Backend - Makefile Commands             ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🔧 Services (Local Development):"
	@echo "  make up-services         - Start only services (DBs + Admin)"
	@echo "  make down-services       - Stop services"
	@echo "  make logs-services       - View service logs"
	@echo "  make restart-services    - Restart services"
	@echo "  make ps-services         - View service status"
	@echo "  make clean-services      - Clean services and volumes"
	@echo ""
	@echo "📦 Development Commands:"
	@echo "  make up-dev              - Start containers in development"
	@echo "  make down-dev            - Stop containers in development"
	@echo "  make logs-dev            - Show all logs in development"
	@echo "  make restart-dev         - Restart containers in development"
	@echo "  make build-dev           - Build images in development"
	@echo "  make clean-dev           - Clean containers and volumes in development"
	@echo "  make destroy-dev         - Destroy everything in development"
	@echo "  make ps-dev              - View container status in development"
	@echo ""
	@echo "🚀 Production Commands:"
	@echo "  make up-prod             - Start containers in production"
	@echo "  make down-prod           - Stop containers in production"
	@echo "  make logs-prod           - Show all logs in production"
	@echo "  make restart-prod        - Restart containers in production"
	@echo "  make build-prod          - Build images in production"
	@echo "  make clean-prod          - Clean containers and volumes in production"
	@echo "  make destroy-prod        - Destroy everything in production"
	@echo "  make ps-prod             - View container status in production"
	@echo ""
	@echo "🗄️  Database Commands (Development):"
	@echo "  make migrate-dev         - Run Prisma migrations"
	@echo "  make migrate-deploy-dev  - Run migrations (deploy)"
	@echo "  make generate-dev        - Generate Prisma client"
	@echo "  make studio-dev          - Open Prisma Studio"
	@echo "  make seed-dev            - Run database seed"
	@echo ""
	@echo "🗄️  Database Commands (Production):"
	@echo "  make migrate-prod        - Run migrations in production"
	@echo "  make generate-prod       - Generate Prisma client"
	@echo "  make seed-prod           - Run seed in production"
	@echo ""
	@echo "🐚 Shell Commands (Development):"
	@echo "  make shell-backend-dev   - Access backend shell"
	@echo "  make shell-postgres-dev  - Access PostgreSQL shell"
	@echo "  make shell-mongo-dev     - Access MongoDB shell"
	@echo "  make shell-redis-dev     - Access Redis shell"
	@echo ""
	@echo "📝 Specific Logs (Development):"
	@echo "  make logs-backend-dev    - Backend logs"
	@echo "  make logs-postgres-dev   - PostgreSQL logs"
	@echo "  make logs-mongo-dev      - MongoDB logs"
	@echo "  make logs-redis-dev      - Redis logs"
	@echo ""
	@echo "📝 Specific Logs (Production):"
	@echo "  make logs-backend-prod   - Backend logs"
	@echo "  make logs-postgres-prod  - PostgreSQL logs"
	@echo "  make logs-mongo-prod     - MongoDB logs"
	@echo ""
	@echo "🛠️  Utilities:"
	@echo "  make stats               - View Docker resource usage statistics"
	@echo "  make prune               - Clean unused Docker resources"
	@echo ""