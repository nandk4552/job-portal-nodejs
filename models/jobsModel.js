import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"], //! required
    },
    position: {
      type: String,
      required: [true, "Job Position is required"], // ! required
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "reject", "pending"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Hyderabad",
      required: [true, "Work Location is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
