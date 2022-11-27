const { db } = require("../../config/database");

const WholeSaler = db.wholeSaler;
const Order = db.order;
const ColdRoomProduct = db.coldRoomProduct;
const FarmerProduct = db.farmerProduct;
const ProductType = db.productType;
const Product = db.product;
const OrderItem = db.OrderItem;

// function for creating order of wholesaler
const placeOrder = async (req, res) => {
  try {
    const orderData = {
      wholeSalerId: req.body.wholeSalerId,
      paymentStatus: "Unpaid",
      coldRoomId: req.body.coldRoomId,
      orderStatus: "pending",
      paidAmount: 0,
      orderCode:Math.floor(Math.random()*1000 +100)
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

        if (productItem.currentQuantity == 0) {
            continue
        } 
        if (requiredQuantity <= 0  || finished == 1) {
            break
        }

        if (
          requiredQuantity > 0 &&
          productItem.currentQuantity >= requiredQuantity &&
          finished === 0
        ) {
          fitToSave = {
            quantity: requiredQuantity,
            // orderId: newOrder.id,
            farmerProductId: productItem.farmerId,
            price: coldRoomProductPrice,
          };
 
          fitsToSave.push(fitToSave);
          //update the Quantity
        const update= await  FarmerProduct.update({
            'currentQuantity':  productItem.currentQuantity - requiredQuantity,
            'soldQuantity': productItem.soldQuantity + requiredQuantity
        },{where:{id:productItem.id}})
        console.log('Quantity Updated',update)

        finished = 1;
        requiredQuantity = 0; 
        console.log('fitToSave1',fitToSave)

    
        break;
          //return
        } else if (!finished && productItem.currentQuantity > 0 && requiredQuantity > 0) {
          fitToSave = {
            quantity: productItem.currentQuantity,
            // orderId: newOrder.id,
            farmerProductId: productItem.farmerId,
            price: coldRoomProductPrice,
          };
          //updating /decreasing product quantity
          const update= await  FarmerProduct.update({
            'currentQuantity':  productItem.currentQuantity - requiredQuantity,
            'soldQuantity': productItem.soldQuantity + requiredQuantity
        },{where:{id:productItem.id}})
        console.log('Quantity Updated',update)

          console.log('fitToSave',fitToSave)
          requiredQuantity -= productItem.currentQuantity;

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
        res.status(400).json('Error While Placing Your Order')
       }

 } catch (error) {
    console.log("block error", error);
    res.status(500).json('Internal Server Error '+error)
  }
};


module.exports = { placeOrder };
