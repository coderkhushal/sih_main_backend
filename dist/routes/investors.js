"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const investors_1 = require("../handlers/v1/investors");
const offers_1 = require("../handlers/v1/offers");
const router = express_1.default.Router();
router.post("/showStartups", authmiddleware_1.AuthMiddleware, investors_1.handleGetStartupsIndustrywise);
router.post("/createMeetingRequest", authmiddleware_1.AuthMiddleware, investors_1.handlecreateMeetingRequest);
router.get("/getMeetingRequests", authmiddleware_1.AuthMiddleware, investors_1.handleGetInvestorMeetingRequests);
router.post("/getMeetings", authmiddleware_1.AuthMiddleware, investors_1.handleGetInvestorMeetingRequests);
router.post("/deleteMeetingRequest", authmiddleware_1.AuthMiddleware, investors_1.handleGetInvestorMeetingRequests);
router.get("/investmentOffers", authmiddleware_1.AuthMiddleware, offers_1.handleGetInvestorInvestmentOffers);
router.post("/investmentOffers/update", authmiddleware_1.AuthMiddleware, offers_1.handleUpdateInvestorInvestmentOffer);
router.post("/investmentOffers/delete", authmiddleware_1.AuthMiddleware, offers_1.handleUpdateInvestorInvestmentOffer);
module.exports = router;
