

const {db} = require("../../config/database");

const WholeSaler=db.wholeSaler
const Order =db.order
const getWholeSalers = async (req, res) => {
  try {
    const wSalers = await WholeSaler.findAll({

        include:[
            {
                model:Order,
               // attributes:[]
            }
        ] 
    }) 
    res.status(200).json(newRent);
  } catch (error) {
    throw error
  }
};
