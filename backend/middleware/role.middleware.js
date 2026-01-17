/* ===== ADMIN ONLY ===== */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Admin access only",
  });
};

/* ===== STUDENT ONLY ===== */
export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Student access only",
  });
};
