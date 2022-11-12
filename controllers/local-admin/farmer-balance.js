const { db } = require("../../config/database");

const FarmerBalance = db.FarmerBalance;
const Farmer=db.farmer

const getFarmerBalance = async (req, res) => {
  try {
    const farmerBalances = await FarmerBalance.findAll({
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
   
   let farmer={}
  const newFarmerBalances=  farmerBalances.map((farmerBalance)=>{
          farmer=farmerBalance.farmer

    return { 
      orderCode:farmerBalance.orderItem.order.orderCode,
      price:farmerBalance.orderItem.price,
      orderDate:farmerBalance.orderItem.order.createdAt,
      productName:farmerBalance.farmerProduct?.product.name,
      productType:farmerBalance.farmerProduct?.productType.title,
      quantity:farmerBalance.quantity,
      state:farmerBalance.state,
      balanceAmount:farmerBalance.balanceAmount
     
    }   
  })
    res.json({farmer,farmerBalances:newFarmerBalances}); 
  } catch (error) {
    res.status(400).json('Error While Fetching'+error);

  } 
}; 

module.exports={getFarmerBalance}