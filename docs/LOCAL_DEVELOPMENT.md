# 🖥️ Desarrollo Local - Guía Rápida

Esta guía te ayudará a configurar el entorno de desarrollo local, corriendo el backend en tu máquina y los servicios (bases de datos) en Docker.

---

## 🎯 Ventajas de Desarrollo Local

✅ **Hot Reload rápido**: Sin reconstruir contenedores Docker  
✅ **Debugging directo**: Usa tu IDE para debug (breakpoints, etc.)  
✅ **Menos recursos**: Solo los servicios en Docker  
✅ **Desarrollo ágil**: Cambios instantáneos en el código  

---

## 📋 Prerrequisitos

- Node.js >= 18.x
- npm o yarn
- Docker y Docker Compose
- Make (opcional pero recomendado)

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` y asegúrate de que las URLs apunten a `localhost`:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/onenglishdb?schema=public

# MongoDB
MONGO_URI=mongodb://mongoadmin:password@localhost:27017/onenglishdb?authSource=admin

# Redis
REDIS_URL=redis://localhost:6379
```

### 3. Levantar los servicios en Docker

```bash
# Con Make (recomendado)
make up-services

# O con docker-compose directamente
docker-compose -f docker-compose.services.yml up -d
```

Esto levantará:
- ✅ PostgreSQL (puerto 5432)
- ✅ PgAdmin (puerto 5050)
- ✅ MongoDB (puerto 27017)
- ✅ Mongo Express (puerto 8081)
- ✅ Redis (puerto 6379)

### 4. Generar clientes de Prisma

```bash
npm run prisma:generate
```

### 5. Ejecutar migraciones

```bash
# PostgreSQL
npm run prisma:migrate:postgres

# MongoDB (sincronizar schema)
npm run prisma:migrate:mongo
```

### 6. (Opcional) Ejecutar seed

```bash
npm run prisma:seed
```

### 7. Iniciar el backend en modo desarrollo

```bash
npm run start:dev
```

El backend estará corriendo en `http://localhost:3000` 🎉

---

## 📝 Comandos Disponibles

### Servicios Docker

```bash
# Levantar servicios
make up-services

# Ver logs de servicios
make logs-services

# Ver estado de servicios
make ps-services

# Reiniciar servicios
make restart-services

# Bajar servicios
make down-services

# Limpiar servicios (borra volúmenes)
make clean-services
```

### Backend Local

```bash
# Desarrollo con hot reload
npm run start:dev

# Modo debug
npm run start:debug

# Build de producción
npm run build
npm run start:prod
```

### Base de Datos

```bash
# Generar clientes Prisma
npm run prisma:generate

# Migraciones PostgreSQL
npm run prisma:migrate:postgres

# Sincronizar MongoDB
npm run prisma:migrate:mongo

# Prisma Studio (PostgreSQL)
npm run prisma:studio:postgres

# Prisma Studio (MongoDB)
npm run prisma:studio:mongo

# Seed
npm run prisma:seed
```

---

## 🔍 Acceso a Herramientas de Admin

Una vez que los servicios estén corriendo:

### PgAdmin (PostgreSQL)
- **URL**: http://localhost:5050
- **Email**: Configurado en `PGADMIN_DEFAULT_EMAIL`
- **Password**: Configurado en `PGADMIN_DEFAULT_PASSWORD`

#### Conectar a PostgreSQL desde PgAdmin:
1. Click en "Add New Server"
2. **General → Name**: OneEnglish DB
3. **Connection**:
   - Host: `postgres` (o `localhost` si no funciona)
   - Port: `5432`
   - Database: `onenglishdb`
   - Username: Tu `POSTGRES_USER`
   - Password: Tu `POSTGRES_PASSWORD`

### Mongo Express (MongoDB)
- **URL**: http://localhost:8081
- **Usuario**: Configurado en `MONGO_EXPRESS_USERNAME`
- **Password**: Configurado en `MONGO_EXPRESS_PASSWORD`

---

## 🛠️ Workflow Típico de Desarrollo

```bash
# 1. Levantar servicios (una vez al día)
make up-services

# 2. Iniciar backend en modo desarrollo
npm run start:dev

# 3. Hacer cambios en el código
# El backend se recarga automáticamente

# 4. Si cambias schemas de Prisma:
npm run prisma:generate
npm run prisma:migrate:postgres  # Si cambió PostgreSQL
npm run prisma:migrate:mongo     # Si cambió MongoDB

# 5. Al terminar el día
make down-services  # O déjalos corriendo
```

---

## 🐛 Debugging en VSCode

Crea o edita `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Luego presiona `F5` para iniciar el debugger.

---

## 🔄 Comparación: Local vs Docker Completo

| Característica | Local (npm run start:dev) | Docker Completo (make up-dev) |
|----------------|---------------------------|-------------------------------|
| **Hot Reload** | ⚡ Instantáneo | 🐌 Lento (rebuild) |
| **Debugging** | ✅ Nativo en IDE | ⚠️ Requiere configuración |
| **Recursos** | 💚 Bajo (solo servicios) | 🔴 Alto (todo en Docker) |
| **Setup Inicial** | 📦 npm install | 🐳 Docker build |
| **Uso típico** | 👨‍💻 Desarrollo diario | 🧪 Testing/CI/CD |
| **Velocidad** | 🚀 Muy rápido | 🐢 Más lento |

---

## 📊 Verificar que todo funciona

```bash
# Ver estado de servicios
make ps-services

# Deberías ver:
# - postgres (healthy)
# - mongo (healthy)
# - redis (healthy)
# - pgadmin (running)
# - mongo-express (running)

# Probar conexión a PostgreSQL
docker exec -it postgres psql -U postgres -d onenglishdb -c "SELECT 1;"

# Probar conexión a MongoDB
docker exec -it mongo mongosh -u mongoadmin -p --eval "db.adminCommand('ping')"

# Probar conexión a Redis
docker exec -it redis redis-cli ping
```

---

## ❌ Troubleshooting

### Backend no puede conectar a las bases de datos

**Problema**: Error de conexión a PostgreSQL/MongoDB

**Solución**: Verifica que las URLs en `.env` usen `localhost`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/onenglishdb
MONGO_URI=mongodb://mongoadmin:password@localhost:27017/onenglishdb
```

### Puerto ya en uso

**Problema**: `Error: bind: address already in use`

**Solución**: Cambia los puertos en `.env`:
```env
POSTGRES_EXT_PORT=5433  # En lugar de 5432
MONGO_EXT_PORT=27018    # En lugar de 27017
REDIS_EXT_PORT=6380     # En lugar de 6379
```

### Prisma no encuentra el schema

**Problema**: `Cannot find module '@prisma/postgres-client'`

**Solución**: Regenera los clientes:
```bash
npm run prisma:generate
```

### Servicios no inician

**Problema**: Contenedores no se levantan

**Solución**: Verifica los logs:
```bash
make logs-services

# O limpia y vuelve a levantar
make clean-services
make up-services
```

---

## 🔄 Cambiar entre Modos

### De Local a Docker Completo

```bash
# 1. Detener servicios locales
make down-services

# 2. Levantar todo en Docker
make up-dev
```

### De Docker Completo a Local

```bash
# 1. Bajar Docker completo
make down-dev

# 2. Levantar solo servicios
make up-services

# 3. Iniciar backend local
npm run start:dev
```

---

## 💡 Tips y Trucos

### Mantener servicios corriendo

Los servicios Docker pueden quedarse corriendo entre sesiones:
```bash
make up-services  # Solo necesitas hacer esto una vez
```

### Ver logs en tiempo real

```bash
# Todos los servicios
make logs-services

# Solo PostgreSQL
docker logs -f postgres

# Solo MongoDB
docker logs -f mongo
```

### Limpiar todo y empezar de nuevo

```bash
# Limpiar servicios
make clean-services

# Limpiar todo Docker
make prune

# Volver a levantar
make up-services
npm run prisma:generate
npm run prisma:migrate:postgres
npm run prisma:migrate:mongo
npm run start:dev
```

### Script de inicio automático

Crea un archivo `dev.sh`:

```bash
#!/bin/bash
make up-services
npm run prisma:generate
npm run start:dev
```

```bash
chmod +x dev.sh
./dev.sh
```

---

## 📚 Recursos Adicionales

- [README.md](./README.md) - Documentación principal
- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Configuración de Prisma
- [DUAL_DATABASE_SETUP.md](./DUAL_DATABASE_SETUP.md) - Setup de bases de datos

---

## ✅ Checklist de Desarrollo Local

- [ ] Node.js instalado
- [ ] Docker instalado y corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Servicios corriendo (`make up-services`)
- [ ] Clientes de Prisma generados
- [ ] Migraciones ejecutadas
- [ ] Backend corriendo (`npm run start:dev`)
- [ ] Acceso a PgAdmin y Mongo Express funcionando

---

<p align="center">
  <strong>¡Desarrollo Local Configurado! 🎉</strong><br>
  Ahora puedes desarrollar con máxima velocidad y eficiencia
</p>

