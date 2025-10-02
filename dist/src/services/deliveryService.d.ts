import { PickUpStatus, IPickUpDetails, VehicleType, RiderStatus } from "../interface/deliveryInterface.ts";
export declare const pickRider: (type: VehicleType, country: string, pickupAddress: string, picked: number, details: IPickUpDetails) => Promise<{
    status: string;
    pickUpStatus: unknown;
    message?: undefined;
    data?: undefined;
} | {
    status: string;
    data: {
        pickUpId: unknown;
        riderId: any;
        userId: number;
        itemId: number;
        pickUpAddress: string;
        riderStatus: any;
        riderNumber: any;
        riderName: any;
        customerName: string;
        customerNumber: string;
    };
    message?: undefined;
    pickUpStatus?: undefined;
} | {
    status: string;
    message: string;
} | undefined>;
export declare const validateRide: (uid: number, validate: string, id: number) => Promise<{
    status: string;
    data: {
        firebaseId: number;
        riderId: number;
        pickupStatus: PickUpStatus.InTransit | null;
        riderStatus: RiderStatus;
    };
}>;
export declare const updatePickUpItem: (uid: number, itemStatus: string, id: number) => Promise<{
    status: string;
}>;
export declare const totalPickUp: (uid: number) => Promise<{
    status: string;
    result: number;
}>;
//# sourceMappingURL=deliveryService.d.ts.map