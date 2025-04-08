document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const filterCategory = document.getElementById('filterCategory');
    const filterPriority = document.getElementById('filterPriority');
    const filterBtn = document.getElementById('filterBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    // Add task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filter tasks
    filterBtn.addEventListener('click', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const taskCategory = document.createElement('span');
        taskCategory.className = 'task-category';
        taskCategory.textContent = `[${categoryInput.value.toUpperCase()}]`;

        const taskPriority = document.createElement('span');
        taskPriority.className = `task-priority priority-${priorityInput.value}`;
        taskPriority.textContent = priorityInput.value.toUpperCase();

        const taskDue = document.createElement('span');
        taskDue.className = 'task-due';
        taskDue.textContent = dueDateInput.value ? `Due: ${dueDateInput.value}` : '';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });

        taskInfo.appendChild(taskCategory);
        taskInfo.appendChild(taskSpan);
        taskInfo.appendChild(taskPriority);
        taskInfo.appendChild(taskDue);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(deleteBtn);

        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
        });

        taskList.appendChild(taskItem);
        taskInput.value = '';
        dueDateInput.value = '';

        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(task => {
            tasks.push({
                text: task.querySelector('span').textContent,
                category: task.querySelector('.task-category').textContent,
                priority: task.querySelector('.task-priority').textContent.toLowerCase(),
                due: task.querySelector('.task-due').textContent.replace('Due: ', ''),
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) taskItem.classList.add('completed');

            const taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';

            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.text;

            const taskCategory = document.createElement('span');
            taskCategory.className = 'task-category';
            taskCategory.textContent = task.category;

            const taskPriority = document.createElement('span');
            taskPriority.className = `task-priority priority-${task.priority}`;
            taskPriority.textContent = task.priority.toUpperCase();

            const taskDue = document.createElement('span');
            taskDue.className = 'task-due';
            taskDue.textContent = task.due ? `Due: ${task.due}` : '';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                taskItem.remove();
                saveTasks();
            });

            taskInfo.appendChild(taskCategory);
            taskInfo.appendChild(taskSpan);
            taskInfo.appendChild(taskPriority);
            taskInfo.appendChild(taskDue);

            taskItem.appendChild(taskInfo);
            taskItem.appendChild(deleteBtn);

            taskItem.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                saveTasks();
            });

            taskList.appendChild(taskItem);
        });
    }

    function filterTasks() {
        const category = filterCategory.value;
        const priority = filterPriority.value;
        const tasks = document.querySelectorAll('.task-item');

        tasks.forEach(task => {
            const taskCategory = task.querySelector('.task-category').textContent.toLowerCase();
            const taskPriority = task.querySelector('.task-priority').textContent.toLowerCase();

            const categoryMatch = (category === 'all') || taskCategory.includes(category);
            const priorityMatch = (priority === 'all') || taskPriority.includes(priority);

            if (categoryMatch && priorityMatch) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }
});