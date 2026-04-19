const express = require("express");
const path = require("path");
const fs = require("fs");
const { execFileSync, execSync } = require("child_process");
const feedbackManager = require("./dataStore");

const app = express();
const PORT = process.env.PORT || 3000;
const JAVA_SRC_DIR = path.join(
  __dirname,
  "..",
  "java-oop-model",
  "src",
  "university",
  "feedback"
);
const JAVA_OUT_DIR = path.join(__dirname, "..", "java-oop-model", "out");
const JAVA_BRIDGE_CLASS = path.join(
  JAVA_OUT_DIR,
  "university",
  "feedback",
  "AnalyticsBridge.class"
);

let javaBridgeReady = false;

function ensureJavaBridgeCompiled() {
  if (fs.existsSync(JAVA_BRIDGE_CLASS)) {
    javaBridgeReady = true;
    return;
  }

  if (!fs.existsSync(JAVA_OUT_DIR)) {
    fs.mkdirSync(JAVA_OUT_DIR, { recursive: true });
  }

  const compileCommand = `javac -d "${JAVA_OUT_DIR}" "${JAVA_SRC_DIR}\\*.java"`;
  execSync(compileCommand, { stdio: "pipe" });
  javaBridgeReady = true;
}

function getAnalyticsFromJava(rows) {
  try {
    ensureJavaBridgeCompiled();
    const payload = rows
      .map(
        (row) => `${row.teacherName}\t${row.rating}\t${Boolean(row.recommend)}`
      )
      .join("\n");

    const output = execFileSync(
      "java",
      ["-cp", JAVA_OUT_DIR, "university.feedback.AnalyticsBridge"],
      {
        input: payload,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    return JSON.parse(output.trim());
  } catch (_error) {
    return null;
  }
}

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
  const rows = feedbackManager.listFeedback();
  const javaAnalytics = getAnalyticsFromJava(rows);
  if (javaAnalytics) {
    res.json({ ...javaAnalytics, source: "java-oop" });
    return;
  }

  res.json({ ...feedbackManager.getAnalytics(), source: "node-fallback" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
