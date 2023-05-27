import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  //* get token from header
  const authHeader = req.headers.authorization;
  //* check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth Failed");
  }
  //* get token // Bearer 123556
  const token = authHeader.split(" ")[1];

  try {
    //* verify token
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    //* check passed from response
    req.user = { userId: payload.userId };
    next(); //* to move to next middleware
  } catch (error) {
    next("Auth Failed");
  }
};

export default userAuth;
