import userModel from "../model/user.model.js";
import ApiError from "../utils/apiError.js";

const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new ApiError(400, "All field is requerd ");
  }

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
  });

  return user;
};

export default createUser;
