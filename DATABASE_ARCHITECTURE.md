# 🗄️ Database Architecture - OneEnglish

## Overview

OneEnglish uses a **dual database architecture** combining PostgreSQL and MongoDB to leverage the strengths of both:

- **PostgreSQL (Prisma)**: Structured, relational data
- **MongoDB (Mongoose)**: Flexible, dynamic data

---

## 🔷 PostgreSQL - Structured Data

### Purpose
Stores **structured, relational data** that benefits from ACID transactions, foreign keys, and complex queries.

### Models

#### 👤 User Management
- **User**: User accounts, authentication data
- **UserSetting**: User preferences (theme, language, notifications)
- **UserActivity**: Activity tracking (login, challenge start, phase completion)
- **Role**: User roles (admin, teacher, student)
- **Permission**: Granular permissions
- **UserRole**: User-Role relationships
- **RolePermission**: Role-Permission relationships
- **UserPermission**: Direct user permissions

#### 🏆 Challenge System (Olympic-style 5 Phases)
- **Challenge**: Main challenge entity (category, level, difficulty)
- **Phase**: 5 phases per challenge (like Olympic stages)
- **UserProgress**: User progress through challenges
- **PhaseProgress**: Detailed progress per phase

#### 📊 Audit & System
- **AuditLog**: System audit trail
- **ErrorLog**: Error tracking and monitoring

### Why PostgreSQL for these?
- ✅ Strong data integrity (foreign keys, constraints)
- ✅ Complex relationships (users → progress → phases)
- ✅ ACID transactions for critical data
- ✅ Efficient joins for reporting
- ✅ Referential integrity

---

## 🔶 MongoDB - Flexible Data

### Purpose
Stores **dynamic, schema-flexible data** that changes frequently or has complex nested structures.

### Collections

#### ❓ Questions (Main Use Case)
**Why MongoDB?**
Dynamic question types with varying structures that would be impossible to model efficiently in SQL.

**Structure:**
```typescript
{
  _id: ObjectId,
  phase_id: string,                    // Reference to PostgreSQL Phase
  type: string,                         // multiple_choice, fill_blank, audio, etc.
  content: {
    prompt: any,                        // String, Object, or complex structure
    instructions: string,
    media_references: [ObjectId]
  },
  validation: {
    correct_answer: any,                // Flexible answer format
    scoring_rules: object,
    evaluation_method: string           // auto, manual, hybrid
  },
  settings: {
    points: number,
    time_limit: number,
    max_attempts: number,
    difficulty: string
  },
  metadata: {
    skill_category: string,
    language_level: string,
    tags: [string]
  }
}
```

**Supported Question Types:**
- Multiple choice
- Fill in the blank
- Audio comprehension
- Speaking practice
- Matching
- Ordering
- True/False
- Short answer
- Essay
- Listening comprehension

#### 💬 Chat Messages
Real-time messaging between users.

```typescript
{
  _id: ObjectId,
  sender_id: string,                    // PostgreSQL User reference
  receiver_id: string,                  // PostgreSQL User reference
  room_id: string,                      // For group chats
  message: string,
  message_type: string,                 // text, image, audio, video, file
  attachments: [string],
  is_read: boolean,
  created_at: Date
}
```

#### 📝 User Answers
Stores user answers for analytics and review.

```typescript
{
  _id: ObjectId,
  user_id: string,                      // PostgreSQL User reference
  phase_progress_id: string,            // PostgreSQL PhaseProgress reference
  question_id: ObjectId,                // MongoDB Question reference
  user_answer: any,                     // Flexible answer structure
  is_correct: boolean,
  points_earned: number,
  time_spent: number,
  attempt_number: number,
  feedback: string,
  detailed_evaluation: object
}
```

### Why MongoDB for these?
- ✅ **Extreme flexibility**: Questions can have wildly different structures
- ✅ **No schema migrations**: Add new question types without DB changes
- ✅ **Complex nested data**: Validation rules, media references, scoring
- ✅ **Performance**: Fast reads for question delivery
- ✅ **Scalability**: Handles high-volume writes (chat, answers)

---

## 🔗 Data Flow

### Challenge Workflow

1. **User starts a Challenge** (PostgreSQL)
   - Creates `UserProgress` record
   - Links to `Challenge` and `User`

2. **User enters a Phase** (PostgreSQL)
   - Creates `PhaseProgress` record
   - Tracks score, attempts, time

3. **System fetches Questions** (MongoDB)
   - Queries `questions` collection by `phase_id`
   - Returns dynamic question structures

4. **User answers Questions** (MongoDB)
   - Stores answer in `user_answers`
   - Links to PostgreSQL `phase_progress_id`

5. **System updates Progress** (PostgreSQL)
   - Updates `PhaseProgress` statistics
   - Updates `UserProgress` when phase completes

### Reference Pattern

```
PostgreSQL                  MongoDB
──────────                  ───────
User (id) ────────────────> user_id (in answers)
Phase (id) ───────────────> phase_id (in questions)
PhaseProgress (id) ───────> phase_progress_id (in answers)
                Question (id) ────> question_id (in answers)
```

---

## 📊 Schema Management

### PostgreSQL (Prisma)
```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Deploy migration (production)
npm run prisma:migrate:deploy

# Reset database (development)
npm run prisma:reset

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### MongoDB (Mongoose)
- **No migrations needed** - schemas are enforced at application level
- **Indexes** are created automatically on startup
- **Validation** happens in Mongoose schemas

---

## 🛠️ Technology Stack

| Database   | ORM/ODM  | Purpose                          |
|------------|----------|----------------------------------|
| PostgreSQL | Prisma   | Structured, relational data      |
| MongoDB    | Mongoose | Flexible, dynamic data           |

---

## 📁 Project Structure

```
src/
├── database/
│   ├── database.module.ts          ← MongoDB forRootAsync config
│   └── prisma-postgres.service.ts  ← PostgreSQL service
│
├── questions/                       ← Questions feature module
│   ├── schemas/
│   │   └── question.schema.ts      ← Mongoose schema
│   ├── questions.module.ts          ← forFeature([Question])
│   └── index.ts
│
├── answers/                         ← Answers feature module
│   ├── schemas/
│   │   └── user-answer.schema.ts   ← Mongoose schema
│   ├── answers.module.ts            ← forFeature([UserAnswer])
│   └── index.ts
│
├── chat/                            ← Chat feature module
│   ├── schemas/
│   │   └── chat-message.schema.ts  ← Mongoose schema
│   ├── chat.module.ts               ← forFeature([ChatMessage])
│   └── index.ts
│
└── app.module.ts                    ← Imports all modules
```

### Module Organization

**database.module.ts** (`@Global`)
- MongoDB connection (`forRootAsync`)
- PrismaPostgresService
- Exported globally

**Feature Modules** (questions, answers, chat)
- Schema definition
- Business logic
- `forFeature` registration
- Independent testing

---

## 🎯 Best Practices

### When to use PostgreSQL
- User authentication and authorization
- Financial transactions
- Referential integrity is critical
- Complex joins required
- Data has fixed structure

### When to use MongoDB
- Dynamic schemas (questions with varying structures)
- High write volume (chat, analytics)
- Complex nested documents
- Schema evolves frequently
- Read-heavy workloads

---

## 🔒 Data Consistency

### Cross-Database References
- Use **string IDs** to reference across databases
- PostgreSQL IDs → MongoDB documents
- MongoDB ObjectIds → Not referenced in PostgreSQL

### Transaction Strategy
- **PostgreSQL**: Use Prisma transactions for related operations
- **MongoDB**: Use Mongoose sessions for multi-document operations
- **Cross-DB**: Implement **Saga pattern** or **Event Sourcing** for critical flows

---

## 📈 Performance Considerations

### Indexing
**PostgreSQL (Prisma)**
```prisma
@@index([email])
@@index([userId, challengeId])
```

**MongoDB (Mongoose)**
```typescript
QuestionSchema.index({ phase_id: 1 });
QuestionSchema.index({ 'metadata.skill_category': 1 });
```

### Caching Strategy
- Cache frequently accessed questions (Redis)
- Cache user progress snapshots
- Invalidate on updates

---

## 📝 Example Queries

### Get Challenge with Progress
```typescript
// PostgreSQL (Prisma)
const progress = await prisma.userProgress.findUnique({
  where: { userId_challengeId: { userId, challengeId } },
  include: {
    challenge: true,
    phaseProgress: {
      include: { phase: true }
    }
  }
});

// MongoDB (Mongoose)
const questions = await Question.find({
  phase_id: phaseId,
  is_active: true
}).sort({ order: 1 });
```

### Save User Answer
```typescript
// Save to MongoDB
const answer = await UserAnswer.create({
  user_id: userId,
  phase_progress_id: phaseProgressId,
  question_id: questionId,
  user_answer: answer,
  is_correct: isCorrect,
  points_earned: points
});

// Update PostgreSQL
await prisma.phaseProgress.update({
  where: { id: phaseProgressId },
  data: {
    score: { increment: points },
    correctAnswers: { increment: isCorrect ? 1 : 0 }
  }
});
```

---

## 🚀 Deployment

### Environment Variables
```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/onenglishdb

# MongoDB
MONGO_URI=mongodb://user:pass@localhost:27017/onenglishdb?authSource=admin
```

### Docker Compose
Both databases run in Docker containers. See `docker-compose.services.yml`.

---

## 📚 Related Documentation
- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Prisma configuration
- [README.md](./README.md) - Project setup
- [RENAMED_FILES.md](./RENAMED_FILES.md) - File structure changes

---

**Last Updated**: October 2024

