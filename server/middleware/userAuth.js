 import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) =>{
  try {
    const {token} = req.cookies;
    if(!token){
      return res.status(401).json({message:"user not autherised",success: false});
    } 
    const tokenVerified = jwt.verify(token,process.env.JWT_SECRET_KEY);

    if(!tokenVerified){
      return res.status(401).json({message:"user not autherised", success:false});
    }

    req.user = tokenVerified;
    next();
  } catch (error) {
    return res.status(401).json({message:error.message||"user autherization failed",success:false});
  }
};

/* import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "User not authorized", success: false });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message || "User authorization failed",
      success: false
    });
  }
}; */
