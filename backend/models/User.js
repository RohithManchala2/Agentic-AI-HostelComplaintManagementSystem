import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Student", "Technician"],
      required: true,
    },

    block: {
      type: String,
      trim: true,
    },

    room: {
      type: String,
      trim: true,
    },

    specialty: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;