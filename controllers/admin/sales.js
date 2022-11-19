const { db } = require("../../config/database");
const {getPagination,getPagingData}=require('./pagination/getPagination')
const Op=db.Sequelize.Op

const WholeSaler = db.wholeSaler;
const Order = db.order;


const getSales = async (req, res) => {
  try {

    const {page,perPage,search,coldRoomId,date}=req.query 
    const {limit,offset}=getPagination(page,perPage)
    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;
    var filterByColdRoom= coldRoomId ? {coldRoomId:coldRoomId} : null
    var filterByDate= date ? {createdAt:{[Op.lte]:date}} : null
     var filterByStatus={orderStatus:'completed'}
    const sales = await Order.findAndCountAll({
      attributes: { exclude: ["coldRoomId", "wholeSalerId", "updatedAt"] },
      limit:limit,
      offset:offset,
      
        where:{...filterByColdRoom,...filterByDate,...filterByStatus},
      include: [
        {
          model: WholeSaler,
          attributes: ["fName", "lName"],
          where:searchCondition
        },{
          model: db.coldRoom,
          as:'coldRoom',
           attributes: ["id","name"],
          // include:[{model:Address,as:'address'}]
        }
      ],
      order:[['createdAt','Desc']]
    });

    const paginated=getPagingData(sales,page,limit,'sales')
    res.status(200).json(paginated);
  } catch (err) {
    res.status(400).json("Error While Fetching  Sales "+err);
  }
};


module.exports={getSales}