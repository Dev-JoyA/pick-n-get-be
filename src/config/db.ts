import dotenv from 'dotenv';
import { initializeApp} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import mongoose from "mongoose";

dotenv.config();


const uri: String | any = process.env.MONGODB_URI;
const databaseURL = process.env.DATABASE_URL;


const firebaseConfig = {
  databaseURL: databaseURL,
};

export const startServer = async() => {
  await mongoose.connect(uri);
  console.log("Connected to the database")
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
















