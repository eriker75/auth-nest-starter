import { PrismaClient as PostgresClient } from '@prisma/postgres-client';
import { PrismaClient as MongoClient } from '@prisma/mongo-client';
import * as bcrypt from 'bcrypt';

const prismaPostgres = new PostgresClient();
const prismaMongo = new MongoClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (optional, comment out in production)
  console.log('🧹 Cleaning existing data...');
  await cleanDatabase();

  // Seed PostgreSQL
  await seedPostgreSQL();

  // Seed MongoDB
  await seedMongoDB();

  console.log('✅ Seed completed successfully!');
}

async function cleanDatabase() {
  // PostgreSQL
  await prismaPostgres.userPermission.deleteMany();
  await prismaPostgres.rolePermission.deleteMany();
  await prismaPostgres.userRole.deleteMany();
  await prismaPostgres.enrollment.deleteMany();
  await prismaPostgres.lesson.deleteMany();
  await prismaPostgres.course.deleteMany();
  await prismaPostgres.permission.deleteMany();
  await prismaPostgres.role.deleteMany();
  await prismaPostgres.user.deleteMany();

  // MongoDB
  await prismaMongo.lessonProgress.deleteMany();
  await prismaMongo.lessonContent.deleteMany();
  await prismaMongo.userActivity.deleteMany();
  await prismaMongo.userSetting.deleteMany();
  await prismaMongo.userProfile.deleteMany();
  await prismaMongo.notification.deleteMany();
  await prismaMongo.chatMessage.deleteMany();
  await prismaMongo.achievement.deleteMany();
  await prismaMongo.auditLog.deleteMany();
  await prismaMongo.errorLog.deleteMany();
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
        description: 'Crear usuarios',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'read:user',
        resource: 'user',
        action: 'read',
        description: 'Leer usuarios',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'update:user',
        resource: 'user',
        action: 'update',
        description: 'Actualizar usuarios',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'delete:user',
        resource: 'user',
        action: 'delete',
        description: 'Eliminar usuarios',
      },
    }),
    prismaPostgres.permission.create({
      data: {
        name: 'manage:course',
        resource: 'course',
        action: 'manage',
        description: 'Gestionar cursos',
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
    // Teacher can manage courses and read users
    prismaPostgres.rolePermission.create({
      data: {
        roleId: teacherRole.id,
        permissionId: permissions.find((p) => p.name === 'manage:course')!.id,
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
      firstName: 'John',
      lastName: 'Teacher',
      isVerified: true,
      isActive: true,
    },
  });

  const studentUser = await prismaPostgres.user.create({
    data: {
      email: 'student@onenglish.com',
      username: 'student',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Student',
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

  // Create Courses
  const beginnerCourse = await prismaPostgres.course.create({
    data: {
      title: 'English for Beginners',
      slug: 'english-for-beginners',
      description: 'Start your English learning journey',
      level: 'beginner',
      price: 99.99,
      isPublished: true,
      isActive: true,
    },
  });

  const intermediateCourse = await prismaPostgres.course.create({
    data: {
      title: 'Intermediate English',
      slug: 'intermediate-english',
      description: 'Take your English to the next level',
      level: 'intermediate',
      price: 149.99,
      isPublished: true,
      isActive: true,
    },
  });

  console.log('✅ Created 2 courses');

  // Create Lessons
  await Promise.all([
    prismaPostgres.lesson.create({
      data: {
        courseId: beginnerCourse.id,
        title: 'Introduction to English',
        slug: 'introduction-to-english',
        description: 'Learn the basics',
        order: 1,
        duration: 30,
        isPublished: true,
      },
    }),
    prismaPostgres.lesson.create({
      data: {
        courseId: beginnerCourse.id,
        title: 'Basic Vocabulary',
        slug: 'basic-vocabulary',
        description: 'Essential words and phrases',
        order: 2,
        duration: 45,
        isPublished: true,
      },
    }),
    prismaPostgres.lesson.create({
      data: {
        courseId: intermediateCourse.id,
        title: 'Advanced Grammar',
        slug: 'advanced-grammar',
        description: 'Master complex grammar structures',
        order: 1,
        duration: 60,
        isPublished: true,
      },
    }),
  ]);

  console.log('✅ Created 3 lessons');

  // Create Enrollments
  await prismaPostgres.enrollment.create({
    data: {
      userId: studentUser.id,
      courseId: beginnerCourse.id,
      progress: 25,
      isActive: true,
    },
  });

  console.log('✅ Created 1 enrollment');

  return { adminUser, teacherUser, studentUser, beginnerCourse, intermediateCourse };
}

async function seedMongoDB() {
  console.log('📦 Seeding MongoDB...');

  // Get user IDs from PostgreSQL
  const users = await prismaPostgres.user.findMany();
  const lessons = await prismaPostgres.lesson.findMany();

  // Create User Profiles
  await Promise.all(
    users.map((user) =>
      prismaMongo.userProfile.create({
        data: {
          userId: user.id,
          bio: `This is ${user.firstName}'s bio`,
          city: 'Caracas',
          country: 'Venezuela',
          socialLinks: {
            twitter: `@${user.username}`,
            linkedin: `linkedin.com/in/${user.username}`,
          },
          preferences: {
            theme: 'light',
            language: 'es',
            notifications: true,
          },
        },
      }),
    ),
  );

  console.log(`✅ Created ${users.length} user profiles`);

  // Create User Settings
  await Promise.all(
    users.map((user) =>
      prismaMongo.userSetting.create({
        data: {
          userId: user.id,
          settings: {
            theme: 'light',
            language: 'es',
            emailNotifications: true,
            pushNotifications: true,
            weeklyReport: true,
          },
        },
      }),
    ),
  );

  console.log(`✅ Created ${users.length} user settings`);

  // Create Lesson Content
  if (lessons.length > 0) {
    await Promise.all(
      lessons.map((lesson) =>
        prismaMongo.lessonContent.create({
          data: {
            lessonId: lesson.id,
            content: {
              type: 'rich-text',
              blocks: [
                {
                  type: 'heading',
                  content: lesson.title,
                },
                {
                  type: 'paragraph',
                  content: lesson.description,
                },
                {
                  type: 'video',
                  url: 'https://example.com/video.mp4',
                },
              ],
            },
            resources: {
              videos: ['video1.mp4', 'video2.mp4'],
              audios: ['audio1.mp3'],
              documents: ['worksheet.pdf'],
            },
            exercises: {
              quiz: [
                {
                  question: 'What is "Hello" in Spanish?',
                  options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
                  correctAnswer: 0,
                },
              ],
            },
          },
        }),
      ),
    );

    console.log(`✅ Created ${lessons.length} lesson contents`);
  }

  // Create User Activities
  await Promise.all([
    prismaMongo.userActivity.create({
      data: {
        userId: users[0].id,
        action: 'login',
        metadata: { device: 'web', browser: 'Chrome' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      },
    }),
    prismaMongo.userActivity.create({
      data: {
        userId: users[0].id,
        action: 'view_course',
        resource: 'course',
        resourceId: 'course-id',
        metadata: { duration: 120 },
      },
    }),
  ]);

  console.log('✅ Created user activities');

  // Create Notifications
  await prismaMongo.notification.create({
    data: {
      userId: users[0].id,
      type: 'welcome',
      title: 'Welcome to OneEnglish!',
      message: 'Start your learning journey today',
      data: { courseId: 'beginner-course' },
    },
  });

  console.log('✅ Created notifications');

  // Create Audit Logs
  await prismaMongo.auditLog.create({
    data: {
      userId: users[0].id,
      action: 'create',
      entity: 'User',
      entityId: users[0].id,
      changes: {
        before: null,
        after: { email: users[0].email },
      },
      ipAddress: '192.168.1.1',
    },
  });

  console.log('✅ Created audit logs');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaPostgres.$disconnect();
    await prismaMongo.$disconnect();
  });

