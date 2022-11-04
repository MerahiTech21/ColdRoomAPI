const { db } = require("../../config/database");

const FarmerBalance = db.FarmerBalance;
const Farmer=db.farmer

const getFarmerBalance = async (req, res) => {
  try {
    const farmerB = await FarmerBalance.findOne({
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
      price:farmerB.orderItem.price,
      orderDate:farmerB.orderItem.order.createdAt,
      productName:farmerB.farmerProduct.Product.name,
      productType:farmerB.farmerProduct.ProductType.title,
      quantity:farmerB.quantity,
      state:farmerB.state,
      balanceAmount:farmerB.balanceAmount
     
    }
    res.json(formatedData); 
  } catch (error) {
    res.status(400).json('Error While Fetching'+error);

  } 
}; 

module.exports={getFarmerBalance}