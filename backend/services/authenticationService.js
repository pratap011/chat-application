const jwt=require('jsonwebtoken');
const User=require('../models/User');
const bcrypt=require('bcryptjs');


const secretKey=process.env.JWT_SECRET_KEY;


const registerUser= async(email,name,password)=>{
    let user=await User.findOne({email});
    if(user){
        throw new Error('User already exists');
    }
    user=new User({name,email,password});
    try{
        await user.save();
        return "User registration is successfull!"
    }
    catch(e){
        return "There is an error"+e;
    }
    
}


const loginUser= async (email,password)=>{
    const user=await User.findOne({email});
    if(!user){
        throw new Error('User is not registered!');
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('Invalid password!');
    }

    const token=jwt.sign({userId:user._id,email:user.email},secretKey, { expiresIn: '24h' });
    return token;
}



module.exports={
    registerUser,
    loginUser
};



