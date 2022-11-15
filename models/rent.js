module.exports=(sequelize,DataTypes)=>{
    const rent=sequelize.define("rent",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
            
        },
        price:{
            type:DataTypes.DOUBLE,
            allowNull:false
        }

    })
    return rent
 

}   