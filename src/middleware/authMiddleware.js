import ApiError from "./../utils/apiError.js";
// import ApiRespone from "./../utils/apiResponse.js";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
// import { cookie } from "express-validator";
import captainModel from "../model/captain.model.js";

const authUser = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("bearer", "");
    if (!token) {
      throw new ApiError(401, "unauthorized user and token was not found");
    }

    const decodeToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await userModel
      .findById(decodeToken._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid  accessToken ");
  }
};

const authCaptain = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("bearer", "");

    if (!token) {
      throw new ApiError(
        400,
        "unauthorized captain and token was not found",
      );
    }

    const decodeToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decodeToken) {
      throw new ApiError(400, " some problem when decoding token ");
    }

    const captain = await captainModel
      .findById(decodeToken._id)
      .select("-refreshToken -password");

    if (!captain) {
      throw new ApiError(400, "captain is not found");
    }

    req.captain = captain;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid  accessToken ");
  }
};

export { authUser, authCaptain };
