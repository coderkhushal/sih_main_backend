"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const patents_1 = require("../handlers/v1/patents");
const router = express_1.default.Router();
router.post("/create", authmiddleware_1.AuthMiddleware, patents_1.handleCreatePatent);
router.post("/update", authmiddleware_1.AuthMiddleware, patents_1.handleupdatePatent);
router.post("/delete", authmiddleware_1.AuthMiddleware, patents_1.handleDeletePatent);
router.post("/", patents_1.handleGetPatents);
router.post("/updateStatus", authmiddleware_1.AuthMiddleware, patents_1.handleupdatePatentStatus);
router.post("/getUploadingUrl", authmiddleware_1.AuthMiddleware, patents_1.handleGetPatentPdfUploadingUrl);
// router.post("/getAnalytics", handleGetStartupMetrics)
module.exports = router;
