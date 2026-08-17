// Находим элементы на странице
let taskInput = document.querySelector('#taskInput');
let addButton = document.querySelector('#addButton');
let taskList = document.querySelector('#taskList');

// Состояние приложения
let tasks = [];

// Функция рендеринга
function renderTasks() {
    taskList.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i];

        // Элемент списка <li>
        let listItem = document.createElement('li');
        // Сохраняем уникальный ID задачи прямо в HTML-тег с помощью data-атрибута
        listItem.dataset.id = currentTask.id;

        // Чекбокс смены статуса
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentTask.completed;
        checkbox.classList.add('toggle-checkbox'); 

        let taskSpan = document.createElement('span');
        taskSpan.textContent = currentTask.text;

        // Если задача выполнена - зачеркиваем ее
        if (currentTask.completed) {
            taskSpan.classList.add('completed');
        }

        // Кнопка «Удалить» 
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete-button'); // класс для отслеживания клика

        // Собираем все внутрь <li>
        listItem.appendChild(checkbox);
        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);

        // Добавляем готовый <li> в <ul>
        taskList.appendChild(listItem);
    }
}

// Добавление новой задачи
addButton.addEventListener('click', function() {
    let textValue = taskInput.value.trim();

    if (textValue === '') {
        return;
    }

    let newTask = {
        id: Date.now(),
        text: textValue,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
});


// Делегирование событий 
//  Навешиваем ВСЕГО ОДИН обработчик на общий родитель <ul>
taskList.addEventListener('click', function(event) {
    // event.target - это тот конкретный элемент, на который фактически кликнул пользователь
    let target = event.target;

    // Находим родительский <li> кликнутого элемента, чтобы узнать id задачи
    let parentListItem = target.closest('li');
    if (!parentListItem) return;

    // Извлекаем id из data-атрибута и переводим в число
    let clickedTaskId = Number(parentListItem.dataset.id);

    // Ситуация А: Кликнули по чекбоксу смены статуса
    if (target.classList.contains('toggle-checkbox')) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === clickedTaskId) {
                // Меняем булевое значение на противоположное
                tasks[i].completed = !tasks[i].completed;
                break;
            }
        }
        renderTasks(); // Перерисовываем список
    }

    // Ситуация Б: Кликнули по кнопке «Удалить»
    if (target.classList.contains('delete-button')) {
        // Оставляем в массиве только те задачи, id которых не совпадает с удаляемым
        tasks = tasks.filter(function(task) {
            return task.id !== clickedTaskId;
        });
        renderTasks(); // Перерисовываем список
    }
});
