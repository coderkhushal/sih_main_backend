"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Token Not Found" });
        }
        let payload = jsonwebtoken_1.default.verify(token.toString(), process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ msg: "Invalid token" });
        }
        req.body.user = { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Token expired or malformed" });
    }
});
exports.AuthMiddleware = AuthMiddleware;
