/**
 * Get html code of new list item with unique UUID.
 * @param {value} str - The text that the user enters.
 * @param {uuid} str - A randomly generated v4 UUID of 36 characters.
 */
function getTaskListItem(uuid, value) {
  return `<li class="task_list__item task_list__item_modern" data-task-uuid="${uuid}">
  <div class="task-list__btn-container">
      <button class="task_list__btn task_list__complete" data-task-uuid="${uuid}">
          <svg class="task_list__icon task_list__complete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
      </button>
  </div>
  <div class="task_list__item-content">
      <input
          type="text"
          name="task_text"
          id="task_text-${uuid}"
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
}
/**
 * Get a string containing a randomly generated v4 UUID of 36 characters.
 */
function getUuid() {
  // eslint-disable-next-line no-restricted-globals
  return self.crypto.randomUUID()
}

/**
 * Get an element with a specific uuid from a list of all elements with that selector.
 * @param {selector} str - The selector by which to get the html elements.
 * @param {uuid} str - A randomly generated v4 UUID of 36 characters
 * that is needed to find a specific html element.
 */
function getElementByUuid(selector, uuid) {
  const elements = Array.from(document.querySelectorAll(selector))
  return elements.filter((item) => item.dataset.taskUuid === uuid)[0]
}

/**
 * Highlights all completed tasks.
 */
function findCompleteTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const completeUuidTasks = []
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].completeStatus) {
      completeUuidTasks.push(key)
    }
  })

  const taskListItemTexts = Array.from(document.querySelectorAll('.task_list__item-text'))

  taskListItemTexts.forEach((item) => {
    const taskItem = item
    if (completeUuidTasks.includes(taskItem.dataset.taskUuid)) {
      taskItem.style.textDecoration = 'line-through'
    } else {
      taskItem.style.textDecoration = 'none'
    }
  })
}

/**
 * Moves all completed tasks down.
 */
function moveDownCompleteTasks() {
  const taskListItem = Array.from(document.querySelectorAll('.task_list__item'))
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const completeUuidTasks = []
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].completeStatus) {
      completeUuidTasks.push(key)
    }
  })

  taskListItem.forEach((item) => {
    if (completeUuidTasks.includes(item.dataset.taskUuid)) {
      const completedTask = tasks[item.dataset.taskUuid]
      delete tasks[item.dataset.taskUuid]
      tasks[item.dataset.taskUuid] = completedTask
      const taskItem = getElementByUuid('.task_list__item', item.dataset.taskUuid)
      const parent = taskItem.parentNode
      parent.appendChild(taskItem)
    }
  })

  localStorage.setItem('tasks', JSON.stringify(tasks))
}

/**
 * Highlights even or odd items in the task list.
 * @param {parityStatus} boolean - Defines the selection status of odd and even elements.
 * @param {className} str - The name of the class (odd or even) to be added to the list of
 * classes for each element of the task list.
 */
function selectElementsByParity(parityStatus, className) {
  const parityElementsStatus = JSON.parse(localStorage.getItem(parityStatus))

  const taskListItems = Array.from(document.querySelectorAll('.task_list__item'))

  for (let i = 0; i < taskListItems.length; i += 1) {
    taskListItems[i].classList.remove(className)
    if (parityElementsStatus && className === 'odd') {
      if (i % 2 === 0) {
        taskListItems[i].classList.add(className)
      }
    } else if (parityElementsStatus && className === 'even') {
      if (i % 2 !== 0) {
        taskListItems[i].classList.add(className)
      }
    }
  }
}

/**
 * Marks the item complete and places it at the end of the list
 * and checks the selection statuses of the items in the task list.
 */
function completeTask() {
  const uuid = this.dataset.taskUuid
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const taskListItemText = getElementByUuid('.task_list__item-text', uuid)
  tasks[uuid].completeStatus = !tasks[uuid].completeStatus

  if (tasks[uuid].completeStatus) {
    taskListItemText.style.textDecoration = 'line-through'
    const completedTask = tasks[uuid]
    delete tasks[uuid]
    tasks[uuid] = completedTask

    const taskItem = getElementByUuid('.task_list__item', uuid)
    const parent = taskItem.parentNode
    parent.appendChild(taskItem)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  } else {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    taskListItemText.style.textDecoration = 'none'
    moveDownCompleteTasks()
  }

  selectElementsByParity('evenElementsStatus', 'even')
  selectElementsByParity('oddElementsStatus', 'odd')
}

/**
 * Changes the content of a particular task list item
 * (if the content changes to an empty string, removes that item)
 * and checks the selection statuses of the items in the task list.
 */
function editTask() {
  const uuid = this.dataset.taskUuid
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const taskItem = getElementByUuid('.task_list__item', uuid)
  const taskListItemText = getElementByUuid('.task_list__item-text', uuid)
  taskListItemText.removeAttribute('readonly')
  taskListItemText.focus()
  taskListItemText.setSelectionRange(taskListItemText.value.length, taskListItemText.value.length)
  taskListItemText.style.color = '#146189'

  /**
   * Saves new data entered by the user
   * and if this data is an empty string, removes this element.
   */
  function onFocus() {
    if (!taskListItemText.value) {
      delete tasks[uuid]
      localStorage.setItem('tasks', JSON.stringify(tasks))
      taskItem.remove()
      selectElementsByParity('evenElementsStatus', 'even')
      selectElementsByParity('oddElementsStatus', 'odd')
      return
    }
    taskListItemText.setAttribute('readonly', '')
    taskListItemText.style.color = '#F2F2F2'
    tasks[uuid].title = taskListItemText.value
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  taskListItemText.addEventListener('blur', () => {
    onFocus.call(this)
  })

  taskListItemText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onFocus.call(this)
    }
  })
}

/**
 * Removes an item from the task list
 * and checks the selection statuses of the items in the task list.
 */
function deleteTask() {
  const uuid = this.dataset.taskUuid

  const taskListItem = getElementByUuid('.task_list__item', uuid)

  const tasks = JSON.parse(localStorage.getItem('tasks'))

  delete tasks[uuid]

  localStorage.setItem('tasks', JSON.stringify(tasks))

  taskListItem.remove()
  selectElementsByParity('evenElementsStatus', 'even')
  selectElementsByParity('oddElementsStatus', 'odd')
}

/**
 * Adds event listeners to task list item buttons.
 * @param {selector} str - The selector by which to get the button.
 * @param {callback} function - The function to be added as an event listener.
 */
function addListenersToActionBtns(selector, callback) {
  const btns = Array.from(document.querySelectorAll(selector))

  btns.forEach((btn) => {
    btn.removeEventListener('click', callback)
    btn.addEventListener('click', callback)
  })
}

/**
 * Adds a new task list item, checks the selection
 * statuses of these elements, adds event listeners to task list item buttons
 * and moves all completed tasks down.
 */
function appendTask() {
  const taskList = document.querySelector('.task-list')
  const taskInput = document.querySelector('#task-input')

  const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

  const uuid = getUuid()

  tasks[uuid] = {
    title: taskInput.value,
    completeStatus: false,
  }
  localStorage.setItem('tasks', JSON.stringify(tasks))
  taskList.innerHTML += getTaskListItem(uuid, taskInput.value)
  taskInput.value = ''

  addListenersToActionBtns('.task_list__delete', deleteTask)
  addListenersToActionBtns('.task_list__edit', editTask)
  addListenersToActionBtns('.task_list__complete', completeTask)

  moveDownCompleteTasks()

  selectElementsByParity('evenElementsStatus', 'even')
  selectElementsByParity('oddElementsStatus', 'odd')
}

/**
 * Displays all elements of the task list, checks the selection
 * statuses of these elements, and adds event listeners to task list item buttons,
 * and moves down and highlights all completed tasks.
 */
function showTasks() {
  const taskList = document.querySelector('.task-list')

  const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

  let taskItems = ''

  Object.keys(tasks).forEach((uuid) => {
    taskItems += getTaskListItem(uuid, tasks[uuid].title)
  })

  taskList.innerHTML = taskItems
  addListenersToActionBtns('.task_list__delete', deleteTask)
  addListenersToActionBtns('.task_list__edit', editTask)
  addListenersToActionBtns('.task_list__complete', completeTask)

  if (Object.keys(tasks).length > 0) {
    findCompleteTasks()

    moveDownCompleteTasks()

    selectElementsByParity('evenElementsStatus', 'even')
    selectElementsByParity('oddElementsStatus', 'odd')
  }
}

/**
 * Add an event listener to the button that highlights even or odd items in the task list.
 * @param {btn} object - A button that selects odd or even list items.
 * @param {parityStatus} boolean - Defines the selection status of odd and even elements.
 * @param {className} str - The name of the class (odd or even) to be added to the list of
 * classes for each element of the task list.
 */
function addListenersToSelectElementsBtns(btn, parityStatus, className) {
  btn.addEventListener('click', () => {
    if (localStorage.getItem(parityStatus) === null) {
      localStorage.setItem(parityStatus, JSON.stringify(false))
    }
    const parityElementsStatus = !JSON.parse(localStorage.getItem(parityStatus))
    localStorage.setItem(parityStatus, parityElementsStatus)
    selectElementsByParity(parityStatus, className)
  })
}

/**
 * Add an event listener on a button that removes either the first or last element of the task list.
 * @param {btn} object - Delete first or last item button.
 * @param {position} str - Specifies which element to remove first or last.
 */
function addListenersForLastFirstElemDelBtns(btn, position) {
  btn.addEventListener('click', () => {
    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {}

    const taskUuid = position === 'first' ? Object.keys(tasks)[0] : Object.keys(tasks)[Object.keys(tasks).length - 1]

    if (Object.keys(tasks).length > 0) {
      const data = {
        dataset: {
          taskUuid,
        },
      }
      deleteTask.call(data)
    }
  })
}

window.addEventListener('load', () => {
  const taskInput = document.querySelector('#task-input')
  const taskSubmit = document.querySelector('#task-submit')
  const selectOddElementBtn = document.querySelector('.menu__item-btn-odd')
  const selectEvenElementBtn = document.querySelector('.menu__item-btn-even')
  const deleteFirstTaskElement = document.querySelector('.menu__item-btn-del-first')
  const deleteLastTaskElement = document.querySelector('.menu__item-btn-del-last')
  const menuBtn = document.querySelector('.menu-btn')
  const menu = document.querySelector('.menu')

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active')
    menu.classList.toggle('active')
  })

  showTasks()

  taskSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    if (!taskInput.value) {
      return
    }
    appendTask()
  })

  addListenersToSelectElementsBtns(selectEvenElementBtn, 'evenElementsStatus', 'even')
  addListenersToSelectElementsBtns(selectOddElementBtn, 'oddElementsStatus', 'odd')
  addListenersForLastFirstElemDelBtns(deleteFirstTaskElement, 'first')
  addListenersForLastFirstElemDelBtns(deleteLastTaskElement, 'last')
})
