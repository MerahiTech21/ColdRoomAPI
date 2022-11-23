const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const ColdRoom =db.coldRoom;
const { fn } = require("sequelize");

const getColdRoom=async(req,res)=>{
    try{
        const allColdRoom=await ColdRoom.findAll(
           { attributes:{exclude:['employeeId','addressId','createdAt','updatedAt']} }
        );
        res.json(allColdRoom);
    }
    catch(err){
      res.send(err);
    }
  

}


module.exports={
    getColdRoom,
}