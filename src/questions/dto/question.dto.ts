// create-question.dto.ts
import {
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsObject,
  IsString,
  Min,
  IsBoolean,
  IsNotEmpty,
  ValidateNested,
  IsMongoId,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALID_QUESTIONS_TYPES } from '../definitions/constants';

// Validation Rules DTO
export class ValidationRulesDto {
  @IsNotEmpty()
  @IsObject()
  correct_answer: any;

  @IsOptional()
  @IsObject()
  scoring_rules?: Record<string, any>;

  @IsEnum(['auto', 'manual', 'hybrid'], {
    message: 'evaluation_method must be one of: auto, manual, hybrid',
  })
  evaluation_method: string;
}

// Question Settings DTO
export class QuestionSettingsDto {
  @IsNumber()
  @Min(0, { message: 'points cannot be negative' })
  points: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'time_limit cannot be negative' })
  time_limit?: number;

  @IsNumber()
  @Min(1, { message: 'max_attempts must be at least 1' })
  @Max(10, { message: 'max_attempts cannot exceed 10' })
  max_attempts: number;

  @IsEnum(['easy', 'medium', 'hard'], {
    message: 'difficulty must be one of: easy, medium, hard',
  })
  difficulty: string;
}

// Question Content DTO
export class QuestionContentDto {
  @IsNotEmpty()
  @IsObject()
  prompt: any;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Each media_references must be a valid MongoDB ObjectId',
  })
  media_references?: string[];
}

// Question Metadata DTO
export class QuestionMetadataDto {
  @IsEnum(
    ['listening', 'speaking', 'grammar', 'vocabulary', 'reading', 'writing'],
    {
      message:
        'skill_category must be one of: listening, speaking, grammar, vocabulary, reading, writing',
    },
  )
  skill_category: string;

  @IsEnum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], {
    message: 'language_level must be one of: A1, A2, B1, B2, C1, C2',
  })
  language_level: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsOptional()
  @IsString()
  created_at?: string;

  @IsOptional()
  @IsString()
  updated_at?: string;
}

// Main Create Question DTO
export class CreateQuestionDto {
  @IsNotEmpty({ message: 'phase_id is required' })
  @IsString()
  phase_id: string;

  @IsEnum(VALID_QUESTIONS_TYPES, {
    message: 'type must be a valid question type',
  })
  type: string;

  @ValidateNested()
  @Type(() => QuestionContentDto)
  content: QuestionContentDto;

  @ValidateNested()
  @Type(() => ValidationRulesDto)
  validation: ValidationRulesDto;

  @ValidateNested()
  @Type(() => QuestionSettingsDto)
  settings: QuestionSettingsDto;

  @ValidateNested()
  @Type(() => QuestionMetadataDto)
  metadata: QuestionMetadataDto;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'order cannot be negative' })
  order?: number;
}
