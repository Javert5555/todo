const getTaskListItem = (key, value) => `<li class="task_list__item" id="list-item-${key}">
<div class="task-list__btn-container">
    <button class="task_list__btn task_list__complete" id="complete-${key}">
        <svg class="task_list__icon task_list__complete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
    </button>
</div>
<div class="task_list__item-content">
    <input
        type="text"
        name="task_text"
        id="text-${key}"
        value="${value}"
        class="task_list__item-text"
        readonly
    >
</div>
<div class="task-list__actions">
    <button class="task_list__btn task_list__edit" id="edit-${key}">
        <svg class="task_list__icon task_list__edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
    </button>
    <button class="task_list__btn task_list__delete" id="delete-${key}">
        <svg xmlns="http://www.w3.org/2000/svg" class="task_list__icon task_list__delete-icon" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
    </button>
</div>
</li>`

function getMaxIndex () {
    // const items = Array.from(document.querySelectorAll('.task_list__item'))
    // if (items) return 0

    const maxIndex = JSON.parse(localStorage.getItem('maxIndex')) ? +JSON.parse(localStorage.getItem('maxIndex')) : 0
    localStorage.setItem('maxIndex', JSON.stringify(maxIndex + 1))
    return maxIndex


}

function deleteTask () {
    const index = this.id.at(-1) // equal this.id[this.id.length - 1]

    const taskListItems = Array.from(document.querySelectorAll('.task_list__item'))
    const taskItemsValue = JSON.parse(localStorage.getItem('tasks'))
    console.log(taskListItems)

    for (let i = 0; i < taskListItems.length; i++) {
        console.log(index)
        if (taskListItems[i].id === `list-item-${index}`) {
            taskListItems[i].remove()
            delete taskItemsValue[`task-${index}`]
            localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
        }
    }


    console.log(this.id.at(-1))
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

    const taskItemsValue = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

    const index = getMaxIndex()

    taskItemsValue[`task-${index}`] = taskInput.value
    localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
    console.log(index)
    taskList.innerHTML += getTaskListItem(index, taskInput.value)
    taskInput.value = ''
    addListenersToActionBtns('.task_list__delete', deleteTask)


}

function showTasks () {
    const taskList = document.querySelector('.task-list')

    const taskItemsValue = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

    let taskItems = ''
    
    Object.keys(taskItemsValue).map(key => {
        taskItems += getTaskListItem(key[key.length-1], taskItemsValue[key])
    })

    taskList.innerHTML = taskItems
    addListenersToActionBtns('.task_list__delete', deleteTask)
    // addListenersToActionBtns('.task_list__edit', editTask)
    // addListenersToActionBtns('.task_list__complete', completeTask)
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