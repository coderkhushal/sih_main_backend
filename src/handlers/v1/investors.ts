import { DbManager } from "../../utils/DbManager";

import { Request, Response } from "express";
const prisma = DbManager.getInstance().getClient()

const industries = ["ALL", "IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"]
export const handleGetStartupsIndustrywise = async (req: Request, res: Response) => {
    try {
        let { page, industry } = req.query
        
        
        if (!industry || !page) {
            return res.status(400).json({ msg: "Industry and page is required" })
        }
        
        if(industries.includes(industry.toString().toUpperCase()) === false){
            return res.status(400).json({msg: "Invalid Industry"})
        }
        if(industry.toString().toUpperCase() === "ALL"){
            let startups = await prisma.startup.findMany({
                skip: (parseInt(page.toString()) - 1) * 10,
                take: 10
            })
            return res.json(startups)
        }
        let startups = await prisma.startup.findMany({
            where: {
                industry: industry.toString().toUpperCase() as any
            },
            skip: (parseInt(page.toString()) - 1) * 10,
            take: 10
        })
        return res.json(startups)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
export const handlecreateMeetingRequest = async(req: Request, res: Response) => {
    try{
        const {startupId, datetime, duration } = req.body
        if(!startupId ){
            return res.status(400).json({msg: "Startup Id  is required"})

        }
        if(!datetime || !duration){
            return res.status(400).json({msg: "Datetime and duration  is required"})

        }
        let date = new Date(datetime)
        if(date.toString() === "Invalid Date"){
            return res.status(400).json({msg: "Invalid Date"})
        }
        let overlappingMeetingrequests = await prisma.meetingRequst.findMany({
            where:{
                startupId,
                date:{
                    gte: date,
                    lt: new Date(date.getTime() + duration*60000)
                },
                
            }
        })
        if(overlappingMeetingrequests.length > 0){
            return res.status(400).json({msg: "Some other meeting already scheduled at this time"})
        }
        let meetingrequest= await prisma.meetingRequst.create({
            data:{

                date, 
                duration,
                status:"PENDING",
                remarks:"",
                investor:{
                    connect:{
                        id: req.body.user.id
                    }
                },
                startup:{
                    connect:{
                        id: startupId
                    }
                }
            }
        })        

        return res.json({msg: "Meeting Requested"})


    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

export const handleGetInvestorMeetingRequests= async(req: Request, res: Response) => {

    try{
        let meetingrequests = await prisma.meetingRequst.findMany({
            where:{
                investorId: req.body.user.id
            }
        })
        return res.json(meetingrequests)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

export const handleGetInvestorMeetings = async(req : Request, res: Response) => {
    try{
        let meetings = await prisma.meeting.findMany({
            where:{
                investorId: req.body.user.id
            }
        })
        return res.json(meetings)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}
export const handleDeleteMeetingRequest = async(req: Request, res: Response) => {
    try{
        let {meetingRequestId} = req.body
        if(!meetingRequestId){
            return res.status(400).json({msg: "Meeting Request Id is required"})
        }
        let meetingrequest = await prisma.meetingRequst.findUnique({
            where:{
                id: meetingRequestId
            }
        })
        if(!meetingrequest){
            return res.status(400).json({msg: "Meeting Request not found"})
        }
        if(meetingrequest.investorId !== req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }
        // logic to turn zoom meeting off
        await prisma.meeting.delete({
            where:{
                meetingRequestId
            }
        })
        await prisma.meetingRequst.delete({
            where:{
                id: meetingRequestId
            }
        })
        return res.json({msg: "Deleted Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}


export const handleGetInvestorInvestments = async(req: Request, res: Response) => {
    try{
        let investments = await prisma.investment.findMany({
            where:{
                investorId: req.body.user.id
            }
        })
        return res.json(investments)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}