import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
//schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String, // optional
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail, // email validator from validator package
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast 6 characters long"],
      select: true, // to select password in response
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

//middleware with help of mongoose
// before saving pass hash it and save
userSchema.pre("save", async function () {
  if (!this.isModified) return; // if password is not modified
  const salt = await bcrypt.genSalt(10); // generates salt upto 10 roundes
  this.password = await bcrypt.hash(this.password, salt);
});

//* compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEB TOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);
