const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const FarmerProduct =db.farmerProduct;
const {AddFarmer} = require("./farmer");
const ColdRoomProduct = db.coldRoomProduct;
const FarmerRent=db.FarmerRent

const getColdroomProducts =async(req,res)=>{

  try {

    const fp=await FarmerProduct.findAll({
       where:{coldRoomId:req.params.id},
     attributes:['productId',[ db.sequelize.fn('sum',db.sequelize.col('oldQuantity')),'totalProduct'],   
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
            
    res.json(fp)   
    
  } catch (error) {
    res.status(404).json('Error '+error)
  }
  
}

const getProductDetail =async(req,res)=>{

  try {
    const fp=await FarmerProduct.findAll({
      //attributes:['productId'],
      where:{productId:req.params.id},
      where:{coldRoomId:req.query.coldRoomId},
      include:[{
    model:db.farmer ,
     attributes:['fName','lName']
  },{
    model:db.productType ,
     attributes:['title','imageUrl'] 
  },
  {
    model:db.product ,
     attributes:['name'] 
  },
  {
    model:db.coldRoom ,
    attributes:['id','name']
  }
  ],     
    });
    res.json(fp) 
  } catch (error) {
    console.log("Error "+error)
  }
 
}


module.exports={getColdroomProducts,getProductDetail}