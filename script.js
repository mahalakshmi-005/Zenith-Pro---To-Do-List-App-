let tasks = JSON.parse(localStorage.getItem("zenith_tasks")) || [];
let currentCategory = "All";
let searchTerm = "";

function addTask() {
    const input = document.getElementById("taskInput");
    const category = document.getElementById("categorySelect").value;
    if (!input.value.trim()) return;

    tasks.unshift({
        id: Date.now(),
        text: input.value,
        category: category,
        completed: false
    });

    input.value = "";
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            if (!t.completed) confetti({ particleCount: 40, spread: 50, origin: { y: 0.9 } });
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function filterByCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.pill, .side-pill').forEach(el => {
        el.classList.toggle('active', el.innerText.includes(cat));
    });
    render();
}

function searchTasks() {
    searchTerm = document.getElementById("searchInput").value.toLowerCase();
    render();
}

function render() {
    const list = document.getElementById("taskList");
    const filtered = tasks.filter(t => {
        const matchesCat = currentCategory === "All" || t.category === currentCategory;
        const matchesSearch = t.text.toLowerCase().includes(searchTerm);
        return matchesCat && matchesSearch;
    });

    list.innerHTML = filtered.map(t => `
        <li class="task-item ${t.completed ? 'done' : ''}">
            <div style="display:flex; align-items:center; gap:15px; cursor:pointer" onclick="toggleTask(${t.id})">
                <div class="checkbox"></div>
                <div>
                    <p style="font-weight:600">${t.text}</p>
                    <small style="color:var(--accent)">#${t.category}</small>
                </div>
            </div>
            <button onclick="deleteTask(${t.id})" style="background:none; border:none; cursor:pointer; color:var(--danger)">🗑️</button>
        </li>
    `).join('');

    updateProgress();
}

function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("completionRate").innerText = percent + "%";
    document.getElementById("progressCircle").style.strokeDasharray = `${percent}, 100`;

    const sideBar = document.getElementById("sidebarProgress");
    if(sideBar) {
        sideBar.style.width = percent + "%";
        document.getElementById("sidebarStatText").innerText = `${done}/${total} Tasks Done`;
    }
}

function saveAndRender() {
    localStorage.setItem("zenith_tasks", JSON.stringify(tasks));
    render();
}

render();