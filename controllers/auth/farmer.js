const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const Farmer = db.farmer;
require('dotenv').config()

const Login=async (req,res)=>{
  let phoneNumber=req.body.phoneNumber;
  let password=req.body.password;

  try{
  const farmer=await Farmer.findOne({where:{phoneNumber}});
    if(!farmer){
      throw new Error('User Not Found !')
    }
    //decrept password and compare
    const valide=await bcrypt.compare(password,farmer.password)
  //  res.json(valide);
     if(! valide ){
        res.status(401).json("Phone NUmber or Password Incorrect!")
    }

    const token= jwt.sign({id:farmer.id,phoneNumber},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
    res.status(200).json({id:farmer.id,phoneNumber:farmer.phoneNumber,token:token})

  }catch(err){
    res.json(err) 
    console.log('eror ',err)
  }
}

const Logout=(req,res)=>{
    
}

module.exports={Login,Logout}