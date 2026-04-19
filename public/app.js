const feedbackList = document.getElementById("feedback-list");
const form = document.getElementById("teacherFeedbackForm");
const formStatus = document.getElementById("form-status");
const teacherFilter = document.getElementById("teacherFilter");
const ratingFilter = document.getElementById("ratingFilter");

const metricTotal = document.getElementById("metric-total");
const metricAverage = document.getElementById("metric-average");
const metricRecommend = document.getElementById("metric-recommend");
const metricTopTeacher = document.getElementById("metric-top-teacher");

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function feedbackTemplate(item) {
  const safeDate = new Date(item.createdAt).toLocaleString();
  return `
    <article class="feedback-card">
      <h4>${item.teacherName} <span class="badge">${item.rating}/5</span></h4>
      <div class="feedback-meta">${item.courseCode} | Year ${
    item.studentYear
  } | ${safeDate}</div>
      <p>${item.comment}</p>
      <div class="feedback-meta">Recommended: ${
        item.recommend ? "Yes" : "No"
      }</div>
    </article>
  `;
}

async function loadFeedback() {
  const params = new URLSearchParams();
  if (teacherFilter.value.trim())
    params.set("teacher", teacherFilter.value.trim());
  if (ratingFilter.value) params.set("minRating", ratingFilter.value);

  const rows = await fetchJSON(`/api/feedback?${params.toString()}`);
  if (!rows.length) {
    feedbackList.innerHTML =
      '<article class="feedback-card">No feedback records match the filter.</article>';
    return;
  }
  feedbackList.innerHTML = rows.map(feedbackTemplate).join("");
}

async function loadAnalytics() {
  const data = await fetchJSON("/api/analytics");
  metricTotal.textContent = data.totalFeedback;
  metricAverage.textContent = data.averageRating.toFixed(2);
  metricRecommend.textContent = `${data.recommendationRate}%`;
  metricTopTeacher.textContent = data.topTeacher;
}

async function bootstrap() {
  await Promise.all([loadFeedback(), loadAnalytics()]);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Submitting feedback...";
  formStatus.style.color = "#1d4f78";

  const formData = new FormData(form);
  const payload = {
    teacherName: formData.get("teacherName"),
    courseCode: formData.get("courseCode"),
    studentYear: Number(formData.get("studentYear")),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
    recommend: formData.get("recommend") === "on",
  };

  try {
    await fetchJSON("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    form.reset();
    formStatus.textContent = "Feedback submitted successfully.";
    formStatus.style.color = "#0b6b45";
    await bootstrap();
  } catch (error) {
    formStatus.textContent = error.message;
    formStatus.style.color = "#8a1030";
  }
});

teacherFilter.addEventListener("input", () => {
  loadFeedback().catch(console.error);
});

ratingFilter.addEventListener("change", () => {
  loadFeedback().catch(console.error);
});

bootstrap().catch((error) => {
  formStatus.textContent = `Unable to load app data: ${error.message}`;
  formStatus.style.color = "#8a1030";
});
