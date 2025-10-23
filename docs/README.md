# 📚 OneEnglish Backend - Documentation

Welcome to the OneEnglish Backend documentation! This folder contains comprehensive guides and references for the project.

---

## 📖 **Documentation Index**

### 🏗️ **Architecture & Setup**

| Document | Description |
|----------|-------------|
| **[DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)** | Complete guide to the dual database architecture (PostgreSQL + MongoDB) |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture diagrams and data flow |
| **[DUAL_DATABASE_SETUP.md](./DUAL_DATABASE_SETUP.md)** | Quick reference for dual database setup |

### 🔧 **Development Guides**

| Document | Description |
|----------|-------------|
| **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** | Prisma configuration, migrations, and best practices |
| **[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)** | How to run the backend locally with Docker services |
| **[RENAMED_FILES.md](./RENAMED_FILES.md)** | History of file structure changes and renaming |

### 🔒 **Sensitive Information**

| Document | Description |
|----------|-------------|
| **[CREDENTIALS.md](./CREDENTIALS.md)** | Database credentials and access tokens (⚠️ NOT in git) |

---

## 🚀 **Quick Start**

1. **Setup Environment**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Start database services
   make up-services
   
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

2. **Start Development**
   ```bash
   npm run start:dev
   ```

3. **Read the Docs**
   - Start with [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) to understand the system
   - Check [PRISMA_SETUP.md](./PRISMA_SETUP.md) for database operations
   - See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for development workflow

---

## 📂 **Documentation Structure**

```
docs/
├── README.md                       ← You are here
├── DATABASE_ARCHITECTURE.md        ← Main architecture guide
├── ARCHITECTURE.md                 ← System diagrams
├── DUAL_DATABASE_SETUP.md          ← Quick setup reference
├── PRISMA_SETUP.md                 ← Prisma guide
├── LOCAL_DEVELOPMENT.md            ← Dev workflow
├── RENAMED_FILES.md                ← Change history
└── CREDENTIALS.md                  ← Credentials (git-ignored)
```

---

## 🔗 **External Resources**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

## 📝 **Contributing to Documentation**

When adding new documentation:

1. ✅ Use clear, descriptive titles
2. ✅ Include code examples
3. ✅ Add to this index
4. ✅ Keep it updated with code changes
5. ✅ Use markdown best practices

---

**Last Updated**: October 2024

