import {sequelize} from  "../config/db.ts"
import { DataTypes } from 'sequelize'; 

const RiderDetails = sequelize.define(
  'RiderDetails',
    {
        firebaseUid:{
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        },
        riderId:{
            type : DataTypes.INTEGER,
            allowNull : false,
            unique: true
        },
        riderName:{
            type : DataTypes.STRING,
            allowNull : false
        },
        phoneNumber : {
            type : DataTypes.STRING,
            allowNull : false,
            unique: true
        },
        vehicleNumber : {
            type : DataTypes.STRING,
            allowNull : false,
            unique: true
        },
        riderStatus : {
            type : DataTypes.ENUM,
            values: ['Offline', 'Available', "OnTrip"],
            defaultValue: 'Offline'
        },
        vehicleType : {
            type : DataTypes.ENUM,
            values : ["Bike", "Car", "Truck", "Van"]
        },
        image : {
            type: DataTypes.STRING,
            allowNull: false
        },
        country : {
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

