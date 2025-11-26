class Course {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.department = data.department;
        this.level = data.level;
        this.credits = data.credits;
        this.instructor = data.instructor;
        this.semester = data.semester;
        this.description = data.description;
    }

    getDetailsHTML() {
        return `
            <h2>${this.id}</h2>
            <p><strong>Title:</strong> ${this.title}</p>
            <p><strong>Department:</strong> ${this.department}</p>
            <p><strong>Level:</strong> ${this.level}</p>
            <p><strong>Credits:</strong> ${this.credits}</p>
            <p><strong>Instructor:</strong> ${this.instructor}</p>
            <p><strong>Semester:</strong> ${this.semester}</p>
            <p>${this.description}</p>
        `;
    }
}

let courses = [];
let filteredCourses = [];

/*Load JSON File*/

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const errorMsg = document.getElementById("errorMsg");

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const json = JSON.parse(e.target.result);

            if (!Array.isArray(json)) {
                throw new Error("JSON must contain an array of course objects.");
            }

            courses = json.map(obj => new Course(obj));
            filteredCourses = [...courses];

            errorMsg.textContent = "";

            generateFilterOptions();
            renderCourses();

        } catch (err) {
            console.error(err);
            errorMsg.textContent = "Invalid JSON file format.";
        }
    };

    reader.readAsText(file);
});


/*Filtering*/

function generateFilterOptions() {
    const deptSet = new Set(courses.map(c => c.department));
    const levelSet = new Set(courses.map(c => c.level));
    const instSet = new Set(courses.map(c => c.instructor));

    fillDropdown("filterDepartment", deptSet);
    fillDropdown("filterLevel", levelSet);
    fillDropdown("filterInstructor", instSet);
}

function fillDropdown(id, set) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="All">All</option>`;
    for (let val of set) {
        dropdown.innerHTML += `<option value="${val}">${val}</option>`;
    }
}

function applyFilters() {
    const dep = document.getElementById("filterDepartment").value;
    const lev = document.getElementById("filterLevel").value;
    const inst = document.getElementById("filterInstructor").value;

    filteredCourses = courses.filter(c => {
        return (dep === "All" || c.department === dep) &&
               (lev === "All" || c.level == lev) &&
               (inst === "All" || c.instructor === inst);
    });

    renderCourses();
}

document.querySelectorAll("#filters select").forEach(sel => {
    sel.addEventListener("change", applyFilters);
});


/*Sorting*/

function semesterValue(sem) {
    const [season, year] = sem.split(" ");
    const order = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
    return parseInt(year) * 10 + order[season];
}

document.getElementById("sortSelect").addEventListener("change", () => {
    const sortType = document.getElementById("sortSelect").value;

    if (sortType === "titleAsc") {
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "titleDesc") {
        filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === "id") {
        filteredCourses.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortType === "semester") {
        filteredCourses.sort((a, b) => semesterValue(a.semester) - semesterValue(b.semester));
    }

    renderCourses();
});


/*Rendering*/
function renderCourses() {
    const container = document.getElementById("courseList");
    container.innerHTML = "";

    filteredCourses.forEach(course => {
        const div = document.createElement("div");
        div.className = "courseItem";
        div.textContent = `${course.id} — ${course.title}`;

        div.addEventListener("click", () =>
            document.getElementById("courseDetails").innerHTML = course.getDetailsHTML()
        );

        container.appendChild(div);
    });
}
