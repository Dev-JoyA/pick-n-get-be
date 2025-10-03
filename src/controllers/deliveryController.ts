import {Request, Response} from "express"
import { 
    pickRider,
    validateRide, 
    updatePickUpItem, 
    totalPickUp,
    getAllRiders,
    updateRiderApproval,
    createRider,
    getRiderById
} from "../services/deliveryService.ts"
import { IPickUpDetails , IRiderDetails} from "../interface/deliveryInterface"

export const RegisterRider = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      country,
      capacity,
      image,
      riderStatus,
      approvalStatus,
    } = req.body;

    if (
      id === undefined ||
      name == null ||
      phoneNumber == null ||
      vehicleNumber == null ||
      vehicleType == null ||
      country == null ||
      capacity == null
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: id, name, phoneNumber, vehicleNumber, vehicleType, country, capacity",
      });
    }
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return res
        .status(400)
        .json({ status: "error", message: "id must be a number" });
    }

    const riderPayload = {
      id: numericId,
      name: String(name),
      phoneNumber: String(phoneNumber),
      vehicleNumber: String(vehicleNumber),
      vehicleType,
      country: String(country),
      capacity: Number(capacity),
      image: image ?? undefined,
      riderStatus: riderStatus ?? undefined,
      approvalStatus: approvalStatus ?? undefined,
    } as Partial<IRiderDetails>;

    const result = await createRider(riderPayload as IRiderDetails);

    if (!result) {
      return res
        .status(500)
        .json({ status: "error", message: `error creating Rider, ${status}` });
    }

    if (result.status === "Rider already exists") {
      return res.status(409).json(result);
    }

    if (
      typeof result.status === "string" &&
      result.status.toLowerCase().includes("error")
    ) {
      return res.status(500).json(result);
    }

    return res.status(201).json(result);
  } catch (err: any) {
    console.error("RegisterRider error:", err);
    return res.status(500).json({
      status: "error",
      message: err.message ?? "Server error",
    });
  }
};

export const pickRide = async (req: Request, res: Response) => {
    const {type, country, address, picked} = req.body;
    const { user, item } = req.params;
    const details = req.body.details as IPickUpDetails;
    try{
         if(!type || !country || !address || picked === undefined || !details || !user){
        return res.status(400).json({message : "All fields are required"})
    }

    if(details.itemId != +item || details.userId != +user){
        return res.status(400).json({message : "Unauthorized"})
    }

    const result = await pickRider(type, country, address, picked, details);

    if(result && (result as any).status === "none"){
        return res.status(200).json({message : "No riders available"})
    }
    if(result && (result as any).status === "taken"){
        return res.status(200).json({message : "Rider already busy"})
    }
    if(result && (result as any).status === "exists"){
        return res.status(409).json({message : "You have a pending pick-up with this rider", pickUpStatus : (result as any).pickUpStatus})
    }
    if(result && (result as any).status === "error"){
        return res.status(400).json({message : (result as any).message})
    }
    return res.status(201).json({
        message : "Rider assigned successfully", 
        data : result
    })

    }catch(error){
        console.error("Error picking ride", error)
        return res.status(500).json({ message: "Server error, cant Pick a Ride", error: (error as any).message });
    }
}


export const validateR = async(req: Request, res: Response) => {
    const {validate } = req.body
    const {uid, pickupId} = req.params

    try{
        if(!validate){
            return res.status(400).json({message : "Kindly pick an option"})
        }
        const result = await validateRide(validate,Number(uid), String(pickupId))
        return res.status(200).json({message : "Ride Validated",
        data : result.data.riderStatus})
    }catch(error){
        console.error("error validating ride", error)
        return res.status(500).json({message : "server error, cant validate Ride", error : (error as any).message})
    }
        
}

export const updateStatus = async(req: Request, res: Response) => {
    const { status } = req.body
    const {uid, pickupId} = req.params

    try{
        if (!status){
        return res.status(200).json({message : "Kindly pick the delivery Status"})
        }

        const result =  await updatePickUpItem(status, String(pickupId), Number(uid))
        return res.status(200).json({ status : result.status})
    }catch(error){
        console.error("error updating ride statys", error)
        return res.status(500).json({message : "server error, cant update Status", error : (error as any).message})
    }

}

export const allPickUpByRider = async(req: Request, res: Response) => {
    const {uid} = req.params;
    try{
        const result = await totalPickUp(Number(uid))
        return res.status(200).json({data : result});
    }catch(error){
        console.error("error getting total ride pick up", error)
        return res.status(500).json({message : "server error, error getting total ride pick up", error : (error as any).message}) 
    }

} 

export const GetAllRiders = async (req: Request, res: Response) => {
  try {
    const result = await getAllRiders();
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const UpdateRiderApproval = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params; 
    const action = req.body as "approve" | "reject"; 
    const result = await updateRiderApproval(Number(riderId), action);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};


export const GetRiderById = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;
    const result = await getRiderById(Number(riderId));
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

