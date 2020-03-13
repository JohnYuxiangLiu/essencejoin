const errorGlobal=require('../utils/errorGlobal')

exports.getOne = (Model,popOptions)=> async (req, res, next) => {
  try {
    // var activity = await activityModel.find().lean();
    var query = Model.findById(req.params.id)
    if(popOptions){
      query= query.populate(popOptions)
    }
    const data= await query
    
    res.status(200).json({
      status: "success",
      data: data
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

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