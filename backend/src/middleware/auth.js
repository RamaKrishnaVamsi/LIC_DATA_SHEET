const jwt = require("jsonwebtoken");

module.exports = function(req , res ,next){
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    
    let token;

    if ( authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = authHeader;
    }

    if(!token){
        return res.status(401).json({message : 'NO token ,authorization denied'})
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({message : 'Token are not valid'});
    }
}