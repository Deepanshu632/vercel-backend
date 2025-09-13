import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"; //helper library that simplifies username + password authentication with Passport.
const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    username : {
        type:String,
        required : true,
    },

})

UserSchema.plugin(passportLocalMongoose);//is what makes your User model "passport-aware" by automatically handling 
// username/password fields, hashing, salting, and authentication methods.


export default mongoose.model("user" , UserSchema);




