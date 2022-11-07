const { db } = require("../../config/database");

const FarmerBalance = db.FarmerBalance;
const Farmer = db.farmer;

const getRevenue = async (req, res) => {
  try {

    const coldRoomId=req.user.coldRoomId

    if (!coldRoomId) {
      res.status(404).json('Error ')

    }
    const Revenues = await FarmerBalance.findAll({
      where:{coldRoomId:coldRoomId},

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

    const newRevenues = Revenues.map((farmerBalance) => {
      return {

        farmer: farmerBalance.farmer,
        productSku: farmerBalance.farmerProduct.Product.id,
      //  price: farmerBalance.orderItem.price,
        soldDate: farmerBalance.orderItem.order.createdAt,
        productName: farmerBalance.farmerProduct.Product.name,
        productType: farmerBalance.farmerProduct.ProductType.title,
        addedDate: farmerBalance.farmerProduct.createdAt,
        quantity: farmerBalance.quantity,
        amount: farmerBalance.balanceAmount,
      };
    });
    res.json(newRevenues);
  } catch (error) {
    res.status(400).json("Error While Fetching" + error);
  }
};

module.exports = { getRevenue };
