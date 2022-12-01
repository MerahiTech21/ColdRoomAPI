const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmer = require("../../models/farmer");
const { Op } = require("sequelize");
const { all } = require("../../routes/farmer");
const Product = db.product;
const Farmer = db.farmer;

const ProductType = db.productType;
const FarmerProduct =db.farmerProduct;
const FarmerBalance=db.FarmerBalance;
const FarmerRent=db.FarmerRent;

const getProfile=async(req,res)=>{
    const profile=await Farmer.findByPk(req.params.id,{attributes:{exclude:['password','createdAt','updatedAt']}});
    res.json(profile);
    
}

const changePhoneNumber=async(req,res)=>{
    try{
        //res.json('hii');
      const farmer=await Farmer.findByPk(req.params.id);
      //res.json(farmer);
      farmer.phoneNumber=req.body.phoneNumber;
     //res.json(req.body.phoneNumber);
       await farmer.save();
        res.status(200).json(farmer);

    }catch(err){
     res.status(404).json(err);
    }
   

}


const changePassword=async(req,res)=>{
    let newPassword=req.body.newPassword;
    let oldPassword=req.body.oldPassword;
  
    try{
      
      const farmer=await Farmer.findByPk(req.params.id)
  
      if(!farmer){
        res.status(401).json("No Such Account Exist")
        return
      }
      //decrept password and compare
      const valide=await bcrypt.compare(oldPassword,farmer.password)
    //  res.json(valide);
       if(! valide ){
          res.status(401).json("Old Password Incorrect!")
          return
      }
      let encryptedPassword = await bcrypt.hash(newPassword, 10);
      farmer.password=encryptedPassword
      await farmer.save()
      res.status(200).json("Successfully Changed") 
  
  
    }catch(err){
      res.status(401).json("Internal Server Error") 
      console.log('eror ',err)
    }
   

}

module.exports={
    getProfile,
    changePhoneNumber,
    changePassword
}