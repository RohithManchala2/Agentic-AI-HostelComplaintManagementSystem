import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Electrical",
      "Plumbing",
      "Cleaning",
      "Internet",
      "Carpentry",
      "Other",
    ],
    required:true
  },
  description:{type:String,required:true},
  block: { type: String, required: true },
  room: { type: String, required: true },

  status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("complaint", complaintSchema);