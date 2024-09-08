import { Request, Response } from "express";
import { DbManager } from "../../utils/DbManager";

const industries = ["IT", "HEALTH", "FINANCE", "AGRICULTURE", "EDUCATION", "ENERGY", "TRANSPORT", "MANUFACTURING", "RETAIL", "OTHER", "REAL_ESTATE", "TOURISM", "ENTERTAINMENT"]
const prisma = DbManager.getInstance().getClient()

export const handleCreateStartup = async(req: Request, res: Response)=>{
    try{
        let{name, description, location, industry ,funding, website , foundedAt, teamSize} = req.body
        if(!name || !description || !location || !industry || !funding || !website || !foundedAt || !teamSize){
            return res.status(400).json({message: "All fields are required"})
        }
        if(industries.includes(industry.toUpperCase()) === false){
            return res.status(400).json({message: "Invalid Industry"})
        }
        if(req.body.user.role.includes("ENTERPRENEUR") === false){
            return res.status(400).json({message: "You must be a entrepreneur to create a startup"})
        }
        let startup = await prisma.startup.create({
            data:{
                name,
                description,
                location, 
                industry,
                funding,
                website,
                foundedAt,
                teamSize, 
                founder : {
                    connect :{
                        id: req.body.user.id
                    }
                }
            }
        })
        return res.status(200).json({message: "Startup created successfully", startupId: startup.id})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const handleGetUserStartups = async(req: Request, res: Response)=>{
    try{
        let startups = await prisma.startup.findMany({
            where:{
                founderId: req.body.user.id
            }
        })
        return res.status(200).json({startups})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const handleUpdateStartup= async(req: Request, res: Response)=>{

    try{
        let{startupId, name, description, location, industry ,funding, website , foundedAt, teamSize} = req.body
        if(!startupId){
            return res.status(400).json({message:"Startup Id is required"})
        }
        if(!name && !description && !location && !industry && !funding && !website && !foundedAt && !teamSize){
            return res.status(400).json({message: "Nothing to update"})
        }
        let existingstartup = await prisma.startup.findUnique({
            where:{
                id: startupId
            }
        })
        if(! existingstartup ){
            return res.status(400).json({message: "Startup not found"})
        }
        if(existingstartup.founderId !== req.body.user.id){
            return res.status(400).json({message: "Unauthorized"})
        }
        let startup = await prisma.startup.update({
            where:{
                id: startupId
            },
            data:{
                name,
                description,
                location, 
                industry,
                funding,
                website,
                foundedAt,
                teamSize, 
            }
        })
        return res.status(200).json({message: "Startup updated successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const handleDeleteStartup = async(req: Request, res: Response)=>{
    try{
        let {startupId} = req.body
        if(!startupId){
            return res.status(400).json({message: "Startup Id is required"})
        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: startupId
            }
        })
        if(!startup){
            return res.status(400).json({message: "Startup not found"})
        }
        if(startup.founderId !== req.body.user.id){
            return res.status(400).json({message: "Unauthorized"})
        }
        await prisma.startup.delete({
            where:{
                id: startupId
            }
        })
        return res.status(200).json({message: "Startup deleted successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const handleCreateStartupMetrics = async(req: Request, res: Response)=>{
    try{
        let {startupId, period, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway  } = req.body
        if( !startupId  ){ 
            return res.status(400).json({"message":"startupId not found"})

        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: startupId
            }
        })
        if(!startup){
            return res.status(400).json({message: "Startup not found"})
        }
        if(startup.founderId !== req.body.user.id){
            return res.status(400).json({message: "Unauthorized"})
        }
        let perioddatetime  = new Date(period)
        if(perioddatetime.toString() === "Invalid Date"){
            return res.status(400).json({message: "Invalid date"})
        }
        perioddatetime.setHours(0,0,0,0)
        let metrics = await prisma.metrics.create({
            data:{
                 period:perioddatetime, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway,
                 
                startup:{
                    connect:{
                        id: startupId
                    }
                }
            }
        })
        return res.status(200).json({message: "Metrics created successfully"})

    } 
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const handleUpdateStartupMetrics = async(req: Request, res: Response) =>{
    try{

        let {metricsId, period, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway, createdAt, updatedAt
} = req.body
        if(!metricsId){
            return res.status(400).json({message: "Metrics Id is required"})
        }
        let metrics = await prisma.metrics.findUnique({
            where:{
                id: metricsId
            }
        })
        if(!metrics){
            return res.status(400).json({message: "Metrics not found"})
        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: metrics.startupId
            }
        })
        if(!startup){
            return res.status(400).json({message: "Startup not found"})
        }
        if(startup.founderId !== req.body.user.id){
            return res.status(400).json({message: "Unauthorized"})
        }
        let perioddatetime 
        if(period){

             perioddatetime  = new Date(period)
            if(perioddatetime.toString() === "Invalid Date"){
                return res.status(400).json({message: "Invalid date"})
            }
            perioddatetime.setHours(0,0,0,0)
        }
        let updatedMetrics = await prisma.metrics.update({
            where:{
                id: metricsId
            },
            data:{
                 period:perioddatetime, retention_rate, mrr_growth, itv_cac_ratio, nps_score, conversion_rate, revenue, expenses, valuation, net_profit, gross_profit, gross_margin, founders_equity, investors_equity, employees_equity, customers, employees, churnRate, burnRate, cac, equity, runway, createdAt, updatedAt


            }
        })
        return res.status(200).json({success: true, message: "Metrics updated successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success: false,message: "Internal Server Error"})
    }
}

export const handleDeleteStartupMetrics = async(req : Request, res: Response)=>{
    try{
        let {metricsId} = req.body
        if(!metricsId){
            return res.status(400).json({message: "Metrics Id is required"})
        }
        let metrics = await prisma.metrics.findUnique({
            where:{
                id: metricsId
            }
        })
        if(!metrics){
            return res.status(400).json({message: "Metrics not found"})
        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: metrics.startupId
            }
        })
        if(!startup){
            return res.status(400).json({message: "Startup not found"})
        }
        if(startup.founderId !== req.body.user.id){
            return res.status(400).json({message: "Unauthorized"})
        }
        await prisma.metrics.delete({
            where:{
                id: metricsId
            }
        })
        return res.status(200).json({message: "Metrics deleted successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const handleGetStartupMetrics = async(req: Request, res: Response)=>{
    try{
        let {startupId} = req.body
        if(!startupId){
            return res.status(400).json({message: "Startup Id is required"})
        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: startupId
            },
        })
        if(!startup){
            return res.status(400).json({message: "Startup not found"})
        }
        let metrics = await prisma.metrics.findMany({
            where:{
                startupId
            },
            orderBy:{
                period: "desc"
            }
        })
        return res.status(200).json({metrics})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
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
        if(status=="PENDING" ){
            return res.status(400).json({msg: "Invalid Status"})
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
       if(status=="ACCEPTED"){

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
        } 
        return res.json({msg: "Updated Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

