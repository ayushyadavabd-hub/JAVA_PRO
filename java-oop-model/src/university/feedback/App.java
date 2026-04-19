package university.feedback;

public class App {
    public static void main(String[] args) {
        Teacher teacher = new Teacher("T-1", "Dr. Meera Gupta", "Computer Science");
        Student student = new Student("S-1", "Ayush Verma", 3);

        FeedbackEntry entry = new FeedbackEntry(
                teacher,
                student,
                5,
                "Excellent explanation quality and practical examples in class.",
                true
        );

        FeedbackService service = new FeedbackService(new SimpleAverageRatingStrategy());
        service.submitFeedback(entry);

        System.out.println("Java OOP Demo Running");
        System.out.println("Total Feedback: " + service.getTotalCount());
        System.out.println("Average Rating: " + service.getAverageRating());
        System.out.println("Teacher Role: " + teacher.getRole());
        System.out.println("Student Role: " + student.getRole());
    }
}
