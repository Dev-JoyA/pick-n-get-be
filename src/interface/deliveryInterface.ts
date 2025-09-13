export type PickUpStatus = 'Pending'| 'InTransit' | 'PickedUp'| 'Delivered'| 'Cancelled'

export type VehicleType = "Bike" | 'Car' | 'Trock' | 'Van'

export type RiderStatus =  'Off-line'| 'Available' | "On-Trip"

export interface IRiderDetails {
    id : number;
    name : string;
    phoneNumber : string;
    vehicleNumber : string;
    riderStatus : RiderStatus;
    vehicleType : VehicleType;
    image : string;
}


export interface IPickUpDetails {
    id: number; 
    riderId: number;
    userId: number;
    itemId: number;
    customerName: string;
    pickUpAddress: string;
    deliveryAddress?: string;
    riderName: string;
    riderPhoneNumber: string;
    userPhoneNumber: string;
    pickUpStatus: PickUpStatus;
    description?: string;
    pickUpDate: Date;
    deliveryDate?: Date;
    image?: string;
    createdAt?: Date; 
    updatedAt?: Date; 
}