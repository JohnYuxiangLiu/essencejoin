const errorGlobal=require('../utils/errorGlobal')

exports.deleteOne=Model=>async (req,res,next)=>{
    try{
      var data=await Model.findByIdAndDelete(req.params.id)
      if(!data){
        return next(new errorGlobal(404,'Cannot find data by ID.'))
      }
      res.status(200).json({
        status:'success',
        data:null,
      })
    }catch(err){
      next(new errorGlobal(404,'Cannot delete data by ID.'))
    }
  }