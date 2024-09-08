import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleCreateStartup, handleCreateStartupMetrics, handleDeleteStartup, handleDeleteStartupMetrics, handleGetStartupMeetingRequests, handleGetStartupMetrics, handleGetUserStartups, handleUpdateMeetingRequest, handleUpdateStartup, handleUpdateStartupMetrics } from "../handlers/v1/startup"
const router = express.Router()

router.post("/create", AuthMiddleware , handleCreateStartup)
router.post("/update" , AuthMiddleware , handleUpdateStartup) 
router.post("/delete", AuthMiddleware , handleDeleteStartup)
router.get("/",AuthMiddleware, handleGetUserStartups)
router.post("/metrics/create", AuthMiddleware , handleCreateStartupMetrics)
router.post("/metrics/update", AuthMiddleware , handleUpdateStartupMetrics )
router.post("/metrics/delete", AuthMiddleware , handleDeleteStartupMetrics)
router.post("/metrics",  handleGetStartupMetrics)
router.post("/meetings/requests", AuthMiddleware, handleGetStartupMeetingRequests)
router.post("/meetings/update", AuthMiddleware, handleUpdateMeetingRequest)
// router.post("/getAnalytics", handleGetStartupMetrics)


module.exports = router