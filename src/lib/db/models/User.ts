import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string; // hashed; only for credentials provider
  name?: string;
  image?: string;
  emailVerified?: Date;
  // Business profile fields
  businessName?: string;
  legalName?: string;
  gstin?: string;
  pan?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  baseCurrency?: string;
  financialYearStartMonth?: number; // 0-11 (0 = Jan); default Apr for India
  onboardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    image: { type: String },
    emailVerified: { type: Date },
    businessName: { type: String },
    legalName: { type: String },
    gstin: { type: String },
    pan: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'India' },
    baseCurrency: { type: String, default: 'INR' },
    financialYearStartMonth: { type: Number, default: 3 }, // April
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev (Next.js hot reload)
export const User: Model<IUser> =
  mongoose.models?.User ?? mongoose.model<IUser>('User', UserSchema);
