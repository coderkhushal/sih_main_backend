import { Request, Response } from "express"
import {DbManager} from "../../utils/DbManager"
const prisma = DbManager.getInstance().getClient()

export const handleCreateGrant = async(req: Request, res: Response) => {
    try{
        const {title, description, amount, requirements, deadline} = req.body

        if(!title || !description || !amount || !requirements || !deadline){
            return res.status(400).json({msg: "All fields are required"})
        }

        if(!req.body.user.role.includes("GOVERNMENT")){
            return res.status(401).json({msg: "Unauthorized"})
        }

        let deadlinedatetime= new Date(deadline)
        if(deadlinedatetime.toString() === "Invalid Date"){
            return res.status(400).json({message: "Invalid date"})
        }
        deadlinedatetime.setHours(0,0,0,0)
            let grant = await prisma.grant.create({
                data:{
                    title,
                    description,
                    amount,
                    requirements,
                    deadline: deadlinedatetime,
                    status:"PENDING",
                    isAssigned:false,
                    remark: "",
                    fundingBody: {
                        connect:{
                            id: req.body.user.id
                        }
                    }


                }
            })
            return res.json({msg: "Created Successfully"})
        
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}


export const handleUpdateGrant = async(req: Request, res: Response) => {
    try{
        const {grantId, title, description, amount, requirements, deadline, status, isAssigned, remark} = req.body

        if(!grantId){
            return res.status(400).json({msg: "Grant Id is required"})
        }

        if(!req.body.user.role.includes("GOVERNMENT")){
            return res.status(401).json({msg: "Unauthorized"})
        }
        let existinggrant = await prisma.grant.findUnique({
            where:{
                id: grantId
            }
        })
        if(!existinggrant){
            return res.status(400).json({msg: "Grant does not exist"})
        }
        let deadlinedatetime
        if(deadline){

            deadlinedatetime= new Date(deadline)
            if(deadlinedatetime.toString() === "Invalid Date"){
                return res.status(400).json({message: "Invalid date"})
            }
            deadlinedatetime.setHours(0,0,0,0)
        }
        let grant = await prisma.grant.update({
            where:{
                id: grantId
            },
            data:{
                title,
                description,
                amount,
                requirements,
                deadline:deadlinedatetime,
                status,
                isAssigned,
                remark
            }
        })
        return res.json({msg: "Updated Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}
export const handleDeleteGrant = async(req: Request, res: Response) => {
    try{
        let {grantId} = req.body
        if(!grantId){
            return res.status(400).json({msg: "Grant Id is required"})
        }

        if(!req.body.user.role.includes("GOVERNMENT")){
            return res.status(401).json({msg: "Unauthorized"})
        }
        let existinggrant = await prisma.grant.findUnique({
            where:{
                id: grantId
            }
        })
        if(!existinggrant){
            return res.status(400).json({msg: "Grant does not exist"})
        }
        await prisma.grant.delete({
            where:{
                id: grantId
            }
        })
        return res.json({msg: "Deleted Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}
export const handleGetGrants = async(req: Request, res: Response) => {
    try{

        if(!req.body.user.role.includes("GOVERNMENT")){
            return res.status(401).json({msg: "Unauthorized"})
        }
        let grants = await prisma.grant.findMany({
            where :{
                fundingBodyId: req.body.user.id
            }
        })
        return res.json({grants})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

export const handleAssignGrant = async(req: Request, res: Response) => {
    try{
        const {grantId, startupId} = req.body

        if(!grantId || !startupId){
            return res.status(400).json({msg: "Grant Id and Startup Id are required"})
        }

        if(!req.body.user.role.includes("GOVERNMENT")){
            return res.status(401).json({msg: "Unauthorized"})
        }
        let existinggrant = await prisma.grant.findUnique({
            where:{
                id: grantId,
                
            },
            include:{
                applications:{
                    where:{
                        startupId
                    }
                }
            }
        })
        if(!existinggrant){
            return res.status(400).json({msg: "Grant does not exist"})
        }
        if(existinggrant.applications.length==0){
            return res.status(400).json({msg: "Startup has not applied for this grant"})
        }
        let existingStartup = await prisma.startup.findUnique({
            where:{
                id: startupId
            }
        })
        if(!existingStartup){
            return res.status(400).json({msg: "Startup does not exist"})
        }
        let grant = await prisma.grant.update({
            where:{
                id: grantId
            },
            data:{
                isAssigned: true,
                status:"APPROVED",
                startup:{
                    connect:{
                        id: startupId
                    }
                }
            }
        })
        return res.json({msg: "Assigned Successfully"})

    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }

}

export const handleSubmitGrantApplication = async(req: Request, res: Response) => {
    try{
        const {grantId,startupId} = req.body
        
        if(!grantId || !startupId){
            return res.status(400).json({msg: "Grant Id and Startup Id are required"})
        }

        let existinggrant = await prisma.grant.findUnique({
            where:{
                id: grantId
            }
        })
        if(!existinggrant){
            return res.status(400).json({msg: "Grant does not exist"})
        }
        if(existinggrant.isAssigned){
            return res.status(400).json({msg: "Grant is already assigned"})
        }
        let existingStartup = await prisma.startup.findUnique({
            where:{
                id: startupId
            }
        })
        if(!existingStartup){
            return res.status(400).json({msg: "Startup does not exist"})
        }
        if(existingStartup.founderId !== req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }

        let newapplication = await prisma.grantApplication.create({
            data:{
                grant:{
                    connect:{
                        id: grantId
                    }
                },
                startup:{
                    connect:{
                        id: startupId
                    }
                },
                
                }
            })
            
            return res.json({msg: "Application Submitted Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }

}