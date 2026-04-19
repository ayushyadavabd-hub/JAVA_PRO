package university.feedback;

public class Teacher extends Person {
    private final String department;

    public Teacher(String id, String name, String department) {
        super(id, name);
        this.department = department;
    }

    public String getDepartment() {
        return department;
    }

    @Override
    public String getRole() {
        return "Teacher";
    }
}
