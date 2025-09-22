import {Router} from "express"
import {validateR, updateStatus, pickRide,allPickUpByRider } from "../controllers/deliveryController.ts"

const route = Router();

route.post("/pick-ride/:user/:item", pickRide)
route.post("/validate-ride/:rider/:pick-up-id", validateR)
route.post("/update-status/:rider/:pick-up-id", updateStatus)
route.get("/total-ride/:rider", allPickUpByRider)

export default route;