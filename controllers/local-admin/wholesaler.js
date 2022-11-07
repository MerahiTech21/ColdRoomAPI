

const {db} = require("../../config/database");

const WholeSaler=db.wholeSaler
const Order =db.order
const getWholeSalers = async (req, res) => {
  try {
    const coldRoomId=req.user.coldRoomId

    if (!coldRoomId) {
      res.status(404).json('Error ')

    }
    const wSalers = await WholeSaler.findAll({

        include:[
            {
                model:Order,
                where:{coldRoomId:coldRoomId},
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
               // attributes:[]
            }
        ] 
    }) 
    res.status(200).json(wSaler);
  } catch (error) {
    throw error
  }
};

