const getTaskListItem = value => `<li class="task_list__item">
<div class="task-list__btn-container">
    <button class="task_list__btn task_list__complete">
        <svg class="task_list__icon task_list__complete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
    </button>
</div>
<div class="task_list__item-content">
    <input
        type="text"
        name="task_text"
        id="task_text"
        value="${value}"
        class="task_list__item-text"
        readonly
    >
</div>
<div class="task-list__actions">
    <button class="task_list__btn task_list__edit">
        <svg class="task_list__icon task_list__edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
    </button>
    <button class="task_list__btn task_list__delete">
        <svg xmlns="http://www.w3.org/2000/svg" class="task_list__icon task_list__delete-icon" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
    </button>
</div>
</li>`

function deleteTask (index) {
    const taskItemsValue = JSON.parse(localStorage.getItem('tasks'))
    const taskItems = Array.from(document.querySelectorAll('.task_list__item'))
    taskItemsValue.splice(index, 1)
    localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
    taskItems[index].remove()
    showTasks()
}

function editTask (index) {
    const taskItemsValue = JSON.parse(localStorage.getItem('tasks'))
    const taskItems = Array.from(document.querySelectorAll('.task_list__item'))

    const taskListItemText = Array.from(document.querySelectorAll('.task_list__item-text'))
    taskListItemText[index].removeAttribute('readonly')
    taskListItemText[index].focus()
    taskListItemText[index].setSelectionRange(taskListItemText[index].value.length, taskListItemText[index].value.length)
    taskListItemText[index].style.color = '#146189'

    const onFocus = (index) => {
        if (!taskListItemText[index].value) {
            taskItemsValue.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
            taskItems[index].remove()
            showTasks()
            return
        }
        taskListItemText[index].setAttribute('readonly', '')
        taskListItemText[index].style.color = '#F2F2F2'
        taskItemsValue[index] = taskListItemText[index].value
        localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
    }
    
    taskListItemText[index].addEventListener('blur', () => {
        onFocus(index)
    })
    
    taskListItemText[index].addEventListener('keydown', e => {
        if (e.key === "Enter") {
            onFocus(index)
        }
    })
}

function completeTask (index) {
    const taskItemsValue = JSON.parse(localStorage.getItem('tasks'))
    const completeTaskIndexes = JSON.parse(localStorage.getItem('taskIndexes')) ? JSON.parse(localStorage.getItem('taskIndexes')) : [] //
    

    const taskListItemText = Array.from(document.querySelectorAll('.task_list__item-text'))
    taskListItemText[index].style.textDecoration = 'line-through'

    const removedTaskItemsValue = taskItemsValue.splice(index, 1)[0]
    taskItemsValue.push(removedTaskItemsValue) //
    completeTaskIndexes.push(taskItemsValue.length - 1) //
    localStorage.setItem('taskIndexes', JSON.stringify(completeTaskIndexes)) //
    localStorage.setItem('tasks', JSON.stringify(taskItemsValue))

    showTasks()
}

function appendTask () {
    const taskInput = document.querySelector('#task-input')

    const taskItemsValue = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []

    taskItemsValue.push(taskInput.value)
    localStorage.setItem('tasks', JSON.stringify(taskItemsValue))
    taskInput.value = ''

    showTasks()
}

function addListenersToActionBtns (selector, callback) {
    const btns = Array.from(document.querySelectorAll(selector))

    btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            callback(i)
        })
    })
}

function showTasks () {
    const taskList = document.querySelector('.task-list')

    const taskItemsValue = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []

    let taskItems = ''
    
    taskItemsValue.map(item => {
        taskItems += getTaskListItem(item)
    })

    taskList.innerHTML = taskItems
    addListenersToActionBtns('.task_list__delete', deleteTask)
    addListenersToActionBtns('.task_list__edit', editTask)
    addListenersToActionBtns('.task_list__complete', completeTask)
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