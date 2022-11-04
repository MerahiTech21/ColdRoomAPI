const { db } = require("../../config/database");
const ColdRoomProduct = db.coldRoomProduct;

const ColdRoomProducts = async (req, res) => {
  let cRoomId = req.params.id;
  const cRoom = db.coldRoom.findByPk(cRoomId, { include: db.product });
  let cRoomPrice = cRoom.getRent().price;
  const products = cRoom.products;

  products.map((product) => {
    return {
      name: product.name,
      imageUrl: product.imageUrl,
      productSalePrice: product.ColdRoomProduct.price,
      productRentFee: cRoomPrice,
    };
  });
};

const setProductTypePrice = async (req, res) => {
  try {
    const cRoomPrice = ColdRoomProduct.create({
      productTypeId: req.body.productTypeId,
      coldRoomId: req.body.coldRoomId,
    });
    res.status(201).json('successfully updated')
  } catch (error) {}
};
