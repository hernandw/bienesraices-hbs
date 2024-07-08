import jwt from "jsonwebtoken";

process.loadEnvFile();

export const protectedRoutes = async(req, res, next) => {
  //verificar el token

  const { tokenJWT } = req.cookies;

  if (!tokenJWT) {
    return res.clearCookie("tokenJWT").redirect("/auth/login");
  }

  try {
    const user = jwt.verify(tokenJWT, process.env.JWT_SECRET_KEY);
    if(!user) {
      return res.clearCookie("tokenJWT").redirect("/auth/login");
    }

    req.user = user.id;
    
    return next();
  } catch (error) {
    return res.clearCookie("tokenJWT").redirect("/auth/login");
  }
  
  
};