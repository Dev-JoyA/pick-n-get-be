import {client, sequelize} from  "../config/db"
import { DataTypes } from 'sequelize'; 

const PickUpDetails = sequelize.define(
  'PickUpDetails',
  {
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    riderId : {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    userId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    itemId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    customerName : {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickUpAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
    },
    riderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    riderPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userPhoneNumber : {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickUpStatus : {
        type : DataTypes.ENUM,
        values: ['Pending', 'InTransit', 'PickedUp', 'Delivered', 'Cancelled']
    },
    description : {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickUpDate : {
        type: DataTypes.DATE,
        allowNull: false
    },
    pickUpTime : {
        type: DataTypes.TIME,
        allowNull: false
    },
    deliveryDate : {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveryTime : {
        type: DataTypes.TIME,
        allowNull: true
    },
    image : {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    modelName : "PickUpDetails",
    tableName: "pick_up_details",
    timestamps: true
  },
);


console.log(PickUpDetails === sequelize.models.PickUpDetails);


