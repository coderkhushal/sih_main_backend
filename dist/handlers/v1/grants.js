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
exports.handleGetStartupappliedgrants = exports.handleDeleteGrantApplication = exports.handleSubmitGrantApplication = exports.handleAssignGrant = exports.handleGetApplications = exports.handleGetGrants = exports.handleDeleteGrant = exports.handleUpdateGrant = exports.handleCreateGrant = void 0;
const DbManager_1 = require("../../utils/DbManager");
const prisma = DbManager_1.DbManager.getInstance().getClient();
const handleCreateGrant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, amount, requirements, deadline } = req.body;
        if (!title || !description || !amount || !requirements || !deadline) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let deadlinedatetime = new Date(deadline);
        if (deadlinedatetime.toString() === "Invalid Date") {
            return res.status(400).json({ message: "Invalid date" });
        }
        deadlinedatetime.setHours(0, 0, 0, 0);
        let grant = yield prisma.grant.create({
            data: {
                title,
                description,
                amount,
                requirements,
                deadline: deadlinedatetime,
                status: "PENDING",
                isAssigned: false,
                remark: "",
                fundingBody: {
                    connect: {
                        id: req.body.user.id
                    }
                }
            }
        });
        return res.json({ msg: "Created Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleCreateGrant = handleCreateGrant;
const handleUpdateGrant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { grantId, title, description, amount, requirements, deadline, status, isAssigned, remark } = req.body;
        if (!grantId) {
            return res.status(400).json({ msg: "Grant Id is required" });
        }
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let existinggrant = yield prisma.grant.findUnique({
            where: {
                id: grantId
            }
        });
        if (!existinggrant) {
            return res.status(400).json({ msg: "Grant does not exist" });
        }
        let deadlinedatetime;
        if (deadline) {
            deadlinedatetime = new Date(deadline);
            if (deadlinedatetime.toString() === "Invalid Date") {
                return res.status(400).json({ message: "Invalid date" });
            }
            deadlinedatetime.setHours(0, 0, 0, 0);
        }
        let grant = yield prisma.grant.update({
            where: {
                id: grantId
            },
            data: {
                title,
                description,
                amount,
                requirements,
                deadline: deadlinedatetime,
                status,
                isAssigned,
                remark
            }
        });
        return res.json({ msg: "Updated Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleUpdateGrant = handleUpdateGrant;
const handleDeleteGrant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { grantId } = req.body;
        if (!grantId) {
            return res.status(400).json({ msg: "Grant Id is required" });
        }
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let existinggrant = yield prisma.grant.findUnique({
            where: {
                id: grantId
            }
        });
        if (!existinggrant) {
            return res.status(400).json({ msg: "Grant does not exist" });
        }
        yield prisma.grant.delete({
            where: {
                id: grantId
            }
        });
        return res.json({ msg: "Deleted Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleDeleteGrant = handleDeleteGrant;
const handleGetGrants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let grants = yield prisma.grant.findMany({
            where: {
                fundingBodyId: req.body.user.id
            },
            orderBy: {
                isAssigned: "asc"
            }
        });
        return res.json({ grants });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetGrants = handleGetGrants;
const handleGetApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { grantId } = req.body;
        console.log(grantId);
        if (!grantId) {
            return res.status(400).json({ msg: "Grant Id is required" });
        }
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let existinggrant = yield prisma.grant.findUnique({
            where: {
                id: grantId
            }
        });
        if (!existinggrant) {
            return res.status(400).json({ msg: "Grant does not exist" });
        }
        let applications = yield prisma.grantApplication.findMany({
            where: {
                grantId
            }
        });
        return res.json({ applications });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetApplications = handleGetApplications;
const handleAssignGrant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { grantId, startupId } = req.body;
        if (!grantId || !startupId) {
            return res.status(400).json({ msg: "Grant Id and Startup Id are required" });
        }
        if (!req.body.user.role.includes("GOVERNMENT")) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let existinggrant = yield prisma.grant.findUnique({
            where: {
                id: grantId,
            },
            include: {
                applications: {
                    where: {
                        startupId
                    }
                }
            }
        });
        if (!existinggrant) {
            return res.status(400).json({ msg: "Grant does not exist" });
        }
        if (existinggrant.isAssigned) {
            return res.status(400).json({ msg: "Grant is already assigned" });
        }
        if (existinggrant.applications.length == 0) {
            return res.status(400).json({ msg: "Startup has not applied for this grant" });
        }
        let existingStartup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            }
        });
        if (!existingStartup) {
            return res.status(400).json({ msg: "Startup does not exist" });
        }
        let grant = yield prisma.grant.update({
            where: {
                id: grantId
            },
            data: {
                isAssigned: true,
                status: "APPROVED",
                startup: {
                    connect: {
                        id: startupId
                    }
                }
            }
        });
        yield prisma.startup.update({
            where: {
                id: startupId
            },
            data: {
                grants: {
                    connect: {
                        id: grantId
                    }
                },
            }
        });
        return res.json({ msg: "Assigned Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleAssignGrant = handleAssignGrant;
const handleSubmitGrantApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { grantId, startupId, pitch } = req.body;
        if (!grantId || !pitch || !startupId) {
            return res.status(400).json({ msg: "Grant Id and Startup Id are required" });
        }
        let existinggrant = yield prisma.grant.findUnique({
            where: {
                id: grantId
            },
            include: {
                applications: {
                    where: {
                        startupId
                    }
                }
            }
        });
        if (!existinggrant) {
            return res.status(400).json({ msg: "Grant does not exist" });
        }
        if (existinggrant.isAssigned) {
            return res.status(400).json({ msg: "Grant is already assigned" });
        }
        if (existinggrant.applications.length > 0) {
            return res.status(400).json({ msg: "Startup has already applied for this grant" });
        }
        let existingStartup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            }
        });
        if (!existingStartup) {
            return res.status(400).json({ msg: "Startup does not exist" });
        }
        if (existingStartup.founderId !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let newapplication = yield prisma.grantApplication.create({
            data: {
                grant: {
                    connect: {
                        id: grantId
                    }
                },
                pitch: pitch,
                startup: {
                    connect: {
                        id: startupId
                    }
                },
            }
        });
        return res.json({ msg: "Application Submitted Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleSubmitGrantApplication = handleSubmitGrantApplication;
const handleDeleteGrantApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { applicationId, startupId } = req.body;
        if (!applicationId) {
            return res.status(400).json({ msg: "Application Id is required" });
        }
        let existingapplication = yield prisma.grantApplication.findUnique({
            where: {
                id: applicationId
            },
            include: {
                startup: {
                    select: {
                        founderId: true
                    }
                }
            }
        });
        if (!existingapplication) {
            return res.status(400).json({ msg: "Application does not exist" });
        }
        if (((_a = existingapplication.startup) === null || _a === void 0 ? void 0 : _a.founderId) !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        yield prisma.grantApplication.delete({
            where: {
                id: applicationId
            }
        });
        return res.json({ msg: "Deleted Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleDeleteGrantApplication = handleDeleteGrantApplication;
const handleGetStartupappliedgrants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(200).json({ "messageL": "startup id not found" });
        }
        const grantsapplied = yield prisma.grantApplication.findMany({
            where: {
                startupId: startupId
            }
        });
        if (!grantsapplied) {
            return res.status(200).json({ msg: "No Grants applied", data: [] });
        }
        return res.status(200).json({ msg: "Grants applied", data: grantsapplied });
    }
    catch (err) {
    }
});
exports.handleGetStartupappliedgrants = handleGetStartupappliedgrants;
