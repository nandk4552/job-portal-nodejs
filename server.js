//** swagger imports API DOCUMENTATION
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// packages imports
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// files imports
import connectDB from "./config/db.js";

//routes imports
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoute from "./routes/jobsRoute.js";
//middleware imports
import errorMiddleware from "./middlewares/errorMiddleware.js";
import swaggerJSDoc from "swagger-jsdoc";

//dot env config
dotenv.config();

//mongodb connection
connectDB();

//swagger API config
//swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal API",
      description: "Node ExpressJs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
//swagger spec
const spec = swaggerJSDoc(options);

// rest object
const app = express();

//middleware
//xss-clean to protect agianst crossite scripting attack
app.use(xss());
//helmet to protect headers
app.use(helmet());
//to protect mongoDB
app.use(mongoSanitize());

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes); //auth routes
app.use("/api/v1/user", userRoutes); //user routes
app.use("/api/v1/job", jobsRoute); //jobs route

//home route root
// swagger documentation
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middleware
app.use(errorMiddleware);

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running in ${process.env.DEV_MODE} Mode on port ${PORT}`.bgCyan
      .white
  );
});
