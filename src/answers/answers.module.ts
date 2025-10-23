import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAnswer, UserAnswerSchema } from './schemas/user-answer.schema';

/**
 * Answers Module
 * Handles user answers and analytics
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAnswer.name, schema: UserAnswerSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class AnswersModule {}

