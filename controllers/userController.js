import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
  //* get user id from req.user
  const { name, lastName, email, location } = req.body;
  //* basic validation
  if (!name || !lastName || !email || !location) {
    next("All fields are required");
  }
  //* check if user exists
  const user = await userModel.findOne({ _id: req.user.userId });

  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  //* create token
  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
  });
};
