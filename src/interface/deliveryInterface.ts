import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export enum PickUpStatus {
    Pending = "Pending",
    InTransit = "InTransit",
    PickedUp = "PickedUp",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}

export enum VehicleType {
    Bike = "Bike",
    Car = "Car",
    Trock = "Trock",
    Van = "Van"
}

export enum ApprovalStatus {
    Pending = "Pending",
    Approve = "Approved",
    Reject = "Reject"
}

export enum RiderStatus {
    Available = "Available",
    OffLine = "Off-line",
    OnTrip = "On-Trip"
}

export interface IRiderDetails extends Document {
    id : number;
    name : string;
    phoneNumber : string;
    vehicleNumber : string;
    riderStatus : RiderStatus;
    vehicleType : VehicleType;
    approvalStatus : ApprovalStatus;
    image : string;
    country: string;
    capacity : number;
}


export interface IPickUpDetails extends Document{
    id: string; 
    riderId: any;
    userId: number;
    itemId: number;
    customerName: string;
    pickUpAddress: string;
    userPhoneNumber: string;
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
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
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
      default: ApprovalStatus.Pending
    },
    image: { type: String },
    country: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);


const PickUpSchema = new mongoose.Schema<IPickUpDetails>(
  {
    id: { type: String,
         required: true, 
         unique: true,
         default: () => `VPD${uuidv4().substring(0, 8)}`
        },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", required: true },
    userId: { type: Number, required: true },
    itemId: { type: Number, required: true },
    customerName: { type: String, required: true },
    pickUpAddress: { type: String, required: true },
    userPhoneNumber: { type: String, required: true },
    pickUpStatus: {
      type: String,
      enum: Object.values(PickUpStatus),
      default: PickUpStatus.Pending,
    },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);


export const PickUp = mongoose.model<IPickUpDetails>("PickUp", PickUpSchema);
export const Rider = mongoose.model<IRiderDetails>("Rider", RiderSchema);
