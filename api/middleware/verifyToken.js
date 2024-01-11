// verification jwt token 
  // middleware 
  const jwt = require('jsonwebtoken');
  const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({message: "unauthorized access"});
    }
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(error,decoded) => {
      if (error) {
        return res.status(401).send({message: "Token is invalid"});
      }
      req.decoded = decoded;
      next();
    })
  }

  module.exports = verifyToken;