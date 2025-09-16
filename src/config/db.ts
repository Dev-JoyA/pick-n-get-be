import { createClient } from 'redis';
import { Server } from "socket.io";
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";

dotenv.config();

const password = process.env.POSTGRES_PASSWORD;
const databaseURL = process.env.DATABASE_URL;

const firebaseConfig = {
  databaseURL: databaseURL,
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
const writeData = (riderId: string, lat: number, lng: number) => {
    set(ref(database, "riders/" + riderId), {
    lat: lat,
    lng: lng,
    updatedAt: Date.now()
   });
}

export const sequelize = new Sequelize('pngdb', 'postgres', password, {
  host: 'localhost',
  dialect: 'postgres'
});





