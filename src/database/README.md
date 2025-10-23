# Base de Datos - Configuración Dual

Este proyecto utiliza **dos bases de datos** con Prisma:

## 🗄️ PostgreSQL (Datos Estructurados)
- **Servicio**: `PrismaPostgresService`
- **Schema**: `prisma/schema.prisma`
- **Cliente**: `@prisma/postgres-client`
- **Uso**: Datos relacionales y estructurados

### Modelos en PostgreSQL:
- `User` - Usuarios del sistema
- `Role` - Roles de usuario
- `Permission` - Permisos del sistema
- `UserRole` - Relación Usuario-Rol
- `RolePermission` - Relación Rol-Permiso
- `UserPermission` - Permisos directos de usuario
- `Course` - Cursos
- `Lesson` - Lecciones
- `Enrollment` - Matrículas

## 📦 MongoDB (Datos Flexibles)
- **Servicio**: `PrismaMongoService`
- **Schema**: `prisma/schema.mongo.prisma`
- **Cliente**: `@prisma/mongo-client`
- **Uso**: Datos no estructurados y flexibles

### Modelos en MongoDB:
- `UserProfile` - Perfil extendido del usuario
- `UserActivity` - Actividad del usuario
- `UserSetting` - Configuraciones del usuario
- `LessonContent` - Contenido de las lecciones
- `LessonProgress` - Progreso en lecciones
- `ChatMessage` - Mensajes de chat
- `Notification` - Notificaciones
- `Achievement` - Logros
- `AuditLog` - Logs de auditoría
- `ErrorLog` - Logs de errores

---

## 🚀 Uso en Servicios

### PostgreSQL Service

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaPostgresService } from './database/prisma-postgres.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaPostgresService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });
  }
}
```

### MongoDB Service

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaMongoService } from './database/prisma-mongo.service';

@Injectable()
export class UserProfileService {
  constructor(private prismaMongoService: PrismaMongoService) {}

  async findByUserId(userId: string) {
    return this.prismaMongoService.userProfile.findUnique({
      where: { userId },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prismaMongoService.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio,
        socialLinks: data.socialLinks,
        preferences: data.preferences,
      },
      update: {
        bio: data.bio,
        socialLinks: data.socialLinks,
        preferences: data.preferences,
      },
    });
  }

  async logActivity(userId: string, action: string, metadata?: any) {
    return this.prismaMongoService.userActivity.create({
      data: {
        userId,
        action,
        metadata,
        timestamp: new Date(),
      },
    });
  }
}
```

### Uso combinado

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaPostgresService } from './database/prisma-postgres.service';
import { PrismaMongoService } from './database/prisma-mongo.service';

@Injectable()
export class UserCompleteService {
  constructor(
    private prisma: PrismaPostgresService,
    private prismaMongoService: PrismaMongoService,
  ) {}

  async getUserComplete(userId: string) {
    // Obtener datos estructurados de PostgreSQL
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    // Obtener datos flexibles de MongoDB
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

  async createCompleteUser(data: CreateUserDto) {
    // Crear usuario en PostgreSQL
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });

    // Crear perfil en MongoDB
    await this.prismaMongoService.userProfile.create({
      data: {
        userId: user.id,
        bio: data.bio,
        preferences: {},
      },
    });

    // Crear configuraciones en MongoDB
    await this.prismaMongoService.userSetting.create({
      data: {
        userId: user.id,
        settings: {
          theme: 'light',
          language: 'es',
          notifications: true,
        },
      },
    });

    // Registrar actividad en MongoDB
    await this.prismaMongoService.userActivity.create({
      data: {
        userId: user.id,
        action: 'user_created',
        metadata: {
          email: data.email,
        },
      },
    });

    return user;
  }
}
```

---

## 📝 Comandos de Prisma

### Generar Clientes

```bash
# Generar ambos clientes
npm run prisma:generate

# Generar solo PostgreSQL
npm run prisma:generate:postgres

# Generar solo MongoDB
npm run prisma:generate:mongo
```

### Migraciones (PostgreSQL)

```bash
# Crear y aplicar migración
npm run prisma:migrate:postgres

# Aplicar migraciones en producción
npm run prisma:migrate:deploy:postgres

# Resetear base de datos (CUIDADO!)
npm run prisma:reset:postgres
```

### Sincronizar Schema (MongoDB)

```bash
# MongoDB no usa migraciones tradicionales, usa db push
npm run prisma:migrate:mongo
```

### Prisma Studio

```bash
# Abrir Studio para PostgreSQL (puerto 5555)
npm run prisma:studio:postgres

# Abrir Studio para MongoDB (puerto 5556)
npm run prisma:studio:mongo
```

### Usando Make

```bash
# Dentro del contenedor Docker
make migrate-dev           # Migraciones PostgreSQL
make generate-dev          # Generar clientes
make studio-dev           # Abrir Prisma Studio (PostgreSQL)
```

---

## 🔄 Workflow de Desarrollo

1. **Modificar schemas**:
   - Edita `prisma/schema.prisma` para PostgreSQL
   - Edita `prisma/schema.mongo.prisma` para MongoDB

2. **Generar clientes**:
   ```bash
   npm run prisma:generate
   ```

3. **Aplicar cambios**:
   ```bash
   # PostgreSQL (con migraciones)
   npm run prisma:migrate:postgres

   # MongoDB (con db push)
   npm run prisma:migrate:mongo
   ```

4. **Usar en tu código**:
   - Inyecta `PrismaService` para PostgreSQL
   - Inyecta `PrismaMongoService` para MongoDB

---

## 🎯 Estrategia de Uso

### ✅ PostgreSQL para:
- Datos de usuarios principales
- Autenticación y autorización
- Roles y permisos
- Cursos y lecciones (estructura)
- Matrículas
- Datos que requieren relaciones estrictas
- Datos que necesitan transacciones ACID

### ✅ MongoDB para:
- Perfiles de usuario extendidos
- Configuraciones flexibles
- Contenido de lecciones (markdown, JSON, etc)
- Progreso de estudiantes
- Logs y auditoría
- Mensajes de chat
- Notificaciones
- Actividad de usuarios
- Datos que cambian frecuentemente
- Datos con estructura variable

---

## 🔐 Transacciones

### PostgreSQL (Transacciones ACID)

```typescript
async transferCredits(fromUserId: string, toUserId: string, amount: number) {
  return this.prisma.$transaction(async (tx) => {
    // Operaciones dentro de la transacción
    await tx.user.update({
      where: { id: fromUserId },
      data: { credits: { decrement: amount } },
    });

    await tx.user.update({
      where: { id: toUserId },
      data: { credits: { increment: amount } },
    });
  });
}
```

### MongoDB (Transacciones)

```typescript
async updateMultipleDocuments(userId: string, data: any) {
  return this.prismaMongoService.$transaction(async (tx) => {
    await tx.userProfile.update({
      where: { userId },
      data: { bio: data.bio },
    });

    await tx.userActivity.create({
      data: {
        userId,
        action: 'profile_updated',
      },
    });
  });
}
```

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Multiple Databases](https://www.prisma.io/docs/guides/database/multi-schema)
- [MongoDB with Prisma](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [PostgreSQL with Prisma](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

