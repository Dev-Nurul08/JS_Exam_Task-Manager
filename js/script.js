
let form, nameInput, dateInput, prioritySelect, viewBody, editBody;
let currentIdx = null;
let filterPriority = 'all';

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveToDB() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


const badgeMap = {
    high: 'badge bg-danger',
    medium: 'badge bg-success',
    low: 'badge bg-primary'
};

function getBadgeClass(priority) {
    return badgeMap[priority] || 'badge bg-secondary';
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getFilteredTasks() {
    if (filterPriority === 'all') {
        return tasks;
    }
    return tasks.filter(task => task.priority === filterPriority);
}


function setupFormElements() {
    form = document.querySelector('#add-task-page form');
    nameInput = document.getElementById('taskName');
    dateInput = document.getElementById('dueDate');
    prioritySelect = document.getElementById('taskPriority');
    
    viewBody = document.querySelector('#view-tasks-page table tbody') 
        || document.querySelector('#view-tasks-page table').appendChild(document.createElement('tbody'));
    
    editBody = document.querySelector('#edit-delete-page table tbody') 
        || document.querySelector('#edit-delete-page table').appendChild(document.createElement('tbody'));
}


function displayViewTasks() {
    viewBody.innerHTML = '';
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        const row = viewBody.insertRow();
        row.innerHTML = '<td colspan="4" style="text-align: center;">No tasks found</td>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const row = viewBody.insertRow();
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.dueDate}</td>
            <td><span class="${getBadgeClass(task.priority)}">${capitalizeWord(task.priority)}</span></td>
            <td>${task.status || 'Pending'}</td>
        `;
    });
}

function displayEditTasks() {
    editBody.innerHTML = '';
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        const row = editBody.insertRow();
        row.innerHTML = '<td colspan="4" style="text-align: center;">No tasks found</td>';
        return;
    }
    
    filteredTasks.forEach((task, idx) => {
        const row = editBody.insertRow();
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.dueDate}</td>
            <td><span class="${getBadgeClass(task.priority)}">${capitalizeWord(task.priority)}</span></td>
            <td>
                <button type="button" class="btn btn-outline-danger del-btn" data-idx="${idx}">Delete</button>
                <button type="button" class="btn btn-outline-warning edt-btn" data-idx="${idx}">Edit</button>
            </td>
        `;
    });
    
    document.querySelectorAll('.del-btn').forEach(btn => 
        btn.addEventListener('click', () => removeTask(parseInt(btn.dataset.idx)))
    );
    
    document.querySelectorAll('.edt-btn').forEach(btn => 
        btn.addEventListener('click', () => startEditing(parseInt(btn.dataset.idx)))
    );
}

// ===== Task Operations =====
function createNewTask(name, date, priority) {
    tasks.push({
        id: Date.now(),
        name,
        dueDate: date,
        priority,
        status: 'Pending'
    });
    
    saveToDB();
    displayViewTasks();
    displayEditTasks();
}

function removeTask(idx) {
    tasks = tasks.filter((_, i) => i !== idx);
    saveToDB();
    displayViewTasks();
    displayEditTasks();
}

function startEditing(idx) {
    if (idx >= 0 && idx < tasks.length) {
        const task = tasks[idx];
        currentIdx = idx;
        
        nameInput.value = task.name;
        dateInput.value = task.dueDate;
        prioritySelect.value = task.priority;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Task';
        submitBtn.classList.toggle('btn-outline-dark', false);
        submitBtn.classList.toggle('btn-outline-warning', true);
        
        switchPage('add-task-page');
    }
}

function applyPriorityFilter(priority) {
    filterPriority = priority;
    displayViewTasks();
    displayEditTasks();
}


function switchPage(pageId) {
    document.querySelectorAll('.slide-page').forEach(page => 
        page.classList.toggle('active', page.id === pageId)
    );
    
    document.querySelectorAll('.nav-link').forEach(link => 
        link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`)
    );
}

function submitForm(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const priority = prioritySelect.value;
    
    if (!name || !date || !priority) {
        alert('Please fill in all fields');
        return;
    }
    
    if (currentIdx !== null) {
        
        Object.assign(tasks[currentIdx], { name, dueDate: date, priority });
        saveToDB();
        
        currentIdx = null;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Task';
        submitBtn.classList.toggle('btn-outline-dark', true);
        submitBtn.classList.toggle('btn-outline-warning', false);
    } else {
        
        createNewTask(name, date, priority);
    }
    
    displayViewTasks();
    displayEditTasks();
    form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    setupFormElements();
    displayViewTasks();
    displayEditTasks();
    
    switchPage('add-task-page');
    
    form.addEventListener('submit', submitForm);
    
    // Priority filter buttons
    document.querySelectorAll('.priority-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.priority-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPriorityFilter(btn.dataset.priority);
        });
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            switchPage(link.getAttribute('href').substring(1));
        });
    });
});