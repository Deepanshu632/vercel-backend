import express from "express";
const router = express.Router();
import Thread from "../models/thread.js";
import getopenApiResponse from "../utils/openai.js";
import User from "../models/user.js";

//test
router.post("/test" , async(req,res) => {
    try{
        const thread = new Thread({
        threadId : "deepu",
        title:"testing 3nd  new thread",
    });
   const response = await thread.save();
   res.send(response);
    }catch(err){
       console.log(err);
       res.status(500).json({error : "failed to save in DB"});
    }
});


//for returning all the threads
router.get("/thread" , async(req ,res) => {

    try{
        const threads = await Thread.find().sort({updateAt :-1}); //Descending order pf updated at .... most recent data on top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error : "Failed to save in DB"})
    }
})


//if want to seee particular thread
router.get("/thread/:threadId" , async(req,res) => {
    const {threadId} = req.params;

    try{
     let thread = await Thread.findOne({threadId});
     
     if(!thread){
        res.status(404).json({error : "faild to load the thread"});
     }
     res.json(thread.messages);
    }catch(err){
      console.log(err);
        res.status(500).json({error : "Failed to load the thread"})
    }
})


//if we want to delete a particular thread
router.delete("/thread/:threadId" , async(req,res) => {
    const {threadId} = req.params;
    
    try{
    const deletedThread = await Thread.findOneAndDelete({threadId });

    if(!deletedThread){
        res.status(404).json({error : "thread could not found"})
    }

    res.status(200).json({success : " thread deleted successfully"});
    console.log(deletedThread);
    }catch(err){
      console.log(err);
        res.status(500).json({error : "Failed to Delete the thread"})
    }
})

router.post("/chat" , async(req,res) => {
    const { threadId , message } = req.body;
    //validating
    if(!threadId || !message){
        res.status(404).json({error : "missing required fields"});
    }

    try{
       let thread = await Thread.findOne({threadId});
       if(!thread){ //if thread doesn't exist in database
        //create new thread in DB
          thread = new Thread({
            threadId,
            userId: req.user?._id,   
            title:message,
            messages :[{role:"user" , content:message}]
          });
       }else{
         thread.messages.push({role:"user" , content :message});
       }
       
     // getting ai response of message
       const assistantReply = await getopenApiResponse(message);
       thread.messages.push({role:"assistant" , content : assistantReply}); //saving assistant reply in databse so that we can represent it in history section
       thread.updateAt = new Date();
       await thread.save();

      
       res.json({reply :assistantReply});//send it to frontend as we have to show it in frontend also
       
    }catch(err){
        console.log(err);
        res.status(500).json({error : "Something went wrong"})
    }
})


export default router;