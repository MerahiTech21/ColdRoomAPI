const { db } = require("../../config/database.js");
const deleteImage = require("../../util/delete-image-file");

const Product = db.product;
const ProductType = db.productType;

const create = async(req, res) => {
  try {

    const productType ={}
    var imageUrl = null;
    if (req.files[0]) {
      imageUrl = req.files[0].filename;
    }
    console.log('img',imageUrl)
    productType.productId = req.body.id;
    productType.imageUrl = imageUrl;
    productType.title = req.body.title;
    productType.description = req.body.description;
     const newPT=await  ProductType.create(productType);
    res.json(newPT)
    
  } catch (error) { 
    console.log(error)
    res.status(400).json(''+error);
  }
};

const update = async(req, res) => {
  try {
    const productType = await ProductType.findByPk(req.params.id);
    var imageUrl = null;
    if (req.files[0]) {
      console.log('here')
      imageUrl = req.files[0].filename;
    }
    if (productType) {
      if (imageUrl) {
        deleteImage("images/" + productType.getDataValue('imageUrl'));
        productType.imageUrl = imageUrl;
      }
      productType.title = req.body.title;
      productType.description = req.body.description;
        await productType.save();
      res.json(productType)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json('Error '+error);
  }
};

const destroy = async (req, res) => {
  try {
    /*
     * checked if possible to delete
     * remove the product image from the file
     * destroy product
     */
    const fproduct = await db.farmerProduct.findOne({
      where: { productId: req.params.id },
    });
    if (fproduct) {
      res.status(403).json("Not Possible to delete");
      return
    } else {
      const productType = await ProductType.findByPk(req.params.id);

      if(productType){
        deleteImage("images/" + productType.getDataValue('imageUrl'));
        const coldroomP=await db.coldRoomProduct.findOne({where:{productTypeId:productType.id}})
        if (coldroomP) {
                  await coldroomP.destroy();

        }
        await productType.destroy();
      res.json("deleted successfully");
      }else{
        res.status('404').json("resource not found");

      }
    
    }
  } catch (error) {
    res.status(400).json("Error while Deleting " + error);
  }
};
  
module.exports = {
  create,
  update,
  destroy
};