import express from "express";
import {
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
  handleUserProfile,
} from "./../controller/user.controller.js";
import { authUser } from "../middleware/authMiddleware.js";
const router = express.Router();
import { body } from "express-validator";

router
  .route("/register", [
    body("email").isEmail().withMessage("please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("password must me 6 charachter long "),

    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("name is at least 3 character "),
  ])
  .post(handleUserRegister);

router
  .route("/login", [
    body("email").isEmail().withMessage("email is requred"),
    body("password").isLength({ min: 2 }).withMessage("password is requred "),
  ])
  .post(handleUserLogin);

router.route("/logout").post(authUser, handleUserLogout);
router.route("/profile").post(authUser, handleUserProfile);
export default router;
