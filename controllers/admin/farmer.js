const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const { all } = require("../../routes/admin/farmer");

const Farmer = db.farmer;
const Address = db.address;
const getfarmer=async(req,res)=>{


const farmers=await Farmer.findAll({
    attributes:[
        'fName',
        'lName',
    ],

    include:[
       {
        model:Address,
        as:'address',
        attributes:[
          ['woreda','location']

        ]
      } 
    ],       
    //  group:['farmer.id','farmerBalances.farmerId','farmerRents.farmerId'],
      // raw:true

  });
 // res.status(200).json(farmers);

  let allFarmer=[]
  allFarmer=farmers;
  res.status(200).json(allFarmer);

  for(let i=0;i<allFarmer.length;i++){
    res.status(200).json(allFarmer[i]);

  }
  //allFarmer=farmers;
  res.status(200).json(allFarmer);
}
  module.exports={
      getfarmer
  }