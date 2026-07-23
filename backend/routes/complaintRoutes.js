import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  createComplaint,
  myComplaints,
  allComplaints,
  assignTechnician,
  technicianComplaints,
  updateStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("Student"), createComplaint);
router.get("/my", authMiddleware, roleMiddleware("Student"), myComplaints);

router.get("/all", authMiddleware, roleMiddleware("Warden"), allComplaints);
router.put("/assign/:id", authMiddleware, roleMiddleware("Warden"), assignTechnician);

router.get("/assigned", authMiddleware, roleMiddleware("Technician"), technicianComplaints);
router.put("/status/:id", authMiddleware, roleMiddleware("Technician"), updateStatus);

export default router;
