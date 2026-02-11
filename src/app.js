import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./router/user.route.js";
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoute);

export default app;
