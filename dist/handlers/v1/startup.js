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
exports.handleGetStartScore = exports.handleGetAllGrants = exports.handleUpdateMeetingRequest = exports.handleGetStartupMeetingRequests = exports.handleGetStartupMetrics = exports.handleDeleteStartupMetrics = exports.handleUpdateStartupMetrics = exports.handleCreateStartupMetrics = exports.handleDeleteStartup = exports.handleUpdateStartup = exports.handleGetUserStartups = exports.handleGetSingleStartupInfo = exports.handleCreateStartup = void 0;
require("dotenv").config();
const DbManager_1 = require("../../utils/DbManager");
const industries = ["IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"];
const prisma = DbManager_1.DbManager.getInstance().getClient();
const handleCreateStartup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, location, industry, funding, website, foundedAt, teamSize } = req.body;
        if (!name || !description || !location || !industry || !funding || !website || !foundedAt || !teamSize) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (industries.includes(industry.toUpperCase()) === false) {
            return res.status(400).json({ message: "Invalid Industry" });
        }
        if (req.body.user.role.includes("ENTREPRENEUR") === false) {
            return res.status(400).json({ message: "You must be a entrepreneur to create a startup" });
        }
        let startup = yield prisma.startup.create({
            data: {
                name,
                description,
                location,
                industry,
                funding,
                website,
                foundedAt,
                teamSize,
                founder: {
                    connect: {
                        id: req.body.user.id
                    }
                }
            }
        });
        return res.status(200).json({ message: "Startup created successfully", startupId: startup.id });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleCreateStartup = handleCreateStartup;
const handleGetSingleStartupInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Startup Id is required" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: Number.parseInt(id)
            }
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        return res.status(200).json({ startup });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleGetSingleStartupInfo = handleGetSingleStartupInfo;
const handleGetUserStartups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let startups = yield prisma.startup.findMany({
            where: {
                founderId: req.body.user.id
            }
        });
        return res.status(200).json({ startups });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleGetUserStartups = handleGetUserStartups;
const handleUpdateStartup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId, name, description, location, industry, funding, website, foundedAt, teamSize } = req.body;
        if (!startupId) {
            return res.status(400).json({ message: "Startup Id is required" });
        }
        if (!name && !description && !location && !industry && !funding && !website && !foundedAt && !teamSize) {
            return res.status(400).json({ message: "Nothing to update" });
        }
        let existingstartup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            }
        });
        if (!existingstartup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        if (existingstartup.founderId !== req.body.user.id) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        let startup = yield prisma.startup.update({
            where: {
                id: startupId
            },
            data: {
                name,
                description,
                location,
                industry,
                funding,
                website,
                foundedAt,
                teamSize,
            }
        });
        return res.status(200).json({ message: "Startup updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleUpdateStartup = handleUpdateStartup;
const handleDeleteStartup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(400).json({ message: "Startup Id is required" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            }
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        if (startup.founderId !== req.body.user.id) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        yield prisma.startup.delete({
            where: {
                id: startupId
            }
        });
        return res.status(200).json({ message: "Startup deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleDeleteStartup = handleDeleteStartup;
const handleCreateStartupMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId, period, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway } = req.body;
        if (!startupId) {
            return res.status(400).json({ "message": "startupId not found" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            }
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        if (startup.founderId !== req.body.user.id) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        let perioddatetime = new Date(period);
        if (perioddatetime.toString() === "Invalid Date") {
            return res.status(400).json({ message: "Invalid date" });
        }
        perioddatetime.setHours(0, 0, 0, 0);
        let metrics = yield prisma.metrics.create({
            data: {
                period: perioddatetime, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway,
                startup: {
                    connect: {
                        id: startupId
                    }
                }
            }
        });
        return res.status(200).json({ message: "Metrics created successfully", metricsId: metrics.id });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleCreateStartupMetrics = handleCreateStartupMetrics;
const handleUpdateStartupMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { metricsId, period, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway, createdAt, updatedAt } = req.body;
        if (!metricsId) {
            return res.status(400).json({ message: "Metrics Id is required" });
        }
        let metrics = yield prisma.metrics.findUnique({
            where: {
                id: metricsId
            }
        });
        if (!metrics) {
            return res.status(400).json({ message: "Metrics not found" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: metrics.startupId
            }
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        if (startup.founderId !== req.body.user.id) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        let perioddatetime;
        if (period) {
            perioddatetime = new Date(period);
            if (perioddatetime.toString() === "Invalid Date") {
                return res.status(400).json({ message: "Invalid date" });
            }
            perioddatetime.setHours(0, 0, 0, 0);
        }
        let updatedMetrics = yield prisma.metrics.update({
            where: {
                id: metricsId
            },
            data: {
                period: perioddatetime, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway, createdAt, updatedAt
            }
        });
        return res.status(200).json({ success: true, message: "Metrics updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.handleUpdateStartupMetrics = handleUpdateStartupMetrics;
const handleDeleteStartupMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { metricsId } = req.body;
        if (!metricsId) {
            return res.status(400).json({ message: "Metrics Id is required" });
        }
        let metrics = yield prisma.metrics.findUnique({
            where: {
                id: metricsId
            }
        });
        if (!metrics) {
            return res.status(400).json({ message: "Metrics not found" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: metrics.startupId
            }
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        if (startup.founderId !== req.body.user.id) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        yield prisma.metrics.delete({
            where: {
                id: metricsId
            }
        });
        return res.status(200).json({ message: "Metrics deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleDeleteStartupMetrics = handleDeleteStartupMetrics;
const handleGetStartupMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(400).json({ message: "Startup Id is required" });
        }
        let startup = yield prisma.startup.findUnique({
            where: {
                id: startupId
            },
        });
        if (!startup) {
            return res.status(400).json({ message: "Startup not found" });
        }
        let metrics = yield prisma.metrics.findMany({
            where: {
                startupId
            },
            orderBy: {
                period: "desc"
            }
        });
        return res.status(200).json({ metrics });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleGetStartupMetrics = handleGetStartupMetrics;
const handleGetStartupMeetingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        if (!startupId) {
            return res.status(400).json({ msg: "Startup Id is required" });
        }
        let meetingrequests = yield prisma.meetingRequst.findMany({
            where: {
                startupId: startupId
            },
            orderBy: {
                status: "asc"
            }
        });
        return res.json(meetingrequests);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetStartupMeetingRequests = handleGetStartupMeetingRequests;
const handleUpdateMeetingRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetingRequestId, status, remarks } = req.body;
        if (!meetingRequestId || !status || !remarks) {
            return res.status(400).json({ msg: "MeetingRequestId and status is required" });
        }
        if (status == "PENDING" || (status != "APPROVED" && status != "REJECTED")) {
            return res.status(400).json({ msg: "Invalid Status" });
        }
        let existingmeetingrequest = yield prisma.meetingRequst.findUnique({
            where: {
                id: meetingRequestId
            },
            include: {
                startup: true
            }
        });
        if (!existingmeetingrequest) {
            return res.status(400).json({ msg: "Meeting Request not found" });
        }
        if (existingmeetingrequest.status !== "PENDING") {
            return res.status(400).json({ msg: "Meeting Request already processed" });
        }
        if (existingmeetingrequest.startup.founderId !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let meetingrequest = yield prisma.meetingRequst.update({
            where: {
                id: meetingRequestId
            },
            data: {
                status,
                remarks
            }
        });
        if (status.toUpperCase() == "APPROVED") {
            let meeting = yield prisma.meeting.create({
                data: {
                    date: meetingrequest.date,
                    duration: meetingrequest.duration,
                    link: "http://meet.google.com",
                    startupId: meetingrequest.startupId,
                    investorId: meetingrequest.investorId,
                    notes: remarks,
                    meetingRequestId: meetingRequestId
                }
            });
        }
        return res.json({ msg: "Updated Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleUpdateMeetingRequest = handleUpdateMeetingRequest;
const handleGetAllGrants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let grants = yield prisma.grant.findMany({
            orderBy: {
                isAssigned: "asc"
            }
        });
        return res.json(grants);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetAllGrants = handleGetAllGrants;
const handleGetStartScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const metrics = yield prisma.metrics.findFirst({
            where: {
                startupId: Number.parseInt(req.params.id)
            },
            orderBy: {
                period: "desc"
            }
        });
        if (!metrics) {
            return res.status(400).json({ msg: "Metrics not found" });
        }
        console.log(metrics);
        const response = yield fetch(process.env.SCORE_MODEL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "foundersEquity": metrics.founders_equity,
                "investorsEquity": metrics.investors_equity,
                "employeesEquity": metrics.employees_equity,
                "othersEquity": 0,
                "burnRate": metrics.burnRate,
                "runway": metrics.runway,
                "cac": 0,
                "activeUsers": metrics.customers,
                "revenue": metrics.revenue,
                "netProfit": metrics.net_profit,
                "grossMargin": metrics.gross_margin,
                "netMargin": 0,
                "retentionRate": metrics.retention_rate,
                "mrrGrowth": metrics.mrr_growth,
                "ltvCacRatio": metrics.itv_cac_ratio,
                "npsScore": metrics.nps_score,
                "conversionRate": metrics.conversion_rate,
            })
        });
        let data = yield response.json();
        return res.json({ data });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetStartScore = handleGetStartScore;
