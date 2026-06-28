const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTask = document.getElementById("addTask");

const taskList = document.getElementById("taskList");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let tasks = [];

loadTasks();

renderTasks();

addTask.addEventListener("click", createTask);

search.addEventListener("input", renderTasks);

filter.addEventListener("change", renderTasks);
function createTask(){

    const text = taskInput.value.trim();

    if(text===""){

        alert("Please enter a task!");

        return;

    }

    const task={

        id:Date.now(),

        text:text,

        date:taskDate.value,

        time:taskTime.value,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value="";

    taskDate.value="";

    taskTime.value="";

}
function renderTasks(){

    taskList.innerHTML="";

    let filtered=[...tasks];

    const keyword=search.value.toLowerCase();

    if(keyword){

        filtered=filtered.filter(task=>

            task.text.toLowerCase().includes(keyword)

        );

    }

    if(filter.value==="active"){

        filtered=filtered.filter(task=>!task.completed);

    }

    if(filter.value==="completed"){

        filtered=filtered.filter(task=>task.completed);

    }

    filtered.forEach(task=>{

        createTaskCard(task);

    });

    updateProgress();

}
function createTaskCard(task){

    const li=document.createElement("li");

    li.className="task";

    if(task.completed){

        li.classList.add("completed");

    }

    li.innerHTML=`

    <div class="task-info">

        <h3>${task.text}</h3>

        <p>📅 ${task.date || "No Date"} &nbsp; ⏰ ${task.time || "No Time"}</p>

    </div>

    <div class="actions">

        <button class="complete">
            <i class="fa-solid fa-check"></i>
        </button>

        <button class="edit">
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete">
            <i class="fa-solid fa-trash"></i>
        </button>

    </div>

    `;

    li.querySelector(".complete").onclick=()=>{

        task.completed=!task.completed;

        saveTasks();

        renderTasks();

    };

    li.querySelector(".edit").onclick=()=>{

        const updated=prompt("Edit Task",task.text);

        if(updated){

            task.text=updated;

            saveTasks();

            renderTasks();

        }

    };

    li.querySelector(".delete").onclick=()=>{

        tasks=tasks.filter(t=>t.id!==task.id);

        saveTasks();

        renderTasks();

    };

    taskList.appendChild(li);

}
function updateProgress(){

    if(tasks.length===0){

        progressFill.style.width="0%";

        progressText.textContent="0%";

        return;

    }

    const completed=tasks.filter(task=>task.completed).length;

    const percent=Math.round((completed/tasks.length)*100);

    progressFill.style.width=percent+"%";

    progressText.textContent=`${completed}/${tasks.length} Completed`;

}
function saveTasks(){

    localStorage.setItem(

        "pinkTasks",

        JSON.stringify(tasks)

    );

}

function loadTasks(){

    const stored=localStorage.getItem("pinkTasks");

    if(stored){

        tasks=JSON.parse(stored);

    }

}
taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        createTask();

    }

});