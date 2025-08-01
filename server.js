import express from "express";
const app = express();
import 'dotenv/config';
import cors from "cors";

app.use(express.json());
app.use(cors());

app.post("/test" , async(req , res)=>{ //client must send a POST to /test to trigger this handler.
   const options = { //You’re preparing the request payload to call OpenAI’s Chat Completions endpoint:
      method : "POST", //he OpenAI API expects a POST because you’re sending data (the conversation) in the request body.
      headers: {
        "Content-Type" : "application/json", //tells the API you’re sending JSON.
        "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body :JSON.stringify({
        model : "gpt-4o-mini",
        messages : [{ //the conversation; here a single user message "Hello!".
          role:"user",
          content : req.body.message,
        }]
      })
   };
  
  try{
     const response = await fetch("https://api.openai.com/v1/chat/completions" , options);// so basically we as a user send request(message) and we gatt reply from api in form of response of our message
     const data = await response.json();
     console.log(data.choices[0].message.content);
     res.send(data.choices[0].message.content);
  }catch(err){
     console.log(err);
  }
})
app.listen(8080 , () =>{
  console.log("server is running on port 8080");
})
