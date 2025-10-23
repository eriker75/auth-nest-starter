# 🗄️ Configuración de Prisma - Base de Datos Dual

Este proyecto utiliza **Prisma con dos bases de datos diferentes** para optimizar el almacenamiento y consulta de datos según su naturaleza.

---

## 📊 Arquitectura de Bases de Datos

### PostgreSQL (Datos Estructurados)
**Archivo**: `prisma/schema.postgre.prisma`  
**Cliente**: `@prisma/postgres-client`  
**Servicio**: `PrismaPostgresService`

**Uso ideal para**:
- ✅ Datos con relaciones estrictas
- ✅ Integridad referencial
- ✅ Transacciones ACID
- ✅ Consultas complejas con JOINs
- ✅ Datos que raramente cambian de estructura

**Modelos incluidos**:
- `User` - Usuarios
- `Role` - Roles
- `Permission` - Permisos
- `UserRole`, `RolePermission`, `UserPermission` - Relaciones
- `Course` - Cursos
- `Lesson` - Lecciones
- `Enrollment` - Matrículas

### MongoDB (Datos Flexibles)
**Archivo**: `prisma/schema.mongo.prisma`  
**Cliente**: `@prisma/mongo-client`  
**Servicio**: `PrismaMongoService`

**Uso ideal para**:
- ✅ Documentos con estructura variable
- ✅ Datos anidados (JSON)
- ✅ Alta frecuencia de escritura
- ✅ Logs y analytics
- ✅ Datos no relacionales
- ✅ Escalabilidad horizontal

**Modelos incluidos**:
- `UserProfile` - Perfiles extendidos
- `UserActivity` - Actividad de usuarios
- `UserSetting` - Configuraciones
- `LessonContent` - Contenido de lecciones
- `LessonProgress` - Progreso en lecciones
- `ChatMessage` - Mensajes
- `Notification` - Notificaciones
- `Achievement` - Logros
- `AuditLog` - Auditoría
- `ErrorLog` - Logs de errores

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener estas variables en tu `.env`:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:password@postgres:5432/onenglishdb?schema=public

# MongoDB
MONGO_URI=mongodb://mongoadmin:password@mongo:27017/onenglishdb?authSource=admin
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Generar Clientes de Prisma

```bash
# Generar ambos clientes
npm run prisma:generate

# O individualmente
npm run prisma:generate:postgres
npm run prisma:generate:mongo
```

### 4. Ejecutar Migraciones (PostgreSQL)

```bash
# Crear y aplicar migración
npm run prisma:migrate:postgres

# En producción
npm run prisma:migrate:deploy:postgres
```

### 5. Sincronizar Schema (MongoDB)

```bash
# MongoDB usa db push en lugar de migraciones
npm run prisma:migrate:mongo
```

### 6. Ejecutar Seed (Opcional)

```bash
npm run prisma:seed
```

---

## 📝 Comandos Disponibles

### Generación de Clientes

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:generate` | Genera ambos clientes |
| `npm run prisma:generate:postgres` | Genera solo cliente PostgreSQL |
| `npm run prisma:generate:mongo` | Genera solo cliente MongoDB |

### Migraciones PostgreSQL

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:migrate:postgres` | Crear y aplicar migración |
| `npm run prisma:migrate:deploy:postgres` | Aplicar migraciones (producción) |
| `npm run prisma:reset:postgres` | Resetear BD (⚠️ CUIDADO) |

### MongoDB

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:migrate:mongo` | Sincronizar schema con db push |

### Prisma Studio

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:studio:postgres` | Abrir Studio PostgreSQL (puerto 5555) |
| `npm run prisma:studio:mongo` | Abrir Studio MongoDB (puerto 5556) |

### Seed

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:seed` | Ejecutar seed de datos de ejemplo |

---

## 💻 Uso en Código

### Inyección de Servicios

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaPostgresService } from './database/prisma-postgres.service';
import { PrismaMongoService } from './database/prisma-mongo.service';

@Injectable()
export class MyService {
  constructor(
    private readonly prisma: PrismaPostgresService,           // PostgreSQL
    private readonly prismaMongoService: PrismaMongoService,  // MongoDB
  ) {}
}
```

### Ejemplo: Crear Usuario Completo

```typescript
async createUser(data: CreateUserDto) {
  // 1. Crear usuario en PostgreSQL
  const user = await this.prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hashedPassword,
    },
  });

  // 2. Crear perfil en MongoDB
  await this.prismaMongoService.userProfile.create({
    data: {
      userId: user.id,
      bio: data.bio,
      preferences: {},
    },
  });

  // 3. Crear configuraciones en MongoDB
  await this.prismaMongoService.userSetting.create({
    data: {
      userId: user.id,
      settings: {
        theme: 'light',
        language: 'es',
      },
    },
  });

  return user;
}
```

### Ejemplo: Consulta Combinada

```typescript
async getUserComplete(userId: string) {
  // Datos estructurados de PostgreSQL
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });

  // Datos flexibles de MongoDB
  const profile = await this.prismaMongoService.userProfile.findUnique({
    where: { userId },
  });

  const settings = await this.prismaMongoService.userSetting.findUnique({
    where: { userId },
  });

  return {
    ...user,
    profile,
    settings: settings?.settings,
  };
}
```

---

## 🔄 Workflow de Desarrollo

### Añadir un Nuevo Modelo

#### PostgreSQL:

1. Edita `prisma/schema.prisma`
2. Genera el cliente: `npm run prisma:generate:postgres`
3. Crea migración: `npm run prisma:migrate:postgres`
4. Usa el modelo en tu código

#### MongoDB:

1. Edita `prisma/schema.mongo.prisma`
2. Genera el cliente: `npm run prisma:generate:mongo`
3. Sincroniza: `npm run prisma:migrate:mongo`
4. Usa el modelo en tu código

### Modificar un Modelo Existente

#### PostgreSQL:

```bash
# 1. Editar schema
# 2. Generar y migrar
npm run prisma:generate:postgres
npm run prisma:migrate:postgres
```

#### MongoDB:

```bash
# 1. Editar schema
# 2. Generar y sincronizar
npm run prisma:generate:mongo
npm run prisma:migrate:mongo
```

---

## 🐳 Docker

### Dentro del Contenedor

```bash
# Acceder al contenedor
docker exec -it nestjs_backend sh

# Ejecutar comandos de Prisma
npm run prisma:generate
npm run prisma:migrate:postgres
npm run prisma:migrate:mongo
```

### Con Make (Recomendado)

```bash
# Migraciones
make migrate-dev

# Generar clientes
make generate-dev

# Prisma Studio
make studio-dev

# Seed
make seed-dev
```

---

## 🎯 Mejores Prácticas

### ✅ DO (Hacer)

1. **Usa PostgreSQL para**:
   - Datos de usuarios principales
   - Autenticación y autorización
   - Estructura de cursos y lecciones
   - Relaciones complejas
   - Datos que requieren integridad referencial

2. **Usa MongoDB para**:
   - Perfiles de usuario extendidos
   - Contenido rico (JSON, markdown)
   - Logs y auditoría
   - Mensajes y notificaciones
   - Datos con estructura variable
   - Analytics y métricas

3. **Referencias entre DBs**:
   - Usa IDs (strings) para referenciar
   - No uses relaciones de Prisma entre diferentes DBs
   - Maneja integridad en código de aplicación

### ❌ DON'T (No hacer)

1. No uses relaciones de Prisma entre PostgreSQL y MongoDB
2. No dupliques datos innecesariamente
3. No uses MongoDB para datos que requieren transacciones complejas
4. No uses PostgreSQL para datos con estructura muy variable

---

## 🔍 Debugging

### Ver Queries Generadas

Ambos servicios tienen logging habilitado en desarrollo:

```typescript
// En prisma.service.ts y prisma-mongo.service.ts
log: nodeEnv === 'production'
  ? ['warn', 'error']
  : ['query', 'info', 'warn', 'error'],
```

### Prisma Studio

```bash
# PostgreSQL (puerto 5555)
npm run prisma:studio:postgres

# MongoDB (puerto 5556)
npm run prisma:studio:mongo
```

### Logs de Contenedor

```bash
# Ver logs del backend
make logs-backend-dev

# Ver logs de PostgreSQL
make logs-postgres-dev

# Ver logs de MongoDB
make logs-mongo-dev
```

---

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Prisma con PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma con MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Múltiples Databases con Prisma](https://www.prisma.io/docs/guides/database/multi-schema)

---

## 🤝 Soporte

Para preguntas sobre la configuración de Prisma:

1. Revisa la documentación en `src/database/README.md`
2. Consulta los ejemplos en `src/database/examples/`
3. Abre un issue en el repositorio
4. Contacta al equipo de desarrollo

---

<p align="center">
  <strong>Configuración creada para OneEnglish Backend</strong>
</p>

