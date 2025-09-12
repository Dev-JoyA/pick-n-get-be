export type PickUpStatus = 'Pending'| 'InTransit' | 'PickedUp'| 'Delivered'| 'Cancelled'

export interface IPickUpDetails {
  id?: number; 
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
  pickUpTime: string; 
  deliveryDate?: Date;
  deliveryTime?: string;
  image?: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}