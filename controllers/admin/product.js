const {db}=require('../../config/database.js');

const FarmerProduct =db.farmerProduct;

const Product=db.product;
const ProductType=db.productType;

//add product
const create= async(req,res)=>{
    
 
   const  productImage= req.files.filter((file)=>{
       return file.fieldname === 'product_image'
    }) 

    const typeImage=req.files.filter((file)=>{
        return file.fieldname !== 'product_image'
     })
       
    let productInfo={
        name:req.body.name,
        imageUrl:productImage[0].filename,
            
    };
   
    try{
        let newProduct= await Product.create(productInfo);
        let types=[]
        if(newProduct){
              for(let i=0;i<typeImage.length;i++){

                
                const type={
                    title:req.body['title'+i],
                    description:req.body['description'+i],
                    imageUrl:`${typeImage[i].filename}`,
                    productId:newProduct.id
                }

              
                types.push(type)
              }
        } 
   
      
        const pType= await ProductType.bulkCreate(types)

         res.status(200).json({newProduct,pType});

}catch(err){
    console.log('err')
    res.status(400).json('Error'+err);

}
}


const getAll=async(req,res)=>{
    try {
        // const coldRoomId=req.user.coldRoomId
    
        // if (!coldRoomId) {
        //   res.status(404).json('Error ')
    
        // }
        const fp=await FarmerProduct.findAll({
        //   where:{coldRoomId:coldRoomId},
         attributes:['productId',[db.sequelize.fn('sum',db.sequelize.col('oldQuantity')),'totalProduct'],   
       ],
       include:[
        {
         model:db.product ,
         attributes:['name','imageUrl']
       },  {
        model:db.coldRoom ,
        attributes:['id','name']
      }
    ],
         group:['productId'],
        
        });
        res.json(fp)   
      } catch (error) {
        res.status(404).json('Error ')
      }
}
module.exports={
  
    create,
     getAll
};




