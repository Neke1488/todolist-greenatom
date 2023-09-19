(() => {
  const { _ } = window;
  const deleteFirst = document.querySelector(".btn-delete-first");
  const deleteLast = document.querySelector(".btn-delete-last");
  const oddBtn = document.querySelector('.btn-odd');
  const evenBtn = document.querySelector('.btn-even');
  const mainInput = document.querySelector('.main-input');
  const addButton = document.querySelector('.add-button');
  const mainList = document.querySelector('.main-list');
  const checkAll = document.querySelector('.check-all');
  const deleteCompleted = document.querySelector('.btn-delete-completed');
  const listContainer = document.querySelector('.list-container');
  const tabs = document.querySelector('.tabs');
  const buttonSelectionAll = document.querySelector('.btn-all');
  const buttonSelectionActive = document.querySelector('.btn-active');
  const buttonSelectionCompleted = document.querySelector('.btn-completed');
  const counterAll = document.querySelector('.counter-all');
  const counterActive = document.querySelector('.counter-active');
  const counterCompleted = document.querySelector('.counter-completed');
  const pageStorage = document.querySelector('.page-storage');
  const Escape = 'Escape';
  const Enter = 'Enter';
  const nTaskPerPage = 5;
  let arrTask = [];
  let selectedButtonValue = 'btn btn-secondary btn-all';
  let nChoicePage = 1;

  window.onload = () => {
    arrTask = JSON.parse(localStorage.getItem('data')) || [];
    render();
  };

  function correctText(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  function render(tempArray) {
    while (mainList.firstChild) {
      mainList.removeChild(mainList.firstChild);
    }
    let outputArray = tempArray;
    if (!outputArray)outputArray = arrTask;
    outputArray.sort((a, b) => a.completed > b.completed ? 1 : a.completed < b.completed ? -1 : 0);
    const valuePages = Math.ceil(outputArray.length / nTaskPerPage);
    let page = '';
    let index = 0;
    while (index < valuePages) {
      if ((index + 1) === Number(nChoicePage))page += `<button class="btn btn-secondary pages-task active">${index + 1} </button>`;
      else page += `<button class="btn btn-secondary pages-task">${index + 1} </button>`;
      index += 1;
    }
    pageStorage.innerHTML = page;

    if (Number(nChoicePage) > valuePages || !nChoicePage) nChoicePage = valuePages;
    outputArray = outputArray.slice((nChoicePage - 1) * nTaskPerPage, nChoicePage * nTaskPerPage);
    
    outputArray.forEach((item) => {
      const checked = item.completed ? 'checked' : '';
      const li = document.createElement('li');
      li.className = 'main-li';
      li.id = String(item.id);
      const input = document.createElement('input');
      input.className = 'checkbox';
      input.id = String(item.id);
      input.type = 'checkbox';
      input.checked = checked;
      console.log(li);
      li.appendChild(input);
      const span = document.createElement('span');
      span.id = String(item.id);
      span.className = 'span-text';
      span.type = 'visibility';
      span.textContent = _.escape(item.text);
      li.appendChild(span);
      const textarea = document.createElement('textarea');
      textarea.hidden = true;
      textarea.className = 'text-area';
      li.appendChild(textarea);
      const button = document.createElement('button');
      button.id = String(item.id);
      button.className = "btn btn-outline-danger delete-button";
      li.appendChild(button);
      mainList.appendChild(li);
   });
    checkAll.checked = !arrTask.find((item) => item.completed === false) && arrTask.length;
    counterAll.textContent = arrTask.length;
    counterActive.textContent = (arrTask.filter((item) => item.completed !== true)).length;
    counterCompleted.textContent = (arrTask.filter((item) => item.completed === true)).length;
  }

  function removeFirstTask() {
    arrTask.shift();
    tabSelection();
  };

  function removeLastTask() {
    arrTask.pop();
    tabSelection();
  };

  function tabSelection(event) {
    let selectedButton = '';
    if (event) {
      selectedButton = event.target.classList;
      if (selectedButton.value.indexOf('counter') !== -1)selectedButton = event.target.parentNode.classList;
      if (selectedButton.value.indexOf(selectedButtonValue, 0) !== -1)selectedButton.remove('active');
      selectedButtonValue = selectedButton.value;
    }
    let tempArray = [];
    switch (selectedButtonValue) {
      case 'btn btn-secondary btn-all':
        tempArray = arrTask;
        break;

      case 'btn btn-secondary btn-active':
        tempArray = arrTask.filter((item) => item.completed === false);
        break;

      case 'btn btn-secondary btn-completed':
        tempArray = arrTask.filter((item) => item.completed === true);
        break;
      default:
        break;
    }

    if (tempArray && event) {
      buttonSelectionActive.classList.remove('active');
      buttonSelectionAll.classList.remove('active');
      buttonSelectionCompleted.classList.remove('active');
      selectedButton.add('active');
    }
    localStorage.setItem('data', JSON.stringify(arrTask));
    render(tempArray);
  }

  function addTask() {
    addButton.blur();
    const inputValue = mainInput.value.trim();
    if (inputValue) {
      const text = correctText(mainInput.value);
      const task = {
        id: Date.now(),
        completed: false,
        text,
      };
      
      arrTask.push(task);
      nChoicePage = Number(Math.ceil(arrTask.length / nTaskPerPage));
      mainInput.value = '';
      tabSelection();
    }
  }

  function addTaskByEnter(event) {
    if (event.key === Enter) addTask();
  }

  function deleteORCheckTask(event) {
    const foundTaskId = Number(event.target.id);
    if (event.target.classList.contains('delete-button')) {
      arrTask = arrTask.filter((item) => item.id !== foundTaskId);
      tabSelection();
    }

    if (event.target.classList.contains('checkbox')) {
      const foundTask = arrTask.find((item) => item.id === foundTaskId);
      foundTask.completed = event.target.checked;
      tabSelection();
    }
  }

  function checkAllTask(event) {
    arrTask.forEach((item) => { item.completed = event.target.checked; });
    tabSelection();
  }

  function deleteCompletedTask() {
    arrTask = arrTask.filter((item) => item.completed !== true);
    deleteCompleted.blur();
    tabSelection();
  }

  function editTaskText(event) {
    const textarea = document.getElementsByClassName('text-area')[0];
    textarea.hidden = false;
    const foundTaskId = Number(event.target.id);
    const foundTask = arrTask.find((item) => item.id === foundTaskId);
    const firstText = event.target;
    textarea.textContent = firstText.value;

    function saveChanges() {
      if (textarea.value.trim()) {
        foundTask.text = correctText(textarea.value);
      }
      tabSelection();
    }

    function saveByBlur() {
      saveChanges();
    }

    function saveOrDeleteChanges(event) {
      if (event.key === Enter)saveChanges();
      if (event.key === Escape) {
        textarea.removeEventListener('blur', saveByBlur);
        tabSelection();
      }
    }

    if (event.target.classList.contains('span-text')) {
      firstText.hidden = true;
      textarea.hidden = false;
      textarea.textContent = firstText.textContent;
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
      textarea.addEventListener('keyup', saveOrDeleteChanges);
      textarea.addEventListener('blur', saveByBlur);
    }
}
  
  function effectEven() {
    const illumination = document.getElementsByClassName("main-li");
    for (let i = 1; i < illumination.length; i += 2) {
      illumination[i].classList.add("even");
    } 
  }

  function effectOdd() {
    const illumination = document.getElementsByClassName("main-li");
    for (let i = 0; i < illumination.length; i += 2) {
      illumination[i].classList.add("odd");
    } 
  }

  function pageSelection(event) {
    nChoicePage = Number(event.target.textContent);
    tabSelection();
  }

  listContainer.addEventListener('dblclick', editTaskText);
  addButton.addEventListener('click', addTask);
  mainList.addEventListener('click', deleteORCheckTask);
  mainInput.addEventListener('keyup', addTaskByEnter);
  checkAll.addEventListener('click', checkAllTask);
  deleteCompleted.addEventListener('click', deleteCompletedTask);
  pageStorage.addEventListener('click', pageSelection);
  tabs.addEventListener('click', tabSelection);
  evenBtn.addEventListener('click', effectEven);
  oddBtn.addEventListener('click', effectOdd);
  deleteFirst.addEventListener('click', removeFirstTask);
  deleteLast.addEventListener('click', removeLastTask);
})();
