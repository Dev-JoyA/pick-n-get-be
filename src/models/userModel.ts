import mongoose, { Document } from 'mongoose';

export enum UserRole {
  Recycler = 'Recycler',
  Admin = 'Admin',
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export interface IUser extends Document {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  walletAddress?: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
  address?: string;
  country?: string;

  // Recycling stats
  totalRecycled?: number; // Total kg recycled
  totalEarnings?: number; // Total ECO tokens earned
  co2Saved?: number; // Total CO2 saved in kg
  totalPickups?: number; // Number of completed pickups

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to be non-unique
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Recycler,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    totalRecycled: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    co2Saved: {
      type: Number,
      default: 0,
    },
    totalPickups: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
