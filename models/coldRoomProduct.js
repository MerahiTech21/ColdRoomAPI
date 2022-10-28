module.exports = (sequelize, DataTypes) => {
  const coldRoomProduct = sequelize.define("coldRoomProduct", {
    price: {
      type: DataTypes.DOUBLE,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return coldRoomProduct;
};
