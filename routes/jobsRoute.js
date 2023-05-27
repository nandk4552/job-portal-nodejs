import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobsController,
  getAllJobsController,
  jobStatsController,
  updateJobsController,
} from "../controllers/jobsController.js";

const router = express.Router();
//* routes

//* CREATE JOB || POST || /api/v1/job/create-job
router.post("/create-job", userAuth, createJobController);

//* GET JOBS|| GET || /api/v1/job/get-jobs
router.get("/get-jobs", userAuth, getAllJobsController);

//* UPDATE JOBS|| PATCH || /api/v1/job/update-job/:id
router.patch("/update-job/:id", userAuth, updateJobsController);

//* DELETE JOBS || DELETE || /api/v1/job/delete-job/:id
router.delete("/delete-job/:id", userAuth, deleteJobsController);


//* JOBS STATS FILTER || GET || /api/v1/job/job-stats/
router.get("/job-stats", userAuth, jobStatsController);

export default router;
