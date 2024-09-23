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
exports.handleGetInvestorInvestments = exports.handleDeleteMeetingRequest = exports.handleGetInvestorMeetings = exports.handleGetInvestorMeetingRequests = exports.handlecreateMeetingRequest = exports.handleGetStartupsIndustrywise = void 0;
const DbManager_1 = require("../../utils/DbManager");
const prisma = DbManager_1.DbManager.getInstance().getClient();
const industries = ["ALL", "IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"];
const handleGetStartupsIndustrywise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, industry } = req.query;
        if (!industry || !page) {
            return res.status(400).json({ msg: "Industry and page is required" });
        }
        if (industries.includes(industry.toString().toUpperCase()) === false) {
            return res.status(400).json({ msg: "Invalid Industry" });
        }
        if (industry.toString().toUpperCase() === "ALL") {
            let startups = yield prisma.startup.findMany({
                skip: (parseInt(page.toString()) - 1) * 10,
                take: 10
            });
            return res.json(startups);
        }
        let startups = yield prisma.startup.findMany({
            where: {
                industry: industry.toString().toUpperCase()
            },
            skip: (parseInt(page.toString()) - 1) * 10,
            take: 10
        });
        return res.json(startups);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetStartupsIndustrywise = handleGetStartupsIndustrywise;
const handlecreateMeetingRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startupId, datetime, duration } = req.body;
        if (!startupId) {
            return res.status(400).json({ msg: "Startup Id  is required" });
        }
        if (!datetime || !duration) {
            return res.status(400).json({ msg: "Datetime and duration  is required" });
        }
        let date = new Date(datetime);
        if (date.toString() === "Invalid Date") {
            return res.status(400).json({ msg: "Invalid Date" });
        }
        let overlappingMeetingrequests = yield prisma.meetingRequest.findMany({
            where: {
                startupId,
                date: {
                    gte: date,
                    lt: new Date(date.getTime() + duration * 60000)
                },
            }
        });
        if (overlappingMeetingrequests.length > 0) {
            return res.status(400).json({ msg: "Some other meeting already scheduled at this time" });
        }
        let meetingrequest = yield prisma.meetingRequest.create({
            data: {
                date,
                duration,
                status: "PENDING",
                remarks: "",
                investor: {
                    connect: {
                        id: req.body.user.id
                    }
                },
                startup: {
                    connect: {
                        id: startupId
                    }
                }
            }
        });
        return res.json({ msg: "Meeting Requested" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handlecreateMeetingRequest = handlecreateMeetingRequest;
const handleGetInvestorMeetingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let meetingrequests = yield prisma.meetingRequest.findMany({
            where: {
                investorId: req.body.user.id
            }
        });
        return res.json(meetingrequests);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetInvestorMeetingRequests = handleGetInvestorMeetingRequests;
const handleGetInvestorMeetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let meetings = yield prisma.meeting.findMany({
            where: {
                investorId: req.body.user.id
            }
        });
        return res.json(meetings);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetInvestorMeetings = handleGetInvestorMeetings;
const handleDeleteMeetingRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { meetingRequestId } = req.body;
        if (!meetingRequestId) {
            return res.status(400).json({ msg: "Meeting Request Id is required" });
        }
        let meetingrequest = yield prisma.meetingRequest.findUnique({
            where: {
                id: meetingRequestId
            }
        });
        if (!meetingrequest) {
            return res.status(400).json({ msg: "Meeting Request not found" });
        }
        if (meetingrequest.investorId !== req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        // logic to turn zoom meeting off
        yield prisma.meeting.delete({
            where: {
                meetingRequestId
            }
        });
        yield prisma.meetingRequest.delete({
            where: {
                id: meetingRequestId
            }
        });
        return res.json({ msg: "Deleted Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleDeleteMeetingRequest = handleDeleteMeetingRequest;
const handleGetInvestorInvestments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let investments = yield prisma.investment.findMany({
            where: {
                investorId: req.body.user.id
            }
        });
        return res.json(investments);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetInvestorInvestments = handleGetInvestorInvestments;
