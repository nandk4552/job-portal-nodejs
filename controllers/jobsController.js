import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

//**=======CREATE JOB CONTROLLER===== */
export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("All fields are required");
  }
  //* check with user id
  req.body.createdBy = req.user.userId;
  //* create job
  const job = await jobsModel.create(req.body);
  //* send responses
  res.status(201).json({ job });
};

//**=======GET ALL JOBS CONTROLLER===== */
export const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //* conditions for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  //* logic for filters like status, workType, search
  //* if status is not all then add status to queryObject
  if (status && status !== "all") {
    queryObject.status = status;
  }
  //* if workType is not all then add workType to queryObject
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  //* if search is not empty then add search to queryObject
  if (search) {
    //$regex is used to search for a string in a field
    //$options is used to make the search case insensitive
    queryObject.position = { $regex: search, $options: "i" };
  }

  //* get jobs
  let queryResult = jobsModel.find(queryObject);

  //* sorting jobs
  if (sort === "latest") {
    //* if sort is latest then sort by createdAt in descending order
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    //* if sort is oldest then sort by createdAt in ascending order
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    //a-z sort by position in ascending order
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    //z-a sort by position in descending order
    queryResult = queryResult.sort("-position");
  }
  //* pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //* jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

//**=======UPDATE JOB CONTROLLER===== */
export const updateJobsController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  //* validation
  if (!company || !position) {
    next("All fields are required");
  }

  //* check if job exists
  const job = await jobsModel.findOne({ _id: id });

  //* if job not exists
  if (!job) {
    next(`No jobs found with this ${id}`);
  }

  //* check if user is authorized and job is created by him
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to update this job");
    return;
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    updateJob,
  });
};

//**=======DELETE JOB CONTROLLER===== */
export const deleteJobsController = async (req, res, next) => {
  const { id } = req.params;
  //* check if job exists
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No jobs found with this ${id}`);
  }
  //* check if user is authorized and job is created by him
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to delete this job");
    return;
  }
  //* delete job
  await job.deleteOne();
  //* send response
  res.status(200).json({
    message: "Job deleted successfully",
  });
};

//**=======JOB STATS CONTROLLER===== */
export const jobStatsController = async (req, res) => {
  //* aggregate query
  const stats = await jobsModel.aggregate([
    //* search by user jobs by user id
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    //* group by status
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //* default stats
  const defaultStats = {
    interview: 0,
    reject: 0,
    pending: 0,
  };

  stats.forEach((item) => {
    if (item._id === "interview") {
      defaultStats.interview = item.count;
    } else if (item._id === "reject") {
      defaultStats.reject = item.count;
    } else if (item._id === "pending") {
      defaultStats.pending = item.count;
    }
  });

  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    //* search by user jobs by user id
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    //* group by month
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  //* formating month and year from monthlyapplications
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM YYYY");
      return { date, count };
    })
    .reverse();

  //* send response
  res.status(200).json({
    totalJobs: stats.length,
    stats: defaultStats,
    monthlyApplication,
  });
};
