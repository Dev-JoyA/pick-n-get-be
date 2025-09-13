import {PickUpStatus, IPickUpDetails, VehicleType, RiderStatus, IRiderDetails} from "../interface/deliveryInterface"
import PickUpDetails from "../models/deliveryModel"
import RiderDetails from "../models/riderModel"

const contract = "";

contract.on("RiderApproved", async (riderDetails : IRiderDetails) => {
  
    const exists = await RiderDetails.findOne({ where: { id: riderDetails.id.toString() } });
        if (!exists) {
            await RiderDetails.create({
                riderId: riderDetails.id.toString(),
                riderName: riderDetails.name,
                phoneNumber: riderDetails.phoneNumber,
                vehicleNumber: riderDetails.vehicleNumber,
                riderStatus: riderDetails.riderStatus,
                vehicleType: riderDetails.vehicleType,
                image: riderDetails.image
            });
        }
});

const assignRide = async(vehicleType : VehicleType ) => {
    if(vehicleType === "Bike") {
        // const bike = await
        // return;
    }
}