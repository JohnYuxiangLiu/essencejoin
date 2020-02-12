
const errorGlobal=require('../utils/errorGlobal')

// cast error
const castError=(err)=>{
  const message=`Invalid ${err.path}: ${err.value}`
  return new errorGlobal(404,message) //errorGlobal will contain userError to production error
}

// duplicate obj key error
const duplicateKeyError=(err)=>{
  const message=`Duplicate object key value: ${err.keyValue}`
  return new errorGlobal(404,message)
}

// validator error e.g. mongoose email enter not correct
const validationError=(err)=>{
  var messageError=Object.values(err.errors).map(elt=>{
    return elt.message //elt key: email, elt value: values of email 
  })
  return new errorGlobal(400,messageError)
}

const jsonWebTokenError=(err)=>{
  // 401: unauth
  return new errorGlobal(401,'Invalid JsonWebToken.')
}

// dev error
const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// production error
const errorProd = (err, res) => {
  // operational including user operation only, not include 3rd party api, programming error...
  if (err.userError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }else{
    console.error('Error:', err) //log error in the cloud
    
    res.status(500).json({
      status:'fail',
      message:'Something went wrong'
    })
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500: internal server error
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    errorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error={...err} //so error can be used on other types of error
    // cast error like wrong url
    if(error.name==='CastError'){error=castError(error)}
    // duplicate key error in mongodb return a error code 11000, e.g. insert a same obj
    if(error.code==='11000'){error=duplicateKeyError(error)}
    if(error.name==='ValidationError'){error=validationError(error)}
    if(error.name==='JsonWebTokenError'){error=jsonWebTokenError(error)}
  
    errorProd(error, res);
  }
};
