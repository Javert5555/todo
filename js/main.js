const getTaskListItem = (uuid, value) => `<li class="task_list__item" data-task-uuid="${uuid}">
<div class="task-list__btn-container">
    <button class="task_list__btn task_list__complete" data-task-uuid="${uuid}">
        <svg class="task_list__icon task_list__complete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
    </button>
</div>
<div class="task_list__item-content">
    <input
        type="text"
        name="task_text"
        id="task_text"
        data-task-uuid="${uuid}"
        value="${value}"
        class="task_list__item-text"
        readonly
    >
</div>
<div class="task-list__actions">
    <button class="task_list__btn task_list__edit" data-task-uuid="${uuid}">
        <svg class="task_list__icon task_list__edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
    </button>
    <button class="task_list__btn task_list__delete" data-task-uuid="${uuid}">
        <svg xmlns="http://www.w3.org/2000/svg" class="task_list__icon task_list__delete-icon" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
    </button>
</div>
</li>`

function getUuid () {
    return self.crypto.randomUUID()
}

function getElementByUuid (selector, uuid) {
    const elements = Array.from(document.querySelectorAll(selector))
    return elements.filter((item) => item.dataset.taskUuid === uuid)[0]
}

function findCompleteTasks () {
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    let completeUuidTasks = []
    Object.keys(tasks).map(key => {
        if (tasks[key]['completeStatus']) {
            completeUuidTasks.push(key)
        }
    })

    let taskListItemTexts = Array.from(document.querySelectorAll('.task_list__item-text'))

    // taskListItemTexts = taskListItemTexts.filter(item => completeUuidTasks.includes(item.dataset.taskUuid))
    taskListItemTexts.map(item => {
        if (completeUuidTasks.includes(item.dataset.taskUuid)) {
            item.style.textDecoration = 'line-through'
        } else {
            item.style.textDecoration = 'none'
        }
    })
}

function moveDownCompleteTasks () {
    let taskListItem = Array.from(document.querySelectorAll('.task_list__item'))
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    let completeUuidTasks = []
    Object.keys(tasks).map(key => {
        if (tasks[key]['completeStatus']) {
            completeUuidTasks.push(key)
        }
    })

    // taskListItem = taskListItem.filter(item => completeUuidTasks.includes(item.dataset.taskUuid))
    taskListItem.map(item => {
        if (completeUuidTasks.includes(item.dataset.taskUuid)) {
            const completedTask = tasks[item.dataset.taskUuid]
            delete tasks[item.dataset.taskUuid]
            tasks[item.dataset.taskUuid] = completedTask

            
            const taskItem = getElementByUuid('.task_list__item', item.dataset.taskUuid)
            let parent = taskItem.parentNode
            parent.appendChild(taskItem)
        }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))


}

function completeTask () {
    const uuid = this.dataset.taskUuid
    const tasks = JSON.parse(localStorage.getItem('tasks'))

    let taskListItemText = getElementByUuid('.task_list__item-text', uuid)
    

    tasks[uuid]['completeStatus'] = !tasks[uuid]['completeStatus']

    if (tasks[uuid]['completeStatus']) {
        taskListItemText.style.textDecoration = 'line-through'
        const completedTask = tasks[uuid]
        delete tasks[uuid]
        tasks[uuid] = completedTask
        
        const taskItem = getElementByUuid('.task_list__item', uuid)
        let parent = taskItem.parentNode
        parent.appendChild(taskItem)
        localStorage.setItem('tasks', JSON.stringify(tasks))

    } else {
        localStorage.setItem('tasks', JSON.stringify(tasks))
        taskListItemText.style.textDecoration = 'none'
        moveDownCompleteTasks()
    }



    console.log(uuid)
    console.log(localStorage)

    // findCompleteTasks()
}

function editTask () {
    const uuid = this.dataset.taskUuid
    
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    const taskItem = getElementByUuid('.task_list__item', uuid)
    const taskListItemText = getElementByUuid('.task_list__item-text', uuid)

    taskListItemText.removeAttribute('readonly')
    taskListItemText.focus()
    taskListItemText.setSelectionRange(taskListItemText.value.length, taskListItemText.value.length)
    taskListItemText.style.color = '#146189'

    function onFocus () {
        if (!taskListItemText.value) {
            delete tasks[uuid]
            localStorage.setItem('tasks', JSON.stringify(tasks))
            taskItem.remove()
            return
        }
        taskListItemText.setAttribute('readonly', '')
        taskListItemText.style.color = '#F2F2F2'
        tasks[uuid]['title'] = taskListItemText.value
        localStorage.setItem('tasks', JSON.stringify(tasks))
        console.log(this)
    }

    
    taskListItemText.addEventListener('blur', function() {
        onFocus.call(this)
    })
    
    taskListItemText.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
            onFocus.call(this)
        }
    })

}

function deleteTask () {
    const uuid = this.dataset.taskUuid

    let taskListItem = getElementByUuid('.task_list__item', uuid)

    const tasks = JSON.parse(localStorage.getItem('tasks'))

    delete tasks[uuid]

    localStorage.setItem('tasks', JSON.stringify(tasks))

    taskListItem.remove()
}

function addListenersToActionBtns (selector, callback) {
    const btns = Array.from(document.querySelectorAll(selector))

    btns.forEach((btn, i) => {
        btn.removeEventListener('click', callback)
        btn.addEventListener('click', callback)
    })
}

function appendTask () {
    const taskList = document.querySelector('.task-list')
    const taskInput = document.querySelector('#task-input')

    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

    const uuid = getUuid()

    tasks[uuid] = {
        title: taskInput.value,
        completeStatus: false
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
    taskList.innerHTML += getTaskListItem(uuid, taskInput.value)
    taskInput.value = ''
    
    addListenersToActionBtns('.task_list__delete', deleteTask)
    addListenersToActionBtns('.task_list__edit', editTask)
    addListenersToActionBtns('.task_list__complete', completeTask)
}

function showTasks () {
    const taskList = document.querySelector('.task-list')

    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

    let taskItems = ''
    
    Object.keys(tasks).map(uuid => {
        taskItems += getTaskListItem(uuid, tasks[uuid]['title'])
    })

    taskList.innerHTML = taskItems
    addListenersToActionBtns('.task_list__delete', deleteTask)
    addListenersToActionBtns('.task_list__edit', editTask)
    addListenersToActionBtns('.task_list__complete', completeTask)

    if (Object.keys(tasks).length > 0) findCompleteTasks()
}

///////////////////////////////////////////

window.addEventListener('load', () => {
    const taskInput = document.querySelector('#task-input')
    const taskSubmit = document.querySelector('#task-submit')
    showTasks()

    taskSubmit.addEventListener('click', e => {

        e.preventDefault()
        if (!taskInput.value) {
            alert('Укажите задачу')
            return
        }
        appendTask()
    })



})