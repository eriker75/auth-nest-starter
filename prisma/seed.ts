import { PrismaClient as PostgresClient } from '@prisma/postgres-client';
import * as bcrypt from 'bcrypt';

const prismaPostgres = new PostgresClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (optional, comment out in production)
  console.log('🧹 Cleaning existing data...');
  await cleanDatabase();

  // Seed PostgreSQL
  await seedPostgreSQL();

  console.log('✅ Seed completed successfully!');
}

async function cleanDatabase() {
  // PostgreSQL - Reverse order to respect foreign keys
  await prismaPostgres.phaseProgress.deleteMany();
  await prismaPostgres.userProgress.deleteMany();
  await prismaPostgres.phase.deleteMany();
  await prismaPostgres.challenge.deleteMany();
  await prismaPostgres.userActivity.deleteMany();
  await prismaPostgres.userSetting.deleteMany();
  await prismaPostgres.userPermission.deleteMany();
  await prismaPostgres.rolePermission.deleteMany();
  await prismaPostgres.userRole.deleteMany();
  await prismaPostgres.permission.deleteMany();
  await prismaPostgres.role.deleteMany();
  await prismaPostgres.errorLog.deleteMany();
  await prismaPostgres.auditLog.deleteMany();
  await prismaPostgres.user.deleteMany();

  console.log('✅ Database cleaned');
}

async function seedPostgreSQL() {
  console.log('📊 Seeding PostgreSQL...');

  // Create Permissions
  const permissions = await Promise.all([
    prismaPostgres.permission.create({
      data: {
        name: 'create:user',
        resource: 'user',
        action: 'create',
        description: 'Create new users',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'read:user',
        resource: 'user',
        action: 'read',
        description: 'View user information',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'update:user',
        resource: 'user',
        action: 'update',
        description: 'Update user information',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'delete:user',
        resource: 'user',
        action: 'delete',
        description: 'Delete users',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'manage:challenge',
        resource: 'challenge',
        action: 'manage',
        description: 'Full access to challenges',
      },
    }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // Create Roles
  const adminRole = await prismaPostgres.role.create({
    data: {
      name: 'admin',
      description: 'System Administrator',
      isActive: true,
    },
  });

  const teacherRole = await prismaPostgres.role.create({
    data: {
      name: 'teacher',
      description: 'Teacher',
      isActive: true,
    },
  });

  const studentRole = await prismaPostgres.role.create({
    data: {
      name: 'student',
      description: 'Student',
      isActive: true,
    },
  });

  console.log('✅ Created 3 roles');

  // Assign permissions to roles
  await Promise.all([
    // Admin has all permissions
    ...permissions.map((permission) =>
      prismaPostgres.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
    // Teacher can manage challenges and read users
    prismaPostgres.rolePermission.create({
      data: {
        roleId: teacherRole.id,
        permissionId: permissions.find((p) => p.name === 'manage:challenge')!.id,
      },
    }),
    prismaPostgres.rolePermission.create({
      data: {
        roleId: teacherRole.id,
        permissionId: permissions.find((p) => p.name === 'read:user')!.id,
      },
    }),
  ]);

  console.log('✅ Assigned permissions to roles');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prismaPostgres.user.create({
    data: {
      email: 'admin@onenglish.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      isActive: true,
    },
  });

  const teacherUser = await prismaPostgres.user.create({
    data: {
      email: 'teacher@onenglish.com',
      username: 'teacher',
      password: hashedPassword,
      firstName: 'Teacher',
      lastName: 'Smith',
      isVerified: true,
      isActive: true,
    },
  });

  const studentUser = await prismaPostgres.user.create({
    data: {
      email: 'student@onenglish.com',
      username: 'student',
      password: hashedPassword,
      firstName: 'Student',
      lastName: 'Johnson',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Created 3 users');

  // Assign roles to users
  await Promise.all([
    prismaPostgres.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    }),
    prismaPostgres.userRole.create({
      data: { userId: teacherUser.id, roleId: teacherRole.id },
    }),
    prismaPostgres.userRole.create({
      data: { userId: studentUser.id, roleId: studentRole.id },
    }),
  ]);

  console.log('✅ Assigned roles to users');

  // Create User Settings
  await Promise.all([
    prismaPostgres.userSetting.create({
      data: {
        userId: adminUser.id,
        theme: 'dark',
        language: 'en',
      },
    }),
    prismaPostgres.userSetting.create({
      data: {
        userId: teacherUser.id,
        theme: 'light',
        language: 'en',
      },
    }),
    prismaPostgres.userSetting.create({
      data: {
        userId: studentUser.id,
        theme: 'light',
        language: 'es',
      },
    }),
  ]);

  console.log('✅ Created user settings');

  // Create Challenges (Olympic-style)
  const beginnerChallenge = await prismaPostgres.challenge.create({
    data: {
      title: 'English Olympic Challenge - Beginner',
      slug: 'olympic-beginner',
      description: 'Complete 5 Olympic phases to master basic English',
      category: 'mixed',
      level: 'A1',
      difficulty: 'easy',
      totalPoints: 500,
      isPublished: true,
      isActive: true,
    },
  });

  const intermediateChallenge = await prismaPostgres.challenge.create({
    data: {
      title: 'English Olympic Challenge - Intermediate',
      slug: 'olympic-intermediate',
      description: 'Advanced Olympic challenge for intermediate learners',
      category: 'mixed',
      level: 'B1',
      difficulty: 'medium',
      totalPoints: 1000,
      isPublished: true,
      isActive: true,
    },
  });

  console.log('✅ Created 2 challenges');

  // Create Phases (5 Olympic phases for each challenge)
  await Promise.all([
    prismaPostgres.phase.create({
      data: {
        challengeId: beginnerChallenge.id,
        phaseNumber: 1,
        title: 'Phase 1 - Olympic Stage',
        slug: 'phase-1',
        description: 'Complete phase 1 to advance',
        points: 100,
        timeLimit: 600,
        questionCount: 10,
        requiredScore: 70,
        isPublished: true,
      },
    }),
    prismaPostgres.phase.create({
      data: {
        challengeId: beginnerChallenge.id,
        phaseNumber: 2,
        title: 'Phase 2 - Olympic Stage',
        slug: 'phase-2',
        description: 'Complete phase 2 to advance',
        points: 100,
        timeLimit: 600,
        questionCount: 10,
        requiredScore: 70,
        isPublished: true,
      },
    }),
    prismaPostgres.phase.create({
      data: {
        challengeId: beginnerChallenge.id,
        phaseNumber: 3,
        title: 'Phase 3 - Olympic Stage',
        slug: 'phase-3',
        description: 'Complete phase 3 to advance',
        points: 100,
        timeLimit: 600,
        questionCount: 10,
        requiredScore: 70,
        isPublished: true,
      },
    }),
    prismaPostgres.phase.create({
      data: {
        challengeId: beginnerChallenge.id,
        phaseNumber: 4,
        title: 'Phase 4 - Olympic Stage',
        slug: 'phase-4',
        description: 'Complete phase 4 to advance',
        points: 100,
        timeLimit: 600,
        questionCount: 10,
        requiredScore: 70,
        isPublished: true,
      },
    }),
    prismaPostgres.phase.create({
      data: {
        challengeId: beginnerChallenge.id,
        phaseNumber: 5,
        title: 'Phase 5 - Olympic Stage',
        slug: 'phase-5',
        description: 'Complete phase 5 to advance',
        points: 100,
        timeLimit: 600,
        questionCount: 10,
        requiredScore: 70,
        isPublished: true,
      },
    }),
  ]);

  console.log('✅ Created 5 phases for beginner challenge');

  // Create User Progress
  await prismaPostgres.userProgress.create({
    data: {
      userId: studentUser.id,
      challengeId: beginnerChallenge.id,
      currentPhase: 1,
      totalScore: 0,
      totalTimeSpent: 0,
      isCompleted: false,
    },
  });

  console.log('✅ Created user progress');

  // Create User Activities
  await Promise.all([
    prismaPostgres.userActivity.create({
      data: {
        userId: studentUser.id,
        action: 'login',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      },
    }),
    prismaPostgres.userActivity.create({
      data: {
        userId: studentUser.id,
        action: 'start_challenge',
        resource: 'challenge',
        resourceId: beginnerChallenge.id,
      },
    }),
  ]);

  console.log('✅ Created user activities');

  return { adminUser, teacherUser, studentUser, beginnerChallenge, intermediateChallenge };
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaPostgres.$disconnect();
  });
