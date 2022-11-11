const fs=require('fs')

const deleteImage= (path)=>{
    fs.unlink(path,(err)=>{
        if(err){
            throw err
        }
     console.log('Deleting ..','Successfully Deleted')
    })

    module.exports=deleteImage
}
