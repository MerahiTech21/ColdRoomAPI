const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const Product =db.product;
const ProductType=db.productType;
const ColdRoomProduct=db.coldRoomProduct;
const ColdRoom=db.coldRoom;
const FarmerProduct=db.farmerProduct;

 
const getProduct=async(req,res)=>{
    try{
        const allProduct=await Product.findAll(
           { attributes:{exclude:['createdAt','updatedAt']} }
        ); 
        res.json(allProduct);
    }
    catch(err){
      res.send(err);
    }
}
const getProductDetail=async(req,res)=>{
    try{
        const product=await Product.findOne({where:{id:req.params.id}});
        const allData={};
        allData.id=product.id;  
        allData.name=product.name;
        const pTypes= await ProductType.findAll({ 
            where:{productId:req.params.id}
        });
       // res.json(pTypes);
        const types=[];
        for(let type of pTypes){
            const price=[];

            const eachProductType={};
            eachProductType.image=type.imageUrl;
            eachProductType.title=type.title;
            eachProductType.description=type.description;

            eachProductType.id=type.id;
            const coldRoomProduct=await ColdRoomProduct.findAll(
                {
                    where:{productId:req.params.id,productTypeId:type.id},
                     include:[
                    {
                      model:ColdRoom
                     // attributes: ["name"],
                    }   
                    ]  
                }
            );
          //  res.json(coldRoomProduct);
            for(let cRProduct of coldRoomProduct){
                const eachcRProduct={};
               const quantities=await FarmerProduct.findAll(
                   {
                       where:{
                           ProductId:cRProduct.productId,
                           ProductTypeId:cRProduct.productTypeId,
                           ColdRoomId:cRProduct.coldRoomId
                       }
                   }
               );
        //res.json(quantities);
               let totalQuantity=0;
               for(let qnty of quantities){
                   totalQuantity=totalQuantity+qnty.currentQuantity;

               }
                eachcRProduct.coldRoomId=cRProduct.coldRoomId;
                eachcRProduct.price=cRProduct.price;
                eachcRProduct.name=cRProduct.coldRoom.name;
                eachcRProduct.quantity=totalQuantity;
                
                price.push(eachcRProduct);
            }
            eachProductType.coldRoomPrice=price;
           types.push(eachProductType);
        }

        allData.type=types;
        res.json(allData);




    }
    catch(err){
        res.send(err);

    }
}


module.exports={
    getProduct,
    getProductDetail
}