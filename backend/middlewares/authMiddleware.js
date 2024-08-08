const jwt = require('jsonwebtoken');
const {
    AuthFailureResponse,
  } = require('../core/apiResponse');

const secretKey=process.env.JWT_SECRET_KEY;

const verifyTokens=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader&&authHeader.split(' ')[1];

    if (!token) {
        return new AuthFailureResponse().send(res);
    }

    try{
        console.log(token);
        const decoded=jwt.verify(token,secretKey);
        console.log(decoded);
        req.user=decoded;
        next();
    }
    catch(e){
        res.status(401).json({msg:'Invalid token!'});
    }



}


module.exports=verifyTokens;