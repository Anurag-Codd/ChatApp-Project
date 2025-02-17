import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { fullName, email, uid } = req.body;

  if (!fullName || !email || !uid) {
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    const user = await User.create({ fullName, email, _id: uid });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const login = async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findById(uid);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const { uid } = req.user;

    if (!profilePicture) {
      return res.status(400).json({ message: "profile picture is missing" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (profilePicture) {
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadPic = await cloudinary.uploader.upload(profilePicture, {
        folder: `ChatApp/${uid}/profilePic`,
      });
      user.avatar = uploadPic.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });

    res.status(200).json({ message: "Profile updated successfully", updatedUser})
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const { uid } = req.user;

  try {
    if (!status) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    res.status(200).json({message: "Status updated successfully", updatedUser});
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const authenticateUser = async (req, res) => {
  const userId = req.user.uid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in authenticating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
