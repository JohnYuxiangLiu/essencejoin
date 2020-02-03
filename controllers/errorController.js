const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

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
    errorProd(err, res);
  }
};
