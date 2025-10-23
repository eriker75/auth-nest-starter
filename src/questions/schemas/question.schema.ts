import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type QuestionDocument = Question & Document;

/**
 * Validation rules for question answers
 */
@Schema({ _id: false })
export class ValidationRules {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  correct_answer: any; // Can be string, array, number, object depending on question type

  @Prop({ type: Object })
  scoring_rules?: Record<string, any>; // Flexible scoring configuration

  @Prop({ 
    type: String, 
    enum: ['auto', 'manual', 'hybrid'], 
    default: 'auto' 
  })
  evaluation_method: string;
}

/**
 * Question settings (points, time, difficulty)
 */
@Schema({ _id: false })
export class QuestionSettings {
  @Prop({ type: Number, default: 10 })
  points: number;

  @Prop({ type: Number })
  time_limit?: number; // Time limit in seconds

  @Prop({ type: Number, default: 3 })
  max_attempts: number;

  @Prop({ 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  })
  difficulty: string;
}

/**
 * Question content (prompt, instructions, media)
 */
@Schema({ _id: false })
export class QuestionContent {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  prompt: any; // Can be string or object with rich content

  @Prop({ type: String })
  instructions?: string;

  @Prop({ type: [Types.ObjectId] })
  media_references?: Types.ObjectId[]; // References to media files
}

/**
 * Question metadata (categorization, tracking)
 */
@Schema({ _id: false })
export class QuestionMetadata {
  @Prop({ 
    type: String, 
    enum: ['listening', 'speaking', 'grammar', 'vocabulary', 'reading', 'writing'],
    required: true 
  })
  skill_category: string;

  @Prop({ 
    type: String, 
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    required: true 
  })
  language_level: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

/**
 * Main Question Schema
 * Flexible and dynamic question structure for challenges
 */
@Schema({ 
  collection: 'questions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Question {
  @Prop({ required: true })
  phase_id: string; // Reference to PostgreSQL Phase

  @Prop({ 
    type: String, 
    required: true,
    enum: [
      'multiple_choice',
      'fill_blank',
      'audio_question',
      'speaking_practice',
      'matching',
      'ordering',
      'true_false',
      'short_answer',
      'essay',
      'listening_comprehension'
    ]
  })
  type: string;

  @Prop({ type: QuestionContent, required: true })
  content: QuestionContent;

  @Prop({ type: ValidationRules, required: true })
  validation: ValidationRules;

  @Prop({ type: QuestionSettings, required: true })
  settings: QuestionSettings;

  @Prop({ type: QuestionMetadata, required: true })
  metadata: QuestionMetadata;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: Number, default: 0 })
  order: number; // Order within the phase
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Indexes for better performance
QuestionSchema.index({ phase_id: 1 });
QuestionSchema.index({ type: 1 });
QuestionSchema.index({ 'metadata.skill_category': 1 });
QuestionSchema.index({ 'metadata.language_level': 1 });
QuestionSchema.index({ 'metadata.tags': 1 });
QuestionSchema.index({ is_active: 1 });
QuestionSchema.index({ order: 1 });

