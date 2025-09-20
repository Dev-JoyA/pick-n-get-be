import {Request, Response} from "express"
import { pickRider, validateRide, updatePickUpItem} from "../services/deliveryService.ts"
import { IPickUpDetails } from "../interface/deliveryInterface"

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
        const result = await validateRide(Number(uid), validate, Number(pickupId))
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

        const result =  await updatePickUpItem(Number(uid), status, Number(pickupId))
        return res.status(200).json({ status : result.status})
    }catch(error){
        console.error("error uodatingStatus ride", error)
        return res.status(500).json({message : "server error, cant update Status", error : (error as any).message})
    }

}