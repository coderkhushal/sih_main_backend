"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const startup_1 = require("../handlers/v1/startup");
const offers_1 = require("../handlers/v1/offers");
const grants_1 = require("../handlers/v1/grants");
const router = express_1.default.Router();
router.get("/score/:id", authmiddleware_1.AuthMiddleware, startup_1.handleGetStartScore);
router.post("/create", authmiddleware_1.AuthMiddleware, startup_1.handleCreateStartup);
router.post("/update", authmiddleware_1.AuthMiddleware, startup_1.handleUpdateStartup);
router.post("/delete", authmiddleware_1.AuthMiddleware, startup_1.handleDeleteStartup);
router.get("/", authmiddleware_1.AuthMiddleware, startup_1.handleGetUserStartups);
router.get("/grants", authmiddleware_1.AuthMiddleware, startup_1.handleGetAllGrants);
router.post("/grantsApplied", authmiddleware_1.AuthMiddleware, grants_1.handleGetStartupappliedgrants);
router.get("/:id", authmiddleware_1.AuthMiddleware, startup_1.handleGetSingleStartupInfo);
router.post("/metrics/create", authmiddleware_1.AuthMiddleware, startup_1.handleCreateStartupMetrics);
router.post("/metrics/update", authmiddleware_1.AuthMiddleware, startup_1.handleUpdateStartupMetrics);
router.post("/metrics/delete", authmiddleware_1.AuthMiddleware, startup_1.handleDeleteStartupMetrics);
router.post("/metrics", startup_1.handleGetStartupMetrics);
router.post("/meetings/requests", authmiddleware_1.AuthMiddleware, startup_1.handleGetStartupMeetingRequests);
router.post("/meetings/update", authmiddleware_1.AuthMiddleware, startup_1.handleUpdateMeetingRequest);
router.post("/investmentOffers", authmiddleware_1.AuthMiddleware, offers_1.handleGetStartupInvestmentOffers);
router.post("/investmentOffers/update", authmiddleware_1.AuthMiddleware, offers_1.handleUpdateStartupInvestmentOffer);
// router.post("/getAnalytics", handleGetStartupMetrics)
module.exports = router;
