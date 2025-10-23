# 🎯 Resumen: Configuración de Base de Datos Dual

## ✅ Cambios Implementados

### 1. **Schemas de Prisma Separados**

#### PostgreSQL (`prisma/schema.postgre.prisma`)
- ✅ Generator: `@prisma/postgres-client`
- ✅ Datasource: PostgreSQL
- ✅ Modelos estructurados creados:
  - User, Role, Permission
  - UserRole, RolePermission, UserPermission
  - Course, Lesson, Enrollment

#### MongoDB (`prisma/schema.mongo.prisma`)
- ✅ Generator: `@prisma/mongo-client`
- ✅ Datasource: MongoDB
- ✅ Modelos flexibles creados:
  - UserProfile, UserActivity, UserSetting
  - LessonContent, LessonProgress
  - ChatMessage, Notification, Achievement
  - AuditLog, ErrorLog

### 2. **Servicios de Prisma**

#### `PrismaPostgresService` (PostgreSQL)
- ✅ Conexión a PostgreSQL
- ✅ Logging configurado
- ✅ Lifecycle hooks (onModuleInit, onModuleDestroy)
- ✅ Método cleanDatabase para testing

#### `PrismaMongoService` (MongoDB)
- ✅ Conexión a MongoDB
- ✅ Logging configurado
- ✅ Lifecycle hooks
- ✅ Método cleanDatabase para testing

### 3. **Módulo de Base de Datos**

`DatabaseModule`:
- ✅ Marcado como `@Global()`
- ✅ Exporta ambos servicios
- ✅ Disponible en toda la aplicación

### 4. **Scripts de NPM**

Agregados en `package.json`:
```json
{
  "prisma:generate": "Genera ambos clientes",
  "prisma:generate:postgres": "Genera solo PostgreSQL",
  "prisma:generate:mongo": "Genera solo MongoDB",
  "prisma:migrate:postgres": "Migraciones PostgreSQL (dev)",
  "prisma:migrate:deploy:postgres": "Migraciones PostgreSQL (prod)",
  "prisma:migrate:mongo": "Sincronizar MongoDB",
  "prisma:studio:postgres": "Prisma Studio PostgreSQL",
  "prisma:studio:mongo": "Prisma Studio MongoDB",
  "prisma:reset:postgres": "Reset PostgreSQL",
  "prisma:seed": "Ejecutar seed"
}
```

### 5. **Dependencias Actualizadas**

Agregadas en `package.json`:
- ✅ `@nestjs/config`: ^3.2.0
- ✅ `@prisma/client`: ^6.18.0
- ✅ `class-transformer`: ^0.5.1
- ✅ `class-validator`: ^0.14.1

### 6. **Seed de Datos**

`prisma/seed.ts`:
- ✅ Seed para PostgreSQL (usuarios, roles, permisos, cursos)
- ✅ Seed para MongoDB (perfiles, actividades, notificaciones)
- ✅ Datos de ejemplo completos

### 7. **Documentación**

Archivos creados:
- ✅ `PRISMA_SETUP.md` - Guía completa
- ✅ `src/database/README.md` - Documentación técnica
- ✅ `src/database/examples/user-complete.service.example.ts` - Ejemplos de uso

### 8. **Configuración de Git**

`.gitignore` actualizado:
- ✅ Ignorar clientes generados de Prisma
- ✅ Ignorar migraciones (excepto .gitkeep)

---

## 🚀 Cómo Empezar

### Paso 1: Variables de Entorno

Asegúrate de tener en tu `.env`:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:password@postgres:5432/onenglishdb?schema=public

# MongoDB
MONGO_URI=mongodb://mongoadmin:password@mongo:27017/onenglishdb?authSource=admin
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Levantar Contenedores Docker

```bash
make up-dev
```

### Paso 4: Generar Clientes de Prisma

```bash
# Dentro del contenedor
docker exec -it nestjs_backend npm run prisma:generate

# O con Make
make generate-dev
```

### Paso 5: Ejecutar Migraciones

```bash
# PostgreSQL
docker exec -it nestjs_backend npm run prisma:migrate:postgres

# MongoDB
docker exec -it nestjs_backend npm run prisma:migrate:mongo

# O con Make
make migrate-dev
```

### Paso 6: (Opcional) Ejecutar Seed

```bash
docker exec -it nestjs_backend npm run prisma:seed

# O con Make
make seed-dev
```

---

## 💡 Uso Básico

### En un Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaPostgresService } from './database/prisma-postgres.service';
import { PrismaMongoService } from './database/prisma-mongo.service';

@Injectable()
export class MyService {
  constructor(
    private prisma: PrismaPostgresService,
    private prismaMongoService: PrismaMongoService,
  ) {}

  async example() {
    // PostgreSQL
    const user = await this.prisma.user.findUnique({
      where: { id: '123' },
    });

    // MongoDB
    const profile = await this.prismaMongoService.userProfile.findUnique({
      where: { userId: '123' },
    });

    return { ...user, profile };
  }
}
```

---

## 📊 Estrategia de Datos

### PostgreSQL (Estructurados)

**Cuándo usar**:
- ✅ Datos con relaciones complejas
- ✅ Integridad referencial necesaria
- ✅ Transacciones ACID
- ✅ Consultas con JOINs
- ✅ Estructura fija

**Ejemplos**:
- Usuarios, roles, permisos
- Cursos y lecciones (estructura)
- Matrículas
- Pagos

### MongoDB (Flexibles)

**Cuándo usar**:
- ✅ Estructura variable
- ✅ Datos anidados (JSON)
- ✅ Alta frecuencia de escritura
- ✅ Logs y analytics
- ✅ Datos no relacionales

**Ejemplos**:
- Perfiles de usuario extendidos
- Contenido de lecciones (rich text, JSON)
- Progreso de estudiantes
- Mensajes y chat
- Logs y auditoría
- Notificaciones

---

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Ver todos los comandos
make help

# Levantar aplicación
make up-dev

# Ver logs
make logs-backend-dev

# Acceder al contenedor
make shell-backend-dev

# Migraciones
make migrate-dev

# Generar clientes
make generate-dev

# Seed
make seed-dev
```

### Prisma Studio

```bash
# PostgreSQL (localhost:5555)
npm run prisma:studio:postgres

# MongoDB (localhost:5556)
npm run prisma:studio:mongo
```

---

## 📝 Notas Importantes

### ⚠️ Migraciones

- **PostgreSQL**: Usa migraciones tradicionales con `prisma migrate`
- **MongoDB**: Usa `prisma db push` (no hay migraciones tradicionales)

### 🔗 Referencias entre DBs

- Usa IDs de tipo `String` para referenciar entre bases de datos
- No uses relaciones de Prisma entre diferentes DBs
- Maneja la integridad en el código de la aplicación

### 🔄 Sincronización

- Al modificar un schema, regenera los clientes
- PostgreSQL: crea migración
- MongoDB: ejecuta db push

---

## 🎓 Ejemplos Completos

Ver archivos de ejemplo en:
- `src/database/examples/user-complete.service.example.ts`
- `src/database/README.md`
- `PRISMA_SETUP.md`

---

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [PostgreSQL Connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [MongoDB Connector](https://www.prisma.io/docs/concepts/database-connectors/mongodb)

---

## 🆘 Troubleshooting

### Error: Cannot find module '@prisma/postgres-client'

```bash
npm run prisma:generate:postgres
```

### Error: Cannot find module '@prisma/mongo-client'

```bash
npm run prisma:generate:mongo
```

### Error en migraciones

```bash
# Resetear PostgreSQL (CUIDADO: Borra todos los datos)
npm run prisma:reset:postgres

# Regenerar clientes
npm run prisma:generate
```

### Contenedor no conecta a las bases de datos

```bash
# Verificar que los contenedores estén corriendo
docker ps

# Ver logs
make logs-postgres-dev
make logs-mongo-dev

# Reiniciar contenedores
make restart-dev
```

---

## ✅ Checklist de Configuración

- [ ] Variables de entorno configuradas (`.env`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Contenedores Docker corriendo (`make up-dev`)
- [ ] Clientes de Prisma generados (`npm run prisma:generate`)
- [ ] Migraciones de PostgreSQL aplicadas
- [ ] Schema de MongoDB sincronizado
- [ ] (Opcional) Seed ejecutado
- [ ] Servicios funcionando correctamente

---

<p align="center">
  <strong>¡Configuración Dual de Bases de Datos Completada!</strong><br>
  OneEnglish Backend está listo para usar PostgreSQL y MongoDB 🎉
</p>

