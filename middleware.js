const jwt = require("jsonwebtoken");

function authmiddleware(req,res,next){
      
   const token = req.headers.token;

   if(!token){
     res.status(403).json({
        message:"You are not logged in"
     })
     return
   }

   const decode = jwt.verify(token,"helloworld123");
   const userId = decode.userId;

   if(!userId){
    res.status(403).json({
        message:"Malformed token"
    });
    return
   }

   req.userId = userId

   next()


}


module.exports = {
   authmiddleware
}