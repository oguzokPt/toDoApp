let taskInput = document.querySelector('#taskInput');
let addButton = document.querySelector('#addButton');
let taskList = document.querySelector('#taskList');

// Изначально это пустой массив, который будет хранить объекты задач
let tasks = [];

// Отдельная функция рендеринга
function renderTasks() {
    // Очищаем текущее содержимое списка перед новой отрисовкой, чтобы задачи не дублировались при каждом добавлении
    taskList.innerHTML = '';

    // Проходим по каждому объекту в массиве tasks
    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i];

        // Создание тега <li>
        let listItem = document.createElement('li');
        
        // Добавляем текст задачи безопасно через textContent
        listItem.textContent = currentTask.text;

        // Вставляем готовый <li> внутрь контейнера <ul>
        taskList.appendChild(listItem);
    }
}

//  Добавление задачи (обработка событий)
addButton.addEventListener('click', function() {
    // Получаем текст из инпута. .trim() удаляет лишние пробелы в начале и конце
    let textValue = taskInput.value.trim();

    // Проверка на ошибки: запрет на добавление пустых строк
    if (textValue === '') {
        return; // Если пусто - прерываем выполнение функции
    }

    // Создаем новый объект задачи согласно требованиям
    let newTask = {
        id: Date.now(), // Генерируем уникальный ID на основе текущего времени
        text: textValue, // Текст задачи
        completed: false // Булевое значение статуса выполнения
    };

    // Добавляем созданный объект в конец нашего массива данных
    tasks.push(newTask);

    // Очищаем поле ввода, чтобы пользователю было удобно вводить следующую задачу
    taskInput.value = '';

    // Вызываем функцию рендеринга для обновления интерфейса
    renderTasks();
});
