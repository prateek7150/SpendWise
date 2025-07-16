const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const expenseRoutes = require("./routes/expenseRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/expenses", expenseRoutes);

// Frontend route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "spendWise.html"));
});

// Connect to MongoDB and start server
mongoose.connect("mongodb://localhost:27017/spendwise")
.then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
        console.log("Server running at http://localhost:5000");
    });
})
.catch((err) => {
    console.error("MongoDB connection failed:", err);
});
