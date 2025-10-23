# Nombre de los archivos docker-compose
COMPOSE_DEV_FILE=docker-compose.dev.yml
COMPOSE_PROD_FILE=docker-compose.prod.yml
COMPOSE_SERVICES_FILE=docker-compose.services.yml

# Nombre del proyecto para docker-compose
PROJECT_NAME=onenglish

# Comandos de desarrollo
up-dev:
	@echo "Levantando los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev up --build

down-dev:
	@echo "Bajando los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down

logs-dev:
	@echo "Mostrando logs de los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f

restart-dev:
	@echo "Reiniciando los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev restart

build-dev:
	@echo "Construyendo las imágenes en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev build

clean-dev:
	@echo "Limpiando los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down --volumes

destroy-dev:
	@echo "Destruyendo los contenedores en modo desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev down --volumes --rmi all

# Comandos para servicios (solo infraestructura - para desarrollo local)
up-services:
	@echo "Levantando servicios (PostgreSQL, MongoDB, Redis, PgAdmin, Mongo Express)..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services up

down-services:
	@echo "Bajando servicios..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services down

logs-services:
	@echo "Mostrando logs de los servicios..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services logs -f

restart-services:
	@echo "Reiniciando servicios..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services restart

ps-services:
	@echo "Mostrando estado de los servicios..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services ps

clean-services:
	@echo "Limpiando servicios y volúmenes..."
	docker-compose -f $(COMPOSE_SERVICES_FILE) -p $(PROJECT_NAME)_services down --volumes

# Comandos de producción
up-prod:
	@echo "Levantando los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod up -d --build

down-prod:
	@echo "Bajando los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down

logs-prod:
	@echo "Mostrando logs de los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f

restart-prod:
	@echo "Reiniciando los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod restart

build-prod:
	@echo "Construyendo las imágenes en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod build

clean-prod:
	@echo "Limpiando los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down --volumes

destroy-prod:
	@echo "Destruyendo los contenedores en modo producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod down --volumes --rmi all

# Comandos de base de datos (Desarrollo)
migrate-dev:
	@echo "Ejecutando migraciones de Prisma en desarrollo..."
	docker exec -it nestjs_backend npx prisma migrate dev

migrate-deploy-dev:
	@echo "Ejecutando migraciones de Prisma (deploy) en desarrollo..."
	docker exec -it nestjs_backend npx prisma migrate deploy

generate-dev:
	@echo "Generando cliente de Prisma en desarrollo..."
	docker exec -it nestjs_backend npx prisma generate

studio-dev:
	@echo "Abriendo Prisma Studio en desarrollo..."
	docker exec -it nestjs_backend npx prisma studio

seed-dev:
	@echo "Ejecutando seed en desarrollo..."
	docker exec -it nestjs_backend npm run seed

# Comandos de base de datos (Producción)
migrate-prod:
	@echo "Ejecutando migraciones de Prisma en producción..."
	docker exec -it nestjs_backend npx prisma migrate deploy

generate-prod:
	@echo "Generando cliente de Prisma en producción..."
	docker exec -it nestjs_backend npx prisma generate

seed-prod:
	@echo "Ejecutando seed en producción..."
	docker exec -it nestjs_backend npm run seed

# Comandos de shell
shell-backend-dev:
	@echo "Accediendo al shell del backend en desarrollo..."
	docker exec -it nestjs_backend sh

shell-postgres-dev:
	@echo "Accediendo al shell de PostgreSQL en desarrollo..."
	docker exec -it postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

shell-mongo-dev:
	@echo "Accediendo al shell de MongoDB en desarrollo..."
	docker exec -it mongo mongosh -u $(MONGO_USERNAME) -p $(MONGO_PASSWORD)

shell-redis-dev:
	@echo "Accediendo al shell de Redis en desarrollo..."
	docker exec -it redis redis-cli

# Comandos de logs específicos (Desarrollo)
logs-backend-dev:
	@echo "Mostrando logs del backend en desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f backend

logs-postgres-dev:
	@echo "Mostrando logs de PostgreSQL en desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f postgres

logs-mongo-dev:
	@echo "Mostrando logs de MongoDB en desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f mongo

logs-redis-dev:
	@echo "Mostrando logs de Redis en desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev logs -f redis

# Comandos de logs específicos (Producción)
logs-backend-prod:
	@echo "Mostrando logs del backend en producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f backend

logs-postgres-prod:
	@echo "Mostrando logs de PostgreSQL en producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f postgres

logs-mongo-prod:
	@echo "Mostrando logs de MongoDB en producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod logs -f mongo

# Comandos útiles
ps-dev:
	@echo "Mostrando estado de los contenedores en desarrollo..."
	docker-compose -f $(COMPOSE_DEV_FILE) -p $(PROJECT_NAME)_dev ps

ps-prod:
	@echo "Mostrando estado de los contenedores en producción..."
	docker-compose -f $(COMPOSE_PROD_FILE) -p $(PROJECT_NAME)_prod ps

stats:
	@echo "Mostrando estadísticas de uso de recursos..."
	docker stats

prune:
	@echo "Limpiando recursos Docker no utilizados..."
	docker system prune -a --volumes

# Comando por defecto
.PHONY: help
help:
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║          OneEnglish Backend - Makefile Commands             ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🔧 Servicios (Desarrollo Local):"
	@echo "  make up-services         - Levantar solo servicios (DBs + Admin)"
	@echo "  make down-services       - Bajar servicios"
	@echo "  make logs-services       - Ver logs de servicios"
	@echo "  make restart-services    - Reiniciar servicios"
	@echo "  make ps-services         - Ver estado de servicios"
	@echo "  make clean-services      - Limpiar servicios y volúmenes"
	@echo ""
	@echo "📦 Comandos de Desarrollo:"
	@echo "  make up-dev              - Levantar contenedores en desarrollo"
	@echo "  make down-dev            - Bajar contenedores en desarrollo"
	@echo "  make logs-dev            - Mostrar todos los logs en desarrollo"
	@echo "  make restart-dev         - Reiniciar contenedores en desarrollo"
	@echo "  make build-dev           - Construir imágenes en desarrollo"
	@echo "  make clean-dev           - Limpiar contenedores y volúmenes en desarrollo"
	@echo "  make destroy-dev         - Destruir todo en desarrollo"
	@echo "  make ps-dev              - Ver estado de contenedores en desarrollo"
	@echo ""
	@echo "🚀 Comandos de Producción:"
	@echo "  make up-prod             - Levantar contenedores en producción"
	@echo "  make down-prod           - Bajar contenedores en producción"
	@echo "  make logs-prod           - Mostrar todos los logs en producción"
	@echo "  make restart-prod        - Reiniciar contenedores en producción"
	@echo "  make build-prod          - Construir imágenes en producción"
	@echo "  make clean-prod          - Limpiar contenedores y volúmenes en producción"
	@echo "  make destroy-prod        - Destruir todo en producción"
	@echo "  make ps-prod             - Ver estado de contenedores en producción"
	@echo ""
	@echo "🗄️  Comandos de Base de Datos (Desarrollo):"
	@echo "  make migrate-dev         - Ejecutar migraciones de Prisma"
	@echo "  make migrate-deploy-dev  - Ejecutar migraciones (deploy)"
	@echo "  make generate-dev        - Generar cliente de Prisma"
	@echo "  make studio-dev          - Abrir Prisma Studio"
	@echo "  make seed-dev            - Ejecutar seed de base de datos"
	@echo ""
	@echo "🗄️  Comandos de Base de Datos (Producción):"
	@echo "  make migrate-prod        - Ejecutar migraciones en producción"
	@echo "  make generate-prod       - Generar cliente de Prisma"
	@echo "  make seed-prod           - Ejecutar seed en producción"
	@echo ""
	@echo "🐚 Comandos de Shell (Desarrollo):"
	@echo "  make shell-backend-dev   - Acceder al shell del backend"
	@echo "  make shell-postgres-dev  - Acceder al shell de PostgreSQL"
	@echo "  make shell-mongo-dev     - Acceder al shell de MongoDB"
	@echo "  make shell-redis-dev     - Acceder al shell de Redis"
	@echo ""
	@echo "📝 Logs Específicos (Desarrollo):"
	@echo "  make logs-backend-dev    - Logs del backend"
	@echo "  make logs-postgres-dev   - Logs de PostgreSQL"
	@echo "  make logs-mongo-dev      - Logs de MongoDB"
	@echo "  make logs-redis-dev      - Logs de Redis"
	@echo ""
	@echo "📝 Logs Específicos (Producción):"
	@echo "  make logs-backend-prod   - Logs del backend"
	@echo "  make logs-postgres-prod  - Logs de PostgreSQL"
	@echo "  make logs-mongo-prod     - Logs de MongoDB"
	@echo ""
	@echo "🛠️  Utilidades:"
	@echo "  make stats               - Ver estadísticas de recursos Docker"
	@echo "  make prune               - Limpiar recursos Docker no utilizados"
	@echo ""