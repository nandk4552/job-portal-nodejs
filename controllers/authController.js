import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  //next is a function which is used to call next middleware or error middleware in this case

  const { name, email, password } = req.body;

  //basic validate
  if (!name) {
    next("name is required..!");
  }
  if (!email) {
    next("email is required..!");
  }
  if (!password) {
    next("password is required and must be greater than 6 characters..!");
  }

  //check if user already exists using email
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next("Email already register please login");
  }

  //create a new user
  const user = await userModel.create({ name, email, password });
  //creating token and saving into localstorage
  const token = user.createJWT();

  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

// for login
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //* validation
  if (!email || !password) {
    next("Please Provide All fields");
  } 
  //* check if user exists by email
  const user = await userModel.findOne({ email }).select("+password");

  //* if user does not exists
  if (!user) {
    next("Invalid Username or Password");
  }

  //* compare password
  const isMatch = await user.comparePassword(password);

  //* if password does not match
  if (!isMatch) {
    next("Invalid Username or Password");
  }

  //* making password undefined in toke
  user.password = undefined;

  //* if everything is ok then generate token
  const token = user.createJWT();

  res.status(200).json({
    success: true,
    message: "User Logged In Successfully",
    user,
    token,
  });
};
