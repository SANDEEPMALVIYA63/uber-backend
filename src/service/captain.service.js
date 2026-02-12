import captainModel from "../model/captain.model.js";
import ApiError from "../utils/apiError.js";

const createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  vehicleType,
  vehicleColor,
  vehiclePlate,
  vehicleCapacity,
}) => {


  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !vehicleType ||
    !vehicleColor ||
    !vehiclePlate ||
    !vehicleCapacity
  ) {
    throw new ApiError(400, "All field are  requered");
  }

  const captian = await captainModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
    vehicle: {
      vehicleCapacity,
      vehicleColor,
      vehiclePlate,
      vehicleType,
    },
  });

  return captian;
};

export default createCaptain;
