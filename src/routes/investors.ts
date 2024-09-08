

import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleGetInvestorMeetingRequests, handleGetStartupsIndustrywise, handlecreateMeetingRequest } from "../handlers/v1/investors"
import { handleGetInvestorInvestmentOffers, handleUpdateInvestorInvestmentOffer } from "../handlers/v1/offers"
const router = express.Router()

router.post("/showStartups", AuthMiddleware ,handleGetStartupsIndustrywise )
router.post("/createMeetingRequest" , AuthMiddleware , handlecreateMeetingRequest) 
router.get("/getMeetingRequests", AuthMiddleware ,handleGetInvestorMeetingRequests)
router.post("/getMeetings",AuthMiddleware, handleGetInvestorMeetingRequests)
router.post("/deleteMeetingRequest", AuthMiddleware, handleGetInvestorMeetingRequests)
router.get("/investmentOffers", AuthMiddleware, handleGetInvestorInvestmentOffers)
router.post("/investmentOffers/update", AuthMiddleware, handleUpdateInvestorInvestmentOffer)
router.post("/investmentOffers/delete", AuthMiddleware, handleUpdateInvestorInvestmentOffer)



module.exports = router