<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">OneEnglish Backend</h1>

<p align="center">
  Backend API para la plataforma OneEnglish, construido con NestJS, PostgreSQL, MongoDB y Redis.
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://www.mongodb.com/" target="_blank"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://redis.io/" target="_blank"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>
  <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="https://www.prisma.io/" target="_blank"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
</p>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Configuración Inicial](#configuración-inicial)
- [Inicio Rápido](#inicio-rápido)
- [Comandos Disponibles](#comandos-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Deployment](#deployment)
- [Recursos](#recursos)

---

## 📝 Descripción

OneEnglish Backend es una API RESTful construida con NestJS que proporciona servicios para una plataforma de aprendizaje de inglés. Utiliza PostgreSQL como base de datos principal, MongoDB para datos no estructurados, y Redis para caché y sesiones.

## 🚀 Tecnologías

- **Framework**: NestJS (Node.js)
- **Lenguaje**: TypeScript
- **Base de Datos Relacional**: PostgreSQL 16
- **Base de Datos NoSQL**: MongoDB 7.0
- **ORM**: Prisma
- **Caché**: Redis 7.4
- **Autenticación**: JWT
- **Contenedores**: Docker & Docker Compose
- **Gestión de Tareas**: Makefile

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker**: >= 20.10.0
- **Docker Compose**: >= 2.0.0
- **Make**: (opcional, pero recomendado)
- **Node.js**: >= 18.x (solo para desarrollo local sin Docker)
- **npm** o **yarn**

### Verificar instalación:

```bash
docker --version
docker-compose --version
make --version
node --version
```

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd onenglishbackend
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales y configuraciones:

```bash
nano .env
# o
code .env
```

> ⚠️ **Importante**: Cambia todos los valores `your_secure_*` y `your_*` por contraseñas seguras reales.

---

## 🎯 Inicio Rápido

### Usando Make (Recomendado)

#### Modo Desarrollo

```bash
# Ver todos los comandos disponibles
make help

# Levantar la aplicación en modo desarrollo
make up-dev

# Ver logs en tiempo real
make logs-dev

# Ver solo logs del backend
make logs-backend-dev
```

#### Modo Producción

```bash
# Levantar la aplicación en modo producción
make up-prod

# Ver logs en tiempo real
make logs-prod
```

### Usando Docker Compose directamente

#### Modo Desarrollo

```bash
# Levantar contenedores
docker-compose -f docker-compose.dev.yml -p onenglish_dev up --build

# Levantar en segundo plano
docker-compose -f docker-compose.dev.yml -p onenglish_dev up -d --build

# Detener contenedores
docker-compose -f docker-compose.dev.yml -p onenglish_dev down
```

#### Modo Producción

```bash
# Levantar contenedores
docker-compose -f docker-compose.prod.yml -p onenglish_prod up -d --build

# Detener contenedores
docker-compose -f docker-compose.prod.yml -p onenglish_prod down
```

---

## 📚 Comandos Disponibles

### 📦 Comandos de Desarrollo

| Comando | Descripción |
|---------|-------------|
| `make up-dev` | Levantar contenedores en desarrollo |
| `make down-dev` | Bajar contenedores en desarrollo |
| `make logs-dev` | Mostrar todos los logs en desarrollo |
| `make restart-dev` | Reiniciar contenedores en desarrollo |
| `make build-dev` | Construir imágenes en desarrollo |
| `make clean-dev` | Limpiar contenedores y volúmenes |
| `make destroy-dev` | Destruir todo (contenedores, volúmenes e imágenes) |
| `make ps-dev` | Ver estado de contenedores |

### 🚀 Comandos de Producción

| Comando | Descripción |
|---------|-------------|
| `make up-prod` | Levantar contenedores en producción |
| `make down-prod` | Bajar contenedores en producción |
| `make logs-prod` | Mostrar todos los logs en producción |
| `make restart-prod` | Reiniciar contenedores en producción |
| `make build-prod` | Construir imágenes en producción |
| `make clean-prod` | Limpiar contenedores y volúmenes |
| `make destroy-prod` | Destruir todo |
| `make ps-prod` | Ver estado de contenedores |

### 🗄️ Comandos de Base de Datos (Desarrollo)

| Comando | Descripción |
|---------|-------------|
| `make migrate-dev` | Ejecutar migraciones de Prisma |
| `make migrate-deploy-dev` | Ejecutar migraciones (deploy) |
| `make generate-dev` | Generar cliente de Prisma |
| `make studio-dev` | Abrir Prisma Studio |
| `make seed-dev` | Ejecutar seed de base de datos |

### 🗄️ Comandos de Base de Datos (Producción)

| Comando | Descripción |
|---------|-------------|
| `make migrate-prod` | Ejecutar migraciones en producción |
| `make generate-prod` | Generar cliente de Prisma |
| `make seed-prod` | Ejecutar seed en producción |

### 🐚 Comandos de Shell

| Comando | Descripción |
|---------|-------------|
| `make shell-backend-dev` | Acceder al shell del backend |
| `make shell-postgres-dev` | Acceder al shell de PostgreSQL |
| `make shell-mongo-dev` | Acceder al shell de MongoDB |
| `make shell-redis-dev` | Acceder al shell de Redis |

### 📝 Logs Específicos

| Comando | Descripción |
|---------|-------------|
| `make logs-backend-dev` | Logs del backend (desarrollo) |
| `make logs-postgres-dev` | Logs de PostgreSQL (desarrollo) |
| `make logs-mongo-dev` | Logs de MongoDB (desarrollo) |
| `make logs-redis-dev` | Logs de Redis (desarrollo) |
| `make logs-backend-prod` | Logs del backend (producción) |
| `make logs-postgres-prod` | Logs de PostgreSQL (producción) |
| `make logs-mongo-prod` | Logs de MongoDB (producción) |

### 🛠️ Utilidades

| Comando | Descripción |
|---------|-------------|
| `make stats` | Ver estadísticas de recursos Docker |
| `make prune` | Limpiar recursos Docker no utilizados |

---

## 📁 Estructura del Proyecto

```
onenglishbackend/
├── src/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── decorators/         # Decoradores personalizados
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── guards/             # Guards de autenticación y roles
│   │   ├── models/             # Modelos de usuario y roles
│   │   └── services/           # Servicios de autenticación
│   ├── common/                  # Recursos compartidos
│   │   └── definitions/        # Definiciones comunes
│   ├── database/                # Módulo de base de datos
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts           # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                 # Punto de entrada
├── prisma/
│   └── schema.prisma           # Schema de Prisma
├── test/                        # Tests E2E
├── docker-compose.dev.yml      # Docker Compose para desarrollo
├── docker-compose.prod.yml     # Docker Compose para producción
├── Dockerfile.dev              # Dockerfile de desarrollo
├── Dockerfile.prod             # Dockerfile de producción
├── Makefile                    # Comandos automatizados
├── .env.example                # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## 🔐 Variables de Entorno

### Configuración General

```env
TZ=America/Caracas
NODE_ENV=development
```

### PostgreSQL

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_DB=onenglishdb
POSTGRES_EXT_PORT=5432
DATABASE_URL=postgresql://postgres:your_secure_postgres_password@postgres:5432/onenglishdb?schema=public
```

### PgAdmin

```env
PGADMIN_DEFAULT_EMAIL=admin@onenglish.com
PGADMIN_DEFAULT_PASSWORD=your_secure_pgadmin_password
PGADMIN_PORT=5050
```

### MongoDB

```env
MONGO_USERNAME=mongoadmin
MONGO_PASSWORD=your_secure_mongo_password
MONGO_EXT_PORT=27017
MONGO_URI=mongodb://mongoadmin:your_secure_mongo_password@mongo:27017/onenglishdb?authSource=admin
```

### Redis

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
```

### Backend

```env
BACKEND_PORT=3000
API_PREFIX=api
API_VERSION=v1
```

### JWT

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_REFRESH_EXPIRATION=7d
```

---

## 🗄️ Base de Datos

### Migraciones con Prisma

```bash
# Crear una nueva migración
make migrate-dev

# Aplicar migraciones (producción)
make migrate-prod

# Generar cliente de Prisma
make generate-dev

# Abrir Prisma Studio
make studio-dev
```

### Acceder a las bases de datos

#### PostgreSQL (CLI)

```bash
make shell-postgres-dev
# o directamente:
docker exec -it postgres psql -U postgres -d onenglishdb
```

#### MongoDB (CLI)

```bash
make shell-mongo-dev
# o directamente:
docker exec -it mongo mongosh -u mongoadmin -p
```

#### PgAdmin (Web UI)

Abre tu navegador en: `http://localhost:5050`

- **Email**: El configurado en `PGADMIN_DEFAULT_EMAIL`
- **Password**: El configurado en `PGADMIN_DEFAULT_PASSWORD`

#### Mongo Express (Web UI)

Abre tu navegador en: `http://localhost:8081`

- **Usuario**: El configurado en `MONGO_EXPRESS_USERNAME`
- **Password**: El configurado en `MONGO_EXPRESS_PASSWORD`

---

## 🧪 Testing

### Tests unitarios

```bash
npm run test
```

### Tests E2E

```bash
npm run test:e2e
```

### Cobertura de tests

```bash
npm run test:cov
```

---

## 🌐 Endpoints

Una vez la aplicación esté corriendo, puedes acceder a:

- **API Backend**: `http://localhost:3000`
- **API Docs (Swagger)**: `http://localhost:3000/api` (si está configurado)
- **PgAdmin**: `http://localhost:5050`
- **Mongo Express**: `http://localhost:8081`
- **Portainer** (solo producción): `http://localhost:9000`
- **Nginx Proxy Manager** (solo producción): `http://localhost:81`

---

## 🚢 Deployment

### Preparación para Producción

1. Asegúrate de configurar todas las variables de entorno en `.env`
2. Cambia `NODE_ENV=production`
3. Configura secretos JWT seguros
4. Configura las credenciales de bases de datos seguras

### Deploy con Docker

```bash
# Construir y levantar en producción
make up-prod

# Ejecutar migraciones
make migrate-prod

# Verificar estado
make ps-prod

# Ver logs
make logs-prod
```

### Servicios Adicionales en Producción

- **Nginx Proxy Manager**: Gestión de proxy reverso y certificados SSL
- **Portainer**: Gestión visual de contenedores Docker

---

## 🔧 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados
make logs-dev

# Verificar estado de contenedores
docker ps -a

# Reconstruir desde cero
make destroy-dev
make up-dev
```

### Error de conexión a la base de datos

```bash
# Verificar que el contenedor de PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs de PostgreSQL
make logs-postgres-dev

# Reiniciar servicio
make restart-dev
```

### Limpiar todo y empezar de nuevo

```bash
# Eliminar contenedores, volúmenes e imágenes
make destroy-dev

# Limpiar recursos Docker no utilizados
make prune

# Levantar de nuevo
make up-dev
```

---

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)

---

## 👥 Soporte

Para preguntas y soporte:

- Crea un issue en el repositorio
- Contacta al equipo de desarrollo

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 👨‍💻 Desarrollo Local (Sin Docker)

Si prefieres ejecutar la aplicación sin Docker:

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar bases de datos locales

Asegúrate de tener PostgreSQL, MongoDB y Redis corriendo localmente y actualiza las variables de entorno con las credenciales locales.

### 3. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

---

<p align="center">
  Hecho con ❤️ para OneEnglish
</p>
