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

module.exports={
    getProfile
}