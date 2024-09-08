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
exports.handleUpdateStartupInvestmentOffer = exports.handleGetStartupInvestmentOffers = exports.handleDeleteInvestorInvestmentOffer = exports.handleUpdateInvestorInvestmentOffer = exports.handleGetInvestorInvestmentOffers = exports.handleCreateInvestmentOffer = void 0;
const DbManager_1 = require("../../utils/DbManager");
const prisma = DbManager_1.DbManager.getInstance().getClient();
const handleCreateInvestmentOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startupId, amount, equity } = req.body;
        if (!startupId || !amount || !equity) {
            return res.status(400).json({ msg: "Startup Id, amount and equity is required" });
        }
        let investmentoffer = yield prisma.investmentoffer.create({
            data: {
                startupId,
                amount,
                equity,
                remarks: "",
                status: "PENDING",
                investorId: req.body.user.id
            }
        });
        return res.json({ msg: "Investment Offer sent" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleCreateInvestmentOffer = handleCreateInvestmentOffer;
const handleGetInvestorInvestmentOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let investmentoffers = yield prisma.investmentoffer.findMany({
            where: {
                investorId: req.body.user.id
            }
        });
        return res.json(investmentoffers);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetInvestorInvestmentOffers = handleGetInvestorInvestmentOffers;
const handleUpdateInvestorInvestmentOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { investmentOfferId, equity, amount } = req.body;
        if (!investmentOfferId || !equity || !amount) {
            return res.status(400).json({ msg: "Investment Offer Id equity and amount are required" });
        }
        const exisitingOffer = yield prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            }
        });
        if (!exisitingOffer) {
            return res.status(400).json({ msg: "Investment Offer not found" });
        }
        if (exisitingOffer.status == "APPROVED" || exisitingOffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" });
        }
        let investmentoffer = yield prisma.investmentoffer.update({
            where: {
                id: investmentOfferId
            },
            data: {
                equity,
                amount
            }
        });
        return res.json({ msg: "Investment Offer updated" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleUpdateInvestorInvestmentOffer = handleUpdateInvestorInvestmentOffer;
const handleDeleteInvestorInvestmentOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { investmentOfferId } = req.body;
        if (!investmentOfferId) {
            return res.status(400).json({ msg: "Investment Offer Id is required" });
        }
        let existinginvestmentoffer = yield prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            }
        });
        if (!existinginvestmentoffer) {
            return res.status(400).json({ msg: "Investment Offer not found" });
        }
        if (existinginvestmentoffer.status == "APPROVED" || existinginvestmentoffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" });
        }
        let investmentoffer = yield prisma.investmentoffer.delete({
            where: {
                id: investmentOfferId
            }
        });
        return res.json({ msg: "Investment Offer Deleted" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleDeleteInvestorInvestmentOffer = handleDeleteInvestorInvestmentOffer;
// startup
const handleGetStartupInvestmentOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startupId } = req.body;
        let investmentoffers = yield prisma.investmentoffer.findMany({
            where: {
                startupId: startupId
            },
            orderBy: {
                status: "asc"
            }
        });
        return res.json(investmentoffers);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleGetStartupInvestmentOffers = handleGetStartupInvestmentOffers;
const handleUpdateStartupInvestmentOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { investmentOfferId, status, remarks } = req.body;
        if (!investmentOfferId || !status) {
            return res.status(400).json({ msg: "Investment Offer Id and status are required" });
        }
        const exisitingOffer = yield prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            },
            include: {
                startup: true
            }
        });
        if (!exisitingOffer) {
            return res.status(400).json({ msg: "Investment Offer not found" });
        }
        if (exisitingOffer.status == "APPROVED" || exisitingOffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" });
        }
        if (exisitingOffer.startup.founderId != req.body.user.id) {
            return res.status(400).json({ msg: "Unauthorized" });
        }
        let investmentoffer = yield prisma.investmentoffer.update({
            where: {
                id: investmentOfferId
            },
            data: {
                status,
                remarks
            }
        });
        yield prisma.investment.create({
            data: {
                amount: investmentoffer.amount,
                equity: investmentoffer.equity,
                investorId: investmentoffer.investorId,
                startupId: investmentoffer.startupId,
                startupName: exisitingOffer.startup.name
            }
        });
        //update latest metrics equity
        let latestmetrics = yield prisma.metrics.findFirst({
            where: {
                startupId: exisitingOffer.startupId
            },
            orderBy: {
                period: "desc"
            }
        });
        if (latestmetrics) {
            yield prisma.metrics.update({
                where: {
                    id: latestmetrics.id
                },
                data: {
                    founders_equity: (latestmetrics.founders_equity ? latestmetrics.founders_equity : 100) - investmentoffer.equity,
                    investors_equity: (latestmetrics.investors_equity ? latestmetrics.investors_equity : 0) + investmentoffer.equity,
                    employees_equity: (latestmetrics.employees_equity ? latestmetrics.employees_equity : 0),
                    burnRate: latestmetrics.burnRate,
                    revenue: latestmetrics.revenue,
                    period: new Date(),
                    cac: latestmetrics.cac,
                    runway: latestmetrics.runway,
                    churnRate: latestmetrics.churnRate,
                    conversion_rate: latestmetrics.conversion_rate,
                    customers: latestmetrics.customers,
                    employees: latestmetrics.employees,
                    equity: latestmetrics.equity,
                    expenses: latestmetrics.expenses,
                    gross_margin: latestmetrics.gross_margin,
                    gross_profit: latestmetrics.gross_profit,
                    itv_cac_ratio: latestmetrics.itv_cac_ratio,
                    mrr_growth: latestmetrics.mrr_growth,
                    net_profit: latestmetrics.net_profit,
                    nps_score: latestmetrics.nps_score,
                    retention_rate: latestmetrics.retention_rate,
                    startupId: latestmetrics.startupId,
                    valuation: latestmetrics.valuation,
                }
            });
        }
        return res.json({ msg: "Investment Offer updated" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.handleUpdateStartupInvestmentOffer = handleUpdateStartupInvestmentOffer;
