import {client, sequelize} from  "../config/db"
import { DataTypes } from 'sequelize'; 

const PickUpDetails = sequelize.define(
  'PickUpDetails',
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    riderId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customerName : {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickUpAddress: {
      type: DataTypes.STRING,
      allowNull: false,
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
    userPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickUpStatus : {
        type : DataTypes.ENUM,
        values: ['Pending', 'InTransit', 'PickedUp', 'Delivered', 'Cancelled'],
        defaultValue: 'Pending'
    },
    description : {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickUpDate : {
        type: DataTypes.DATE,
        allowNull: false
    },
    deliveryDate : {
        type: DataTypes.DATE,
        allowNull: true
    },
    image : {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    tableName: "pick_up_details",
    timestamps: true,
  }
);

export default PickUpDetails;


