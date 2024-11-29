import { deleteOneTask, editOneTask} from "./httpRequests.js";

let statusColor;
let statusText;
let taskId;
const cover2 = document.querySelector('.cover2')


function CreateTask(task, tasks){
    const progress = document.querySelector('.progress')

    let taskObj = {
        title: null,
        description: null,
        priority: null,
        dueDate: null,
        status: null,
    }

    function showProgress (item){
        item.style.display = "flex"
        item.parentElement.style.gap = "7px"
    }
    
    function hideProgress (item){
        item.style.display = "none"
        item.parentElement.style.gap = "none"
    }

    function addColorToStatus(){
        const taskStatus = task.status
        switch(taskStatus){
            case 'pending':  {statusColor = '#fefecd', statusText ='#eea810'};break;
            case 'completed': {statusColor = '#c8fcc8', statusText ='#0d990d'};break;
            case 'in-progress': {statusColor = '#ddddfc', statusText ='#3333aa'};break;
            default: {statusColor = 'var(--liner)',statusText ='var(--grey)'};
        }
    }

    const closeModal = () =>{
        while(cover2.firstChild){
            cover2.firstChild.remove()
        }
        cover2.style.display = 'none'
        taskObj = {
            title:null,
            description: null,
            priority: null,
            dueDate: null,
            status: null,
        }
    }

    const clearOut = (event) =>{
        let target = event.target
        target.parentElement.remove()
    }


    const changeDesc = () =>{
        const desc = document.querySelector('#desc')
        const area = document.querySelector('.textarea')
        let description = area.value 
        taskObj.description = description
        desc.innerText = description
    }

    const changeDate = () =>{
        const due = document.querySelector('#due')
        const date = document.querySelector('#dateInput')
        let dateInput = date.value 
        taskObj.dueDate = dateInput
        due.innerText = dateInput
    }

    const changePriority = () =>{
        const prio = document.querySelector('#prio')
        const priority = document.querySelector('#prior')
        let prior = priority.value
        taskObj.priority = prior
        prio.innerText = prior
    }

    const changeStatus = () =>{
        const stat = document.querySelector('#stat')
        const status = document.querySelector('#status2')
        let statusValue = status.value
        taskObj.status = statusValue
        stat.innerText = statusValue
    }

    const sendDeleteRequest = () =>{
        const progress1 = document.querySelector('#progress1')
        showProgress(progress1)
        deleteOneTask(taskId).then(()=>{
            hideProgress(progress1)
            const taskIndex = tasks.findIndex(item => item.id === taskId)
            if(taskIndex !== -1){
                tasks.splice(taskIndex,1)
                tasks.length - 1
                renderTasks(tasks)
                closeModal()
            }
        })
    }

    function saveTaskEdit(){
        const progress2 = document.querySelector("#progress2")
        for(let x in taskObj){
            if(!taskObj[x]){
                delete taskObj[x]
            }
        }
        showProgress(progress2)
        editOneTask(taskId,taskObj).then((oneTask =>{
            closeModal()
            hideProgress(progress2)
            if(oneTask){
                const taskIndex = tasks.findIndex(item => item.id === taskId)
                if(taskIndex !== -1){
                    tasks.splice(taskIndex,1)
                    tasks.push(oneTask)
                    tasks.length - 1
                    if(tasks.length !== 0){
                        renderTasks(tasks)
                    }
                }
            }
        }))
    }


    const showSingleTask = (event) => {
        let id = event.target.id
        taskId = id
        let myTask = tasks.filter(item => item.id === id)
        cover2.style.display = 'flex'
        taskObj.title = myTask[0].title
       
        const handleEdit = (event) => {
            const lt = document.querySelector('.large-task')
            
            let target = event.target.id
    
            const description = `<div class="disc">
                <textarea onchange = changeDesc() name="textarea2" id="textarea" onblur='clearOut(event)' class="textarea" >${myTask[0].description}</textarea>
            <div>`

            const priority = `<div class="disc" id="priority">
                <select onchange ="changePriority()"  name="priority2" id="prior" onblur='clearOut(event)' class="textarea">
                    <option value="" disabled selected>select</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
            <div>`

            const dueDate = `<div class="disc" id="date">
                <input type="date"  onchange="changeDate()" id="dateInput" onblur='clearOut(event)' name="date2">
            <div>`

            const status = `<div class="disc" id="statusItem">
                <select onchange ="changeStatus()"  name="status2" id="status2" onblur='clearOut(event)' class="textarea">
                    <option value="" disabled selected>select</option>
                    <option value="cancelled">cancelled</option>
                    <option value="pending">pending</option>
                    <option value="in-progress">in-progress</option>
                    <option value="completed">completed</option>
                </select>
            <div>`

    
            switch(target){
                case "d1": lt.innerHTML += dueDate; break;
                case "d2": lt.innerHTML += description; break;
                case "p1": lt.innerHTML += priority; break;
                case "s1": lt.innerHTML += status; break;
                default: return
            }
    
            const area = document.querySelector('.textarea')
            const dateInput = document.querySelector('#dateInput')
            const prior = document.querySelector('#prior')
            const status1 = document.querySelector('#status2')

            target === 'd1'? dateInput.focus() : target === "d2"? area.focus() : target === 'p1'? prior.focus() : status1.focus()
        }

        window.handleEdit = handleEdit





        
        const singleTask = `<div class="large-task liner card-corner">
                                <div class="closeBtn" onclick="closeModal()">
                                    <img src="../assets/close.svg">
                                </div>
                                <h1>${myTask[0].title}</h1>
                                <div class="task-items">
                                    <div class="task-item">
                                         <h3 class="task-header">
                                            <span>Description</span>
                                         </h3>
                                         <div class="ti">
                                            <span id="desc">${myTask[0].description}</span>
                                            <span id="d2" onclick="handleEdit(event)" class="edit">
                                                <img src="../assets/edit2.svg">
                                            </span>
                                         </div>
                                    </div>
                                    <div class="task-item">
                                         <h3 class="task-header">
                                            <span>Priority</span>
                                         </h3>
                                         <div class="ti">
                                            <span id="prio">${myTask[0].priority}</span>
                                            <span id='p1' onclick="handleEdit(event)" class="edit">
                                                 <img src="../assets/edit2.svg">
                                            </span>
                                        </div>
                                    </div>
                                    <div class="task-item">
                                         <h3 class="task-header">
                                            <span>Due date</span>
                                         </h3>
                                         <div class="ti">
                                            <span id="due">${myTask[0].fDueDate}</span>
                                            <span id="d1" onclick="handleEdit(event)" class="edit">
                                                <img src="../assets/edit2.svg">
                                            </span>
                                        </div>
                                    </div>
                                    <div class="task-item">
                                         <h3 class="task-header">
                                            <span>Status</span>
                                         </h3>
                                         <div class="ti">
                                            <span id="stat">${myTask[0].status}</span>
                                            <span  id="s1" onclick="handleEdit(event)" class="edit">
                                                <img src="../assets/edit2.svg">
                                            </span>
                                         </div>
                                    </div>
                                    <div class="btns">
                                         <button onclick="sendDeleteRequest()" id="delete-one" class="delete">
                                            <span>delete task</span>
                                            <span id="progress1" class="progress">
                                                <img src="assets/progress3.svg" alt="">
                                            </span>
                                         </button>
                                         <button onclick="saveTaskEdit()">
                                            <span>save</span>
                                            <span id="progress2" class="progress">
                                                <img src="assets/progress2.svg" alt="">
                                            </span>
                                         </button>
                                    </div>
                                </div>
                            </div>`
        
        cover2.innerHTML += singleTask
    }

    addColorToStatus(task)
    const item = `<div onclick="showSingleTask(event)" id="${task.id}" class="task">
                        <span style= 'pointer-events:none; border:1px solid ${statusText}; color:${statusText};background-color:${statusColor}'} class='status'>${task.status}</span>
                        <span class="task-title">${task.title}</span>
                        <div class='between' style="pointer-events:none; font-size:0.9rem;">
                         <span>${task.description}</span>
                         ${
                            tasks == window.bestTask? 
                            `<span>
                                priority:
                                <span class="first">${task.priority}</span>
                            </span>`:""
                         }
                        </div>
                    </div>`
    
    window.showSingleTask = showSingleTask
    window.addColorToStatus = addColorToStatus
    window.closeModal = closeModal
    window.clearOut = clearOut
    window.changeDesc = changeDesc
    window.changePriority = changePriority
    window.changeDate = changeDate
    window.changeStatus = changeStatus
    window.sendDeleteRequest = sendDeleteRequest
    window.saveTaskEdit = saveTaskEdit

    return item
}

export default CreateTask