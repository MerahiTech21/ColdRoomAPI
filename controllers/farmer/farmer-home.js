const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmer = require("../../models/farmer");
const { Op } = require("sequelize");
const { all } = require("../../routes/farmer");
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
        FProducts.forEach((FarmerProducts)=>{
            res.json(FarmerProducts);
            let all=[];
           let product={
               name:FarmerProduct.product.name,
               image:process.env.BASE_URL+'/Images/'+FarmerProduct.Product.imageUrl,
               remainingQuantity:FarmerProduct.currentQuantity,
               //rentPrice:FarmerRent.findAll()
           };
         let type={

         }


        })
        res.json(FProduct);

    }
    catch(err){
        

    }

};

const getSoldProduct=async (req,res)=>{
    const allSold=[];
    try{
        
        //res.send('hiii');
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
             let netBal=farmerBal.balanceAmount-rent.rentAmount;
             
               let products={
                   productName:sp.product.name,
                   typeName:sp.productType.title,
                   quality:sp.quality,
                   soldAmount:sp.soldQuantity,
                   soldPrice:sp.soldQuantity*sp.pricePerKg,
                   rentCost:rent.rentAmount,    
                   date:sp.updatedAt,
                   netBalance:netBal,
               };
               //console.log(products);
              //res.json(products);
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

    
  };
