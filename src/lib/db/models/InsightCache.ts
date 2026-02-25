import mongoose, { Schema, Model } from 'mongoose';

export interface IInsightCache {
  userId: mongoose.Types.ObjectId;
  year: number;
  month: number;
  /** Number of transactions in the month when cached (invalidates if count changes) */
  transactionCount: number;
  /** Max updatedAt of transactions in the month when cached (invalidates if any tx edited) */
  lastTransactionUpdatedAt: Date;
  insights: Array<{ title: string; description: string; type: string; value?: string }>;
  createdAt: Date;
}

const InsightCacheSchema = new Schema<IInsightCache>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    transactionCount: { type: Number, required: true },
    lastTransactionUpdatedAt: { type: Date, required: true },
    insights: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        value: { type: String },
      },
    ],
  },
  { timestamps: true }
);

InsightCacheSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const InsightCache: Model<IInsightCache> =
  mongoose.models?.InsightCache ?? mongoose.model<IInsightCache>('InsightCache', InsightCacheSchema);
