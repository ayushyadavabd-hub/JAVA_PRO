package university.feedback;

import java.util.List;

public class SimpleAverageRatingStrategy implements RatingStrategy {
    @Override
    public double computeAverage(List<FeedbackEntry> entries) {
        if (entries.isEmpty()) {
            return 0;
        }
        int total = 0;
        for (FeedbackEntry entry : entries) {
            total += entry.getRating();
        }
        return (double) total / entries.size();
    }
}
