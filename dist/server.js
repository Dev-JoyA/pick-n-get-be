import express from 'express';
;
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "It works" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map