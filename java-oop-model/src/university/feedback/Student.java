package university.feedback;

public class Student extends Person {
    private int year;

    public Student(String id, String name, int year) {
        super(id, name);
        this.year = year;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Override
    public String getRole() {
        return "Student";
    }
}
