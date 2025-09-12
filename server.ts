import express, {Request , Response} from 'express';;
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {sequelize, client}  from "./src/config/db.ts"

dotenv.config();

try {
  await sequelize.authenticate();
  console.log('Postgres Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
console.log("redis sucessfully connected", client);

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get("/", (req : Request, res : Response) => {
    res.json({message : "It works"});
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
