import express from "express";
import { body } from "express-validator";
import { authCaptain } from "../middleware/authMiddleware.js";
import {
  handleCaptainRegister,
  handleCaptainLogin,
  handleCaptainProfile,
  handleCaptainLogout,
} from "../controller/captain.controller.js";
const router = express.Router();

router
  .route("/register", [
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long "),

    body("email").isEmail().withMessage("email is requred "),

    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be at 3 character "),

    body("vehicle.vehicleColor")
      .isLength({ min: 2 })
      .withMessage("color name must me 2 charcter "),

    body("vahicle.vehiclePlate")
      .isLength({ min: 3 })
      .withMessage("vahiclePlate must be at 3 character "),

    body("vahicle.vehicleCapacity")
      .isInt({ min: 1 })
      .withMessage("vehicleCapacity must be atleast 1 people"),

    body("vahicle.vahicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage(" should be one vahicle"),
  ])
  .post(handleCaptainRegister);

router
  .route("/login", [
    body("email").isEmail().withMessage("email is requered").trim(),

    body("password")
      .isLength({ min: 2 })
      .withMessage(" password must me 3 characters"),
  ])
  .post(handleCaptainLogin);

router.route("/profile").post(authCaptain, handleCaptainProfile);

router.route("/logout").post(authCaptain, handleCaptainLogout);
export default router;
