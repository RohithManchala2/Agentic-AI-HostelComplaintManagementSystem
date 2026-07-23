import Complaint from "../models/Complaint.js";

const ALLOWED_CATEGORIES = ["Electrical", "Plumbing", "Cleaning", "Internet", "Carpentry", "Other"];
const ALLOWED_STATUSES = ["Pending", "In Progress", "Resolved"];

const sendSuccess = (res, status, message, data) => res.status(status).json({ success: true, message, data });
const sendError = (res, status, message) => res.status(status).json({ success: false, message });
const sanitizeText = (value) => (value || "").toString().trim().replace(/\s+/g, " ");

export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, block, room } = req.body;
    const safeTitle = sanitizeText(title);
    const safeCategory = sanitizeText(category);
    const safeDescription = sanitizeText(description);
    const safeBlock = sanitizeText(block);
    const safeRoom = sanitizeText(room);

    if (!safeTitle || !safeDescription || !safeBlock || !safeRoom) {
      return sendError(res, 400, "Please fill in all complaint details.");
    }

    if (!ALLOWED_CATEGORIES.includes(safeCategory)) {
      return sendError(res, 400, "Please select a valid complaint category.");
    }

    await Complaint.create({
      title: safeTitle,
      category: safeCategory,
      description: safeDescription,
      block: safeBlock,
      room: safeRoom,
      student: req.user.id,
    });

    return sendSuccess(res, 201, "Complaint submitted", null);
  } catch (error) {
    console.error("Create complaint error:", error);
    return sendError(res, 500, "Server error while submitting complaint.");
  }
};

export const myComplaints = async (req, res) => {
  const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Complaints fetched", { complaints });
};

export const allComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .populate("student", "fullName block room")
    .populate("assignedTo", "fullName");

  return sendSuccess(res, 200, "Complaints fetched", { complaints });
};

export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const updated = await Complaint.findByIdAndUpdate(req.params.id, {
      assignedTo: technicianId,
      status: "In Progress",
    });

    if (!updated) {
      return sendError(res, 404, "Complaint not found.");
    }

    return sendSuccess(res, 200, "Technician assigned", null);
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
