const { Op } = require("sequelize");
const { db } = require("../../config/database");

const FarmerBalance = db.FarmerBalance;
const Farmer=db.farmer

const getFarmerBalance = async (req, res) => {
  try {

    const date=req.query.date
    var filterByDate = date ? { createdAt: { [Op.gte]: date } } : null;

    const farmerBalances = await FarmerBalance.findAll({
      where: { farmerId: req.params.id,...filterByDate },
      include:[{
        model:Farmer ,
         attributes:['fName','lName'],
        
      },{
        model:db.OrderItem ,
        include:db.order
        // attributes:['title','imageUrl'] 
      },{
        model:db.farmerProduct ,
        include:[db.product,db.productType]
        // attributes:['title','imageUrl'] 
      }
    ],
    order:[['createdAt','DESC']]
    });
   
   let farmer=await Farmer.findByPk(req.params.id)
  const newFarmerBalances=  farmerBalances.map((farmerBalance)=>{

    return { 
      orderCode:farmerBalance.orderItem.order.orderCode,
      price:farmerBalance.orderItem.price,
      orderDate:farmerBalance.orderItem.order.createdAt,
      productName:farmerBalance.farmerProduct?.product.name,
      productType:farmerBalance.farmerProduct?.productType.title,
      quantity:farmerBalance.quantity,
      state:farmerBalance.state,
      balanceAmount:farmerBalance.balanceAmount,
      rentAmount:farmerBalance.rentAmount,
      rentPrice:farmerBalance.rentPrice
     
    }   
  })
    res.json({farmer,farmerBalances:newFarmerBalances}); 
  } catch (error) {
    res.status(400).json('Error While Fetching'+error);

  } 
}; 

const withdrawBalance=async(req,res)=>{
 try {
  
  const farmerId=req.params.id
  const orderCode=req.body.orderCode
  if(!farmerId || !orderCode){
   return res.status(400).json('Error Order code Required')
  }

  const order= await db.order.findOne({where:{orderCode:orderCode},include:{model:db.OrderItem}})
  if(!order){
    return res.status(400).json('Order with this code Doesn\'t exist' )

  }

  for (const item of order.orderItems) {
    await FarmerBalance.update({state:1},{where:{orderItemId:item.id,farmerId:farmerId}})
  }
  return res.status(200).json('successfully withdrawn')
 } catch (error) {
  res.status(400).json('Error while Withrawn')
 }
}
module.exports={getFarmerBalance,withdrawBalance}