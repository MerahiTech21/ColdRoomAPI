module.exports = (sequelize, DataTypes) => {
  const coldRoomProduct = sequelize.define("coldRoomProduct", {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull:false,

  },
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
