import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
const PHONE_REGEX = /^\d{10}$/;
const ALLOWED_SPECIALIZATIONS = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Network Technician",
  "Cleaner",
  "General",
];
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return process.env.JWT_SECRET;
};

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), {
    expiresIn: "7d",
  });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

const sendSuccess = (res, status, message, data) => res.status(status).json({ success: true, message, data });
const sendError = (res, status, message) => res.status(status).json({ success: false, message });
const sanitizeText = (value) => (value || "").toString().trim().replace(/\s+/g, " ");
const sanitizeEmail = (value) => sanitizeText(value).toLowerCase();
const validateEmail = (email) => EMAIL_REGEX.test(email);
const validatePassword = (password) => PASSWORD_REGEX.test(password) && !password.includes(" ");
const validatePhone = (phone) => PHONE_REGEX.test(phone);
const validateSpecialization = (specialty) => ALLOWED_SPECIALIZATIONS.includes(specialty);

const toUserResponse = (user) => {
  if (!user) return null;
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  return safeUser;
};

const getWardenCredential = () => ({
  email: (process.env.WARDEN_USERNAME || process.env.WARDEN_EMAIL || "").trim().toLowerCase(),
  password: process.env.WARDEN_PASSWORD?.toString().trim(),
});

/*export const getTechnicians = async (req, res) => {
  const { category } = req.query;

  try {
    let filter = { role: "Technician" };
    if (category) {
      filter = {
        role: "Technician",
        $or: [
          { specialty: category },
          { specialty: { $regex: category, $options: "i" } },
        ],
      };
    }

    let techs = await User.find(filter).lean();
    if (category && (!Array.isArray(techs) || techs.length === 0)) {
      techs = await User.find({ role: "Technician" }).lean();
    }

    const technicians = await Promise.all(
      techs.map(async (tech) => {
        const count = await Complaint.countDocuments({ assignedTo: tech._id, status: "In Progress" });
        return {
          _id: tech._id,
          name: tech.fullName,
          email: tech.email,
          phone: tech.phone || "—",
          specialization: tech.specialty || "General",
          activeTasks: count,
          taskCount: count,
          availability: count < 5,
          role: tech.role,
        };
      })
    );

    return sendSuccess(res, 200, "Technicians fetched", technicians);
  } catch (error) {
    console.error("Error in getTechnicians:", error);
    return sendError(res, 500, "Server error while fetching technicians.");
  }
};*/
export const getTechnicians = async (req, res) => {
  try {
    const { category } = req.query;

    const categoryToSpecialty = {
      Electrical: "Electrician",
      Plumbing: "Plumber",
      Carpentry: "Carpenter",
      Internet: "Network Technician",
      Cleaning: "Cleaner",
      Other: "General",
    };

    let filter = { role: "Technician" };

    if (category) {
      filter.specialty = categoryToSpecialty[category] || "General";
    }

    const techs = await User.find(filter).lean();

    const technicians = await Promise.all(
      techs.map(async (tech) => {
        const count = await Complaint.countDocuments({
          assignedTo: tech._id,
          status: "In Progress",
        });

        return {
          _id: tech._id,
          name: tech.fullName,
          email: tech.email,
          phone: tech.phone || "—",
          specialization: tech.specialty,
          activeTasks: count,
          availability: count < 5,
        };
      })
    );

    return sendSuccess(res, 200, "Technicians fetched", technicians);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while fetching technicians.");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, block, room, specialty } = req.body;
    const safeFullName = sanitizeText(fullName);
    const safeEmail = sanitizeEmail(email);
    const safePassword = sanitizeText(password);
    const safeRole = sanitizeText(role);

    if (!safeFullName || !safeEmail || !safePassword || !safeRole) {
      return sendError(res, 400, "Please fill in all required fields.");
    }

    if (!validateEmail(safeEmail)) {
      return sendError(res, 400, "Please provide a valid email address.");
    }

    if (!validatePassword(safePassword)) {
      return sendError(res, 400, "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.");
    }

    if (safeRole === "Warden") {
      return sendError(res, 403, "Warden registration is disabled. Please sign in with the existing warden account.");
    }

    if (!["Student", "Technician"].includes(safeRole)) {
      return sendError(res, 400, "Invalid role selected.");
    }

    if (safeRole === "Student" && (!sanitizeText(block) || !sanitizeText(room))) {
      return sendError(res, 400, "Block and room are required for students.");
    }

    if (safeRole === "Technician" && !sanitizeText(specialty)) {
      return sendError(res, 400, "Specialization is required for technicians.");
    }

    const existingUser = await User.findOne({ email: safeEmail });
    if (existingUser) {
      return sendError(res, 409, "An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(safePassword, 10);
    const user = new User({
      fullName: safeFullName,
      email: safeEmail,
      password: hashedPassword,
      role: safeRole,
      block: sanitizeText(block),
      room: sanitizeText(room),
      specialty: sanitizeText(specialty),
    });

    await user.save();

    const token = createToken({ id: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    return sendSuccess(res, 201, "Account created successfully", {
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while creating account.");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const safeEmail = sanitizeEmail(email);
    const safePassword = sanitizeText(password);

    if (!safeEmail || !safePassword) {
      return sendError(res, 400, "Email and password are required.");
    }

    if (!validateEmail(safeEmail)) {
      return sendError(res, 400, "Please provide a valid email address.");
    }

    const { email: wardenEmail, password: wardenPassword } = getWardenCredential();
    if (safeEmail === wardenEmail) {
      if (!wardenPassword) {
        return sendError(res, 500, "Warden authentication is not configured.");
      }

      if (safePassword !== wardenPassword) {
        return sendError(res, 401, "Invalid credentials.");
      }

      const token = createToken({ id: "warden-env", role: "Warden" });
      setAuthCookie(res, token);

      return sendSuccess(res, 200, "Login successful", {
        user: {
          fullName: "Warden",
          email: safeEmail,
          role: "Warden",
        },
      });
    }

    const user = await User.findOne({ email: safeEmail });
    if (!user) {
      return sendError(res, 401, "Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(safePassword, user.password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid credentials.");
    }

    const token = createToken({ id: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    const userDoc = await User.findById(user._id).select("-password").lean();
    return sendSuccess(res, 200, "Login successful", { user: userDoc });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while logging in.");
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });
    return sendSuccess(res, 200, "Logged out", null);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while logging out.");
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendError(res, 401, "Unauthorized");

    if (req.user.role === "Warden" && req.user.id === "warden-env") {
      const { email } = getWardenCredential();
      return sendSuccess(res, 200, "Session restored", {
        user: {
          fullName: "Warden",
          email,
          role: "Warden",
        },
      });
    }

    const userDoc = await User.findById(req.user.id).select("-password").lean();
    if (!userDoc) return sendError(res, 404, "User not found");

    return sendSuccess(res, 200, "Session restored", { user: userDoc });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while loading profile.");
  }
};

export const updateTechnician = async (req, res) => {
  try {
    const { fullName, email, specialty, phone } = req.body;
    const safeFullName = sanitizeText(fullName);
    const safeEmail = sanitizeEmail(email);
    const safeSpecialty = sanitizeText(specialty);
    const safePhone = sanitizeText(phone);

    if (!safeFullName || !safeEmail) {
      return sendError(res, 400, "Name and email are required.");
    }

    if (!validateEmail(safeEmail)) {
      return sendError(res, 400, "Please provide a valid email address.");
    }

    if (!validatePhone(safePhone)) {
      return sendError(res, 400, "Phone number must be exactly 10 digits.");
    }

    if (!validateSpecialization(safeSpecialty)) {
      return sendError(res, 400, "Please select a valid specialization.");
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return sendError(res, 404, "Technician not found.");
    }

    if (existingUser.role !== "Technician") {
      return sendError(res, 400, "Only technician accounts can be updated.");
    }

    const duplicateEmail = await User.findOne({ email: safeEmail, _id: { $ne: req.params.id } });
    if (duplicateEmail) {
      return sendError(res, 409, "An account with this email already exists.");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName: safeFullName,
        email: safeEmail,
        specialty: safeSpecialty,
        phone: safePhone,
      },
      { new: true }
    ).select("-password");

    return sendSuccess(res, 200, "Technician updated successfully", { user: updatedUser });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while updating technician.");
  }
};

export const removeTechnician = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return sendError(res, 404, "Technician not found.");
    }

    if (existingUser.role !== "Technician") {
      return sendError(res, 400, "Only technician accounts can be deleted.");
    }

    await User.findByIdAndDelete(req.params.id);
    await Complaint.updateMany({ assignedTo: req.params.id }, { assignedTo: null });
    return sendSuccess(res, 200, "Technician removed successfully", null);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error while deleting technician.");
  }
};