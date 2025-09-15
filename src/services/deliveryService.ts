import {PickUpStatus, IPickUpDetails, VehicleType, RiderStatus, IRiderDetails} from "../interface/deliveryInterface"
import PickUpDetails from "../models/deliveryModel"
import RiderDetails from "../models/riderModel"
import { Op } from "sequelize";
import { ethers, JsonRpcProvider } from "ethers";
import { redisClient } from "../config/db"
import fetch from "node-fetch"; 

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

const client = redisClient;
const provider = new JsonRpcProvider();
const contract = new ethers.Contract("", [], provider);

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
                image: riderDetails.image,
                country: riderDetails.country
            });
        }
});

const selectRide = async(type: string , country: string, pickupLat: any, pickupLng: any) => {
    const riders = await RiderDetails.findAll({ where :{ 
        [Op.and] : [
            {vehicleType : {[Op.like] : `%${type}%`}}, 
            {riderStatus : {[Op.like] : "%Available%"}},
            {country : {[Op.like] : `%${country}%`}}
        ]
    }})
    
    const coords=[]
    for(let rider of riders){
        const riderData = rider.toJSON() as any;
        const location = await client.hGetAll(`rider:${riderData.riderId}:location`);
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

    if (coords.length === 0) return null;
    const sources = `0`;
    const coordinates = [
        `${pickupLat}, ${pickupLng}`,
        ...coords.map(c => `${c.lng}, ${c.lat}`)
    ].join(";");

    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?sources=${sources}&annotations=distance,duration&access_token=${MAPBOX_API_KEY}`;

    const response = await fetch(url);
    const data: any = await response.json();

    const durations = data.durations[0].slice(1); 
    const riderDurations = coords.map((c, i) => ({
        ...c,
        duration: durations[i]
    }));

    riderDurations.sort((a, b) => a.duration - b.duration);

    return riderDurations.slice(0, 5);
    
};

const pickRider = async(type: string , country: string, pickupLat: any, pickupLng: any, picked : number) => {
    const riderDurations = await selectRide(type, country, pickupLat, pickupLng);

    if (!riderDurations || riderDurations.length === 0) return null;

    const riderData = riderDurations[picked];

    const selected = await RiderDetails.findOne({where : {
        riderId : riderData.riderId
    }});

    await RiderDetails.update(
        { riderStatus: "On-trip" },
        { where: { riderId: riderData.riderId } }
    )

    const exist = await PickUpDetails.findOne({ where : {
         [Op.and] : [
            {}
        ]
    }

    })

    // {vehicleType : {[Op.like] : `%${type}%`}}, 
    //         {riderStatus : {[Op.like] : "%Available%"}},
    //         {country : {[Op.like] : `%${country}%`}}

    await PickUpDetails.create({

    })

    
}