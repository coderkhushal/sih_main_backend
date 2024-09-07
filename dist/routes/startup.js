"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const startup_1 = require("../handlers/v1/startup");
const router = express_1.default.Router();
router.post("/create", authmiddleware_1.AuthMiddleware, startup_1.handleCreateStartup);
router.post("/update", authmiddleware_1.AuthMiddleware, startup_1.handleUpdateStartup);
router.post("/delete", authmiddleware_1.AuthMiddleware, startup_1.handleDeleteStartup);
router.get("/", authmiddleware_1.AuthMiddleware, startup_1.handleGetUserStartups);
router.post("/metrics/create", authmiddleware_1.AuthMiddleware, startup_1.handleCreateStartupMetrics);
router.post("/metrics/update", authmiddleware_1.AuthMiddleware, startup_1.handleUpdateStartupMetrics);
router.post("/metrics/delete", authmiddleware_1.AuthMiddleware, startup_1.handleDeleteStartupMetrics);
router.post("/metrics", startup_1.handleGetStartupMetrics);
// router.post("/getAnalytics", handleGetStartupMetrics)
module.exports = router;
