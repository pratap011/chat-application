const authService=require('../services/authenticationService');


const register=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
        const message=await authService.registerUser(email,name,password);
        res.status(200).json({msg:message});
    }
    catch(e){
        res.status(401).json({msg:"There was an error "+e});
    }
}


const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const token=await authService.loginUser(email,password);
        res.json({msg:'User logged in successfully',token});

    }
    catch(e){
        res.send("Login failed");
    }

}

module.exports={
    register,
    login
}