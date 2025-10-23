import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

/**
 * Chat Message Schema
 * For real-time messaging between users
 */
@Schema({ 
  collection: 'chat_messages',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class ChatMessage {
  @Prop({ required: true })
  sender_id: string; // Reference to PostgreSQL User.id

  @Prop()
  receiver_id?: string; // Reference to PostgreSQL User.id (null for group messages)

  @Prop()
  room_id?: string; // For group or challenge-specific chats

  @Prop({ required: true })
  message: string;

  @Prop({ 
    type: String, 
    enum: ['text', 'image', 'audio', 'video', 'file'],
    default: 'text' 
  })
  message_type: string;

  @Prop({ type: [String] })
  attachments?: string[]; // URLs to file attachments

  @Prop({ type: Boolean, default: false })
  is_read: boolean;

  @Prop({ type: Date })
  read_at?: Date;

  @Prop({ type: Boolean, default: false })
  is_edited: boolean;

  @Prop({ type: Date })
  edited_at?: Date;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;

  @Prop({ type: Date })
  deleted_at?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Additional flexible data

  created_at?: Date;
  updated_at?: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

// Indexes for better query performance
ChatMessageSchema.index({ sender_id: 1, created_at: -1 });
ChatMessageSchema.index({ receiver_id: 1, created_at: -1 });
ChatMessageSchema.index({ room_id: 1, created_at: -1 });
ChatMessageSchema.index({ is_read: 1 });
ChatMessageSchema.index({ created_at: -1 });

