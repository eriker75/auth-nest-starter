import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';

/**
 * Questions Module
 * Handles dynamic question structures for challenges
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class QuestionsModule {}

