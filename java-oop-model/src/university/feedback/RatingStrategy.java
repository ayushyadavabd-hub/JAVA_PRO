package university.feedback;

import java.util.List;

public interface RatingStrategy {
    double computeAverage(List<FeedbackEntry> entries);
}
