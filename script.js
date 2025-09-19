let todoArray = [];
let todoId = 0;
let currentFilter = 'all';
const LOCAL_TODOS = "local_todos";

const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const todoFilters = document.querySelectorAll("input[name='filter']");
const btnClear = document.getElementById('clear-completed');

const themeSwitch = document.getElementById('theme-toggle');
const themeLogos = document.querySelectorAll('.btn--theme img');

btnClear.addEventListener("click", () => {
   todoArray = todoArray.filter(todo => todo.active);
   updateLocalStorage();
   refreshFilters();
   todoList.innerHTML = "";
   getLocalStorage();
});

themeSwitch.addEventListener('click', themeSwitcher);

todoInput.addEventListener("keyup",(e)=>{
   if(e.target.value!=="" && e.key==="Enter"){
      let todoText = e.target.value.trim();
      addTodoElem(todoText);
      todoInput.value="";
   }
});

todoFilters.forEach((filter) => {
   filter.addEventListener('change', filterCallback);
});


function filterCallback(e) {
   currentFilter = e.target.value;
   refreshFilters();
}

function refreshFilters() {
   if (currentFilter === 'completed') {
      completedCB();
   } else if (currentFilter === 'all') {
      allCB();
   } else { 
      activeCB();
   }
}

function completedCB() {
   todoArray.forEach((arrayObj)  => {
      arrayObj.DOMelem.classList.toggle("todo_elem--hide", arrayObj.active);
   });
}

function allCB() {
   todoArray.forEach((arrayObj)  => {
      arrayObj.DOMelem.classList.remove("todo_elem--hide");
   });
}

function activeCB() {
   todoArray.forEach((arrayObj)  => {
      arrayObj.DOMelem.classList.toggle("todo_elem--hide", !arrayObj.active);
   });
}


function updateActiveCount() {
   let count = todoArray.reduce((count, todoObj) => {
      if (todoObj.active) count++;
      return count;
   }, 0);
   itemsLeft.innerText = count;
}


function themeSwitcher(e) {
   themeLogos.forEach(logo => logo.classList.toggle("todo_elem--hide"));
   document.body.dataset.theme = document.body.dataset.theme === "darkTheme" ? "" : "darkTheme";
}


function addTodoElem(todoText, isNew = true, storedTodo = null) { 
   const currentId = isNew ? todoId : storedTodo.id;
   const todoEl = document.createElement("li");                   
   todoEl.classList.add("todo_elem");                            
   todoEl.dataset.id = currentId; 

   todoEl.innerHTML = `                                            
      <input type="checkbox" id="check-${currentId}" ${storedTodo && !storedTodo.active ? "checked" : ""}>
      <label for="check-${currentId}" class="custom-checkbox todo_check">
         <img src="icon-check.svg" alt="check">
      </label>
      <label for="check-${currentId}" class="todo-text">${todoText}</label>
      <button class="btn todo_delete">
         <img src="icon-cross.svg" alt="delete">
      </button>
   `;

   // Delete
   const todo_delete = todoEl.querySelector(".todo_delete");      
   todo_delete.addEventListener("click", function() {            
      removeElem(todoEl);                                          
   });

   // Checkbox toggle 
   const checkbox = todoEl.querySelector("input[type='checkbox']");
   checkbox.addEventListener("change", function(e) {
      const todoObj = todoArray.find(t => t.id === currentId);
      if (todoObj) {
         todoObj.active = !e.target.checked;
         updateLocalStorage();
         updateActiveCount();
         refreshFilters();
      }
   });

   // Add to array if new 
   if (isNew) {                                                    
      todoArray.push({                                            
         active: true,                                            
         content: todoText,                                        
         DOMelem: todoEl,                                        
         id: currentId                                             
      });
      todoId++; 
   } else {
      todoArray.forEach((arrayObj) => {
         if (arrayObj.id === storedTodo.id) {
            arrayObj.DOMelem = todoEl;
         }
      });
   }

   todoList.appendChild(todoEl);
   updateLocalStorage();                                 
   updateActiveCount();
}

// local-storage
function getLocalStorage() {                                      
   if (localStorage.getItem(LOCAL_TODOS) === null) {              
      localStorage.setItem(LOCAL_TODOS, JSON.stringify([]));       
   } else {
      todoArray = JSON.parse(localStorage.getItem(LOCAL_TODOS));   
      let maxId = 0;
      todoArray.forEach((todoElem) => {                            
         addTodoElem(todoElem.content, false, todoElem);
         if (todoElem.id > maxId) maxId = todoElem.id;
      });
      todoId = maxId + 1;
   }                    
}

function updateLocalStorage() {                                    
   localStorage.setItem(LOCAL_TODOS, JSON.stringify(todoArray));
}

//remove
function removeElem(todoEl) {
   removeElemfromDom(todoEl);
   removeFromStorage(+todoEl.dataset.id);
}

function removeElemfromDom(todoEl) {
   todoEl.remove();
}

function removeFromStorage(id) {
   todoArray = todoArray.filter(todoObj => todoObj.id !== id);
   updateLocalStorage();
   updateActiveCount();
}


function init() {
   const starterList = [
      "Complete online JavaScript course",
      "Jog around the park 3x",
      "10 minutes meditation",
      "Read for 1 hour",
      "Pick up groceries",
      "Complete Todo App on Frontend Mentor",   
   ];

   if (localStorage.getItem("isFirstVisit") === null || localStorage.getItem("isFirstVisit") === false){
      localStorage.setItem("isFirstVisit", true);
      starterList.forEach((item) => {
         addTodoElem(item);
      });
      changeActiveStatus(todoArray[0].DOMelem);
   }
   else {
      getLocalStorage();
   }
}


init();
