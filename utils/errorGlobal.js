class errorGlobal extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "";
    this.message = message;
    // operational including user operation only, not include 3rd party api, programming error...
    this.userError=true //mongoose error is not userError

    // Error.captureStackTrace(this,this.construcotr)



    // return {
    //   statusCode: this.statusCode,
    //   status: this.status,
    //   message: this.message,
    //   stack: new Error().stack,
    // };
  }
}

module.exports = errorGlobal;
