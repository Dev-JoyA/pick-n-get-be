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

export enum RiderStatus {
    Available = "Available",
    OffLine = "Off-line",
    OnTrip = "On-Trip"
}

export interface IRiderDetails {
    id : number;
    name : string;
    phoneNumber : string;
    vehicleNumber : string;
    riderStatus : RiderStatus;
    vehicleType : VehicleType;
    image : string;
    country: string;
}


export interface IPickUpDetails {
    id: number; 
    riderId: number;
    userId: number;
    itemId: number;
    customerName: string;
    pickUpAddress: string;
    riderName: string;
    riderPhoneNumber: string;
    userPhoneNumber: string;
    pickUpStatus: PickUpStatus;
    description?: string;
    image?: string;
    createdAt?: Date; 
    updatedAt?: Date; 
}