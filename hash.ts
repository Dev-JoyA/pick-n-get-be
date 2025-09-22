import { ethers } from "ethers";

const eventSig = "RiderApproved(uint256,string,uint8,string,bytes,string,uint8)";
const topicHash = ethers.id(eventSig);

console.log("Event Hash:", topicHash);
