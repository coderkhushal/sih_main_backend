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
exports.handleUpdateMeetingRequest = exports.handleGetMeetingRequests = exports.handleRequestMeeting = exports.handleGetStartupsIndustrywise = void 0;
const DbManager_1 = require("../../utils/DbManager");
const prisma = DbManager_1.DbManager.getInstance().getClient();
const industries = ["IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"];
const handleGetStartupsIndustrywise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { industry } = req.params;
        if (!industry) {
            return res.status(400).json({ msg: "Industry is required" });
        }
        if (industries.includes(industry.toUpperCase()) === false) {
            return res.status(400).json({ msg: "Invalid Industry" });
        }
        let startups = yield prisma.startup.findMany({
            where: {
                industry: industry.toUpperCase()
            }
        });
        return res.json(startups);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetStartupsIndustrywise = handleGetStartupsIndustrywise;
const handleRequestMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let meetingrequest = yield prisma.meetingRequst.create({
            data: {
                startupId,
                date,
                duration,
                status: "PENDING",
                remarks: "",
                investorId: req.body.user.id
            }
        });
        return res.json({ msg: "Meeting Requested" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleRequestMeeting = handleRequestMeeting;
const handleGetMeetingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let meetingrequests = yield prisma.meetingRequst.findMany({
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
exports.handleGetMeetingRequests = handleGetMeetingRequests;
const handleUpdateMeetingRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetingRequestId, status, remarks } = req.body;
        if (!meetingRequestId || !status) {
            return res.status(400).json({ msg: "MeetingRequestId and status is required" });
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
        let meeting = yield prisma.meeting.create({
            data: {
                date: meetingrequest.date,
                duration: meetingrequest.duration,
                link: "http://meet.google.com",
                startupId: meetingrequest.startupId,
                investorId: meetingrequest.investorId,
                notes: remarks
            }
        });
        return res.json({ msg: "Updated Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleUpdateMeetingRequest = handleUpdateMeetingRequest;
