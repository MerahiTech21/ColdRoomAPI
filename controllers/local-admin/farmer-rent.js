const { db } = require("../../config/database");

const FarmerRent = db.FarmerRent;
const Farmer=db.farmer

const getFarmerRent = async (req, res) => {
  try {
    const farmerB = await FarmerRent.findOne({
      where: { farmerId: req.params.id },
      include:[{
        model:Farmer ,
         attributes:['fName','lName']
      },{
        model:db.OrderItem ,
        include:db.order
        // attributes:['title','imageUrl'] 
      },{
        model:db.farmerProduct ,
        include:[db.product,db.productType]
        // attributes:['title','imageUrl'] 
      }
    ]
    });
   
    const formatedData={ 
      farmer:farmerB.farmer,
      orderCode:farmerB.orderItem.order.orderCode,
      rentPrice:farmerB.rentPrice,
      orderDate:farmerB.orderItem.order.createdAt,
      productName:farmerB.farmerProduct.Product.name,
      productType:farmerB.farmerProduct.ProductType.title,
      quantity:farmerB.quantity,
      state:farmerB.state,
      rentAmount:farmerB.rentAmount
     
    }
    res.json(formatedData); 
  } catch (error) {
    res.status(400).json('Error While Fetching'+error);

  } 
}; 

module.exports={getFarmerRent}