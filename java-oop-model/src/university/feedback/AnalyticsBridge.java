package university.feedback;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class AnalyticsBridge {
    public static void main(String[] args) {
        FeedbackService service = new FeedbackService(new SimpleAverageRatingStrategy());
        Map<String, Integer> teacherCount = new HashMap<>();
        int recommendCount = 0;

        Scanner scanner = new Scanner(System.in);
        int index = 1;

        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            if (line == null || line.trim().isEmpty()) {
                continue;
            }

            String[] parts = line.split("\\t");
            if (parts.length < 3) {
                continue;
            }

            String teacherName = parts[0].trim();
            int rating;
            boolean recommend;

            try {
                rating = Integer.parseInt(parts[1].trim());
            } catch (NumberFormatException ex) {
                continue;
            }

            recommend = Boolean.parseBoolean(parts[2].trim());

            Teacher teacher = new Teacher("T-" + index, teacherName, "General");
            Student student = new Student("S-" + index, "Student " + index, 1);
            FeedbackEntry entry = new FeedbackEntry(teacher, student, rating, "Imported feedback", recommend);
            service.submitFeedback(entry);

            teacherCount.put(teacherName, teacherCount.getOrDefault(teacherName, 0) + 1);
            if (recommend) {
                recommendCount++;
            }
            index++;
        }

        scanner.close();

        int total = service.getTotalCount();
        double averageRating = service.getAverageRating();
        double recommendationRate = total == 0 ? 0 : ((double) recommendCount / total) * 100;

        String topTeacher = "N/A";
        int maxCount = 0;
        for (Map.Entry<String, Integer> entry : teacherCount.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                topTeacher = entry.getKey();
            }
        }

        String json = "{"
                + "\"totalFeedback\":" + total + ","
                + "\"averageRating\":" + round2(averageRating) + ","
                + "\"recommendationRate\":" + round2(recommendationRate) + ","
                + "\"topTeacher\":\"" + escapeJson(topTeacher) + "\""
                + "}";

        System.out.println(json);
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
