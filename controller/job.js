const Job = require("../models/job");
const { updateOne } = require("../models/user");

const createJobPost = async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      information,
      jobType,
      skills,
    } = req.body;
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !salary ||
      !location ||
      !duration ||
      !locationType ||
      !information ||
      !jobType ||
      !skills
    ) {
      //use yup of joi for detailed validation
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const jobDetails = new Job({
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      information,
      jobType,
      skills,
      refUserId: currentUserId,
    });
    await jobDetails.save();
    res.json({ message: "Job created Successfully" });
  } catch (error) {
    next(error);
  }
};

const getJobDetailsById = async (req, res, next) => {
  try {
    const { jobid } = req.params;
    if (!jobid) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const jobDetails = await Job.findById(jobid);
    if (!jobDetails) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    res.json({ jobDetails });
  } catch (error) {
    next(error);
  }
};

const updateJobDetailsById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.params.userId
    console.log(userId)
    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      information,
      jobType,
      skills,
    } = req.body;
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !salary ||
      !location ||
      !duration ||
      !locationType ||
      !information ||
      !jobType ||
      !skills
    ) {
      //use yup of joi for detailed validation
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const isJobExist = await Job.findOne({ _id: jobId });
    //check if refUserId == parameter id
    if (!isJobExist) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          logoUrl,
          title,
          description,
          salary,
          location,
          duration,
          locationType,
          information,
          jobType,
          skills,
        },
      }
    );
    res.json({ message: "Job Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const searchQuery = req.query.searchQuery || "";
    const skills = req.query.skills;
    let filteredSkills;
    let filter = {}
    if (skills && skills.length > 0) {
      filteredSkills = skills.split(",");
      const caseInsensitiveFilteredSkills = filteredSkills.map(
        (element) => new RegExp(element, "i")
      );
      filteredSkills = caseInsensitiveFilteredSkills;
      filter = {skills: {$in: filteredSkills}};
    }

    const jobList = await Job.find(
      { title: { $regex: searchQuery, $options: "i" }, ...filter },
      { companyName: 1, title: 1, description: 1 }
    );

    res.json({ data: jobList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getJobDetailsById,
  updateJobDetailsById,
  getAllJobs,
};
