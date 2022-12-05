const { db } = require("../config/database");

const FarmerRent = db.FarmerRent;
const Farmer = db.farmer;

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
        productName: farmerRent.farmerProduct.product.name,
        productType: farmerRent.farmerProduct.productType.title,
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

module.exports = { getFarmerRent };
