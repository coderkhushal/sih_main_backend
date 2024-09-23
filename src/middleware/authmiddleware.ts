import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { PrismaClient  } from "@prisma/client";
let prisma = new PrismaClient()
export const AuthMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    try{

        const token = req.headers.authorization?.split(" ")[1];
 
        if (!token) {
            return res.status(401).json({ msg: "Token Not Found" })
        }
        let payload: any = jwt.verify(token.toString(), process.env.JWT_SECRET as string);
        if(!payload){
            return res.status(401).json({ msg: "Invalid token" });
        }
 
        
            req.body.user ={id : payload.id, name: payload.name, email: payload.email, role :payload.role} 
      next()
}
catch(err){
    console.log(err)
    return res.status(500).json({ msg: "Token expired or malformed" })
}

}