import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaPostgresService } from './prisma-postgres.service';
import { PrismaMongoService } from './prisma-mongo.service';

/**
 * Global Database Module
 * Provides access to both databases:
 * - PrismaPostgresService: PostgreSQL (structured data)
 * - PrismaMongoService: MongoDB (flexible data)
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaPostgresService, PrismaMongoService],
  exports: [PrismaPostgresService, PrismaMongoService],
})
export class DatabaseModule {}
