const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const Product =db.product;
const ProductType=db.productType;
const ColdRoomProduct=db.coldRoomProduct;
const ColdRoom=db.coldRoom;
const { fn } = require("sequelize");
const { all } = require("../../routes");

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
           // res.json(coldRoomProduct);
            for(let cRProduct of coldRoomProduct){
                const eachcRProduct={};

                eachcRProduct.coldRoomId=cRProduct.id;
                eachcRProduct.price=cRProduct.price;
                eachcRProduct.name=cRProduct.coldRoom.name;
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