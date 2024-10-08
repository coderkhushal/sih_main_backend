
import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
const router = express.Router()

router.get("/", AuthMiddleware, )
router.get("/pending")
router.get("/completed")
router.post("/update")

// router.post("/login", handleLogin)
// router.get("/user", AuthMiddleware , handleGetUser)
// router.post("/reset-password", handleResetPassword)
// router.post("/reset-password/:token", handleResetPasswordVerifyToken)


module.exports = router