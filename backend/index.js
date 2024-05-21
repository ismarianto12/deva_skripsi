import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// import db from "./db/connect.js"
import db from "./db/database.js";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use('/files', express.static(path.join(__dirname, 'public')));


const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:8080'];
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(8080, () => console.log('Server running at port 5000'));
