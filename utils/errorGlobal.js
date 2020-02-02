class errorGlobal extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "";
    this.message = message;
    
    return {
      statusCode: this.statusCode,
      status: this.status,
      message: this.message,
      stack: new Error().stack,
    };
  }
}

module.exports = errorGlobal;
