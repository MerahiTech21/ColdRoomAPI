const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmerProduct =db.farmerProduct;
const {AddFarmer} = require("./farmer");
const { fn } = require("sequelize");
const coldRoomProduct = db.coldRoomProduct;

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
    warehousePosition: req.body.warehousePosition, 
  };

  const fp=await farmerProduct.create(dataToSave);
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
    const coldRoomId=req.user.coldRoomId

    if (!coldRoomId) {
      res.status(404).json('Error ')

    }
    const fp=await farmerProduct.findAll({
      where:{coldRoomId:coldRoomId},
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
    const fp=await farmerProduct.findAll({
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


module.exports={SaveFarmerProduct,getFarmersProducts,getProductDetail}