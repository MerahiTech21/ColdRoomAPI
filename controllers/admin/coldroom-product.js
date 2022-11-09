const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const FarmerProduct =db.farmerProduct;
const {AddFarmer} = require("./farmer");
const { fn } = require("sequelize");
const ColdRoomProduct = db.coldRoomProduct;
const FarmerRent=db.FarmerRent

const getColdroomProducts =async(req,res)=>{

  try {

    var fp=await FarmerProduct.findAll({
       where:{coldRoomId:req.params.id},
     attributes:['ProductId',[ db.sequelize.fn('sum',db.sequelize.col('oldQuantity')),'totalProduct'],   
   ],
   include:[
    {
     model:db.product ,
     attributes:['name','imageUrl']
   },{
    model:db.coldRoom ,
    attributes:['id','name']
  }
  ],
     group:['productId'],
    
    });
             let allP=[]
    fp.forEach((fProduct)=>{   
               let all={}

        const product={
        name:fProduct.Product.name,
        imageUrl:process.env.BASE_URL+'/Images/'+fProduct.Product.imageUrl,
        productId:fProduct.ProductId
      }

      const coldRoom={
        id:fProduct.coldRoom.id,
        name:fProduct.coldRoom.name
      }
      
        all.product=product
        all.coldRoom=coldRoom     
        all.productId=fProduct.ProductId
        all.totalProduct=fProduct.totalProduct
   
     // return all
        allP.push(all)
      
    })
    res.json(allP)   
    
  } catch (error) {
    res.status(404).json('Error '+error)
  }
  
}

const getProductDetail =async(req,res)=>{

  try {
    const fp=await FarmerProduct.findAll({
      //attributes:['productId'],
   where:{productId:req.params.id},
   include:[{
    model:db.farmer ,
     attributes:['fName','lName']
  },{
    model:db.productType ,
     attributes:['title','imageUrl'] 
  }
  ],
    //  group:['createdAt'], 
    
    });
    res.json(fp) 
  } catch (error) {
    console.log("Error "+error)
  }
 
}


module.exports={getColdroomProducts,getProductDetail}