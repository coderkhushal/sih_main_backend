import { DbManager } from "../../utils/DbManager"

const prisma = DbManager.getInstance().getClient()
import { Request, Response } from "express";
export const handleCreateInvestmentOffer = async (req: Request, res: Response) => {
    try {
        const { startupId, amount, equity } = req.body
        if (!startupId || !amount || !equity) {
            return res.status(400).json({ msg: "Startup Id, amount and equity is required" })

        }
        let investmentoffer = await prisma.investmentoffer.create({
            data: {
                startupId,
                amount,
                equity,
                remarks : "",
                status: "PENDING",
                investorId: req.body.user.id
            }
        })

        return res.json({ msg: "Investment Offer sent" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const handleGetInvestorInvestmentOffers = async (req: Request, res: Response) => {

    try {
        let investmentoffers = await prisma.investmentoffer.findMany({
            where: {
                investorId: req.body.user.id
            }
        })
        return res.json(investmentoffers)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const handleUpdateInvestorInvestmentOffer = async (req: Request, res: Response) => {
    try {
        const { investmentOfferId, equity, amount } = req.body
        if (!investmentOfferId || !equity || !amount) {
            return res.status(400).json({ msg: "Investment Offer Id equity and amount are required" })
        }
        const exisitingOffer = await prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            }
        })
        if (!exisitingOffer) {
            return res.status(400).json({ msg: "Investment Offer not found" })
        }

        if (exisitingOffer.status == "APPROVED" || exisitingOffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" })
        }
        let investmentoffer = await prisma.investmentoffer.update({
            where: {
                id: investmentOfferId
            },
            data: {
                equity, 
                amount
            }
        })
        return res.json({ msg: "Investment Offer updated" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const handleDeleteInvestorInvestmentOffer = async (req: Request, res: Response) => {
    try {
        const { investmentOfferId } = req.body
        if (!investmentOfferId) {
            return res.status(400).json({ msg: "Investment Offer Id is required" })
        }
        let existinginvestmentoffer = await prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            }
        })
        if (!existinginvestmentoffer) {
            return res.status(400).json({ msg: "Investment Offer not found" })
        }

        if (existinginvestmentoffer.status == "APPROVED" || existinginvestmentoffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" })
        }

        let investmentoffer = await prisma.investmentoffer.delete({
            where: {
                id: investmentOfferId
            }
        })
        return res.json({ msg: "Investment Offer Deleted" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

// startup
export const handleGetStartupInvestmentOffers = async (req: Request, res: Response) => {
    try {
        let {startupId} = req.body
        let investmentoffers = await prisma.investmentoffer.findMany({
            where: {
                startupId:startupId
            },
            orderBy:{
                status: "asc"
            }
        })
        return res.json(investmentoffers)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}



export const handleUpdateStartupInvestmentOffer = async (req: Request, res: Response) => {
    try {
        const { investmentOfferId, status , remarks} = req.body
        console.log(investmentOfferId, status)
        if (!investmentOfferId || !status) {
            return res.status(400).json({ msg: "Investment Offer Id and status are required" })
        }
        if(status!="APPROVED" && status!="REJECTED"){
            return res.status(400).json({ msg: "Invalid status" })
        }
        const exisitingOffer = await prisma.investmentoffer.findUnique({
            where: {
                id: investmentOfferId
            },
            include:{
                startup:true
            }
        })
        if (!exisitingOffer) {
            return res.status(400).json({ msg: "Investment Offer not found" })
        }

        if (exisitingOffer.status == "APPROVED" || exisitingOffer.status == "REJECTED") {
            return res.status(400).json({ msg: "Investment Offer already processed" })
        }
        if(exisitingOffer.startup.founderId!=req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }
        let investmentoffer = await prisma.investmentoffer.update({
            where: {
                id: investmentOfferId
            },
            data: {
                status,
                remarks

            }
        })

        await prisma.investment.create({
            data:{
                amount: investmentoffer.amount,
                equity: investmentoffer.equity,
                investorId: investmentoffer.investorId,
                startupId: investmentoffer.startupId,
                startupName: exisitingOffer.startup.name

            }
        })
        //update latest metrics equity
        let latestmetrics = await prisma.metrics.findFirst({
            where:{
                startupId: exisitingOffer.startupId
            },
            orderBy:{
                period: "desc"
            }
        })
        if(latestmetrics){
            await prisma.metrics.update({
                where:{
                    id: latestmetrics.id
                },
                data:{
                    founders_equity: (latestmetrics.founders_equity? latestmetrics.founders_equity : 100) - investmentoffer.equity,
                    investors_equity: (latestmetrics.investors_equity? latestmetrics.investors_equity : 0) + investmentoffer.equity,
                    employees_equity: (latestmetrics.employees_equity? latestmetrics.employees_equity : 0) , 
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
            })
        }
        
        return res.json({ msg: "Investment Offer updated" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

