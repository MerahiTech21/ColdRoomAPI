const { request } = require('express');
const {db}=require('../../config/database.js');
const multer=require('multer');
const path=require('path');
const coldRoom = require('../../models/address.js');
const Address=db.address;

const findAll= async(req,res)=>{
    let address1=await Address.findAll();
    return res.send(address1);
}
     
module.exports={
    findAll 

} 