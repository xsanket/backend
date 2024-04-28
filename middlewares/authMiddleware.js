import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        //message: "Unauthorized: Missing or invalid token",
      });
    }

    const token = authorizationHeader.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      //message: "Unauthorized: Invalid token",
    });
  }
};


export default authMiddleware;