const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const WholeSaler = db.wholeSaler;
require('dotenv').config()

const Login=async (req,res)=>{
  let phoneNumber=req.body.phoneNumber;
  let password=req.body.password;

  try{
  const wholeSaler=await WholeSaler.findOne({where:{phoneNumber:phoneNumber}});
    if(!wholeSaler){
      res.status(404).json('User Not Found !')
      return
    } 
    //decrept password and compare
    const valide=await bcrypt.compare(password,wholeSaler.password)
  //  res.json(valide);
     if(! valide ){
        res.status(403).json("Phone Number or Password Incorrect!")
        return
    }  

    const token= jwt.sign({id:wholeSaler.id,phoneNumber:wholeSaler.phoneNumber},process.env.ACCESS_TOKEN_SECRET)
    const userData={
      id: wholeSaler.id,
      lName: wholeSaler.lName,
      fName: wholeSaler.fName,
      phoneNumber: wholeSaler.phoneNumber,
    }
    res
      .status(200)
      .json({userData,accessToken: token});
  }catch(err){
    res.status(400).json("Error While Login "+err) 
    console.log('eror ',err)
  }
}

const changePassword=async(req,res)=>{

  let newPassword=req.body.newPassword;
  let oldPassword=req.body.oldPassword;

  try{
     
    const wsaler=await WholeSaler.findByPk(req.params.id)

    if(!wsaler){
      res.status(401).json("No Such Account Exist")
      return
    }
    //decrept password and compare
    const valide=await bcrypt.compare(oldPassword,wsaler.password)
  //  res.json(valide); 
     if(! valide ){
        res.status(401).json("Old Password Incorrect!")
        return
    }
    let encryptedPassword = await bcrypt.hash(newPassword, 10);
    wsaler.password=encryptedPassword
    await wsaler.save()
    res.status(200).json("Successfully Changed") 


  }catch(err){
    res.status(401).json("Internal Server Error "+err) 
    console.log('eror ',err)
  }
  

}

module.exports={Login,changePassword}