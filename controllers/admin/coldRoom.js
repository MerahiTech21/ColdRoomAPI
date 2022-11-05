const { request } = require('express');
const {db}=require('../../config/database.js');
const multer=require('multer');
const path=require('path');
const coldRoom = require('../../models/coldRoom.js');
const ColdRoom=db.coldRoom;
const Address=db.address;
const Rent=db.rent;



// woreda:req.body.woreda,
// kebele:req.body.kebele,
// name:req.body.name,       
// region:req.body.region,
//add coldRoom
const create= async(req,res)=>{
    let ColdRoomInfo={  
        name:req.body.name,
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
    let Address= await createAddress(AddressInfo);
    ColdRoomInfo.addressId=Address.id;
    let coldRoom= await ColdRoom.create(ColdRoomInfo);
    let id=coldRoom.id;
    rentInfo.coldRoomId=id;
    let rent= await createRent(rentInfo);
    
    res.status(200).send({coldRoom,rent,Address});

    } catch(err){
        console.log('error db creation',err);
    };
};
//creatin address for coldroom
const createAddress=async(address)=>{
  //console.log(address)
    const newaddress = await Address.create(address);
    return newaddress;

}; 

//creating rent
  
const createRent=async(rentInfo)=>{
    const newRent = await Rent.create(rentInfo);
    return newRent;

};
//updating the coldroom data
const update=async(req,res)=>{
    let ColdRoomInfo={  
        name:req.body.name,
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
        
     
     const updatedColdRoom=await ColdRoom.findOne({where:{id:req.params.id}});
     const addressId=updatedColdRoom.addressId;
      console.log(addressId);
     //res.send('done');
     const address= await Address.findOne({where: {id:addressId}});
     let addressUpdated= await address.update(AddressInfo);
     if(addressUpdated){
         const coldRoomUpdated= await updatedColdRoom.update(ColdRoomInfo);
         //res.send(coldRoomUpdated);
         if(coldRoomUpdated){
            let rent= await Rent.findOne({where: {id:updatedColdRoom.id}});
            const rentUpdate=await rent.update(rentInfo);
             if(rentUpdate)
             res.status(200).send({coldRoomUpdated,addressUpdated,rentUpdate});

         }
      

     }


    
    

    }  catch(err){
        console.log('error in update',err);


    }

}



module.exports={
    
    create,
    update
    
};