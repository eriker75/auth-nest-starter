# 🏗️ Arquitectura de Base de Datos Dual

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                     OneEnglish Backend (NestJS)                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    DatabaseModule (@Global)                 │ │
│  │                                                              │ │
│  │   ┌──────────────────┐          ┌──────────────────┐       │ │
│  │   │PrismaPostgreServ.│          │PrismaMongoService│       │ │
│  │   │   (PostgreSQL)   │          │    (MongoDB)     │       │ │
│  │   └────────┬─────────┘          └────────┬─────────┘       │ │
│  │            │                              │                  │ │
│  └────────────┼──────────────────────────────┼─────────────────┘ │
│               │                              │                   │
└───────────────┼──────────────────────────────┼───────────────────┘
                │                              │
                │                              │
     ┌──────────▼──────────┐        ┌─────────▼──────────┐
     │                     │        │                     │
     │    PostgreSQL       │        │      MongoDB        │
     │   (Port 5432)       │        │    (Port 27017)     │
     │                     │        │                     │
     │  Datos Estructurados│        │  Datos Flexibles    │
     │                     │        │                     │
     └─────────────────────┘        └─────────────────────┘
              │                              │
              │                              │
     ┌────────▼─────────┐           ┌───────▼────────┐
     │                  │           │                 │
     │   PgAdmin        │           │  Mongo Express  │
     │  (Port 5050)     │           │  (Port 8081)    │
     │                  │           │                 │
     └──────────────────┘           └─────────────────┘
```

---

## 📊 Distribución de Datos

### PostgreSQL - Datos Estructurados

```
┌────────────────────────────────────────┐
│           POSTGRESQL                   │
├────────────────────────────────────────┤
│                                        │
│  👤 User                               │
│    ├─ id, email, username              │
│    ├─ firstName, lastName              │
│    ├─ password, isActive               │
│    └─ timestamps                       │
│                                        │
│  🎭 Role                               │
│    ├─ id, name, description            │
│    └─ permissions (relation)           │
│                                        │
│  🔐 Permission                         │
│    ├─ id, name, resource, action       │
│    └─ description                      │
│                                        │
│  📚 Course                             │
│    ├─ id, title, slug                  │
│    ├─ description, level, price        │
│    └─ isPublished                      │
│                                        │
│  📖 Lesson                             │
│    ├─ id, courseId, title, slug        │
│    ├─ order, duration                  │
│    └─ isPublished                      │
│                                        │
│  🎓 Enrollment                         │
│    ├─ id, userId, courseId             │
│    ├─ progress, completedAt            │
│    └─ timestamps                       │
│                                        │
│  🔗 Relaciones (UserRole,              │
│      RolePermission, UserPermission)   │
│                                        │
└────────────────────────────────────────┘
```

### MongoDB - Datos Flexibles

```
┌────────────────────────────────────────┐
│             MONGODB                    │
├────────────────────────────────────────┤
│                                        │
│  👤 UserProfile                        │
│    ├─ userId (ref → PostgreSQL)       │
│    ├─ bio, address, city               │
│    ├─ socialLinks (JSON)               │
│    └─ preferences (JSON)               │
│                                        │
│  📊 UserActivity                       │
│    ├─ userId, action, resource         │
│    ├─ metadata (JSON)                  │
│    └─ timestamp, ipAddress             │
│                                        │
│  ⚙️  UserSetting                       │
│    ├─ userId                           │
│    └─ settings (JSON flexible)         │
│                                        │
│  📝 LessonContent                      │
│    ├─ lessonId (ref → PostgreSQL)     │
│    ├─ content (JSON rich text)         │
│    ├─ resources (JSON)                 │
│    └─ exercises (JSON)                 │
│                                        │
│  📈 LessonProgress                     │
│    ├─ userId, lessonId, enrollmentId   │
│    ├─ completedSteps (JSON)            │
│    ├─ quizResults (JSON)               │
│    └─ timeSpent, notes                 │
│                                        │
│  💬 ChatMessage                        │
│    ├─ senderId, receiverId, roomId     │
│    ├─ message, messageType             │
│    └─ attachments (JSON)               │
│                                        │
│  🔔 Notification                       │
│    ├─ userId, type, title, message     │
│    ├─ data (JSON)                      │
│    └─ isRead, readAt                   │
│                                        │
│  🏆 Achievement                        │
│    ├─ userId, type, title              │
│    ├─ points, metadata (JSON)          │
│    └─ earnedAt                         │
│                                        │
│  📋 AuditLog                           │
│    ├─ userId, action, entity           │
│    ├─ changes (JSON before/after)      │
│    └─ timestamp, ipAddress             │
│                                        │
│  ❌ ErrorLog                           │
│    ├─ userId, errorType, message       │
│    ├─ stack, context (JSON)            │
│    └─ severity, timestamp              │
│                                        │
└────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### Ejemplo: Crear Usuario Completo

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ POST /api/users
     ▼
┌────────────────────┐
│  UserController    │
└────────┬───────────┘
         │
         │ createUser(dto)
         ▼
┌────────────────────┐
│   UserService      │
└────────┬───────────┘
         │
         ├──────────────────────┬────────────────────────┐
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ PrismaService   │   │PrismaMongoService│   │PrismaMongoService│
│                 │   │                  │   │                  │
│ CREATE User     │   │ CREATE Profile   │   │ CREATE Settings  │
│ in PostgreSQL   │   │ in MongoDB       │   │ in MongoDB       │
└─────────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
          │                    │                       │
          ▼                    ▼                       ▼
     ┌─────────┐          ┌─────────┐            ┌─────────┐
     │PostgreSQL          │ MongoDB │            │ MongoDB │
     │  users  │          │ profiles│            │settings │
     └─────────┘          └─────────┘            └─────────┘
```

### Ejemplo: Obtener Usuario Completo

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ GET /api/users/:id
     ▼
┌────────────────────┐
│  UserController    │
└────────┬───────────┘
         │
         │ getUser(id)
         ▼
┌────────────────────┐
│   UserService      │
└────────┬───────────┘
         │
         ├──────────────────────┬────────────────────────┐
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│PrismaPostgreServ│   │PrismaMongoService│   │PrismaMongoService│
│                 │   │                  │   │                  │
│ FIND User       │   │ FIND Profile     │   │ FIND Settings    │
│ with roles      │   │ by userId        │   │ by userId        │
└─────────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
          │                    │                       │
          ▼                    ▼                       ▼
     ┌─────────┐          ┌─────────┐            ┌─────────┐
     │PostgreSQL          │ MongoDB │            │ MongoDB │
     └─────────┘          └─────────┘            └─────────┘
          │                    │                       │
          └────────────────────┴───────────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   Combine    │
                        │     Data     │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   Response   │
                        └──────────────┘
```

---

## 🎯 Decisiones de Arquitectura

### ¿Por qué dos bases de datos?

#### PostgreSQL - Cuando necesitas:
- ✅ **ACID Compliance**: Transacciones garantizadas
- ✅ **Relaciones complejas**: JOINs eficientes
- ✅ **Integridad referencial**: Foreign keys
- ✅ **Esquema fijo**: Estructura bien definida
- ✅ **Consultas complejas**: Agregaciones, subqueries

**Casos de uso**:
- Autenticación y autorización
- Sistema de roles y permisos
- Estructura de cursos
- Matrículas y pagos
- Cualquier dato crítico del negocio

#### MongoDB - Cuando necesitas:
- ✅ **Flexibilidad**: Esquema variable
- ✅ **Escalabilidad**: Sharding horizontal
- ✅ **Documentos anidados**: JSON nativo
- ✅ **Alta escritura**: Logs, eventos
- ✅ **Datos no estructurados**: Contenido dinámico

**Casos de uso**:
- Perfiles de usuario (datos variables)
- Contenido de lecciones (rich text, JSON)
- Logs y auditoría
- Mensajes y chat
- Notificaciones
- Analytics y métricas

---

## 🔗 Estrategia de Referencias

### Referencias entre DBs

```typescript
// PostgreSQL
model User {
  id    String  @id @default(uuid())
  email String  @unique
  // ... otros campos
}

// MongoDB
model UserProfile {
  id     String  @id @default(auto()) @map("_id") @db.ObjectId
  userId String  @unique  // ← Referencia al User.id de PostgreSQL
  bio    String?
  // ... otros campos
}
```

### Cómo mantener la integridad

```typescript
// En el servicio
async createUser(data: CreateUserDto) {
  // 1. Crear en PostgreSQL (DB principal)
  const user = await this.prisma.user.create({ data });
  
  try {
    // 2. Crear en MongoDB (datos relacionados)
    await this.prismaMongoService.userProfile.create({
      data: { userId: user.id, ... },
    });
  } catch (error) {
    // 3. Si falla MongoDB, hacer rollback en PostgreSQL
    await this.prisma.user.delete({ where: { id: user.id } });
    throw error;
  }
  
  return user;
}
```

---

## 📈 Escalabilidad

### PostgreSQL
- **Vertical**: Aumentar recursos del servidor
- **Read Replicas**: Para distribución de lecturas
- **Connection Pooling**: PgBouncer

### MongoDB
- **Horizontal**: Sharding nativo
- **Replica Sets**: Alta disponibilidad
- **Index Optimization**: Para queries rápidas

---

## 🔒 Seguridad

### PostgreSQL
- ✅ SSL/TLS connections
- ✅ Row Level Security (RLS)
- ✅ Roles y permisos a nivel de DB
- ✅ Auditoría de queries

### MongoDB
- ✅ TLS/SSL connections
- ✅ RBAC (Role-Based Access Control)
- ✅ Field-level encryption
- ✅ Auditing nativo

---

## 🎓 Recursos

- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **MongoDB**: https://docs.mongodb.com/
- **NestJS**: https://docs.nestjs.com/

---

<p align="center">
  Arquitectura diseñada para <strong>OneEnglish Backend</strong><br>
  Optimizada para rendimiento, escalabilidad y mantenibilidad
</p>
