const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const DBConfig = require("./configs/connection");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ** Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const roleRoutes = require("./routes/roleRoutes");
const taskRoutes = require("./routes/taskRoutes");
const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
// REST OBJECT
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DOT ENV CONFIG
dotenv.config();

//MYSQL CONNECTION
DBConfig;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.static(__dirname + '/public'));
// Login Routes
app.use("/api/v1/auth", authRoutes);
// User Routes
app.use("/api/v1/users", userRoutes);
// Team Routes
app.use("/api/v1/team", teamRoutes);
// Role Routes
app.use("/api/v1/role", roleRoutes);
// Task Routes
app.use("/api/v1/task", taskRoutes);
// Article Routes
app.use("/api/v1/article", articleRoutes);
// Article Routes
app.use("/api/v1/category", categoryRoutes);

// Check api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Task Management System<h1>");
});

// PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `SERVER IS RUNNING ON PORT ${process.env.NODE_MODE} at PORT ${PORT}`.bgGreen
      .white
  );
});
