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
// write a express app
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    allowedHeaders: "*",
    origin: "*"
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(ratelimiter)
app.use("/auth", require("./routes/auth"));
app.use("/startup", require("./routes/startup"));
app.use("/patent", require("./routes/patents"));
app.use("/grants", require("./routes/grants"));
app.use("/investor", require("./routes/investors"));
app.use("/zoom", require("./routes/zoomtesting"));
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Server is running" });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
