console.log("SCRIPT LOADED");
let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

displayCandidates();

function addCandidate() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;

    if (!name || !email || !skills || !experience) {
        alert("Please fill all fields");
        return;
    }

    const candidate = {
        name,
        email,
        skills,
        experience,
        match: 0,
        status: "Applied"
    };

    candidates.push(candidate);

    saveData();
    displayCandidates();

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("experience").value = "";
}

function screenCandidates() {
    const requiredSkills = document
        .getElementById("requiredSkills")
        .value
        .toLowerCase()
        .split(",");

    candidates.forEach(candidate => {

        const candidateSkills =
            candidate.skills.toLowerCase().split(",");

        let matched = 0;

        requiredSkills.forEach(skill => {
            if (candidateSkills.includes(skill.trim())) {
                matched++;
            }
        });

        candidate.match = Math.round(
            (matched / requiredSkills.length) * 100
        );

        if(candidate.match >= 80){
    candidate.status = "Highly Recommended";
}
else if(candidate.match >= 70){
    candidate.status = "Shortlisted";
}
else{
    candidate.status = "Rejected";
}
    });

    saveData();
    displayCandidates();
}

function displayCandidates() {

    const table =
        document.getElementById("candidateTable");

    table.innerHTML = "";

    candidates.forEach((candidate, index) => {

        let badgeClass = "badge-yellow";

if(candidate.status === "Highly Recommended"){
    badgeClass = "badge-blue";
}
else if(candidate.status === "Shortlisted"){
    badgeClass = "badge-green";
}
else if(candidate.status === "Rejected"){
    badgeClass = "badge-red";
}
        table.innerHTML += `
        <tr>
            <td>${candidate.name}</td>
            <td>${candidate.email}</td>
            <td>${candidate.skills}</td>
            <td>${candidate.experience}</td>
            <td>${candidate.match}%</td>

            <td>
                <span class="${badgeClass}">
                    ${candidate.status}
                </span>
            </td>

            <td>
                <button class="edit-btn" onclick="editCandidate(${index})">
                    ✏ Edit
                </button>

                <button class="delete-btn" onclick="deleteCandidate(${index})">
                    🗑 Delete
                </button>
            </td>
        </tr>
        `;
    });

    updateDashboard();
}

function saveData() {
    localStorage.setItem(
        "candidates",
        JSON.stringify(candidates)
    );
}

function updateDashboard() {

    document.getElementById("totalApps").innerText =
        candidates.length;

    const shortlisted =
        candidates.filter(
            c => c.status === "Shortlisted"
        ).length;

    const rejected =
        candidates.filter(
            c => c.status === "Rejected"
        ).length;

    document.getElementById("shortlisted").innerText =
        shortlisted;

    document.getElementById("rejected").innerText =
        rejected;

    const rate =
        candidates.length === 0
            ? 0
            : Math.round(
                (shortlisted / candidates.length) * 100
            );

    document.getElementById("successRate").innerText =
        rate + "%";
    const applied =
candidates.filter(
c => c.status === "Applied"
).length;

document.getElementById("applied").innerText =
applied;
}

function clearAllData() {

    if (confirm("Are you sure you want to delete all candidates?")) {

        candidates = [];

        saveData();
        displayCandidates();
    }
}

function deleteCandidate(index) {

    if (confirm("Delete this candidate?")) {

        candidates.splice(index, 1);

        saveData();
        displayCandidates();
    }
}

function editCandidate(index) {

    const candidate = candidates[index];

    document.getElementById("name").value =
        candidate.name;

    document.getElementById("email").value =
        candidate.email;

    document.getElementById("skills").value =
        candidate.skills;

    document.getElementById("experience").value =
        candidate.experience;

    candidates.splice(index, 1);

    saveData();
    displayCandidates();
}

function generateAIReport() {

    if (candidates.length === 0) {
        alert("No candidates available");
        return;
    }

    const shortlisted =
        candidates.filter(
            c => c.status === "Shortlisted"
        ).length;

    const percentage =
        Math.round(
            (shortlisted / candidates.length) * 100
        );

    let recommendation = "";

    if(percentage >= 80){
    recommendation =
    "Excellent candidate pool. Immediate interview scheduling recommended.";
}
else if(percentage >= 60){
    recommendation =
    "Good candidate pool. Proceed with technical assessments.";
}
else if(percentage >= 40){
    recommendation =
    "Moderate candidate quality. Additional screening advised.";
}
else{
    recommendation =
    "Candidate pool quality is low. Consider expanding recruitment efforts.";
}

    document.getElementById("aiResult").innerHTML = `
        <h3>AI Recruitment Insight</h3>
        <p><strong>Total Candidates:</strong> ${candidates.length}</p>
        <p><strong>Shortlisted:</strong> ${shortlisted}</p>
        <p><strong>Success Rate:</strong> ${percentage}%</p>
        <p><strong>Recommendation:</strong> ${recommendation}</p>
    `;
}

const searchBox = document.getElementById("searchCandidate");

if (searchBox) {
    searchBox.addEventListener("input", function () {

        const search = this.value.toLowerCase();

        const rows = document.querySelectorAll(
            "#candidateTable tr"
        );

        rows.forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display =
                text.includes(search)
                    ? ""
                    : "none";
        });
    });
}
function downloadReport(){

    let report =
    " Recruitment Report\n\n";

    candidates.forEach(candidate => {

        report +=
        "Name: " + candidate.name + "\n" +
        "Email: " + candidate.email + "\n" +
        "Skills: " + candidate.skills + "\n" +
        "Match: " + candidate.match + "%\n" +
        "Status: " + candidate.status + "\n\n";

    });

    const blob =
    new Blob([report],
    {type:"text/plain"});

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "TalentAI_Report.txt";

    link.click();
}
function downloadReport() {

    let report = " Recruitment Report\n";
    report += "===========================\n\n";

    report += "Total Candidates: " + candidates.length + "\n";

    const shortlisted =
        candidates.filter(c => c.status === "Shortlisted").length;

    const rejected =
        candidates.filter(c => c.status === "Rejected").length;

    report += "Shortlisted: " + shortlisted + "\n";
    report += "Rejected: " + rejected + "\n\n";

    report += "Candidate Details\n";
    report += "-----------------\n";

    candidates.forEach(candidate => {

        report +=
            "Name: " + candidate.name + "\n" +
            "Email: " + candidate.email + "\n" +
            "Skills: " + candidate.skills + "\n" +
            "Experience: " + candidate.experience + " Years\n" +
            "Match: " + candidate.match + "%\n" +
            "Status: " + candidate.status + "\n\n";

    });

    const blob = new Blob(
        [report],
        { type: "text/plain" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "Report.txt";

    a.click();
}
function filterCandidates(status){

    const rows =
    document.querySelectorAll("#candidateTable tr");

    rows.forEach(row => {

        if(status === "All"){
            row.style.display = "";
            return;
        }

        if(row.innerText.includes(status)){
            row.style.display = "";
        }
        else{
            row.style.display = "none";
        }

    });

}
