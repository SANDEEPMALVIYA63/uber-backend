import express from "express";
import {
  handleUserRagister,
  handleUserLogin,
} from "./../controller/user.controller.js";
const router = express.Router();
import { body } from "express-validator";

router
  .route("/userRagister", [
    body("email").isEmail().withMessage("please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("password must me 6 charachter long "),

    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("name is at least 3 character "),
  ])
  .post(handleUserRagister);

router
  .route("/userLogin", [
    body("email").isEmail().withMessage("email is requred"),
    body("password").isLength({ min: 2 }).withMessage("password is requred "),
  ])
  .post(handleUserLogin);

export default router;
