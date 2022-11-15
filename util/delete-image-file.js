const fs=require('fs')
const path=require('path')

const deleteImage= (filePath)=>{

    filePath=path.join(__dirname,'..',filePath)
    fs.unlink(filePath,(err)=>{
        if(err){
            throw err
        }
     console.log('Deleting ..','Successfully Deleted')
    })

    module.exports=deleteImage
}
