

const {db} = require("../../config/database");
const Op=db.Sequelize.Op

const WholeSaler=db.wholeSaler
const Order =db.order

const getWholeSalers = async (req, res) => {
  try {
 
    const search=req.query.search

    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;

    const wSalers = await WholeSaler.findAll({
      where:searchCondition,
      attributes: { exclude: ["password"] },

        include:[
            {
                model:db.address,
                as:'address'
                // where:{coldRoomId:coldRoomId},
               // attributes:[]
            }
        ] 
    }) 
    res.status(200).json(wSalers);
  } catch (error) {
    res.status(400).json(error)
  }
};

const getWholeSalerOrders = async (req, res) => {
  try {
    const wSaler = await WholeSaler.findOne({

         where:{id:req.params.id},
        include:[
            {
                model:Order,
                  include:{
                  model: db.coldRoom,
                  as:'coldRoom',
                   attributes: ["id","name"],
                  // include:[{model:Address,as:'address'}]
                },
               // attributes:[]
            }
        ] 
    }) 
    res.status(200).json(wSaler);
  } catch (error) {
    throw error
  }
};

module.exports={getWholeSalers,getWholeSalerOrders}