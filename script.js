let taskInput = document.querySelector('.task-input');
let addButton = document.querySelector('.btn-add');
let taskList = document.querySelector('.task-list');
let bulkDeleteBtn = document.querySelector('.bulk-delete-btn');
let filterButtons = document.querySelectorAll('.btn-filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; 

// cохранением данные в localStorage даже при преезагрузке страницы
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Форматирование дат (ДД.ММ.ГГГГ ЧЧ:ММ)
function formatDate(timestamp) {
    if (!timestamp) return '';
    let date = new Date(timestamp);
    let d = String(date.getDate()).padStart(2, '0');
    let m = String(date.getMonth() + 1).padStart(2, '0');
    let y = date.getFullYear();
    let hh = String(date.getHours()).padStart(2, '0');
    let mm = String(date.getMinutes()).padStart(2, '0');
    return `${d}.${m}.${y} ${hh}:${mm}`;
}

function renderTasks() {
    taskList.innerHTML = '';

    // Фильтрация данных
    let tasksToRender = tasks;
    if (currentFilter === 'active') {
        tasksToRender = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        tasksToRender = tasks.filter(task => task.completed);
    }

    // Отрисовка отфильтрованных задач
    for (let i = 0; i < tasksToRender.length; i++) {
        let task = tasksToRender[i];

        let li = document.createElement('li');
        li.classList.add('task-item');
        if (task.completed) li.classList.add('completed');
        li.dataset.id = task.id;

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.classList.add('toggle-checkbox');

        let contentDiv = document.createElement('div');
        contentDiv.classList.add('task-content');

        let textSpan = document.createElement('span');
        textSpan.classList.add('task-text');
        textSpan.textContent = task.text;

        let datesSpan = document.createElement('span');
        datesSpan.classList.add('task-dates');
        let datesText = `Создано: ${formatDate(task.createdAt)}`;
        if (task.updatedAt) {
            datesText += ` | Изменено: ${formatDate(task.updatedAt)}`;
        }
        datesSpan.textContent = datesText;

        contentDiv.appendChild(textSpan);
        contentDiv.appendChild(datesSpan);

        let editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.classList.add('btn', 'btn-small', 'btn-edit');

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.classList.add('btn', 'btn-small', 'btn-delete');

        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }
}

// Добавление задачи (с датами)
addButton.addEventListener('click', function() {
    let textValue = taskInput.value.trim();
    if (textValue === '') return;

    let newTask = {
        id: Date.now(),
        text: textValue,
        completed: false,
        createdAt: Date.now(),
        updatedAt: null // если задача не редактировалась/только что была создана, то updatedAt будет null
    };

    tasks.push(newTask);
    // Сохраняем в localStorage
    saveTasks(); // 
    taskInput.value = '';
    renderTasks();
});

// Делегирование событий списка (Клик по чекбоксу, изменению, удалению)
taskList.addEventListener('click', function(event) {
    let target = event.target;
    let parentLi = target.closest('.task-item');
    if (!parentLi) return;

    let taskId = Number(parentLi.dataset.id);
    let taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) return;

    // Переключение статуса
    if (target.classList.contains('toggle-checkbox')) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }

    // Удаление одной задачи
    if (target.classList.contains('btn-delete')) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
    }

    // Изменение задачи
    if (target.classList.contains('btn-edit')) {
        let newText = prompt('Редактировать задачу:', tasks[taskIndex].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[taskIndex].text = newText.trim();
            tasks[taskIndex].updatedAt = Date.now(); // Обновляем дату изменения
            saveTasks();
            renderTasks();
        }
    }
});

// Удаление нескольких задач (только завершенные)
bulkDeleteBtn.addEventListener('click', function() {
    // Оставляем в массиве только НЕ завершенные задачи
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// Логика переключения фильтров
filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        // Убираем класс active у всех кнопок
        filterButtons.forEach(b => b.classList.remove('active'));
        // Добавляем класс active нажатой кнопке
        event.target.classList.add('active');
        
        // Меняем текущий режим фильтра и перерисовываем
        currentFilter = event.target.dataset.filter;
        renderTasks();
    });
});

// Отрисовка при первой загрузке страницы
renderTasks();
