"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const grants_1 = require("../handlers/v1/grants");
const router = express_1.default.Router();
router.post("/create", authmiddleware_1.AuthMiddleware, grants_1.handleCreateGrant);
router.post("/update", authmiddleware_1.AuthMiddleware, grants_1.handleUpdateGrant);
router.post("/delete", authmiddleware_1.AuthMiddleware, grants_1.handleDeleteGrant);
router.post("/", authmiddleware_1.AuthMiddleware, grants_1.handleGetGrants);
router.post("/getApplications", authmiddleware_1.AuthMiddleware, grants_1.handleGetApplications);
router.post("/assign", authmiddleware_1.AuthMiddleware, grants_1.handleAssignGrant);
router.post("/submitApplication", authmiddleware_1.AuthMiddleware, grants_1.handleSubmitGrantApplication);
// router.post("/getAnalytics", handleGetStartupMetrics)
module.exports = router;
