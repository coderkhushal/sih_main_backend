

import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
const router = express.Router()

// router.post("/showStartups?page=1&industry=HEALTH", AuthMiddleware , )
// router.post("/requestMeeting" , AuthMiddleware , handleupdatePatent) 
// router.post("/deteMeeting", AuthMiddleware , handleDeletePatent)
// router.post("/getMeeting", handleGetPatents)
// router.post("/InvestRequest", AuthMiddleware, handleupdatePatentStatus)
// router.post("/showMeetingRequests", AuthMiddleware, handleGetPatentPdfUploadingUrl)

// router.post("/getAnalytics", handleGetStartupMetrics)


module.exports = router