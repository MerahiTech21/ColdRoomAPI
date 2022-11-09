const { request } = require("express");
const { db } = require("../../config/database.js");
const multer = require("multer");
const path = require("path");

const ColdRoom = db.coldRoom;
const Address = db.address;
const Rent = db.rent;
const Employee = db.employee;
const Product = db.product;
const FarmerProduct = db.farmerProduct;

const create = async (req, res) => {
  // res.json('succc')
  // return
  let ColdRoomInfo = {
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };

  let AddressInfo = {
    woreda: req.body.woreda,
    kebele: req.body.kebele,
    zone: req.body.zone,
    region: req.body.region,
  };
  let rentInfo = {
    price: req.body.price,
  };

  try {
    //calling a function
    let address = await createAddress(AddressInfo);
    ColdRoomInfo.addressId = address.id;
    let coldRoom = await ColdRoom.create(ColdRoomInfo);
    let id = coldRoom.id;
    rentInfo.coldRoomId = id;
    let rent = await createRent(rentInfo);
    //coldRoom=await coldRoom.toJson()
    res.status(200).json({ coldRoom, rent, address, employee: null });
  } catch (err) {
    res.json(err);
    console.log("error creating Coldroom creation", err);
  }
};
//creatin address for coldroom
const createAddress = async (address) => {
  //console.log(address)
  try {
    const newaddress = await Address.create(address);
    return newaddress;
  } catch (er) {
    throw "Error While creating Adrree";
  }
};

//creating rent

const createRent = async (rentInfo) => {
  try {
    const newRent = await Rent.create(rentInfo);
    return newRent;
  } catch (err) {
    throw "Error in rent";
  }
};
//updating the coldroom data
const update = async (req, res) => {
  let ColdRoomInfo = {
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };

  let AddressInfo = {
    woreda: req.body.woreda,
    kebele: req.body.kebele,
    zone: req.body.zone,
    region: req.body.region,
  };
  let rentInfo = {
    price: req.body.price,
  };

  try {
    
    try {
      const updatedColdRoom = await ColdRoom.findOne({
        where: { id: req.params.id },
      });

      if(updatedColdRoom){

      let addressUpdated = await Address.update(AddressInfo, {
        where: { id: updatedColdRoom.addressId },
      });
      const coldRoomUpdated = await ColdRoom.update(ColdRoomInfo, {
        where: { id: updatedColdRoom.id },
      });
      let rent = await Rent.findOne({
        where: { coldRoomId: updatedColdRoom.id },
      });

      if(rent){
           const rentUpdate = await Rent.update(rentInfo, {
        where: { id: rent.id },
      });
      }
    }
    } catch (error) {
        throw error
    }

    const coldRoom = await ColdRoom.findOne({
      where: { id: req.params.id },
      attributes: {
        include: [
          [
            db.Sequelize.fn(
              "sum",
              db.Sequelize.col("farmerProducts.currentQuantity")
            ),
            "stockProduct",
          ],
        ],
      },
      group: ["id"],
      include: [
        {
          model: Address,
          as: "address",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Employee,
          attributes: ["fName", "lName"],
          as: "employee",
        },
        {
          model: Rent,
          attributes: ["id", "price"],
        },
        {
          model: FarmerProduct,
          attributes: [],
        },
      ],
    });
    res.json(coldRoom);
  } catch (err) {
    res.json("errr" + err);
    console.log("error in update", err);
  }
};

const getAll = async (req, res) => {
  try {
    // const procount=Produ
    const coldRooms = await ColdRoom.findAll({
      attributes: {
        include: [
          [
            db.Sequelize.fn(
              "sum",
              db.Sequelize.col("farmerProducts.currentQuantity")
            ),
            "stockProduct",
          ],
        ],
      },
      group: ["id"],
      include: [
        {
          model: Address,
          as: "address",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Employee,
          attributes: ["fName", "lName"],
          as: "employee",
        },
        {
          model: Rent,
          attributes: ["id", "price"],
        },
        {
          model: FarmerProduct,
          attributes: [],
        },
      ],
    });
    res.json(coldRooms);
  } catch (error) {
    res.json("Error while fetching coldroom" + error);
  }
};

module.exports = {
  create,
  update,
  getAll,
};
