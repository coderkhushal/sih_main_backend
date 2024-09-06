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
exports.MailManager = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailManager {
    constructor() {
        this.username = process.env.NODEMAILER_USERNAME;
        this.password = process.env.NODEMAILER_PASSWORD;
        this.transporter = null;
    }
    static getInstance() {
        if (!MailManager.instance) {
            MailManager.instance = new MailManager();
        }
        return this.instance;
    }
    sendMail(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: this.username,
                    pass: this.password
                }
            });
            const content = `
        <h1>Reset Password</h1>
        <p>Click on the link below to reset your password</p>
        <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
        `;
            const mailOptions = {
                from: "rajeshbhasin4488@gmail.com",
                to: to,
                subject: "Reset Password",
                html: content
            };
            let p = new Promise((resolve, reject) => {
                var _a;
                (_a = this.transporter) === null || _a === void 0 ? void 0 : _a.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                        reject(false);
                    }
                    else {
                        console.log(info);
                        resolve(true);
                    }
                });
            });
            return p;
        });
    }
}
exports.MailManager = MailManager;
