import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js"

const app = express();
const port = process.env.PORT || 4000;

await connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

/*routes*/
app.use("/api/user",userRoutes);
app.use("/api/complaint",complaintRoutes);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});