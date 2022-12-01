const { db } = require("../../config/database");
const Op=db.Sequelize.Op
const {getPagination,getPagingData}=require('./pagination/getPagination')
const FarmerBalance = db.FarmerBalance;
const Farmer = db.farmer;

const getRevenue = async (req, res) => {
  try {

    const {page,perPage,search,coldRoomId,date}=req.query 
    const {limit,offset}=getPagination(page,perPage)
    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;
    var filterByColdRoom= coldRoomId ? {coldRoomId:coldRoomId} : null
    var filterByDate= date ? {createdAt:{[Op.gte]:date}} : null
 
    const Revenues = await FarmerBalance.findAndCountAll({
      // limit:limit, 
      // offset:offset,
       where:{...filterByColdRoom,...filterByDate},
       
      include: [
        {
          model: Farmer,
          attributes: ["fName", "lName"],
          where:searchCondition
        },
        {
          model: db.OrderItem,
          include: db.order,
          // attributes:['title','imageUrl']
        },{
          model: db.coldRoom,
          as:'coldRoom',
           attributes: ["id","name"],
          // include:[{model:Address,as:'address'}]
        },
        {
          model: db.farmerProduct,
          include: [db.product, db.productType],
          // attributes:['title','imageUrl']
        },
      ],
    });

    const paginated=getPagingData(Revenues,page,limit)

    const newRevenues = Revenues.rows.map((farmerBalance) => {
      return {

        farmer: farmerBalance.farmer,
        coldRoom: farmerBalance.coldRoom,
        productSku: farmerBalance.farmerProduct?.product.id,
      //  price: farmerBalance.orderItem.price,
        soldDate: farmerBalance.orderItem?.order.createdAt,
        productName: farmerBalance.farmerProduct?.product.name,
        productType: farmerBalance.farmerProduct?.productType.title,
        addedDate: farmerBalance.farmerProduct?.createdAt,
        quantity: farmerBalance.quantity,
        amount: farmerBalance.balanceAmount,
      };
    });
    res.json({...paginated,data_name:newRevenues});
  } catch (error) {
    res.status(400).json("Error While Fetching" + error);
  }
};

module.exports = { getRevenue };
