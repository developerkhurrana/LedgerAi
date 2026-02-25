import mongoose, { Schema, Model } from 'mongoose';

export type TransactionType = 'income' | 'expense';

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency: string; // ISO 4217 e.g. INR, USD
  gstPercent: number;
  gstAmount: number;
  category: string;
  invoiceNumber?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    vendorName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    gstPercent: { type: Number, required: true, default: 0 },
    gstAmount: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    invoiceNumber: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Compound index for multi-tenant queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1 });

export const Transaction: Model<ITransaction> =
  mongoose.models?.Transaction ?? mongoose.model<ITransaction>('Transaction', TransactionSchema);
