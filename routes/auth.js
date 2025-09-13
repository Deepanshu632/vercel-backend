import express from "express";
const router = express.Router();

import passport from "passport";
import User from "../models/user.js";


//signup
router.post("/register" , async(req,res) => {
    try {
        // console.log("Incoming body:", req.body);
     const {email , username , password} = req.body;
    const user  = new User({ // create a mongoose object without a password
        email , username
    })
    await User.register(user , password); // passport-local-mongoose -> generates the salt , hashes the given passport with salt , Stores hash and salt in the database along with the other fields (email, username) password itself is never stores. , saves the document
    res.status(201).json({message : "user registered successfully"});
    
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "registration failed"});
    }
})


//login
router.post("/login" , passport.authenticate("local") , (req,res) => {
    res.json({message: "login successful" , user : req.user});
});


//logout route
router.post("/logout" , (req , res) => {
    if(!req.isAuthenticated()){
       return res.status(401).json({ error: "You are not logged in" });
    }
    req.logout(err => {
        if(err) return res.status(500).json({ error: "Logout failed" });
         res.json({ message: "Logged out successfully" });
    })
} )

//protect routes authorization
function isLoggedin(req, res , next){
 if(req.isAuthenticated()){
    return next();
 }
 res.status(401).json({error : "you must be logged in"});
}

router.get("/protected" , isLoggedin, (req,res) => {
    res.json({message : " you are authorized" , user : req.user});
})


export default router;

