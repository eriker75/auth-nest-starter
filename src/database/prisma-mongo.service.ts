import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/mongo-client';
import { ConfigService } from '@nestjs/config';

/**
 * Prisma Service for MongoDB
 * Manages MongoDB database connection for flexible and unstructured data
 */
@Injectable()
export class PrismaMongoService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const nodeEnv = configService.get<string>('NODE_ENV');
    super({
      log:
        nodeEnv === 'production'
          ? ['warn', 'error']
          : ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: configService.get<string>('MONGO_URI'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 MongoDB disconnected');
  }

  /**
   * Clean all collections (useful for testing)
   */
  async cleanDatabase() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_'),
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof typeof this];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return (model as any).deleteMany();
        }
      }),
    );
  }
}

