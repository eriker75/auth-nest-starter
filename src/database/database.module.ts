import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaPostgreService } from './prisma-postgre.service';
import { PrismaMongoService } from './prisma-mongo.service';

/**
 * Módulo global de base de datos
 * Proporciona acceso a ambas bases de datos:
 * - PrismaPostgreService: PostgreSQL (datos estructurados)
 * - PrismaMongoService: MongoDB (datos flexibles)
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaPostgreService, PrismaMongoService],
  exports: [PrismaPostgreService, PrismaMongoService],
})
export class DatabaseModule {}
