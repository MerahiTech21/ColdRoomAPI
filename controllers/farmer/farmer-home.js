const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmer = require("../../models/farmer");
const { Op } = require("sequelize");
const { all } = require("../../routes/farmer");
const productType = require("../../models/productType");
const Product = db.product
const ProductType = db.productType;
const FarmerProduct =db.farmerProduct;
const FarmerBalance=db.FarmerBalance;
const FarmerRent=db.FarmerRent;
//const FarmRent=db.FarmerRent

  const getData=async(req,res)=>{
    let FarmerProductAmount=0;
    let FarmerTotalBalance=0;
   let farmerHomeData=[];
    try{
        let FProduct=await FarmerProduct.findAll(
           { where:{farmerId:req.params.id}}
        );
        //res.json(FProduct)
        FProduct.forEach((product)=>{
            FarmerProductAmount=FarmerProductAmount+product.currentQuantity
        });
       // res.json(FarmerProductAmount);   
        let FBalance=await FarmerBalance.findAll({
            where:{
                farmerId:req.params.id
            }
        });
        FBalance.forEach((FarBalance)=>{
            FarmerTotalBalance=FarmerTotalBalance+FarBalance.balanceAmount;

        });
        //res.json(FarmerProductAmount);  
         farmerHomeData={'farmerBalance':FarmerTotalBalance,'farmerProduct':FarmerProductAmount};
        res.json(
            farmerHomeData
        );        
    }catch(err){

    }
   
}
/**
 * return all products associated with a certain farmer

 */


const getFarmerProduct=async (req,res)=>{
    try{
        let allP=[];
        let FProducts =await FarmerProduct.findAll({
            where:{
                farmerId:req.params.id
            },
            include:[
                {
                model:Product,        
              },{
               model:ProductType
             }]

        });
        for(let FarmerProduct of FProducts){
        let rent=await FarmerRent.findOne({where:{farmerProductId:req.params.id}});
        let rentAmount=rent.rentAmount;

           let product={
            id:FarmerProduct.product.id,
            name:FarmerProduct.product.name,
            image:FarmerProduct.product.imageUrl,
               remainingQuantity:FarmerProduct.currentQuantity,
               rentPrice:rentAmount,
               
           };
           allP.push(product);
         

        }
        res.json(allP);

    }
    catch(err){
        

    }

};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getProductType=async(req,res)=>{
   //res.json(req.body);
    let allProdType=[];
    try{
        let id=req.body.ProductId
        const ProdTypes= await FarmerProduct.findAll({where:{
         farmerId:req.params.id,
           productId:id

        },
        include:[
            {
                model:ProductType,
            }     
       ] 
    });
   //res.json(ProdTypes);
    for(PTypes of ProdTypes){
      // res.json(PTypes)
        let ProddType={
           name:PTypes.productType.title,
           remainingQuantity:PTypes.currentQuantity,
           soldQuantity:PTypes.soldQuantity,
           addedDate:PTypes.createdAt,
            image:PTypes.productType.imageUrl,

        };

       allProdType.push(ProddType);


    }
       res.json(allProdType);

    }
    catch(err){
        res.json(err);

    }

};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

const getSoldProduct=async (req,res)=>{
    const allSold=[];
    try{
        
        let SProduct=await FarmerProduct.findAll({
            where:{
                farmerId:req.params.id,
                soldQuantity:{
                    [Op.ne]:0
                }  
           
                   },
            include:[
                {
                model:Product,        
                  },
                  {
                model:ProductType
                 }]
           });
           for(let sp of SProduct){
              // let p=Product.findAll()
               //res.json(sp.product.name);
                 
              let rent= await FarmerRent.findOne({where:{farmerProductId:sp.id}});
             let farmerBal=await FarmerBalance.findOne({where:{farmerProductId:sp.id}});
             let rentAmount;
             let balance;
             if(rent===null){
               rentAmount=0;
             }
             else{
                 rentAmount=rent.rentAmount
             }
             if(farmerBal===null){
                balance=0;
              }
              else{
                  balance=farmerBal.balanceAmount
              }

             let netBal=balance-rentAmount;
               let products={
                   productName:sp.product.name,
                   typeName:sp.productType.title,
                   quality:sp.quality,
                   image:sp.product.imageUrl,
                   soldAmount:sp.soldQuantity,
                   soldPrice:sp.soldQuantity*sp.pricePerKg,
                   rentCost:rentAmount,    
                   date:sp.updatedAt,
                    netBalance:netBal,
               };
               //console.log(products);
             // res.json(products);
               //return;
                allSold.push(products);
                


           }
        //    let all=[];
        //    all.push(allSold);
        //console.log(allSold);
             //console.log(allSold);

           res.json(allSold);

           //res.json(allSold);
        

    }catch(err){
       res.json(err)
    }

}


const getWithDraw=async (req,res)=>{
    try{

        const withDrawAmount=await FarmerBalance.findAll({
            where:{farmerId:req.params.id,state:1},
            attributes:['id','balanceAmount','updatedAt']
        });

        res.json(withDrawAmount);
    }catch(err){

    }

}
module.exports = {
    getData,
    getFarmerProduct,
    getSoldProduct,
    getWithDraw,
    getProductType,

    
  };
