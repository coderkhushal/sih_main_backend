import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleCreateStartup, handleCreateStartupMetrics, handleDeleteStartup, handleDeleteStartupMetrics, handleGetAllGrants, handleGetSingleStartupInfo, handleGetStartScore, handleGetStartupMeetingRequests, handleGetStartupMeetings, handleGetStartupMetrics, handleGetUserStartups, handleUpdateMeetingRequest, handleUpdateStartup, handleUpdateStartupMetrics } from "../handlers/v1/startup"
import { handleGetStartupInvestmentOffers, handleUpdateStartupInvestmentOffer } from "../handlers/v1/offers"
import { handleGetStartupappliedgrants } from "../handlers/v1/grants"
const router = express.Router()
router.get("/score/:id", AuthMiddleware, handleGetStartScore)
router.post("/create", AuthMiddleware , handleCreateStartup)
router.post("/update" , AuthMiddleware , handleUpdateStartup) 
router.post("/delete", AuthMiddleware , handleDeleteStartup)
router.get("/",AuthMiddleware, handleGetUserStartups)
router.get("/grants", AuthMiddleware, handleGetAllGrants)
router.post("/grantsApplied", AuthMiddleware, handleGetStartupappliedgrants)
router.get("/:id", AuthMiddleware, handleGetSingleStartupInfo)
router.post("/metrics/create", AuthMiddleware , handleCreateStartupMetrics)
router.post("/metrics/update", AuthMiddleware , handleUpdateStartupMetrics )
router.post("/metrics/delete", AuthMiddleware , handleDeleteStartupMetrics)
router.post("/metrics",  handleGetStartupMetrics)
router.post("/meetings/requests", AuthMiddleware, handleGetStartupMeetingRequests)
router.post("/meetings/update", AuthMiddleware, handleUpdateMeetingRequest)
router.get("/meetings/:startupId", AuthMiddleware, handleGetStartupMeetings)
router.post("/investmentOffers", AuthMiddleware, handleGetStartupInvestmentOffers)
router.post("/investmentOffers/update", AuthMiddleware, handleUpdateStartupInvestmentOffer)
// router.post("/round/create",AuthMiddleware  )
// router.post("/rounds/update", AuthMiddleware, )
// router.post("/rounds/delete",)
// router.post("")
// router.post("/getAnalytics", handleGetStartupMetrics)


module.exports = router