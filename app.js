const $ = selector => document.querySelector(selector);

// Function go to the next input when pressing enter
function nextFocus(input, nextInput) {
    $(`#${input}`).addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            if (input === "description") {
                saveTask();
            } else {
                $(`#${nextInput}`).focus();
            }
        }
    });
}

// Function save task in the localStorage
function saveTask () {

    const generateId = () => Math.random().toString(36).substr(2, 18);
    let title = $('#title').value;
    let description = $('#description').value;

    if (title === "") {
        $("#btnSaveTask").disabled = true;
        $('#title').focus();
        return
    }
    $("#form").classList.remove('active');

    const task = {title: title, description: description, id: generateId(), star: 0};

    if (localStorage.getItem('tasks') === null) {
        let tasks = [];

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks.length <= 149) {
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } else {
            const $modalFullLocalStorage = $('#modalFullLocalStorage');
            const $btnOkFullStorageModal = $('#btnOkFullStorageModal');
            if (typeof $modalFullLocalStorage.showModal === 'function') {
                $modalFullLocalStorage.showModal();

                $btnOkFullStorageModal.addEventListener("click", () => { // On click in button close modal
                    $modalFullLocalStorage.close();
                });
            } else {
                window.alert('Sorry, Your storage is full, delete some tasks');
            }
        }
    }

    $('#formTasks').reset();
    getTasks();
}

// Function to display tasks stored in localStorage
function getTasks () {
    if (localStorage.getItem('tasks') === null) {
        $('#tasks').innerHTML = '';
        $('#createdTask').innerHTML = `0/150 Tasks`;
        $('#createdTask2').innerHTML = `0/150 Tasks`;
        return
    }

    const $tasksView = $('#tasks');
    const $taskIndicator = $('#createdTask');
    const $taskIndicator2 = $('#createdTask2');
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let tasksStar = tasks.filter((task) => task.star === 1);
    let task = tasks.filter((task) => task.star !== 1);

    $taskIndicator.innerHTML = `${tasks.length}/150 Tasks`;
    $taskIndicator2.innerHTML = `${tasks.length}/150 Tasks`;
    $tasksView.innerHTML = '';

    for (let n = 0; n < tasksStar.length; n++) {
        let title = tasksStar[n].title;
        let description = tasksStar[n].description;
        let id = tasksStar[n].id;

        $tasksView.innerHTML += `
        <article>
            <h4>${title}</h4>
            <p>${description}</p>
            <section>
            <button class = "contrast" onclick = "deleteTask('${id}')" ><i class="fa-solid fa-trash"></i></button>
            <button class = "secondary" onclick = "editTask('${id}')" ><i class="fa-solid fa-pencil"></i></button>
            <button id = "btnStar.${id}"onclick = "starTask('${id}')"><i class="fa-solid fa-star"></i></button>
            </section>
        </article>
        `;
    }

    for (let n = 0; n < task.length; n++) {
        let title = task[n].title;
        let description = task[n].description;
        let id = task[n].id;

        $tasksView.innerHTML += `
        <article>
            <h4>${title}</h4>
            <p>${description}</p>
            <section>
            <button class = "contrast" onclick = "deleteTask('${id}')" ><i class="fa-solid fa-trash"></i></button>
            <button class = "secondary" onclick = "editTask('${id}')" ><i class="fa-solid fa-pencil"></i></button>
            <button id = "btnStar.${id}"onclick = "starTask('${id}')"><i class="fa-regular fa-star"></i></button>
            </section>
        </article>
        `;
    }
}

// Function to delate task on localStorage
function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let delateTasks = tasks.filter((task) => task.id !== id);
    
    localStorage.setItem('tasks', JSON.stringify(delateTasks));

    getTasks();
}

//
function editTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const $title = $('#title');
    const $description = $('#description');
    var edit = true;
    var editTask = tasks.filter((task) => task.id === id);
    let delateTasks = tasks.filter((task) => task.id !== id);

    $("#form").classList.add('active')

    $title.value = editTask[0].title;
    $description.value = editTask[0].description;
    $title.focus();
    localStorage.setItem('tasks', JSON.stringify(delateTasks));

    getTasks();
}

function starTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let btn = 'btnStar.' + id;

    tasks.map(function(task) {
        if (task.id === id) {
            let star = 1;
            if (task.star === 1) star = 0;
            task.star = star;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    getTasks();
}

// Variables to interact with the modal
const $btnOpenModal = $("#btnOpenModal");
const $modalClearTasks = $("#modalClearTasks");
const $btnCancelModal = $("#btnCancelModal");
const $btnOkeyModal = $("#btnOkeyModal");

// On click in button open modal
$btnOpenModal.addEventListener("click", () => {
    if (typeof $modalClearTasks.showModal === 'function') {
        $modalClearTasks.showModal();
    } else {
        let deleted = window.confirm('Delate all Tasks');
        if (deleted === true) {
            localStorage.clear();
            getTasks();
        }
    }
});

// On click in button close modal
$btnCancelModal.addEventListener("click", () => {
    $modalClearTasks.close();
});

// On click in button close modal and clear the localStorage
$btnOkeyModal.addEventListener("click", () => {
    $modalClearTasks.close();   
    localStorage.clear();
    getTasks();
});

const $switchTheme = $("#switchTheme");

$switchTheme.addEventListener('click', () => {
    let theme = 'light';
    if($switchTheme.checked) theme = 'dark';
    $('html').setAttribute("data-theme", theme);
});

//
const $newTask = $("#newTask");
const $form = $("#form");
const $cancelTask = $("#cancelTask");

//
$newTask.addEventListener("click", () => {
    form.classList.add('active');
    $('#title').focus();
});

//
$cancelTask.addEventListener("click", () => {
    $('#formTasks').reset();
    $form.classList.remove('active');
    if (edit) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.push(editTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

//
const $btnOpenSideBar = $("#btnOpenSideBar");
const $sideBar = $("#sideBar");

//
$btnOpenSideBar.addEventListener("click", () => {
    $sideBar.classList.toggle('active');
    $btnOpenSideBar.classList.toggle('active');

    let icon = `<i class="fa-solid fa-bars"></i>`;
    if ($btnOpenSideBar.classList[1] === 'active') icon = `<i class="fa-solid fa-angle-right"></i>`;
    
    $btnOpenSideBar.innerHTML = icon;
});

$form.addEventListener('input', () => {
    let disabled = true;
    let title = $('#title').value;

    if (title !== "") {
        disabled = false;
    }
    $("#btnSaveTask").disabled = disabled;
});

//
if (typeof(Storage) !== 'undefined') {
    $("#btnSaveTask").addEventListener('click', saveTask);
    getTasks();
} else {
    const $modalErrorLocalStorage = $('#modalErrorLocalStorage');
    if (typeof $modalErrorLocalStorage.showModal === 'function') {
        $modalErrorLocalStorage.showModal();
    } else {
        window.alert('Sorry, this page is not compatible with your browser &#1F615');
    }
}