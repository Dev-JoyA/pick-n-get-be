export type PickUpStatus = 'Pending'| 'InTransit' | 'PickedUp'| 'Delivered'| 'Cancelled'

export type VehicleType = "Bike" | 'Car' | 'Trock' | 'Van'

export type RiderStatus =  'Available'| 'Off-line' | "On-Trip"

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