import {PickUpStatus, IPickUpDetails, VehicleType, RiderStatus, IRiderDetails} from "../interface/deliveryInterface"
import PickUpDetails from "../models/deliveryModel"
import RiderDetails from "../models/riderModel"
import { Op } from "sequelize";
import { ethers, JsonRpcProvider } from "ethers";
import { sequelize } from "../config/db"
import { getDatabase, ref, get, child } from "firebase/database";
import fetch from "node-fetch"; 
import { getAuth } from "firebase-admin/auth";


const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const db = getDatabase();
const auth = getAuth();

const provider = new JsonRpcProvider();
const contract = new ethers.Contract("", [], provider);

contract.on("RiderApproved", async (riderDetails : IRiderDetails) => {
    let firebaseUser;
    try{
        firebaseUser = await auth.createUser({
            phoneNumber : riderDetails.phoneNumber,
            displayName : riderDetails.name
        })
    }catch(error: any){
        if (error.code === "auth/phone-number-already-exists") {
            firebaseUser = await auth.getUserByPhoneNumber(riderDetails.phoneNumber);
        }
    }
    const exists = await RiderDetails.findOne({ where: { id: riderDetails.id.toString() } });
    if (!exists) {
        await RiderDetails.create({
            firebaseUid: firebaseUser?.uid,
            riderId: riderDetails.id.toString(),
            riderName: riderDetails.name,
            phoneNumber: riderDetails.phoneNumber,
            vehicleNumber: riderDetails.vehicleNumber,
            riderStatus: riderDetails.riderStatus,
            vehicleType: riderDetails.vehicleType,
            image: riderDetails.image,
            country: riderDetails.country
        });
    }
});

const selectRide = async(type: string , country: string, pickupAddress: string) => {
    const riders = await RiderDetails.findAll({ where :{ 
        [Op.and] : [
            {vehicleType : {[Op.like] : `%${type}%`}}, 
            {riderStatus : {[Op.like] : "%Available%"}},
            {country : {[Op.like] : `%${country}%`}}
        ]
    }})

    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        pickupAddress
    )}.json?access_token=${MAPBOX_API_KEY}`

   
    const geocode = await fetch(geoUrl)
    if (!geocode.ok) throw new Error("Error geocoding pickup address");

    const geoData: any = await geocode.json();
    if (!geoData.features || geoData.features.length === 0)
    throw new Error("Pickup address not found");

    const [pickupLng, pickupLat] = geoData.features[0].center;
    
    const coords=[]
    for(let rider of riders){
        const riderData = rider.toJSON() as any;

       try{
        const snapshot = await get(child(ref(db), `riders/${riderData.riderId}`));
        if (snapshot.exists()) {
            const location = snapshot.val();
              if(location.lat && location.lng){
                coords.push({
                riderId: riderData.riderId,
                name : riderData.riderName,
                phoneNumber: riderData.phoneNumber,
                vehicleNumber: riderData.vehicleNumber,
                riderStatus: riderData.riderStatus as RiderStatus,
                image: riderData.image,
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
            })
        }
        }
       }catch(error){
           console.error("Error fetching rider location:", error);
       }
    }

    if (coords.length === 0) return null;
    const sources = `0`;
    const coordinates = [
        `${pickupLng},${pickupLat}`,
        ...coords.map(c => `${c.lng},${c.lat}`)
    ].join(";");

    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?sources=${sources}&annotations=distance,duration&access_token=${MAPBOX_API_KEY}`;
    try{
        const response = await fetch(url);
        if (!response.ok) throw new Error("Mapbox API error");
        const data: any = await response.json();

        const durations = data.durations[0].slice(1);
        const riderDurations = coords.map((c, i) => ({
            ...c,
            duration: durations[i]
        }));
        
        riderDurations.sort((a, b) => a.duration - b.duration);
        return riderDurations.slice(0, 5);

    }catch(err){
        console.error("Error fetching Mapbox durations:", err);
        return null;
    }
    
};

const pickRider = async(
    type: string,
    country: string,
    pickupAddress: string,
    picked: number,
    details: IPickUpDetails
) => {
    const riderDurations = await selectRide(type, country, pickupAddress);

    if (!riderDurations || riderDurations.length === 0) {
        return { status: "none", message: "No riders available" } 
    }

    if (picked < 0 || picked >= riderDurations.length) {
        return { status: "error", message: "Invalid rider index" }; 
    };
    const riderData = riderDurations[picked];

    return await sequelize.transaction(async (t) => {
    const selected = await RiderDetails.findOne({
      where: { riderId: riderData.riderId },
      transaction: t,
      lock: t.LOCK.UPDATE, 
    });

    if (!selected || selected.get("riderStatus") !== "Available") {
      return { status: "taken", message: "Rider already busy" };
    }

    await RiderDetails.update(
        { riderStatus: "On-trip" },
        { where: { riderId: riderData.riderId }, transaction: t  }
    )

    const exist = await PickUpDetails.findOne({ where : {
        [Op.and] : [
            {riderId: riderData.riderId },
            {userId : details.userId },
            {itemId : details.itemId}
        ]
    },
        transaction: t,
    });

    if (exist) {
      return { status: "exists", pickUpStatus: exist.get("pickUpStatus") };
    }


    if(!exist){
        const newPickUp = await PickUpDetails.create({
            riderId : riderData.riderId,
            userId : details.userId,
            itemId : details.itemId,
            customerName : details.customerName,
            pickUpAddress : details.pickUpAddress,
            deliveryAddress : details.deliveryAddress,
            riderName : riderData.name,
            riderPhoneNumber : riderData.phoneNumber,
            userPhoneNumber : details.userPhoneNumber,
            pickUpStatus : 'Pending',
            description : details.description,
            pickUpDate : details.pickUpDate,
            deliveryDate : details.deliveryDate,
            image : details.image
        }, { transaction: t });

    return {
        status : "success",
        data : {
            pickUpId : newPickUp.get('id'),
            riderId: riderData.riderId,
            userId : details.userId,
            itemId : details.itemId,
            pickUpAddress: details.pickUpAddress,
        }
    };
    }
  }); 
}

const validateRide = async(uid: number, validate: string, id: number) => {
    const firebaseUid = uid;

    const findRider = await RiderDetails.findOne({
        where: { firebaseUid }  
    });

    if (!findRider) {
        throw new Error("Rider not found or not authorized");
    }

    const riderId = findRider.get("riderId") as number;

    if (validate === "cancel") {
        await RiderDetails.update(
        { riderStatus: "Available" },
        { where: { riderId } }
        );
    } else if (validate === "off-line") {
        await RiderDetails.update(
        { riderStatus: "off-line" },
        { where: { riderId } }
        );
    } else {
        await PickUpDetails.update(
        { pickUpStatus: "in-transit" },
        { where: { pickUpId: id, riderId } } 
        );
    }
};


