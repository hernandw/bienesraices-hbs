import jwt from "jsonwebtoken";

import 'dotenv/config';

const identifyUser = async (req, res, next) => {
  
  const { tokenJWT } = req.cookies;
 
  if (!tokenJWT) {
    req.user = null;
    return next();
  }

  try {
    const user = jwt.verify(tokenJWT, process.env.JWT_SECRET_KEY);
    if(!user) {
      return res.clearCookie("tokenJWT").redirect("/auth/login");
    }

    req.user = user
    
    return next();
  } catch (error) {
    console.log(error);
    return res.clearCookie("tokenJWT").redirect("/auth/login");
  }
};

export default identifyUser;
