

import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleDeleteMeetingRequest, handleGetInvestorInvestments, handleGetInvestorMeetingRequests, handleGetInvestorMeetings, handleGetStartupsIndustrywise, handlecreateMeetingRequest } from "../handlers/v1/investors"
import { handleCreateInvestmentOffer, handleGetInvestorInvestmentOffers, handleUpdateInvestorInvestmentOffer } from "../handlers/v1/offers"
const router = express.Router()

router.post("/showStartups", AuthMiddleware ,handleGetStartupsIndustrywise )
router.post("/createMeetingRequest" , AuthMiddleware , handlecreateMeetingRequest) 
router.get("/getMeetingRequests", AuthMiddleware ,handleGetInvestorMeetingRequests)
router.get("/getMeetings",AuthMiddleware, handleGetInvestorMeetings)
router.post("/deleteMeetingRequest", AuthMiddleware, handleDeleteMeetingRequest)
router.post("/investmentOffers/create", AuthMiddleware, handleCreateInvestmentOffer)
router.get("/investmentOffers", AuthMiddleware, handleGetInvestorInvestmentOffers)
router.post("/investmentOffers/update", AuthMiddleware, handleUpdateInvestorInvestmentOffer)
router.post("/investmentOffers/delete", AuthMiddleware, handleUpdateInvestorInvestmentOffer)
router.get("/investments", AuthMiddleware, handleGetInvestorInvestments)


module.exports = router