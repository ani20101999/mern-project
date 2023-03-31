require("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let studentSchema = new mongoose.Schema({
    NAME:{
        type:String,
        required:true,
    },
    AGE:{
        type:Number,
        required:true,
    },
    GENDER:{
        type:String,
        required:true,
    },
    EMAIL:{
        type:String,
        required:true,
        unique:true
    },
    PHONE:{
        type:Number,
        required:true,
        unique:true
    },
    PASSWORD:{
        type:String,
        required:true,
    },
    TOKENS:[{
       TOKEN:{
                type:String,
                required:true,
             }
        
    }]
})

//for jwt authentication:-
studentSchema.methods.jsonWebToken = async function(req,res){  //use statics if required
try{
  let tok =  jwt.sign({_id:this._id},process.env.SPECIAL_KEY,{expiresIn:"10 minutes"});
   this.TOKENS = this.TOKENS.concat({TOKEN:tok});
   await this.save();
   return tok;
}
catch(err){
   res.send(err)
}
}

//for hashing the password:-
studentSchema.pre("save",function(next){ //for comparing the password during login we use bcrypt.compare(login pass,database stored pass)

    if(this.isModified("PASSWORD")){
   bcrypt.hash(this.PASSWORD,10,(err,hash)=>{
    if(err){return(next(err))}
    else{
        this.PASSWORD = hash;
        next()
    }
   });
}
})



const StudentModel = new mongoose.model("StudentModel",studentSchema);

module.exports = StudentModel;