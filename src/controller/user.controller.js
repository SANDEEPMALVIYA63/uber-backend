import userModel from "./../model/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "./../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { validationResult } from "express-validator";
import createUser from "../service/user.service.js";

const generateAcccessTokenAndRefresToken = async (id) => {
  try {
    // console.log("token me  id ", id);
    const user = await userModel.findById(id);

    if (!user) {
      throw new ApiError(400, " somthing went wrong when genearete token ");
    }

    // console.log("token me id se get  user ", user);

    const accessToken = await user.generateAcccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("accessToken, refreshToken", accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "somthing went wrong ", error);
  }
};

const handleUserRagister = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "details are requerd");
  }
  const isUserAlready = await userModel.findOne({ email });

  if (isUserAlready) {
    throw new ApiError(400, "user is already ragister ");
  }
  // const hashedPassword = await userModel.hashPassword({ password });

  const user = await createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password,
  });

  console.log("service ke bad user ", user);
  console.log("Id ", user._id);

  if (!user) {
    throw new ApiError(400, "Somthing went wrong when ragister  user ");
  }

  const { accessToken, refreshToken } =
    await generateAcccessTokenAndRefresToken(user._id);

  // console.log("accessToken, refreshToken", accessToken, refreshToken);

  const createdUser = await userModel
    .findById(user._id)
    .select("-password  -refreshToken ");

  if (!createdUser) {
    throw new ApiError(400, "somthing went wronng while ragister the user ");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "user ragister successFully", {
        createdUser,
        accessToken,
        refreshToken,
      }),
    );
});

const handleUserLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password is requred ");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(400, "user is not  found ");
  }

  if (!user.email == email) {
    throw new ApiError(400, "email is not valid");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(400, "password does not match ");
  }

  const { accessToken, refreshToken } =
    await generateAcccessTokenAndRefresToken(user._id);

  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("accessToken, refreshToken ", accessToken, refreshToken);
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .send(
      new ApiResponse(200, "user login success fully ", {
        loggedInUser,
        accessToken,
        refreshToken,
      }),
    );
});

export { handleUserRagister, handleUserLogin };
