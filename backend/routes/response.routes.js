import express from "express";
import Response from "../models/Response.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { isStudent, isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/* ================= STUDENT: SUBMIT EXAM ================= */
router.post("/", authMiddleware, isStudent, async (req, res) => {
  try {
    const { examId, answers } = req.body;

    if (!examId || !answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and answers are required",
      });
    }

    const alreadySubmitted = await Response.findOne({
      student: req.user._id,
      exam: examId,
    });

    if (alreadySubmitted) {
      return res.status(409).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    const response = await Response.create({
      student: req.user._id,
      exam: examId,
      answers,
    });

    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      response,
    });
  } catch (error) {
    console.error("SUBMIT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit exam",
    });
  }
});

/* ================= STUDENT: GET MY RESPONSES ================= */
router.get("/me", authMiddleware, isStudent, async (req, res) => {
  try {
    const responses = await Response.find({
      student: req.user._id,
    })
      .populate("exam", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("FETCH MY RESPONSES ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch responses",
    });
  }
});

/* ================= ADMIN: GET ALL RESPONSES ================= */
router.get("/admin/all", authMiddleware, isAdmin, async (req, res) => {
  try {
    const responses = await Response.find()
      .populate("student", "name email")
      .populate("exam", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("ADMIN FETCH ALL ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all responses",
    });
  }
});

/* ================= ADMIN: GET RESPONSES BY EXAM ================= */
router.get(
  "/admin/exam/:examId",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const responses = await Response.find({
        exam: req.params.examId,
      })
        .populate("student", "name email")
        .populate("exam", "title")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: responses.length,
        responses,
      });
    } catch (error) {
      console.error("ADMIN FETCH BY EXAM ERROR:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch responses for exam",
      });
    }
  }
);

export default router;
