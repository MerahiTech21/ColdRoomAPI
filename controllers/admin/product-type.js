const { db } = require("../../config/database.js");

const Product = db.product;
const ProductType = db.productType;

const create = async(req, res) => {
  try {
    const productType = new ProductType()
    var imageUrl = null;
    if (req.file) {
      imageUrl = req.file.filename;
    }

      productType.title = req.body.title;
      productType.description = req.body.description;
      productType.save();
      res.json(productType)
    
  } catch (error) { 
    res.json(error);
  }
};

const update = async(req, res) => {
  try {
    const productType = await ProductType.findByPk(req.params.id);
    var imageUrl = null;
    if (req.file) {
      imageUrl = req.file.filename;
    }
    if (productType) {
      if (imageUrl) {
        deleteImage("images/" + productType.imageUrl);
        productType.imageUrl = req.file.filename;
      }
      productType.title = req.body.title;
      productType.description = req.body.description;
      productType.save();
      res.json(productType)
    }
  } catch (error) {
    res.json(error);
  }
};

const destroy = async (req, res) => {
  try {
    /*
     * checked if possible to delete
     * remove the product image from the file
     * destroy product
     */
    const fproduct = await FarmerProduct.findOne({
      where: { productId: req.params.id },
    });
    if (fproduct) {
      res.status(403).json("Not Possible to delete");
      return
    } else {
      const productType = await ProductType.findByPk(req.params.id);

      deleteImage("images/" + productType.imageUrl);
      await ProductType.destry(req.params.id);
      res.json("deleted successfully");
    }
  } catch (error) {
    res.json("Error while Deleting " + error);
  }
};
  
module.exports = {
  create,
  update,
  destroy
};