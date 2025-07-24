const express = require("express");
const app = express();
require("dotenv").config();

// ============ Middleware & Utilities ============
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// ============ Cloud & Database Setup ============
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// ============ Route Imports ============
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");
const categoryRoutes = require("./routes/category");

// ============ Middleware Configuration ============
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Replace with your frontend URL for production
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ============ Connect to DB and Cloudinary ============
connectDB();
cloudinaryConnect();

// ============ Route Mounting ============
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);

// ============ Health Check Route ============
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 1rem;">
      <h2>✅ Server is Running</h2>
      <p>Welcome to the <strong>LearnHub</strong></p>
    </div>
  `);
});

// ============ Start Server ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
