import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["mcq", "code"],
    required: true,
  },

  question: {
    type: String,
    required: true,
  },

  options: {
    type: [String], // only for MCQ
    default: [],
  },

  correctAnswer: {
    type: String, // optional (for MCQ evaluation later)
  },

  language: {
    type: String, // for code questions
    enum: ["c", "cpp", "java", "python"],
  },

  starterCode: {
    type: String,
  },
});

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    questions: [questionSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
