
// server/server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: "uploads/" });

// Store print jobs in a local JSON file
const JOB_FILE = "jobs.json";
function loadJobs() {
  if (!fs.existsSync(JOB_FILE)) fs.writeFileSync(JOB_FILE, "[]");
  return JSON.parse(fs.readFileSync(JOB_FILE));
}
function saveJobs(jobs) {
  fs.writeFileSync(JOB_FILE, JSON.stringify(jobs, null, 2));
}

// === ROUTES ===

// Upload + Job Creation
app.post("/upload", upload.single("file"), (req, res) => {
  const { name, color } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const jobs = loadJobs();
  const job = {
    id: Date.now().toString(),
    name,
    color,
    filename: file.originalname,
    path: file.path,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  jobs.push(job);
  saveJobs(jobs);
  res.json({ message: "Upload successful", job });
});

// Fetch pending print jobs
app.get("/jobs/pending", (req, res) => {
  const jobs = loadJobs();
  res.json(jobs.filter((j) => j.status === "pending"));
});

// Update job status (printed/done)
app.post("/jobs/update", (req, res) => {
  const { id, status } = req.body;
  const jobs = loadJobs();
  const job = jobs.find((j) => j.id === id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  job.status = status;
  saveJobs(jobs);
  res.json({ message: "Status updated", job });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
