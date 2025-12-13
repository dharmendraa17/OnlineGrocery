import cookieParser from "cookie-parser";
import cors from "cors";
import express, { application } from "express";
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";


// load .env from the routes folder where your .env currently resides
dotenv.config({ path: '.env' });


const app = express();
const port = process.env.PORT || 4000;

// Connect to DB (will log helpful error if MONGODB_URI missing)
await connectDB();

await connectCloudinary()

//Allowed origins for CORS
const allowOrigins = [
  "https://online-grocery-frontend-chi.vercel.app"
  
];


//Middleware to handle JSON requests and cookies — register BEFORE routes
app.use(express.json());   // JSON body allow करता है
//app.use(express.urlencoded({ extended: true })); // form data allow करता है

app.use(cookieParser());
app.use(cors({ origin: allowOrigins, credentials: true }));

app.get("/", (req, res) => res.send("Api is working"));
app.use('/api/user', userRoute);
app.use('/api/seller', sellerRouter);
app.use('/api/product',productRouter );
app.use('/api/cart',cartRouter );
app.use('/api/address',addressRouter );
app.use('/api/order',orderRouter );



app.listen(port, () => {
  console.log(`server is running on port no is:${port}`);
});
