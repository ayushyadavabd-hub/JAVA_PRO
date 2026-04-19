const express = require("express");
const path = require("path");
const feedbackManager = require("./dataStore");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "University Teacher Feedback Manager" });
});

app.get("/api/feedback", (req, res) => {
  const { teacher, minRating } = req.query;
  const data = feedbackManager.listFeedback({ teacher, minRating });
  res.json(data);
});

app.post("/api/feedback", (req, res) => {
  try {
    const feedback = feedbackManager.addFeedback(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/analytics", (_req, res) => {
  res.json(feedbackManager.getAnalytics());
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
