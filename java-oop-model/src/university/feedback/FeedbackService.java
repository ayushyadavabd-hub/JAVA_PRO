package university.feedback;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class FeedbackService {
    private final List<FeedbackEntry> entries = new ArrayList<>();
    private final RatingStrategy ratingStrategy;

    public FeedbackService(RatingStrategy ratingStrategy) {
        this.ratingStrategy = ratingStrategy;
    }

    public void submitFeedback(FeedbackEntry entry) {
        entries.add(entry);
    }

    public List<FeedbackEntry> getEntriesByTeacher(String teacherName) {
        return entries
                .stream()
                .filter(entry -> entry.getTeacher().getName().equalsIgnoreCase(teacherName))
                .collect(Collectors.toList());
    }

    public double getAverageRating() {
        return ratingStrategy.computeAverage(entries);
    }

    public int getTotalCount() {
        return entries.size();
    }
}
