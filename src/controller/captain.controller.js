import ApiError from "../utils/apiError.js";
import asynchHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import captainModel from "../model/captain.model.js";
import createCaptain from "../service/captain.service.js";
import ApiResponse from "../utils/apiResponse.js";

const generateAcccessTokenAndRefresToken = async (id) => {
  try {
    // console.log("token me  id ", id);
    const captain = await captainModel.findById(id);

    if (!captain) {
      throw new ApiError(400, " somthing went wrong when genearete token ");
    }

    // console.log("token me id se get  user ", user);

    const accessToken = await captain.generateAcccessToken();
    const refreshToken = await captain.generateRefreshToken();
    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    // console.log("accessToken, refreshToken", accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "somthing went wrong ", error);
  }
};

const handleCaptainRegister = asynchHandler(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, errors: error.array() });
  }

  const { fullName, email, password, vehicle } = req.body;


  if (
    !fullName?.firstName ||
    !fullName?.lastName ||
    !email ||
    !password ||
    !vehicle
  ) {
    throw new ApiError(400, "All field are required");
  }

  const isRagister = await captainModel.findOne({ email: email.toLowerCase() });
  console.log("isRagister", isRagister);

  if (isRagister) {
    throw new ApiError(400, "captain is already Register");
  }

  const captain = await createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password,
    vehicleCapacity: vehicle.vehicleCapacity,
    vehiclePlate: vehicle.vehiclePlate,
    vehicleType: vehicle.vehicleType,
    vehicleColor: vehicle.vehicleColor,
  });

  if (!captain) {
    throw new ApiError(400, "something went wrong when  create  captain ");
  }

  const createdCaptain = await captainModel
    .findById(captain._id)
    .select("-password -refreshToken");

  const { accessToken, refreshToken } =
    await generateAcccessTokenAndRefresToken(captain._id);

  if (!createdCaptain) {
    throw new ApiError(400, "captain is not found");
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "captain  ragister successFully", {
        createdCaptain,
        accessToken,
        refreshToken,
      }),
    );
});

const handleCaptainLogin = asynchHandler(async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, error: error.array() });
  }

  const { email, password } = req.body;


  if (!email || !password) {
    throw new ApiError(400, "all field  is requered");
  }

  const captain = await captainModel.findOne({ email });
  if (!captain) {
    throw new ApiError(404, "Captain not found");
  }

  const isValidPassword = await captain.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "password is incorrect ");
  }

  const { accessToken, refreshToken } =
    await generateAcccessTokenAndRefresToken(captain._id);

  const loggedInCaptain = await captainModel
    .findById(captain._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    .json(
      new ApiResponse(
        200,
        { loggedInCaptain, accessToken, refreshToken },
        " captain login success fully ",
      ),
    );
});

const handleCaptainLogout = asynchHandler(async (req, res) => {
  await captainModel.findByIdAndUpdate(
    req.captain._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, " captain logOut successFully"));
});

const handleCaptainProfile = asynchHandler(async (req, res) => {
  const captain = req.captain;
  console.log(captain);

  // if (!id) {
  //   throw new ApiError(400, "id is reqeured");
  // }

  // const captain = await captainModel
  //   .findById(id)
  //   .select("-password  -refreshToken");

  if (!captain) {
    throw new ApiError(404, " captain profile is not availbe");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { captain }, "captain profile is get successFully "),
    );
});

export {
  handleCaptainRegister,
  handleCaptainLogin,
  handleCaptainLogout,
  handleCaptainProfile,
};
