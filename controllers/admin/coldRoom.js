const { request } = require('express');
const {db}=require('../../config/database.js');
const multer=require('multer');
const path=require('path');
const coldRoom = require('../../models/coldRoom.js');
const ColdRoom=db.coldRoom;
const Address=db.address;


// woreda:req.body.woreda,
// kebele:req.body.kebele,
// name:req.body.name,       
// region:req.body.region,

//add coldRoom
const create= async(req,res)=>{
    let ColdRoomInfo={  
        name:req.body.name,
        zone:req.body.zone,
        latitude:req.body.latitude,
        longitude:req.body.longitude,  
         

    };
   
    let AddressInfo={  
      woreda:req.body.woreda,
      kebele:req.body.kebele,
      zone:req.body.zone,
      region:req.body.region,
    

    };
    let rentInfo={
        price:req.body.price,
        
    };
    

    try{
        //calling a function
    let AddressId= await createAddress(AddressInfo);
    ColdRoomInfo.addressId=AddressId;
    let coldRoom= await ColdRoom.create(ColdRoomInfo);
    let coldRoomId=coldRoom.id;
    
        res.status(200).send(coldRoom);

    } catch(err){
        console.log('error db creation',err);
    };
};

const createAddress=async(address)=>{
    const newaddress = await Address.create(address);
    return newaddress.id;

};

const createAddress2=async(address)=>{
    const newaddress = await Address.create(address);
    return newaddress.id;

};




module.exports={
    
    create
    
};