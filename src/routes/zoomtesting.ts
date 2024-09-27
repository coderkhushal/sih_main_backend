require("dotenv").config()
import express, { Request, Response } from "express"

import { handleLogin,  handleResetPassword, handleResetPasswordVerifyToken, handlesignup, handleGetUser } from "../handlers/v1/auth"
import { AuthMiddleware } from "../middleware/authmiddleware"
const router = express.Router()

router.get("/", async(req: Request, res: Response)=>{


    try{
        const response = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id='+process.env.ZOOM_ACCOUNT_ID, {
            method:'POST',
            headers:{
                'Authorization':`Basic ${process.env.ZOOM_AUTH_HEADER}`
            }
        });
        const data : any= await response.json()
        res.json({success:"true", data});    
    }catch(error){
        console.error('Error',error);
        res.send('Error');
    }
    
} )

module.exports = router