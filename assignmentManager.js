//Observer Class
class Observer {
  notify(studentName, assignmentName, status) {
    console.log(`Observer → ${studentName}, ${assignmentName} has been ${status}.`);
  }
}

//Assignment Class
class Assignment {
  #grade; //private grade

  constructor(name) {
    this.assignmentName = name;
    this.status = "released";
    this.#grade = null;
  }

  setGrade(grade) {
    this.#grade = grade;
    this.status = grade > 50 ? "passed" : "failed";
  }

  getGrade() {
    return this.#grade;
  }
}

//Student Class
class Student {
  constructor(fullName, email, observer) {
    this.fullName = fullName;
    this.email = email;
    this.assignmentStatuses = []; //array of Assignment objects
    this.observer = observer;

    //interrupt working with reminders
    this._forceSubmitFlags = {};
  }

  setFullName(name) {
    this.fullName = name;
  }

  setEmail(email) {
    this.email = email;
  }

  findAssignment(name) {
    return this.assignmentStatuses.find(a => a.assignmentName === name);
  }

  updateAssignmentStatus(name, grade = null) {
    let assignment = this.findAssignment(name);

    if (!assignment) {
      assignment = new Assignment(name);
      this.assignmentStatuses.push(assignment);
      this.observer.notify(this.fullName, name, "released");
      return;
    }

    //grade update
    if (grade !== null) {
      assignment.setGrade(grade);
      const statusWord = assignment.status === "passed" ? "passed" : "failed";
      this.observer.notify(this.fullName, name, statusWord);
    }
  }

  getAssignmentStatus(name) {
    const assignment = this.findAssignment(name);
    if (!assignment) return "Hasn't been assigned";
    return assignment.status;
  }

  async startWorking(name) {
    let assignment = this.findAssignment(name);
    if (!assignment) {
      assignment = new Assignment(name);
      this.assignmentStatuses.push(assignment);
    }

    assignment.status = "working";
    this.observer.notify(this.fullName, name, "working on");

    this._forceSubmitFlags[name] = false;

    await new Promise(resolve => setTimeout(resolve, 500));

    if (!this._forceSubmitFlags[name]) {
      this.submitAssignment(name);
    }
  }

  submitAssignment(name) {
    const assignment = this.findAssignment(name);
    if (!assignment) return;

    assignment.status = "submitted";
    this.observer.notify(this.fullName, name, "submitted");

    setTimeout(() => {
      const grade = Math.floor(Math.random() * 101);
      this.updateAssignmentStatus(name, grade);
    }, 500);
  }

  getGrade() {
    const graded = this.assignmentStatuses
      .map(a => a.getGrade())
      .filter(g => g !== null);

    if (graded.length === 0) return 0;

    return graded.reduce((a, b) => a + b, 0) / graded.length;
  }
}

//ClassList class
class ClassList {
  constructor(observer) {
    this.students = [];
    this.observer = observer;
  }

  addStudent(student) {
    this.students.push(student);
    console.log(`${student.fullName} has been added to the classlist.`);
  }

  removeStudent(studentObj) {
    this.students = this.students.filter(s => s !== studentObj);
  }

  findStudentByName(name) {
    return this.students.find(s => s.fullName === name);
  }

  findOutstandingAssignments(assignmentName = null) {
    if (assignmentName) {
      return this.students
        .filter(s => {
          const a = s.findAssignment(assignmentName);
          return !a || (a.status !== "submitted" && a.status !== "passed" && a.status !== "failed");
        })
        .map(s => s.fullName);
    }

    return this.students
      .filter(s => s.assignmentStatuses.some(a =>
        a.status === "released" || a.status === "working"
      ))
      .map(s => s.fullName);
  }

  async releaseAssignmentsParallel(names) {
    const tasks = names.map(name => {
      return Promise.all(
        this.students.map(s => s.updateAssignmentStatus(name))
      );
    });
    await Promise.all(tasks);
  }

  sendReminder(assignmentName) {
    this.students.forEach(s => {
      const assignment = s.findAssignment(assignmentName);

      if (!assignment || assignment.status === "submitted" ||
          assignment.status === "passed" || assignment.status === "failed") {
        return;
      }

      assignment.status = "final reminder";
      this.observer.notify(s.fullName, assignmentName, "given a final reminder");

      s._forceSubmitFlags[assignmentName] = true;

      s.submitAssignment(assignmentName);
    });
  }
}

//Program Run
const observer = new Observer();
const classList = new ClassList(observer);

const s1 = new Student("Alice Smith", "alice@example.com", observer);
const s2 = new Student("Bob Jones", "bob@example.com", observer);

classList.addStudent(s1);
classList.addStudent(s2);

classList.releaseAssignmentsParallel(["A1", "A2"]).then(() => {
  s1.startWorking("A1");
  s2.startWorking("A2");

  setTimeout(() => classList.sendReminder("A1"), 200);
});