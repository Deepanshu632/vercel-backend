import express from "express";
const app = express();
import 'dotenv/config';
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";


import chatRoutes from "./routes/chat.js"
import authRoutes from "./routes/auth.js"

import MongoStore from "connect-mongo";



import session from "express-session"

import passport from "passport"
import LocalStrategy from "passport-local"




//connecting frontend and backend so that cookie can be sent for seesion from frontend to backend and back
app.use(cors({
  origin: "http://localhost:5173", // Your React app URL
  credentials: true                // Allow cookies over CORS
}));



app.use(express.json());   // Middleware for parsing JSON
app.use(express.urlencoded({ extended: true }));


const sessionOption = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store : MongoStore.create({
     mongoUrl : process.env.MONGODB_URI,
    collectionName : "sessions",
    ttl : 60 * 60 * 24 * 7, //// session expiry in seconds (7 days)
  }),  
cookie: { 
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week millisicond from now date
    maxAge:7 * 24 * 60 * 60 * 1000,                // expiridate of a session (i.e;)after 7 days
    httpOnly:true,    
    sameSite: "lax",
    secure: false
  },
}



app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));  //authenticate -> user ko login  and signup karwana 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use("/api" , chatRoutes);
app.use("/auth" ,authRoutes );

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database!");
  }catch(err){
    console.log(`Failed to connect with database due to  ${err}`);
  }
}


app.listen(8080 , () =>{ 
  console.log("server is running on port 8080");
  connectDB();
});





