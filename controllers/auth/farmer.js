const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const Farmer = db.farmer;
require('dotenv').config()

const Login=async (req,res)=>{
 

  try{ 
    let phoneNumber=req.body.phoneNumber;
    let password=req.body.password;
  const farmer=await Farmer.findOne({where:{phoneNumber}});
    if(!farmer){
      throw 'User Not Found !'
    }
    //decrept password and compare
    const valide=await bcrypt.compare(password,farmer.password)
  //  res.json(valide);
    if(! valide ){
        res.status(401).json("Phone Number or Password Incorrect!")      
     }
    const token=  await jwt.sign({id:farmer.id,phoneNumber},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
    res.status(200).json({id:farmer.id,phoneNumber:farmer.phoneNumber,token:token})
  }catch(err){
    res.status(404).json('Error ' +err) 
    console.log('eror ',err)
  }
}

const Logout=(req,res)=>{
    
}

module.exports={Login,Logout}