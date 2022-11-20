const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const FarmerProduct =db.farmerProduct;
const {AddFarmer} = require("./farmer");
const { fn } = require("sequelize");
const ColdRoomProduct = db.coldRoomProduct;

const SaveFarmerProduct = async (req, res) => {
    // res.json(req.body.farmer)
  try {
    
  let farmerId;
  if (req.body.newFarmer) {
    farmerId = await AddFarmer(req.body.farmer);
    console.log('farmerId',farmerId)
  } else {
    farmerId = req.body.farmerId;
  }
 
 
  const dataToSave = {
    coldRoomId: req.body.coldRoomId,
    ProductTypeId: req.body.productTypeId, 
    productId: req.body.productId,
    farmerId: farmerId,
    oldQuantity: req.body.quantity,
    soldQuantity: 0,
    currentQuantity:req.body.quantity ,
    quality: req.body.quality,
    pricePerKg:123,
    warehousePosition: req.body.warehousePosition, 
  };

  const fp=await FarmerProduct.create(dataToSave);
  //farmer.addProductType(product, { through: { dataToSave } });

  //console.log(fp.stringfy())
  res.json('saved')
} catch (error) {
  res.json(''+error)

  //  console.log('error',error)
}
};

const getFarmersProducts =async(req,res)=>{

  try {
    // const coldRoomId=req.user.coldRoomId
     
    // if (!coldRoomId) {
    //   res.status(404).json('Error ')

    // }
    const fp=await FarmerProduct.findAll({
      // where:{coldRoomId:coldRoomId},
     attributes:['productId',[db.sequelize.fn('sum',db.sequelize.col('oldQuantity')),'totalProduct'],   
   ],
   include:[{
     model:db.product ,
     attributes:['name','imageUrl']
   }],
     group:['productId'],
    
    });
    res.json(fp)   
  } catch (error) {
    res.status(404).json('Error ')
  }
  
}

const getProductDetail =async(req,res)=>{

  try {
    const fp=await FarmerProduct.findAll({
      //attributes:['productId'],
   where:{productId:req.params.id},
   include:[{
    model:db.farmer ,
     attributes:['id','fName','lName']
  },{
    model:db.productType ,
     attributes:['id','title','imageUrl'] 
  }
  ],
    //  group:['createdAt'], 
    
    });
    res.json(fp) 
  } catch (error) {
    console.log("Error "+error)
  }
 
}


module.exports={SaveFarmerProduct,getFarmersProducts,getProductDetail}