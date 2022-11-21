const { db } = require("../../config/database");
const Op=db.Sequelize.Op

const Farmer = db.farmer;
const Address = db.address;
const FarmerBalance=db.FarmerBalance
const FarmerRent= db.FarmerRent
const FarmerProduct=db.farmerProduct
const ProductType=db.productType
const getFarmers=async(req,res)=>{
 
  try {
    const search=req.query.search

    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;

  const farmers=await Farmer.findAll({
    where:searchCondition,

    include:[
      {
        model:FarmerBalance,
 
      },
      {
        model:FarmerRent,
 
      }, {
        model:Address,
        as:'address'

      }, {
        model:FarmerProduct,

        
      }
    ],       
    //  group:['farmer.id','farmerBalances.farmerId','farmerRents.farmerId'],
      // raw:true

  })
  //console.log('far',farmers)

  const arrangedFarmers=farmers.map((farmer)=>{

    return {
          id:farmer.id,
          fullName:farmer.fName+ ' '+farmer.lName,
          location:farmer.address.woreda,
          totalProduct:farmer.farmerProducts.reduce((total,product)=>{
            return total+product.oldQuantity
          },0),
          totalBalance:farmer.farmerBalances.reduce((sum,balance)=>{
             return sum+balance.balanceAmount
          },0.0),
          totalRent:farmer.farmerRents.reduce((sum,rent)=>{
            return sum+rent.rentAmount
         },0.0),
    }
  })
   res.json(arrangedFarmers)

  } catch (error) {
   res.json(''+error) 
  }
}


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


const getFarmerProducts = async (req, res) => {
  try {
    const fp = await FarmerProduct.findAll({
      where: { farmerId: req.params.id },
      //  attributes:['productId'],
      include: [
        {
          model: db.farmer,
          attributes: ["fName", "lName"],
        },
        {
          model: db.productType,
          attributes: ["title", "imageUrl"],
          include: [{ model: db.product, attributes: ["name"] }],
        },    {
          model: db.coldRoom,
          attributes: ["name"],
        },
      ],
      //  group:['createdAt'],
    });
    res.json(fp);
  } catch (error) {
    res.json(error);
  }
};


const getFarmerRent = async (req, res) => {
  try {
    const farmerRents = await FarmerRent.findAll({
      where: { farmerId: req.params.id },
      include: [
        {
          model: Farmer,
          attributes: ["fName", "lName"],
        },
        {
          model: db.OrderItem,
          include: db.order,
          // attributes:['title','imageUrl']
        },
        {
          model: db.farmerProduct,
          include: [db.product, db.productType],
          // attributes:['title','imageUrl']
        },
      ],
    });

    let farmer = {};
    const newfarmerRents = farmerRents.map((farmerRent) => {
      farmer = farmerRent.farmer;

      return {
        orderCode: farmerRent.orderItem.order.orderCode,
        rentPrice: farmerRent.rentPrice,
        orderDate: farmerRent.orderItem.order.createdAt,
        productName: farmerRent.farmerProduct?.product.name,
        productType: farmerRent.farmerProduct?.productType.title,
        quantity: farmerRent.quantity,
        state: farmerRent.state,
        rentAmount: farmerRent.rentAmount,
      };
    });
    res.json({farmer,farmerRents:newfarmerRents});
  } catch (error) {
    res.status(400).json("Error While Fetching" + error);
  }
};



module.exports={getFarmers,getFarmerBalance,getFarmerProducts,getFarmerRent}