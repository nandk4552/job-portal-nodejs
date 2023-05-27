import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

// router object
const router = express.Router();
//* IP rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user collection
 *           example: VDJHVADHJVDDVj
 *         name:
 *           type: string
 *           description: User name
 *           example: John
 *         lastName:
 *           type: string
 *           description: User last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: User email address
 *           example: Johndoe@gmail.com
 *         password:
 *           type: string
 *           description: User password (should be greater than 6 characters)
 *           example: John@123
 *         location:
 *           type: string
 *           description: User location (city or country)
 *           example: hyderabad
 *       example:
 *         id: VDJHVADHJVDDVj
 *         name: John
 *         lastName: Doe
 *         email: johndoes@gmail.com
 *         password: test@123
 *         location: Hyderabad
 */

/**
 * @swagger
 * tags:
 *    name: Auth
 *    description: The authentication managing API's
 */
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

//routes
//* REGISTER  || POST || /api/auth/v1/register
router.post("/register", limiter, registerController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Something went wrong
 */

//* LOGIN  || POST || /api/auth/v1/login
router.post("/login", limiter, loginController);

//export
export default router;
