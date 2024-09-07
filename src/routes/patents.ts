
import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleCreatePatent, handleDeletePatent, handleGetPatentPdfUploadingUrl, handleGetPatents, handleupdatePatent, handleupdatePatentStatus } from "../handlers/v1/patents"
const router = express.Router()

router.post("/create", AuthMiddleware , handleCreatePatent)
router.post("/update" , AuthMiddleware , handleupdatePatent) 
router.post("/delete", AuthMiddleware , handleDeletePatent)
router.post("/", handleGetPatents)
router.post("/updateStatus", AuthMiddleware, handleupdatePatentStatus)
router.post("/getUploadingUrl", AuthMiddleware, handleGetPatentPdfUploadingUrl)

// router.post("/getAnalytics", handleGetStartupMetrics)


module.exports = router