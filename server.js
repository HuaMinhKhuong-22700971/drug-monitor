const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectMongo = require('./server/database/connect');

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 3100;
const BASE_URI = process.env.BASE_URI || "http://localhost";

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // thư mục views

// Middleware
app.use(express.urlencoded({ extended: true })); // ✅ thay bodyParser bằng express
app.use(express.json()); // ✅ parse JSON body
app.use(express.static(path.join(__dirname, 'assets'))); // static assets (css, js, images)
app.use(morgan('tiny'));

// Connect to MongoDB
connectMongo();

// Routes
app.use('/', require('./server/routes/routes'));

// 404 handler - Trang không tồn tại
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: "404",
    message: "Page not found: " + req.originalUrl
  });
});

// 500 handler - Lỗi server nội bộ
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).render("error", {
    title: "500",
    message: "Something went wrong! Please try again later."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Welcome to the Drug Monitor App at ${BASE_URI}:${PORT}`);
});
