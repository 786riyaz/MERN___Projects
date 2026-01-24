const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Enabling CORS before defining routes
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local React app
      "https://react-js-psi-beryl.vercel.app", // deployed frontend
      "https://pfx9d576-5173.inc1.devtunnels.ms",
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
// debug: show whether DB_URL is available
// console.log("DB_URL present:", !!process.env.DB_URL);

// improved mongoose connect with options and explicit error logging
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // other options if needed
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message || err);
    // helpful: print full error object to debug in local only
    console.error(err);
    process.exit(1); // fail fast in dev so you see the error
  });

// ✅ Schema and Model
const chatSchema = new mongoose.Schema({
  userName: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const chatModel = mongoose.model("Chat", chatSchema);

// ✅ Routes
app.get("/", (req, res) => {
  console.log("Inside / route");
  res.send("Hello World!");
});

app.get("/getAllMessage", async (req, res) => {
  console.log("Inside /getAllMessage route");
  // console.log("Request Query :: ", req.query.limit);
  const limitParam = parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;

  const data = await chatModel
    .find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .select("-_id -__v");
  // console.log("Sent Data Length ::", data.length);
  let actualData = data.toReversed()
  // console.log("Sent Data Length ::", actualData);
  res.send(actualData);
});

app.post("/addMessage", async (req, res) => {
  console.log("Inside /addMessage route");
  let requestBody = req.body;
  let data = new chatModel(requestBody);
  const result = await data.save();
  console.log("Result ::", result?._id);
  res.send(result);
});

// ✅ Start Server
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });