import { DbManager } from "../../utils/DbManager";

import { Request, Response } from "express";
const prisma = DbManager.getInstance().getClient()

const industries = ["IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"]
export const handleGetStartupsIndustrywise = async (req: Request, res: Response) => {
    try {
        let { industry } = req.params
        if (!industry) {
            return res.status(400).json({ msg: "Industry is required" })
        }
        
        if(industries.includes(industry.toUpperCase()) === false){
            return res.status(400).json({msg: "Invalid Industry"})
        }
        let startups = await prisma.startup.findMany({
            where: {
                industry: industry.toUpperCase() as any
            }
        })
        return res.json(startups)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
