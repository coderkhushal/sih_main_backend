

import express from "express"

import { AuthMiddleware } from "../middleware/authmiddleware"
import { handleAssignGrant, handleCreateGrant, handleDeleteGrant, handleGetApplications, handleGetGrants, handleSubmitGrantApplication, handleUpdateGrant } from "../handlers/v1/grants"
const router = express.Router()

router.post("/create", AuthMiddleware , handleCreateGrant)
router.post("/update" , AuthMiddleware , handleUpdateGrant) 
router.post("/delete", AuthMiddleware , handleDeleteGrant)
router.post("/", AuthMiddleware, handleGetGrants )
router.post("/getApplications", AuthMiddleware, handleGetApplications )
router.post("/assign", AuthMiddleware, handleAssignGrant)
router.post("/submitApplication", AuthMiddleware, handleSubmitGrantApplication)

// router.post("/getAnalytics", handleGetStartupMetrics)


module.exports = router