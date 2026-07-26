import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

const ALLOWED_CATEGORIES = ["Electrical", "Plumbing", "Cleaning", "Internet", "Carpentry", "Other"];
const ALLOWED_STATUSES = ["Pending", "In Progress", "Resolved"];

const sendSuccess = (res, status, message, data) => res.status(status).json({ success: true, message, data });
const sendError = (res, status, message) => res.status(status).json({ success: false, message });
const sanitizeText = (value) => (value || "").toString().trim().replace(/\s+/g, " ");

export const createComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const safeTitle = sanitizeText(title);
    const safeCategory = sanitizeText(category);
    const safeDescription = sanitizeText(description);

    if (!safeTitle || !safeDescription) {
      return sendError(res, 400, "Please fill in all complaint details.");
    }

    if (!ALLOWED_CATEGORIES.includes(safeCategory)) {
      return sendError(res, 400, "Please select a valid complaint category.");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    const safeBlock = sanitizeText(user.block);
    const safeRoom = sanitizeText(user.room);

    if (!safeBlock || !safeRoom) {
      return sendError(res, 400, "User profile is missing block or room details.");
    }

    await Complaint.create({
      title: safeTitle,
      category: safeCategory,
      description: safeDescription,
      block: safeBlock,
      room: safeRoom,
      student: user._id,
    });

    return sendSuccess(res, 201, "Complaint submitted", null);
  } catch (error) {
    console.error("Create complaint error:", error);
    return sendError(res, 500, "Server error while submitting complaint.");
  }
};

/*export const myComplaints = async (req, res) => {
  const complaints = await Complaint.find({ student: req.user.id })
    .populate("assignedTo", "fullName")
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, "Complaints fetched", { complaints });
};*/
export const myComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
};

/*export const allComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .populate("student", "fullName block room")
    .populate("assignedTo", "fullName");

  return sendSuccess(res, 200, "Complaints fetched", { complaints });
};*/
export const allComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "fullName block room")
      .populate("assignedTo", "fullName")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("allComplaints Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: technicianId,
        status: "In Progress",
      },
      {
        new: true,
      }
    )
      .populate("student", "fullName block room")
      .populate("assignedTo", "fullName");

    if (!updated) {
      return sendError(res, 404, "Complaint not found.");
    }

    return sendSuccess(res, 200, "Technician assigned", {
      complaint: updated,
    });
  } catch (error) {
    console.error("Assign technician error:", error);
    return sendError(res, 500, "Server error while assigning technician.");
  }
};

export const technicianComplaints = async (req, res) => {
  const complaints = await Complaint.find({ assignedTo: req.user.id });
  return sendSuccess(res, 200, "Complaints fetched", { complaints });
};

export const updateStatus = async (req, res) => {
  try {
    const safeStatus = sanitizeText(req.body.status);
    if (!ALLOWED_STATUSES.includes(safeStatus)) {
      return sendError(res, 400, "Please select a valid status.");
    }

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: safeStatus },
      { new: true }
    )
      .populate("student", "fullName block room")
      .populate("assignedTo", "fullName");

    if (!updated) {
      return sendError(res, 404, "Complaint not found.");
    }

    return sendSuccess(res, 200, "Status updated", { complaint: updated });
  } catch (error) {
    console.error("Update status error:", error);
    return sendError(res, 500, "Server error while updating complaint status.");
  }
};
export const completeComplaint = async (req, res) => {
  try {
    const room = sanitizeText(req.body.room);

    if (!room) {
      return sendError(res, 400, "Room number is required.");
    }

    const complaint = await Complaint.findOne({
      room,
      assignedTo: req.user.id,
      status: "In Progress",
    })
      .populate("student", "fullName block room")
      .populate("assignedTo", "fullName");

    if (!complaint) {
      return sendError(
        res,
        404,
        "No active complaint assigned to you was found for this room."
      );
    }

    complaint.status = "Resolved";

    await complaint.save();

    return sendSuccess(
      res,
      200,
      "Complaint marked as resolved.",
      {
        complaint,
      }
    );
  } catch (error) {
    console.error("Complete complaint error:", error);

    return sendError(
      res,
      500,
      "Server error while completing complaint."
    );
  }
};
