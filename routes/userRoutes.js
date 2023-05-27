import express from "express";
import userAuth from "../middlewares/authMiddleware.js    ";
import { updateUserController } from "../controllers/userController.js";

//router Object
const router = express.Router();

// routes
//* GET USERS || GET || /api/users/v1/get-users

//* UPDATE USER || PUT || /api/users/v1/update-user/:id
router.put("/update-user", userAuth, updateUserController);

export default router;
