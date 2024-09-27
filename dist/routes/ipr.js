"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get("/", authmiddleware_1.AuthMiddleware);
router.get("/pending");
router.get("/completed");
router.post("/update");
// router.post("/login", handleLogin)
// router.get("/user", AuthMiddleware , handleGetUser)
// router.post("/reset-password", handleResetPassword)
// router.post("/reset-password/:token", handleResetPasswordVerifyToken)
module.exports = router;
