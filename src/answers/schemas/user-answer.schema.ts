import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type UserAnswerDocument = UserAnswer & Document;

/**
 * User Answer Schema
 * Stores user answers to questions for review and analytics
 */
@Schema({ 
  collection: 'user_answers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class UserAnswer {
  @Prop({ required: true })
  user_id: string; // Reference to PostgreSQL User.id

  @Prop({ required: true })
  phase_progress_id: string; // Reference to PostgreSQL PhaseProgress.id

  @Prop({ type: Types.ObjectId, required: true, ref: 'Question' })
  question_id: Types.ObjectId; // Reference to MongoDB Question

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  user_answer: any; // User's answer (flexible structure)

  @Prop({ type: Boolean, required: true })
  is_correct: boolean;

  @Prop({ type: Number, default: 0 })
  points_earned: number;

  @Prop({ type: Number, default: 0 })
  time_spent: number; // Time in seconds

  @Prop({ type: Number, default: 1 })
  attempt_number: number;

  @Prop({ type: String })
  feedback?: string; // Automated or manual feedback

  @Prop({ type: Object })
  detailed_evaluation?: Record<string, any>; // Detailed scoring breakdown

  @Prop({ type: Date, default: Date.now })
  answered_at: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const UserAnswerSchema = SchemaFactory.createForClass(UserAnswer);

// Indexes
UserAnswerSchema.index({ user_id: 1, created_at: -1 });
UserAnswerSchema.index({ phase_progress_id: 1 });
UserAnswerSchema.index({ question_id: 1 });
UserAnswerSchema.index({ is_correct: 1 });
UserAnswerSchema.index({ answered_at: -1 });

