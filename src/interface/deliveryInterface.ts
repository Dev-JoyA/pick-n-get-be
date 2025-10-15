import mongoose, { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum PickUpStatus {
  Pending = 'Pending',
  InTransit = 'InTransit',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export enum VehicleType {
  Bike = 'Bike',
  Car = 'Car',
  Truck = 'Truck',
  Van = 'Van',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approve = 'Approved',
  Reject = 'Reject',
}

export enum RiderStatus {
  Available = 'Available',
  OffLine = 'Off-line',
  OnTrip = 'On-Trip',
}

export interface IRiderDetails extends Document {
  id: number;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  homeAddress: string;
  walletAddress?: string;
  riderStatus: RiderStatus;
  vehicleType: VehicleType;
  approvalStatus: ApprovalStatus;
  country: string;
  capacity: number;

  // Vehicle additional details
  vehicleMakeModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;

  // IPFS CID fields for documents
  profileImage?: string;
  driversLicense?: string;
  vehicleRegistration?: string;
  insuranceCertificate?: string;
  vehiclePhotos?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPickUpDetails extends Document {
  id: string;
  riderId: any;
  userId: number;
  itemId: number;
  customerName: string;
  pickupAddress: string;
  customerPhoneNumber: string;
  pickUpStatus: PickUpStatus;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RiderSchema = new mongoose.Schema<IRiderDetails>(
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
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to be non-unique
    },
    riderStatus: {
      type: String,
      enum: Object.values(RiderStatus),
      default: RiderStatus.Available,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.Pending,
    },
    country: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },

    // Vehicle additional details
    vehicleMakeModel: {
      type: String,
    },
    vehiclePlateNumber: {
      type: String,
    },
    vehicleColor: {
      type: String,
    },

    // IPFS CID fields for documents
    profileImage: {
      type: String,
    },
    driversLicense: {
      type: String,
    },
    vehicleRegistration: {
      type: String,
      required: true, // Required document
    },
    insuranceCertificate: {
      type: String, // Optional
    },
    vehiclePhotos: {
      type: String,
      required: true, // Required document
    },
  },
  { timestamps: true },
);

const PickUpSchema = new mongoose.Schema<IPickUpDetails>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `VPD${uuidv4().substring(0, 8)}`,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },
    pickUpStatus: {
      type: String,
      enum: Object.values(PickUpStatus),
      default: PickUpStatus.Pending,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const PickUp = mongoose.model<IPickUpDetails>('PickUp', PickUpSchema);
export const Rider = mongoose.model<IRiderDetails>('Rider', RiderSchema);
