import express from "express"
import {validateR, 
    updateStatus, 
    pickRide,
    allPickUpByRider,
    GetAllRiders,
    GetRiderById,
    UpdateRiderApproval,
    RegisterRider
 } from "../controllers/deliveryController.ts"


const route = express.Router();

route.post("/riders", RegisterRider);

route.post("/pick-ride/:user/:item", pickRide)

route.post("/validate-ride/:rider/:pick-up-id", validateR)

route.post("/update-status/:rider/:pick-up-id", updateStatus)

route.get("/total-ride/:rider", allPickUpByRider)

route.get("/riders", GetAllRiders);

route.get("/riders/:riderId", GetRiderById);

route.patch("/riders/:riderId/approval", UpdateRiderApproval);


export default route;