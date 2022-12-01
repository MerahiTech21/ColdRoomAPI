const { db } = require("../../config/database");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const getData = async (req, res) => {
  try {
    var date = new Date();

    console.log(date.subDays(30));

    const totalProduct = await db.product.count();
    console.log("Pro", totalProduct);

    const totalOrder = await db.order.count({
      where: {
        createdAt: {
          // [Op.gte]: "2022-11-01 02:29:14"
          [Op.gt]: date.subDays(30).toISOString(),
        },
      },
    });
    console.log("o", totalOrder);

    const totalRevenue = await db.FarmerRent.sum("rentAmount", {
      where: {
        createdAt: {
          [Op.gte]: date.subDays(30),
        },
        coldRoomId:req.query.coldRoomId
      },
    });
    console.log("re", totalRevenue);

    res.json({
      totalProduct: totalProduct,
      totalOrder: totalOrder,
      totalRevenue: totalRevenue,
    });
  } catch (err) {
    console.log("Error " + err);
    res.json(err);
  }
};

Date.prototype.subDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};
const bargraphData = async (req, res) => {
  try {
    const year = req.query.year ? req.query.year : new Date().getFullYear();
    const orders = await db.order.count({
      where: {
        createdAt: sequelize.where(
          sequelize.fn("YEAR", sequelize.col("createdAt")),
          year
        ),
      },
      attributes: [
        [sequelize.fn("MONTHNAME", sequelize.col("createdAt")), "month"],
      ],
      group: ["month"],
    });

    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

const pichartData = async (req, res) => {
  try {
    const year = req.query.year ? req.query.year : new Date().getFullYear();

    const orders = await db.OrderItem.findAll({
      limit: 3,
      attributes: [
        [sequelize.fn("sum", sequelize.col("quantity")), "soldQuantity"],
      ],
      where: {
        createdAt: sequelize.where(
          sequelize.fn(
            "YEAR",
            sequelize.col("orderItem.createdAt")
          ),
          year
        ),
      },
      include: [
        {
          model: db.farmerProduct,
          attributes: ['id'],
          include: [{ model: db.product, attributes: ["name"] }],
        //    right:true,
          required: true
        },
        // {
        //  attributes:[]
        // }
      ],
      order: [["soldQuantity", "Desc"]],
      group: [db.Sequelize.col("name", { model: db.product })],


 
    });
         const total= await db.OrderItem.count({
        where: {
            createdAt: sequelize.where(
              sequelize.fn(
                "YEAR",
                sequelize.col("orderItem.createdAt")
              ),
              year
            ),
          }
      })
    res.json({total,sales:orders});
  } catch (error) {
    console.log("Error " + error);
  }
};
module.exports = { getData, bargraphData, pichartData };
