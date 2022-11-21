const multer=require('multer');

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'images')
    },
    filename:(req,file,cb)=>{
    //  cb(null, `${Math.floor(Math.random()*1000)} - ${file.originalname}`)
      cb(null, `${new Date().getTime()}-${file.originalname}`)
    } 
});
const fileFilter=(req,file,cb)=>{
      if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null,true)
      }else{
        cb(null,false)
      }

}
      const upload=multer({storage:fileStorage,fileFilter:fileFilter}).any()
                                          //.single('image')//a middleware for encodding multipart/form-data

module.exports=upload