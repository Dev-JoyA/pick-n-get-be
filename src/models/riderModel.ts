import {client, sequelize} from  "../config/db"
import { DataTypes } from 'sequelize'; 

const RiderDetails = sequelize.define(
  'RiderDetails',
    {
        riderId:{
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true
        },
        riderName:{
            type : DataTypes.STRING,
            allowNull : false
        },
        phoneNumber : {
            type : DataTypes.STRING,
            allowNull : false
        },
        vehicleNumber : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        riderStatus : {
            type : DataTypes.ENUM,
            values: ['Off-line', 'Available', "On-Trip"],
            defaultValue: 'Off-line'
        },
        vehicleType : {
            type : DataTypes.ENUM,
            values : ["Bike", "Car", "Truck", "Van"]
        },
        image : {
            type: DataTypes.STRING,
            allowNull: false
        } 
    },
    {
        tableName: "rider_details",
        timestamps: true,
    }

)

export default RiderDetails;

