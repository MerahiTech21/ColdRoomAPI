

const {db} = require("../../config/database");
const Op=db.Sequelize.Op

const WholeSaler=db.wholeSaler
const Order =db.order

const getWholeSalers = async (req, res) => {
  try {
    // const coldRoomId=req.user.coldRoomId

    // if (!coldRoomId) {
    //   res.status(404).json('Error ')

    // }
    const search=req.query.search

    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;

    const wSalers = await WholeSaler.findAll({
      where:searchCondition,

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
    throw error
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