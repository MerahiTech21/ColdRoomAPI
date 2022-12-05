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

    const totalRevenue = await db.FarmerBalance.sum("rentAmount", {
      where: {
        createdAt: {
          [Op.gte]: date.subDays(30),
        },
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
        orderStatus:'completed'
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
      // limit:2 ,
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
        {
          model: db.order,
          attributes: [],
           where:{
             orderStatus:'completed'

            //  orderStatus:'completed'
             },
        //    right:true,
          // required: true
        },
  
   
      ],
      order: [["soldQuantity", "Desc"]],
      group: [db.Sequelize.col("name", { model: db.product })],


 
    });
         const total= await db.OrderItem.sum('quantity',{
        where: {
            createdAt: sequelize.where(
              sequelize.fn(
                "YEAR",
                sequelize.col("orderItem.createdAt")
              ),
              year
            ),
          } ,
          include: {
            model: db.order,
            where: {
              orderStatus:'completed',
            },
            required: true,
    
          },
      })
    res.json({total:total?total:0,sales:orders});
  } catch (error) {
    console.log("Error " + error);
  }
};
module.exports = { getData, bargraphData, pichartData };
