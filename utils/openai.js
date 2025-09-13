//our application core logic will be in utils folder
import 'dotenv/config';
const getopenApiResponse = async(message) => {
 const options = { //You’re preparing the request payload to call OpenAI’s Chat Completions endpoint:
      method : "POST", //he OpenAI API expects a POST because you’re sending data (the conversation) in the request body.
      headers: {
        "Content-Type" : "application/json",    //tells the API you’re sending JSON.
        "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body :JSON.stringify({
        model : "gpt-4o-mini",
        messages : [{ //the conversation; here a single user message "Hello!".
          role:"user",
          content : message,
        }]
      })
   };

  
  
  try{
     const response = await fetch("https://api.openai.com/v1/chat/completions" , options);// so basically we as a user send request(message) and we gatt reply from api in form of response of our message
     const data = await response.json();
     return data.choices[0].message.content
  }catch(err){
     console.log(err);
  }
}


export default getopenApiResponse;