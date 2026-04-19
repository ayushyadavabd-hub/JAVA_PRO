package university.feedback;

import java.time.LocalDateTime;

public class FeedbackEntry {
    private final Teacher teacher;
    private final Student student;
    private int rating;
    private String comment;
    private boolean recommend;
    private final LocalDateTime createdAt;

    public FeedbackEntry(Teacher teacher, Student student, int rating, String comment, boolean recommend) {
        this.teacher = teacher;
        this.student = student;
        this.rating = rating;
        this.comment = comment;
        this.recommend = recommend;
        this.createdAt = LocalDateTime.now();
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public Student getStudent() {
        return student;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isRecommend() {
        return recommend;
    }

    public void setRecommend(boolean recommend) {
        this.recommend = recommend;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
