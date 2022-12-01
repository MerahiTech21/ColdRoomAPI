const { Op } = require("sequelize");
const { db } = require("../../config/database");
const { getPagination, getPagingData } = require("../admin/pagination/getPagination");

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
const ColdRoom = db.coldRoom;

const getOrders = async (req, res) => {
  try {
    const { page, perPage, search, coldRoomId, date,status } = req.query;
    const { limit, offset } = getPagination(page, perPage);
    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;

    var filterByColdRoom = coldRoomId ? { coldRoomId: coldRoomId } : null;
    var filterByDate = date ? {createdAt: { [Op.gte]: date }  } :null
    // var filterByStatus= status ? {[Op.or]:[{orderStatus:status} ,{orderStatus:status}]}:null
    var filterByStatus = status ? { [Op.or]:[{orderStatus:status} ,{paymentStatus:status} ]} : null;

 
    const orders = await Order.findAndCountAll({
          where:{
            ...filterByStatus,...filterByColdRoom,...filterByDate
          }
          ,
         
      // limit: limit,
      // offset: offset,
      attributes: { exclude: [ "wholeSalerId", "updatedAt"] },
      include: [ 
        {
          model: WholeSaler,
          attributes: ["fName", "lName"],
          where:searchCondition
        },
        {
          model: ColdRoom,
          as: "coldRoom",
          attributes: ["id", "name"],
          where:{
            id:req.query.coldRoomId
          },
          required:true
          // include:[{model:Address,as:'address'}]
        },        {
          model: OrderLog,
    
        },        {
          model: OrderPaymentLog,
      
        },
      ],
    });

    const paginated=getPagingData(orders,page,limit)
    res.status(200).json(paginated);
  } catch (err) {
    res.status(400).json("Error While Fetching  Orders" + err);
  }
}

const getOrder = async (req, res) => {
  try {
    const orders = await Order.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["coldRoomId", "wholeSalerId", "updatedAt"] },
      include: [
        { model: WholeSaler, attributes: ["fName", "lName"] },
        { model: OrderItem, 
          include: [
            { 
              model: FarmerProduct,
              include:[Product,ProductType] }] },
      ],
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json("Error While Fetching  Order" + err);
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    //  let user=req.user

    let user = await db.employee.findByPk(req.body.changedBy);

    const orderId = req.params.id;
    let prevStatus;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        prevStatus = order.orderStatus;
         if (prevStatus === 'completed') {
          res.status(403).json('Impossible to Change Completed Order')
          return
         }
        order.orderStatus = req.body.orderStatus;
         await order.save();
      
       const orderLog= await OrderLog.create({
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
        res.json(orderLog);
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
    let orderItems = await OrderItem.findAll({where:{orderId:order.id},include:{model:FarmerProduct}})
    const rent=await db.rent.findOne({where:{coldRoomId:order.coldRoomId}})

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
        farmerId: orderItem.farmerProduct.farmerId,
         coldRoomId: order.coldRoomId,
        farmerProductId: orderItem.farmerProductId,
      };

      const rentData = {
        orderItemId: orderItem.id,
        quantity: orderItem.quantity,
        rentPrice: rent ? rent.price : 10,
        rentAmount: orderItem.quantity * rent.price,
        state: 0,
        farmerId: orderItem.farmerProduct.farmerId,
        coldRoomId: order.coldRoomId,
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
    let user = await db.employee.findByPk(req.body.changedBy);
    // let user=req.user
    const orderId = req.params.id;
    let prevStatus;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      prevStatus = order.paymentStatus;


      if (order) {
        
      if(order.paidAmount*1 + Number(req.body.amount) > order.totalPrice ){
             return res.status(403).json('Don\'t Enter Greater Than total Price')

      }
        order.paidAmount += Number(req.body.amount);
        await order.save();
        if (order.totalPrice*1 === order.paidAmount*1) {
          order.paymentStatus = "paid";
          await order.save();
        } else if (order.paidAmount*1 < order.totalPrice*1) {
          order.paymentStatus = "partiallyPaid";
          await order.save();
        }

        const paymentLog=await OrderPaymentLog.create({
          paidAmount: req.body.amount,
          changedBy: user.fName + " " + user.lName,
          orderId: orderId,
        });
        res.json({paymentLog,paymentStatus:order.paymentStatus});
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
