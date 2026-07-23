import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getTechnicians,
  updateTechnician,
  removeTechnician,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getMe);
router.get("/technicians", authMiddleware, roleMiddleware("Warden"), getTechnicians);
router.put("/technicians/:id", authMiddleware, roleMiddleware("Warden"), updateTechnician);
router.delete("/technicians/:id", authMiddleware, roleMiddleware("Warden"), removeTechnician);

export default router;
