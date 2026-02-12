import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainShema = new mongoose.Schema(
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
        minlength: [3, "first name must be at least 3 characters"],
        maxlength: [30, "first name must be less than 30 characters"],
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    vehicle: {
      vehicleColor: {
        type: String,
        required: true,
        minlength: [3, "Color must be at least 3 characters long   "],
      },
      vehiclePlate: {
        type: String,
        required: true,
        minlength: [3, " plate number must  be at 3 character long "],
      },
      vehicleCapacity: {
        type: String,
        required: true,
        minlength: [1, " capacity must me at 2 people requered"],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["auto", "bike", "car"],
      },
    },

    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  },
);

captainShema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

captainShema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainShema.methods.generateAcccessToken = async function () {
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

captainShema.methods.generateRefreshToken = async function () {
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

const captainModel = mongoose.model("captain", captainShema);

export default captainModel;
