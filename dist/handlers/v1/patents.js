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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetPatentPdfUploadingUrl = exports.handleGetPatents = exports.handleDeletePatent = exports.handleupdatePatentStatus = exports.handleupdatePatent = exports.handleCreatePatent = void 0;
const DbManager_1 = require("../../utils/DbManager");
const getSignedUrl_1 = require("../../services/getSignedUrl");
const prisma = DbManager_1.DbManager.getInstance().getClient();
const handleCreatePatent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId, title, description, pdfPath } = req.body;
        if (!startupId || !title || !description || !pdfPath) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        let applicationDate = new Date().toISOString();
        let patent = yield prisma.iPR.create({
            data: {
                title,
                description,
                pdfPath,
                status: "PENDING",
                startupId: startupId, // Add the missing property
                IPRType: "PATENT"
            }
        });
        return res.json({ msg: "Created Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleCreatePatent = handleCreatePatent;
const handleupdatePatent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { patentId, title, description, pdfPath } = req.body;
        const existingPatent = yield prisma.iPR.findUnique({
            where: {
                id: patentId
            },
            include: {
                startup: {
                    select: {
                        founderId: true
                    }
                }
            }
        });
        if (!existingPatent) {
            return res.status(400).json({ msg: "Patent not found" });
        }
        if (((_a = existingPatent === null || existingPatent === void 0 ? void 0 : existingPatent.startup) === null || _a === void 0 ? void 0 : _a.founderId) !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let patent = yield prisma.iPR.update({
            where: {
                id: patentId
            },
            data: {
                title,
                description,
                pdfPath,
            }
        });
        return res.json({ msg: "Updated Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleupdatePatent = handleupdatePatent;
const handleupdatePatentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patentId, status } = req.body;
        if (!patentId || !status) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        let approvedDate;
        if (status == "APPROVED") {
            approvedDate = new Date().toISOString();
        }
        if (req.body.user.role.includes("GOVERNMENT")) {
            let patent = yield prisma.iPR.update({
                where: {
                    id: patentId
                },
                data: {
                    status: status,
                    approvalDate: approvedDate
                }
            });
            return res.json({ msg: "Updated Successfully" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleupdatePatentStatus = handleupdatePatentStatus;
const handleDeletePatent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { patentId } = req.body;
        if (!patentId) {
            return res.status(400).json({ msg: "Patent Id is required" });
        }
        let existingpatent = yield prisma.iPR.findUnique({
            where: {
                id: patentId
            },
            include: {
                startup: {
                    select: {
                        founderId: true
                    }
                }
            }
        });
        if (!existingpatent) {
            return res.status(400).json({ msg: "Patent not found" });
        }
        if (((_a = existingpatent === null || existingpatent === void 0 ? void 0 : existingpatent.startup) === null || _a === void 0 ? void 0 : _a.founderId) !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let patent = yield prisma.iPR.delete({
            where: {
                id: patentId
            }
        });
        return res.json({ msg: "Deleted Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleDeletePatent = handleDeletePatent;
const handleGetPatents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(400).json({ msg: "Startup Id is required" });
        }
        let patents = yield prisma.iPR.findMany({
            where: {
                startupId,
                IPRType: "PATENT"
            }
        });
        return res.json({ patents });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetPatents = handleGetPatents;
const handleGetPatentPdfUploadingUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(400).json({ msg: "Patent Id is required" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            },
            include: {
                ipr: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!startup) {
            return res.status(400).json({ msg: "startup not found" });
        }
        if (startup.founderId != req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let url = yield (0, getSignedUrl_1.GetUploadingUrl)(`patents/${startupId}-${startup.ipr.length + 1}`);
        return res.json({ url, pdfPath: `https://s3.ap-south-1.amazonaws.com/bucket.khushalbhasin.live/patents/${startupId}-${startup.ipr.length + 1}` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetPatentPdfUploadingUrl = handleGetPatentPdfUploadingUrl;
