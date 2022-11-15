const { db } = require("../../config/database");

const WholeSaler = db.wholeSaler;
const Order = db.order;
const ColdRoomProduct = db.coldRoomProduct;
const FarmerProduct = db.farmerProduct;
const ProductType = db.productType;
const Product = db.product;
const OrderItem = db.OrderItem;
const OrderLog = db.OrderLog;
const OrderPaymentLog = db.OrderPaymentLog;
const FarmerBalance = db.FarmerBalance;
const FarmerRent = db.FarmerRent;

const getOrders = async (req, res) => {
  try {

    const coldRoomId=req.user.coldRoomId

    if (!coldRoomId) {
      res.status(404).json('Error ')

    }
    const orders = await Order.findAll({
      where:{coldRoomId:coldRoomId}, 
      attributes: { exclude: ["coldRoomId", "wholeSalerId", "updatedAt"] },
      include: [
        {
          model: WholeSaler,
          attributes: ["fName", "lName"],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json("Error While Fetching  Orders");
  }
};

const getOrder = async (req, res) => {
  try {
    const orders = await Order.findOne({
      where: { id: 45 },
      attributes: { exclude: ["coldRoomId", "wholeSalerId", "updatedAt"] },
      include: [
        { model: WholeSaler, attributes: ["fName", "lName"] },
        { model: OrderItem, include: [{ model: FarmerProduct }] },
      ],
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json("Error While Fetching  Order" + err);
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    // let user=req.user
    let user = { fName: "Alemu", lName: "Tebkew" };

    const orderId = req.params.id;
    let prevStatus;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        prevStatus = order.orderStatus;

        order.orderStatus = req.body.orderStatus;
        order.save();
      
        OrderLog.create({
          changedFrom: prevStatus,
          changedTo: req.body.orderStatus,
          changedBy: user.fName + " " + user.lName,
          orderId: orderId,
        });

        if (order.orderStatus === "completed") {
          console.log('completed1')
         await setFarmerBalance(order);
         console.log('completed2')

        }
        res.json("order status updated");
      } else {
        res.status(404).json("No Order with this id  ");
      }
    } else {
      res.status(404).json("No Order with this id  ");
    }
  } catch (error) {
    res.status(400).json("Error While Updating Order" + error);
  }
};

const setFarmerBalance = async (order) => {

  try {
    let orderItems = await order.getOrderItems();
    console.log('orderItems',orderItems)
    let balanceDatas=[];
    let rentDatas=[];
    for (let i = 0; i < orderItems.length; i++) {
      const orderItem = orderItems[i];

      const balanceData = {
        orderItemId: orderItem.id,
        quantity: orderItem.quantity,
        balanceAmount: orderItem.price * orderItem.quantity,
        state: 0,
        farmerId: 1,
        // farmerId: orderItem.farmerProduct.farmerId,
        farmerProductId: orderItem.farmerProductId,
      };

      const rentData = {
        orderItemId: orderItem.id,
        quantity: orderItem.quantity,
        rentPrice: 0.2,
        rentAmount: orderItem.quantity * 0.2,
        state: "not paid",
        farmerId: 1,
        // farmerId: orderItem.getFarmerProduct().farmerId,
        farmerProductId: orderItem.farmerProductId,
      };

      rentDatas.push(rentData);
      balanceDatas.push(balanceData);
    }
    try {
      const balance = await FarmerBalance.bulkCreate(balanceDatas);
      const rent = await FarmerRent.bulkCreate(rentDatas);

      return "Success"
    } catch (error) {
      throw new Error("Error while updating Farmer Balance" + error);
    }
  } catch (error) {
    throw error
  }
};
const updatePaymentStatus = async (req, res) => {
  try {
    let user = { fName: "Alemu", lName: "Tebkew" };
    // let user=req.user
    const orderId = req.params.id;
    let prevStatus;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      prevStatus = order.paymentStatus;
      if (order) {
        order.paidAmount += Number(req.body.paidAmount);
        order.save();

        if (order.totalPrice === order.paidAmount) {
          order.paymentStatus = "fullyPaid";
          order.save();
        } else if (order.paidAmount < order.totalPrice) {
          order.paymentStatus = "partiallyPaid";
          order.save();
        }

        OrderPaymentLog.create({
          paidAmount: req.body.paidAmount,
          changedBy: user.fName + " " + user.lName,
          orderId: orderId,
        });
        res.json("order status updated");
      }
    }
  } catch (error) {
    res.status(400).json("Error While Updating Order" + error);
  }
};
module.exports = {
  getOrder,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
};
