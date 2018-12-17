// selecting all elements
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

// all eventListeners
function eventListeners(){
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    if (localStorage.getItem("todos")===null){
        showAlert("danger","Zaten hiç todos yok.", secondCardBody)
    }
    if (confirm("Tümünü silmek istediğinizden emin misiniz?")){
       // todoList.innerHTML = "";  slow
       while(todoList.firstElementChild != null){
           todoList.removeChild(todoList.firstElementChild);
       }
       localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            // didn't find
            listItem.setAttribute("style","display : none !important");
        } else{
            listItem.setAttribute("style","display : block");
        }
    });
}

function deleteTodo(e){
    if (e.target.className === "fa fa-remove"){
        const li=e.target.parentElement.parentElement;
        li.remove();
        deleteTodoFromStorage(li.textContent);
        showAlert("success", "Başarıyla silindi.", firstCardBody);
    }
}

function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();
    

    todos.forEach(function(todo, index){
        if (todo === deleteTodo){
            // removing value from array on local storage
            todos.splice(index,1); 
        }
        
    });
    if (todos == "") {
        localStorage.removeItem("todos");
    } else {
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function loadAllTodosToUI(){

    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}

function addTodo(e){
    const newTodo = todoInput.value.trim();
    const allTodos = getTodosFromStorage();
    var say = 0;
    allTodos.forEach(todo => {
        if (newTodo.toLowerCase() == todo.toLowerCase()) {
            say++;
        } 
    });
        if(say != 0){
            showAlert("danger", "Girmiş olduğunuz todo zaten mevcut.", firstCardBody);
            e.preventDefault();
            return false;
        } else if (newTodo == ""){
                showAlert("danger", "Lütfen bir todo girin.", firstCardBody);

        } else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "Todo Başarıyla Eklendi", firstCardBody);
        }

    e.preventDefault();
}
// taking todos from the storage
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos" )=== null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}
// adding todos to the storage (array)
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message, where) {
    const alert = document.createElement("div");
    const hr = document.createElement("hr");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    where.appendChild(hr);
    where.appendChild(alert);

    setTimeout(function(){
        alert.remove();
        hr.remove();
    }, 5000);
}

// adding valute to the uı as a list item
function addTodoToUI(newTodo){
    //creating list item and link
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className ="list-group-item d-flex justify-content-between";

    // adding text node and link to the li element that we just created
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // adding todo list to the list item (to the ul element)
    todoList.appendChild(listItem);

    todoInput.value = "";


}
