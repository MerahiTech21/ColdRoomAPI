const { db } = require("../../config/database.js");
const deleteImage = require("../../util/delete-image-file");
const FarmerProduct = db.farmerProduct;

const Product = db.product;
const ProductType = db.productType;
//add product
const create = async (req, res) => {
  const productImage = req.files.filter((file) => {
    return file.fieldname === "product_image";
  });

  const typeImage = req.files.filter((file) => {
    return file.fieldname !== "product_image";
  });

  let productInfo = {
    name: req.body.name,
    imageUrl: productImage[0].filename,
  };

  try {
    let newProduct = await Product.create(productInfo);
    let types = [];
    if (newProduct) {
      for (let i = 0; i < typeImage.length; i++) {
        const type = {
          title: req.body["title" + i],
          description: req.body["description" + i],
          imageUrl: `${typeImage[i].filename}`,
          productId: newProduct.id,
        };

        types.push(type);
      }
    }

    const pType = await ProductType.bulkCreate(types);

    res.status(200).json({ newProduct, pType });
  } catch (err) {
    console.log("err");
    res.status(400).json("Error" + err);
  }
};

const getAll = async (req, res) => {
  try {

    const search=req.query.search 
    const products = await Product.findAll({
      where:search,
      include: [
        {
          model: FarmerProduct,
        },
      ],
    });

    const manipulatedProducts = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        totalProduct: product.farmerProducts.reduce((total, fproduct) => {
          return total + fproduct.currentQuantity;
        }, 0),
      };
    });
    res.json(manipulatedProducts);
  } catch (error) {
    res.status(404).json("Error " + error);
  }
};

const getProductType=async (req,res)=>{

  try {

    const productTypes = await ProductType.findAll({
      where:{productId:req.params.id},
      include: [
        {
          model: FarmerProduct,
        },
      ],
    });

    const manipulatedProducts = productTypes.map((productType) => {
      return {
        id: productType.id,
        name: productType.title,
        description: productType.description,
        imageUrl: productType.imageUrl,
        totalproductType: productType.farmerProducts.reduce((total, fproduct) => {
          return total + fproduct.currentQuantity;
        }, 0),
      };
    });
    res.json(manipulatedProducts);
  } catch (error) {
    res.status(404).json("Error " + error);
  }
}

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

module.exports = {
  create,
  getAll,
  getProductType
};
