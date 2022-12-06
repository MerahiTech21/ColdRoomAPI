const { json } = require("sequelize");
const { db } = require("../../config/database");
const product = require("../../models/product");

const WholeSaler = db.wholeSaler;
const Order = db.order;
const ColdRoomProduct = db.coldRoomProduct;
const FarmerProduct = db.farmerProduct;
const ProductType = db.productType;
const Product = db.product;
const OrderItem = db.OrderItem;
const OrderLog= db.OrderLog;
//const Order=db.order
// function for creating order of wholesaler
const placeOrder = async (req, res) => {
  try {
    const orderData = {
      wholeSalerId: req.body.wholeSalerId,
      paymentStatus: "unpaid",
      coldRoomId: req.body.coldRoomId,
      orderStatus: "pending",
      paidAmount: 0,
      orderCode:Math.floor(Math.random()*10000 +10000)
    };

    const orderItems = req.body.orderItems;

    //get total price of total order Item for Order Table
    let totalPrice = 0;

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      try {
        let crProduct = await ColdRoomProduct.findOne({
          where: {
            productTypeId: item.productTypeId,
            coldRoomId: req.body.coldRoomId,
          },
        });
        totalPrice = totalPrice + (item.quantity * Number(crProduct?.price));
      } catch (error) {
        console.log("Error1 ", error);
      }
    }

    console.log("totalPrice", totalPrice);

    orderData.totalPrice = totalPrice;
 
    let fitsToSave = [];

    // //iterating over all items
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];

      //get price of single item for OrderItem table
      const crProduct = await ColdRoomProduct.findOne({
        where: {
          productTypeId: item.productTypeId,
          coldRoomId: req.body.coldRoomId,
        },
          include:[{model:ProductType,include:Product}]
      });

      const coldRoomProductPrice = crProduct?.price;

      //get quantity of item in the cold room
      const totalCurrentQuantity = await FarmerProduct.sum("currentQuantity", {
        where: {
          productTypeId: item.productTypeId,
          coldRoomId: req.body.coldRoomId,
        },
      });
       console.log('totalCurrentQuantity=',totalCurrentQuantity)
      if (Number(totalCurrentQuantity) < item.quantity) {
        res.status(400).json("Opps No Enougn amount of "); //+crProduct.producType.name+' of '+crProduct.producType.product.name)
        console.log('Message ',"Ohh! No Enough Product")
        return;
      }

      let farmerProducts
      try {
              farmerProducts =await FarmerProduct.findAll({
        where: {
          productTypeId: item.productTypeId,
          coldRoomId: req.body.coldRoomId,
        },
        order: [["createdAt", "ASC"]],
      });

      } catch (error) {
        
      }
 

       let finished = 0;
      let requiredQuantity = item.quantity;

      for (let i = 0; i < farmerProducts.length; i++) {
        const productItem = farmerProducts[i];
        let fitToSave

        if (productItem.currentQuantity*1 === 0) {
            continue
        } 
        if (requiredQuantity <= 0  || finished === 1) {
            break
        }

        if (
          (requiredQuantity > 0) &&
          (productItem.currentQuantity >= requiredQuantity) &&
          finished === 0
        ) {
          fitToSave = {
            quantity: requiredQuantity,
            // orderId: newOrder.id,
            farmerProductId: productItem.id,
            price: coldRoomProductPrice,
          };
 
          fitsToSave.push(fitToSave);
          //update the Quantity
        const update= await  FarmerProduct.update({
            'currentQuantity':  productItem.currentQuantity - requiredQuantity,
            'soldQuantity': productItem.soldQuantity*1 + requiredQuantity*1
        },{where:{id:productItem.id}})
        console.log('Quantity Updated',update)

        finished = 1;
        requiredQuantity = 0; 
        console.log('fitToSave1',fitToSave)

    
        break;
          //return
        } else if (!finished && (productItem.currentQuantity > 0) && (requiredQuantity > 0)) {
          fitToSave = {
            quantity: productItem.currentQuantity,
            // orderId: newOrder.id,
            farmerProductId: 11,
            price: coldRoomProductPrice,
          };
          //updating /decreasing product quantity
          const remainingRequired=requiredQuantity - productItem.currentQuantity
          const update= await  FarmerProduct.update({
            // 'currentQuantity':  productItem.currentQuantity - requiredQuantity,
            'currentQuantity':  0,
            'soldQuantity': productItem.soldQuantity + requiredQuantity
        },{where:{id:productItem.id}})
        console.log('Quantity Updated',update)

          console.log('fitToSave',fitToSave)
          requiredQuantity = remainingRequired;

          fitsToSave.push(fitToSave);
        }
      }
    }
  
    try {    
           //creating order and order Item
         const newOrder = await Order.create(orderData);
         const newfitsToSave=fitsToSave.map((item)=>{
              return{
               
                 orderId: newOrder.id,
                 ...item
              }
           })
         const newOrderItems= await OrderItem.bulkCreate(newfitsToSave);

         res.status(201).json({newOrder,newOrderItems});
    } catch (error) {
        console.log("Error In Creating Order Table", error);
        res.status(400).json('Error While Placing Your Order '+error)
       }

 } catch (error) {
    console.log("block error", error);
    res.status(500).json('Internal Server Error '+error)
  }
};

const orderHistory=async(req,res)=>{
  try{
     let orderHistories= await Order.findAll({
       where:{wholeSalerId:req.params.id},
       include:[{
         model: OrderItem,
         include:[{
           model:FarmerProduct,
           include:[{
             model:Product,
           },
          {
            model:ProductType,
          }]
          }]
       }],
       order:[['createdAt','DESC']]
     });
     const allHistory=[];
     for(let orderHistory of orderHistories){
       let order={};
       order.id=orderHistory.id;
       order.orderCode=orderHistory.orderCode;
       order.orderStatus=orderHistory.orderStatus;
       order.paymentStatus=orderHistory.paymentStatus;
       order.paidAmount=orderHistory.paidAmount;
       order.totalPrice=orderHistory.totalPrice;
       order.orderDate=orderHistory.createdAt;
       let allItem=[];
       for(let orderItem of orderHistory.orderItems){
        let item={};
        item.id=orderItem.id;
        item.quantity=orderItem.quantity;
        item.price=orderItem.price;
        item.name=orderItem.farmerProduct.product.name;
        item.type=orderItem.farmerProduct.productType.title;

        /**
         * edited by Alemu start
         */
        item.typeId=orderItem.farmerProduct.productType.id;
        
        const index=allItem.findIndex((existed) => {
          return existed.typeId ===  orderItem.farmerProduct.productType.id
        })

        if(index !== -1){
          const changedItem={...allItem[index]}
         allItem[index]={
          ...changedItem,
          quantity:changedItem.quantity*1 + orderItem.quantity*1,

        }
        }else{
            allItem.push(item);
       }
      
      /**
       * end of editing
       */
       }
       order.orderitems=allItem;
       allHistory.push(order);
       //res.json(allHistory);
     }
     res.json(allHistory);
    
     }      
  
  catch(err){
    res.json(err);
  }
}
const changeOrderStatus=async(req,res)=>{
  let order=await Order.findOne({where:{id:req.params.id}});

  // added by Alemu
   const prevStatus=order.orderStatus
  if (prevStatus === "completed" || prevStatus === "cancelled") {
    res.status(403).json("Impossible to Change Completed or Cancelled Order");
    return;
  }
  order.orderStatus="cancelled";
   await order.save();
   cancelOrder(order)
  res.json(order);
}

/**
 *  this function added by Alemu
 */
const cancelOrder = async (order) => {
  try {
    let orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: { model: FarmerProduct },
    });

    for (let i = 0; i < orderItems.length; i++) {
      const orderItem = orderItems[i];

      const farmerProduct = await FarmerProduct.findByPk(
        orderItem.farmerProductId
      );
      farmerProduct.soldQuantity -= orderItem.quantity;
      farmerProduct.currentQuantity += orderItem.quantity * 1;
      await farmerProduct.save();
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
   placeOrder,
   orderHistory,
   changeOrderStatus
  };
  
