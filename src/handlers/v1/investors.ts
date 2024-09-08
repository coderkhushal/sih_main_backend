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
export const handleRequestMeeting = async(req: Request, res: Response) => {
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
        let meetingrequest= await prisma.meetingRequst.create({
            data:{
                startupId,
                date, 
                duration,
                status:"PENDING",
                remarks:"",
                investorId: req.body.user.id
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

export const handleGetStartupMeetingRequests= async(req: Request, res: Response) => {

    try{
        let {startupId} = req.body
        if(!startupId){
            return res.status(400).json({msg: "Startup Id is required"})
        }
        let meetingrequests = await prisma.meetingRequst.findMany({
            where:{
                startupId: startupId
            },
            orderBy:{
                status: "asc"
            }
        })
        return res.json(meetingrequests)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}


export const handleUpdateMeetingRequest = async(req: Request, res: Response) => {
    try{
        const {meetingRequestId, status, remarks} = req.body
        if(!meetingRequestId || !status){
            return res.status(400).json({msg: "MeetingRequestId and status is required"})
        }
        let meetingrequest = await prisma.meetingRequst.update({
            where:{
                id: meetingRequestId
            },
            data:{
                status,
                remarks
            }
        })
        
        let meeting = await prisma.meeting.create({
            data:{
                date: meetingrequest.date,
                duration: meetingrequest.duration,
                link:"http://meet.google.com",
                startupId: meetingrequest.startupId,
                investorId: meetingrequest.investorId  ,
                notes:remarks ,
                meetingRequestId: meetingRequestId
            }
        })
        return res.json({msg: "Updated Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}
