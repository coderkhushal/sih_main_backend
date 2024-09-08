"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const offers_1 = require("../handlers/v1/offers");
const router = express_1.default.Router();
router.post("/createOffer", authmiddleware_1.AuthMiddleware, offers_1.handleCreateInvestmentOffer);
// router.post("/update" , AuthMiddleware , handleUpdateGrant) 
// router.post("/delete", AuthMiddleware , handleDeleteGrant)
// router.post("/", AuthMiddleware, handleGetGrants )
// router.post("/getApplications", AuthMiddleware, handleGetApplications )
// router.post("/assign", AuthMiddleware, handleAssignGrant)
// router.post("/submitApplication", AuthMiddleware, handleSubmitGrantApplication)
// router.post("/getAnalytics", handleGetStartupMetrics)
module.exports = router;
