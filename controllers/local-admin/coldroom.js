const {db} = require("../../config/database");

const Rent=db.rent
const setColdroomRent = async (req, res) => {
  try {
    const newRent = await Rent.create({
      price: req.body.price,
      coldRoomId: req.body.coldRoomId,
    });
    res.status(200).json(newRent);
  } catch (error) {
    throw error
  }
};
