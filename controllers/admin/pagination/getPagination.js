
const getPagination=(page,perPage)=>{
    const limit=perPage ? +perPage :3
    const offset=page ?  page* limit : 0

    return {limit,offset}
}


const getPagingData=(data,page,limit)=>{
   const { count:totalItems,rows:data_name}=data
   const currentPage=page ? +page :0
   const totalPages= Math.ceil(totalItems / limit)
   return {totalItems,data_name,currentPage,totalPages}
}

module.exports={getPagination,getPagingData}