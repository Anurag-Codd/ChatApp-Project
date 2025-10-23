import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/ds8nimjln/image/upload/v1755022964/user_b2tqsv.svg",
    },
    status: {
      type: String,
      default: "Hey there! I am using ChatApp.",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
