const express = require("express");
require("./db/conn");
const StudentModel = require("./models/modelschema")
const app = express();
const path = require("path");
// const hbs = require("hbs");
const port = process.env.PORT || 3000

const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views")
// const partial_path = path.join(__dirname,"../templates/partials")

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
// hbs.registerPartial(partial_path);

console.log(process.env.SPECIAL_KEY)

app.get("/",(req,res)=>{
 res.render("index")
})

app.post("/register",async(req,res)=>{
   try{
       const password = req.body.password;
       const confirmPassword = req.body.confirmPassword;
       if(password===confirmPassword){
        const studentRegister = new StudentModel({NAME:req.body.name,
            AGE:req.body.age,
            GENDER:req.body.gender,
            EMAIL:req.body.email,
            PHONE:req.body.phone,
            PASSWORD:password})

// console.log(studentRegister);

    const token = await studentRegister.jsonWebToken();
    console.log(`hello ani your ${token}`)

        const emp = await StudentModel.create(studentRegister);
        res.status(201).render("index")
       }
       else{
        res.send("invalid input")
       }
   }
   catch(err){
      res.status(400).send(err)
   }
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})