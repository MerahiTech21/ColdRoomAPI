
const ColdRoomProducts = async (req, res) => {
    let cRoomId = req.params.id;
    const cRoom = db.coldRoom.findByPk(cRoomId, { include: product });
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
  
const setProductTypePrice=(req,res)=>{

}