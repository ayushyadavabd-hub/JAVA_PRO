# University Teacher Feedback Manager

A full-stack feedback platform with:

- Frontend: HTML, CSS, JavaScript with modern animation-focused UI/UX
- Backend: Node.js + Express REST APIs
- Java OOP module: Domain model using abstraction, encapsulation, inheritance, polymorphism, and strategy pattern

## Features

- Submit teacher feedback with validation
- Filter feedback by teacher and minimum rating
- Runtime Java OOP analytics integration (Node calls Java for analytics)
- Live analytics cards:
  - Total feedback
  - Average rating
  - Recommendation rate
  - Most reviewed teacher
- Premium-looking, responsive and animated interface

## Run the Web App

1. Install dependencies

   npm install

2. Start server

   npm start

3. Open

   http://localhost:3000

## API Endpoints

- `GET /api/health`
- `GET /api/feedback?teacher=...&minRating=...`
- `POST /api/feedback`
- `GET /api/analytics` (computed by Java OOP bridge with Node fallback)

Example POST payload:

```json
{
  "teacherName": "Dr. Kavita Singh",
  "courseCode": "CS410",
  "studentYear": 2,
  "rating": 5,
  "comment": "Excellent delivery, consistent mentoring, and clear explanation.",
  "recommend": true
}
```

## Java OOP Module

Location:

- `java-oop-model/src/university/feedback/`

Compile from project root:

javac -d java-oop-model/out java-oop-model/src/university/feedback/\*.java

Run:

java -cp java-oop-model/out university.feedback.App

## OOP Concepts Implemented

- Abstraction: `Person` abstract class
- Inheritance: `Teacher` and `Student` extend `Person`
- Encapsulation: private fields with getters/setters
- Polymorphism: overridden `getRole()` methods and strategy interface usage
- Interface/Strategy Pattern: `RatingStrategy` with `SimpleAverageRatingStrategy`
