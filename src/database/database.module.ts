import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaPostgresService } from './prisma-postgres.service';

/**
 * Global Database Module
 * Provides access to both databases:
 * - PrismaPostgresService: PostgreSQL (structured data - users, challenges, progress)
 * - MongooseModule: MongoDB (flexible data - questions, chat, analytics)
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        console.log('🔗 Attempting MongoDB connection...');
        
        return {
          uri: mongoUri,
          onConnectionCreate: (connection) => {
            console.log('✅ MongoDB connection established');
            
            connection.on('connected', () => {
              console.log('✅ MongoDB connected event fired');
            });
            connection.on('error', (error) => {
              console.error('❌ MongoDB connection error:', error);
            });
            connection.on('disconnected', () => {
              console.log('🔌 MongoDB disconnected');
            });
            
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaPostgresService],
  exports: [PrismaPostgresService],
})
export class DatabaseModule {}
