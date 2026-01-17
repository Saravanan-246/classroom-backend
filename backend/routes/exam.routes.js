import express from "express";
import Exam from "../models/Exam.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/* ===== CREATE EXAM (ADMIN) ===== */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const {
      title,
      subject,
      classId,
      date,
      time,
      duration,
      marks,
      published = false,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const exam = await Exam.create({
      title,
      subject,
      classId,
      date,
      time,
      duration,
      marks,
      published,
      questions: [], // ✅ add later from QuestionBank
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    let exams;

    if (req.user.role === "admin") {
      exams = await Exam.find().sort({ createdAt: -1 });
    } else {
      exams = await Exam.find({ published: true })
        .select("-questions.correctAnswer")
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===== GET SINGLE EXAM ===== */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    let exam;

    if (req.user.role === "admin") {
      exam = await Exam.findById(req.params.id);
    } else {
      exam = await Exam.findOne({
        _id: req.params.id,
        published: true,
      }).select("-questions.correctAnswer");
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.json({
      success: true,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


export default router;
