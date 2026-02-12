import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minlength: [3, "first name must be at least 3 characters"],
        maxlength: [30, "first name must be less than 30 characters"],
      },
      lastName: {
        type: String,
        minlength: [3, "last name must be at least 3 characters"],
        maxlength: [30, "last name must be less than 30 characters"],
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
    },

    socketId: {
      type: String,
    },
  },

  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("this.password", this.password);

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAcccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

// userSchema.statics.hashPassword = async function (password) {
//     return await bcrypt.hash(password, 10);
// }

const userModel = mongoose.model("user", userSchema);

export default userModel;
