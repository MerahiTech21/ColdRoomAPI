
const Product = db.product;
const ProductType = db.productType;

const update = (req, res) => {
    try {
      const fproduct = Product.findByPk(req.params.id);
      if (req.file) {
        deleteImage('image/')
      }
      if (fproduct) {
        fproduct.name = req.body.name;
        fproduct.imageUrl = req.file.filename;
        fproduct.save();
      }
    } catch (error) {}
  };
  
  const destroy = async (req, res) => {
    try {
      /*
       * checked if possible to delete
       * remove the product image from the file
       * destroy product
       */
      const fproduct = FarmerProduct.findOne({
        where: { productId: req.params.id },
      });
      if (fproduct) {
        res.status(403).json("Not Possible to delete");
      } else {
        deleteImage("images/");
        Product.destry(req.params.id);
        res.json("deleted successfully");
      }
    } catch (error) {
      res.json("Error while Deleting " + error);
    }
  };
  