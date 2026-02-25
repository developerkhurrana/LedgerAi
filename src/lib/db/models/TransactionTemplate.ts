import mongoose, { Schema, Model } from 'mongoose';
import type { TransactionType } from './Transaction';

export interface ITransactionTemplate {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency: string;
  gstPercent: number;
  category: string;
  invoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionTemplateSchema = new Schema<ITransactionTemplate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    vendorName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    gstPercent: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    invoiceNumber: { type: String },
  },
  { timestamps: true }
);

TransactionTemplateSchema.index({ userId: 1 });

export const TransactionTemplate: Model<ITransactionTemplate> =
  mongoose.models?.TransactionTemplate ??
  mongoose.model<ITransactionTemplate>('TransactionTemplate', TransactionTemplateSchema);
