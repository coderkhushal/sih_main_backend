import { Request, Response } from "express";
import { DbManager } from "../../utils/DbManager";
import { GetUploadingUrl } from "../../services/getSignedUrl";

const prisma = DbManager.getInstance().getClient()
export const handleCreatePatent = async (req: Request, res: Response) => {
    try {
        let { startupId, title, description, pdfPath } = req.body
        if (!startupId || !title || !description || !pdfPath) {
            return res.status(400).json({ msg: "All fields are required" })
        }

        let applicationDate = new Date().toISOString()
        let patent = await prisma.patent.create({
            data: {
                title,
                description,
                pdfPath,
                status: "PENDING",
                startupId: startupId // Add the missing property
            }
        })
        return res.json({ msg: "Created Successfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }

}
export const handleupdatePatent = async (req: Request, res: Response) => {
    try {
        let { patentId, title, description, pdfPath } = req.body
        const existingPatent = await prisma.patent.findUnique({
            where: {
                id: patentId
            }, 
            include:{
                startup:{
                    select:{
                        founderId: true
                    }
                }
            }
        })
        if (!existingPatent) {
            return res.status(400).json({ msg: "Patent not found" })
        }
        if(existingPatent.startup.founderId !== req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }
        
        let patent = await prisma.patent.update({
            where: {
                id: patentId
            },
            data: {
                title,
                description,
                pdfPath,
                
            }
        })
        return res.json({ msg: "Updated Successfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
export const handleupdatePatentStatus = async (req: Request, res: Response) => {
    try {
        let { patentId, status } = req.body
        if (!patentId || !status) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        let approvedDate
        if (status == "APPROVED") {
            approvedDate = new Date().toISOString()
        }
        if (req.body.user.role.includes("GOVERNMENT")) {
            let patent = await prisma.patent.update({
                where: {
                    id: patentId
                },
                data: {
                    status: status,
                    approvalDate: approvedDate
                }
            })
            return res.json({ msg: "Updated Successfully" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
export const handleDeletePatent = async(req: Request, res: Response) => {
    try{
        let {patentId} = req.body
        if(!patentId){
            return res.status(400).json({msg: "Patent Id is required"})
        }
        let existingpatent = await prisma.patent.findUnique({
            where:{
                id: patentId
            },
            include:{
                startup:{
                    select:{
                        founderId: true
                    }
                }
            }
        })
        if(!existingpatent){
            return res.status(400).json({msg: "Patent not found"})
        }
        if(existingpatent.startup.founderId !== req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }

        let patent = await prisma.patent.delete({
            where:{
                id: patentId
            }
        })
        return res.json({msg: "Deleted Successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

export const handleGetPatents =async(req: Request, res: Response) => {
    try{
        let {startupId} = req.body
        if(!startupId){
            return res.status(400).json({msg: "Startup Id is required"})
        }
        let patents = await prisma.patent.findMany({
            where:{
                startupId
            }
        })
        return res.json({patents})


    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}
export const handleGetPatentPdfUploadingUrl = async(req: Request, res: Response) => {  
    try{
        let {startupId} = req.body
        if(!startupId){
            return res.status(400).json({msg: "Patent Id is required"})
        }
        let startup = await prisma.startup.findUnique({
            where:{
                id: startupId
            },
            include:{
                patents:{
                    select:{
                        id: true
                    }
                }
            }
        })
        if(!startup){
            return res.status(400).json({msg: "startup not found"})
        }
        if(startup.founderId!=req.body.user.id){
            return res.status(400).json({msg: "Unauthorized"})
        }
        let url = await GetUploadingUrl(`patents/${startupId}-${startup.patents.length+1}`)

        return res.json({url, pdfPath:`https://s3.ap-south-1.amazonaws.com/bucket.khushalbhasin.live/patents/${startupId}-${startup.patents.length+1}`})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}