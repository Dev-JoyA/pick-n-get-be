import express, {Request , Response} from 'express';;
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {startServer} from "./src/config/db.ts"
import route from "./src/routes/deliveryRoute.ts"

dotenv.config();

// try {
//   await sequelize.authenticate();
//   console.log('Postgres Connection has been established successfully.');
//   await sequelize.sync({alter : true})
//   console.log("Postgres successfully synced")
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

startServer();



const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/v1", route)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
