"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var eventSig = "RiderApproved(uint256,string,uint8,string,bytes,string,uint8)";
var topicHash = ethers_1.ethers.id(eventSig);
console.log("Event Hash:", topicHash);
