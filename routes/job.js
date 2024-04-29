const express = require("express")
const router = express.Router();
const jobController = require("../controller/job")
const verifyToken = require("../middlewares/verifyAuth");

router.post("/create",verifyToken,jobController.createJobPost)
router.get("/job-details/:jobid",jobController.getJobDetailsById)
router.put("/update/:jobid",verifyToken,jobController.updateJobDetailsById)
router.get("/all",verifyToken,jobController.getAllJobs)

module.exports = router