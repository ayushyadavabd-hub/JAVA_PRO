class Feedback {
  #id;
  #teacherName;
  #courseCode;
  #studentYear;
  #rating;
  #comment;
  #recommend;
  #createdAt;

  constructor({
    id,
    teacherName,
    courseCode,
    studentYear,
    rating,
    comment,
    recommend,
    createdAt,
  }) {
    this.#id = id;
    this.#teacherName = teacherName;
    this.#courseCode = courseCode;
    this.#studentYear = studentYear;
    this.#rating = rating;
    this.#comment = comment;
    this.#recommend = recommend;
    this.#createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.#id,
      teacherName: this.#teacherName,
      courseCode: this.#courseCode,
      studentYear: this.#studentYear,
      rating: this.#rating,
      comment: this.#comment,
      recommend: this.#recommend,
      createdAt: this.#createdAt,
    };
  }
}

class FeedbackManager {
  #feedbacks;
  #nextId;

  constructor(seed = []) {
    this.#feedbacks = seed.map((item) => new Feedback(item));
    this.#nextId = this.#feedbacks.length + 1;
  }

  #validate(payload) {
    const teacherName = String(payload.teacherName || "").trim();
    const courseCode = String(payload.courseCode || "")
      .trim()
      .toUpperCase();
    const studentYear = Number(payload.studentYear);
    const rating = Number(payload.rating);
    const comment = String(payload.comment || "").trim();
    const recommend = Boolean(payload.recommend);

    if (!teacherName || teacherName.length < 3) {
      throw new Error("Teacher name must be at least 3 characters long.");
    }
    if (!courseCode || courseCode.length < 4) {
      throw new Error("Course code must be at least 4 characters long.");
    }
    if (!Number.isInteger(studentYear) || studentYear < 1 || studentYear > 6) {
      throw new Error("Student year must be between 1 and 6.");
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }
    if (!comment || comment.length < 10) {
      throw new Error("Feedback comment must be at least 10 characters.");
    }

    return {
      teacherName,
      courseCode,
      studentYear,
      rating,
      comment,
      recommend,
    };
  }

  addFeedback(payload) {
    const clean = this.#validate(payload);
    const feedback = new Feedback({
      id: this.#nextId++,
      ...clean,
      createdAt: new Date().toISOString(),
    });
    this.#feedbacks.unshift(feedback);
    return feedback.toJSON();
  }

  listFeedback({ teacher, minRating } = {}) {
    const min = Number(minRating || 0);
    return this.#feedbacks
      .filter((item) => {
        const value = item.toJSON();
        const byTeacher = teacher
          ? value.teacherName
              .toLowerCase()
              .includes(String(teacher).toLowerCase())
          : true;
        const byRating = min ? value.rating >= min : true;
        return byTeacher && byRating;
      })
      .map((item) => item.toJSON());
  }

  getAnalytics() {
    const rows = this.#feedbacks.map((item) => item.toJSON());
    const total = rows.length;

    if (!total) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        recommendationRate: 0,
        topTeacher: "N/A",
      };
    }

    const averageRating =
      rows.reduce((sum, row) => sum + row.rating, 0) / total;
    const recommendationRate =
      (rows.filter((row) => row.recommend).length / total) * 100;

    const teacherCount = rows.reduce((acc, row) => {
      acc[row.teacherName] = (acc[row.teacherName] || 0) + 1;
      return acc;
    }, {});

    const topTeacher =
      Object.entries(teacherCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      totalFeedback: total,
      averageRating: Number(averageRating.toFixed(2)),
      recommendationRate: Number(recommendationRate.toFixed(2)),
      topTeacher,
    };
  }
}

const manager = new FeedbackManager([
  {
    id: 1,
    teacherName: "Dr. Meera Gupta",
    courseCode: "CS501",
    studentYear: 3,
    rating: 5,
    comment: "Excellent clarity and practical examples in every lecture.",
    recommend: true,
    createdAt: "2026-04-18T14:52:00.000Z",
  },
  {
    id: 2,
    teacherName: "Prof. Arjun Rao",
    courseCode: "MA402",
    studentYear: 2,
    rating: 4,
    comment:
      "Very structured sessions; assignments are challenging but useful.",
    recommend: true,
    createdAt: "2026-04-18T16:20:00.000Z",
  },
]);

module.exports = manager;
