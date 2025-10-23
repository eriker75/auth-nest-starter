import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaPostgreService } from '../prisma-postgre.service';
import { PrismaMongoService } from '../prisma-mongo.service';

/**
 * Ejemplo de servicio que usa ambas bases de datos
 * Este servicio gestiona usuarios usando datos de PostgreSQL y MongoDB
 */
@Injectable()
export class UserCompleteServiceExample {
  constructor(
    private readonly prisma: PrismaPostgreService,
    private readonly prismaMongoService: PrismaMongoService,
  ) {}

  /**
   * Obtener usuario completo con todos sus datos
   * - Datos estructurados de PostgreSQL
   * - Perfil y configuraciones de MongoDB
   */
  async getUserComplete(userId: string) {
    // 1. Obtener datos principales de PostgreSQL
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Obtener perfil de MongoDB
    const profile = await this.prismaMongoService.userProfile.findUnique({
      where: { userId },
    });

    // 3. Obtener configuraciones de MongoDB
    const settings = await this.prismaMongoService.userSetting.findUnique({
      where: { userId },
    });

    // 4. Obtener actividad reciente de MongoDB
    const recentActivity = await this.prismaMongoService.userActivity.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // 5. Obtener notificaciones no leídas de MongoDB
    const unreadNotifications = await this.prismaMongoService.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 6. Combinar todos los datos
    return {
      // Datos estructurados
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isOnline: user.isOnline,
      isActive: user.isActive,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      
      // Roles y permisos
      roles: user.roles.map((ur) => ur.role),
      permissions: [
        ...user.permissions.map((up) => up.permission),
        ...user.roles.flatMap((ur) => 
          ur.role.permissions.map((rp) => rp.permission)
        ),
      ],
      
      // Datos flexibles de MongoDB
      profile: profile || null,
      settings: settings?.settings || {},
      recentActivity,
      unreadNotifications,
      unreadCount: unreadNotifications.length,
    };
  }

  /**
   * Crear usuario completo en ambas bases de datos
   */
  async createCompleteUser(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    bio?: string;
    city?: string;
    country?: string;
  }) {
    // 1. Crear usuario en PostgreSQL
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // 2. Asignar rol de estudiante por defecto
    const studentRole = await this.prisma.role.findUnique({
      where: { name: 'student' },
    });

    if (studentRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: studentRole.id,
        },
      });
    }

    // 3. Crear perfil en MongoDB
    await this.prismaMongoService.userProfile.create({
      data: {
        userId: user.id,
        bio: data.bio || '',
        city: data.city,
        country: data.country,
        preferences: {
          theme: 'light',
          language: 'es',
        },
      },
    });

    // 4. Crear configuraciones iniciales en MongoDB
    await this.prismaMongoService.userSetting.create({
      data: {
        userId: user.id,
        settings: {
          theme: 'light',
          language: 'es',
          emailNotifications: true,
          pushNotifications: true,
          weeklyReport: false,
        },
      },
    });

    // 5. Registrar actividad de creación en MongoDB
    await this.prismaMongoService.userActivity.create({
      data: {
        userId: user.id,
        action: 'user_created',
        metadata: {
          email: data.email,
          username: data.username,
        },
      },
    });

    // 6. Crear notificación de bienvenida en MongoDB
    await this.prismaMongoService.notification.create({
      data: {
        userId: user.id,
        type: 'welcome',
        title: '¡Bienvenido a OneEnglish!',
        message: 'Comienza tu viaje de aprendizaje hoy',
      },
    });

    // 7. Registrar en audit log
    await this.prismaMongoService.auditLog.create({
      data: {
        userId: user.id,
        action: 'create',
        entity: 'User',
        entityId: user.id,
        changes: {
          before: null,
          after: {
            email: user.email,
            username: user.username,
          },
        },
      },
    });

    return this.getUserComplete(user.id);
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    city?: string;
    country?: string;
    socialLinks?: any;
  }) {
    // Obtener datos anteriores para audit
    const oldUser = await this.prisma.user.findUnique({ where: { id: userId } });
    const oldProfile = await this.prismaMongoService.userProfile.findUnique({ where: { userId } });

    // 1. Actualizar datos estructurados en PostgreSQL
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // 2. Actualizar perfil en MongoDB
    const updatedProfile = await this.prismaMongoService.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio,
        city: data.city,
        country: data.country,
        socialLinks: data.socialLinks,
      },
      update: {
        bio: data.bio,
        city: data.city,
        country: data.country,
        socialLinks: data.socialLinks,
      },
    });

    // 3. Registrar actividad
    await this.prismaMongoService.userActivity.create({
      data: {
        userId,
        action: 'profile_updated',
        metadata: {
          changes: data,
        },
      },
    });

    // 4. Registrar en audit log
    await this.prismaMongoService.auditLog.create({
      data: {
        userId,
        action: 'update',
        entity: 'User',
        entityId: userId,
        changes: {
          before: { ...oldUser, ...oldProfile },
          after: { ...updatedUser, ...updatedProfile },
        },
      },
    });

    return {
      ...updatedUser,
      profile: updatedProfile,
    };
  }

  /**
   * Obtener progreso del estudiante en todos los cursos
   */
  async getStudentProgress(userId: string) {
    // 1. Obtener matrículas de PostgreSQL
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, isActive: true },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // 2. Obtener progreso detallado de MongoDB
    const progressDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const lessonProgress = await this.prismaMongoService.lessonProgress.findMany({
          where: {
            userId,
            enrollmentId: enrollment.id,
          },
        });

        return {
          enrollment,
          lessonProgress,
          completedLessons: lessonProgress.filter((lp) => lp.isCompleted).length,
          totalLessons: enrollment.course.lessons.length,
        };
      }),
    );

    return progressDetails;
  }

  /**
   * Marcar lección como completada
   */
  async completLesson(userId: string, lessonId: string, enrollmentId: string, data: {
    timeSpent?: number;
    quizResults?: any;
    notes?: string;
  }) {
    // 1. Buscar o crear progreso de lección en MongoDB
    const lessonProgress = await this.prismaMongoService.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        enrollmentId,
        timeSpent: data.timeSpent,
        quizResults: data.quizResults,
        notes: data.notes,
        isCompleted: true,
        completedAt: new Date(),
      },
      update: {
        timeSpent: data.timeSpent,
        quizResults: data.quizResults,
        notes: data.notes,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // 2. Actualizar progreso general en PostgreSQL
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (enrollment) {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = await this.prismaMongoService.lessonProgress.count({
        where: {
          userId,
          enrollmentId,
          isCompleted: true,
        },
      });

      const progress = (completedLessons / totalLessons) * 100;

      await this.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          progress,
          completedAt: progress === 100 ? new Date() : null,
        },
      });
    }

    // 3. Registrar actividad
    await this.prismaMongoService.userActivity.create({
      data: {
        userId,
        action: 'lesson_completed',
        resource: 'lesson',
        resourceId: lessonId,
        metadata: {
          enrollmentId,
          timeSpent: data.timeSpent,
        },
      },
    });

    // 4. Crear notificación de logro si completó el curso
    if (enrollment && lessonProgress.isCompleted) {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = await this.prismaMongoService.lessonProgress.count({
        where: {
          userId,
          enrollmentId,
          isCompleted: true,
        },
      });

      if (completedLessons === totalLessons) {
        await this.prismaMongoService.notification.create({
          data: {
            userId,
            type: 'achievement',
            title: '¡Curso Completado!',
            message: `Has completado el curso "${enrollment.course.title}"`,
            data: {
              courseId: enrollment.courseId,
            },
          },
        });

        await this.prismaMongoService.achievement.create({
          data: {
            userId,
            type: 'course_completion',
            title: 'Curso Completado',
            description: `Completaste "${enrollment.course.title}"`,
            points: 100,
            metadata: {
              courseId: enrollment.courseId,
              courseName: enrollment.course.title,
            },
          },
        });
      }
    }

    return lessonProgress;
  }
}

