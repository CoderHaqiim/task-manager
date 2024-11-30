import CreateTask from "../components/tasks.js"
import { getAllTasks, deleteAllTasks, createOneTask} from "../components/httpRequests.js"

const addBtn = document.querySelector("#add")
const deleteBtn = document.querySelector('#delete')
const addMenu = document.querySelector("#add-menu")
const settingsBtn = document.querySelector('#settings')
const deleteMenu = document.querySelector("#delete-menu")
const settingsMenu = document.querySelector("#settings-menu")
const slider = document.querySelector('.slider')
const viewButtons = document.querySelectorAll('.view-btn')
const cover = document.querySelector('.cover')
const searchInput = document.querySelector('.searchinput')
const closeMenuBtn = document.querySelectorAll('.close-menu')
const deleteAll = document.querySelector('#delete-all')
const loader = document.querySelector('.loader')
const recommendedTask = document.querySelector('.rec-task')
const searchBlock = document.querySelector("#container12")
const searchList = document.querySelector('.searchlist')
const progress3 = document.querySelector('#progress3')
const progress4 = document.querySelector('#progress4')
const totalCount = document.querySelector('#total')
const progressCount = document.querySelector('#prog')
const pendingCount = document.querySelector('#pend')
const completeCount = document.querySelector('#comp')
const myProfile = document.querySelector('.my-profile')
const logoutBtn = document.querySelector('.logout')
const profile = document.querySelector('.profile')
const username = document.querySelector('.username')
const balls = document.querySelector('.balls')

let user;
let searchWord;
let overSearch = false
let comp = 0,pend = 0,prog = 0,total = 0;

let taskview = 'all'
let tasks;
let bestTask = [];

const fetchTasks = async() => {
    const allTasks = await getAllTasks();

    if(allTasks){
        tasks = allTasks
        if(tasks.length !== 0){
            loader.style.display = 'none'
            renderTasks(tasks)
        }else{
            balls.style.display = "none"
            loader.innerHTML += `<p>You have no tasks yet</p>`
            return
        }
    }
    else{
        balls.style.display = 'none'
        loader.innerHTML += `<p style="color:red">Oops! An error occured.</p>`
        return
    }
}

function showProgress (item){
    item.style.display = "flex"
    item.parentElement.style.gap = "7px"
}

function hideProgress (item){
    item.style.display = "none"
    item.parentElement.style.gap = "none"
}

logoutBtn.onclick = () => {
    logout()
}

function logout(){
    localStorage.clear()
    window.location.href ="./index.html"
}

const toggleAddMenu = () => { 
    closeMenu()
    addMenu.style.display = "flex"
    cover.style.display = 'flex'
} 

function closeMenu(){
    addMenu.style.display = 'none'
    deleteMenu.style.display = 'none'
    settingsMenu.style.display = 'none'
    myProfile.style.display = 'none'
    cover.style.display = 'none'
}

const toggleDeleteMenu = () => { 
    closeMenu()
    deleteMenu.style.display = "flex"
    cover.style.display = 'flex'
} 
const toggleProfileMenu = () => { 
    closeMenu()
    myProfile.style.display = "flex"
    cover.style.display = 'flex'
} 
const toggleSettingsMenu = () => { 
    closeMenu()
    settingsMenu.style.display = "flex"
    cover.style.display = 'flex'
} 

function countTasks(item){
    switch(item){
        case 'completed': comp += 1; break;
        case 'pending': pend += 1; break;
        case 'in-progress': prog += 1; break;
        default: return;
    }

    pendingCount.textContent = pend
    completeCount.textContent = comp
    progressCount.textContent = prog
}

const renderTasks = (tasks) =>{
    comp = 0; pend = 0; prog = 0;

    if(tasks){
        total = tasks.length;
        totalCount.textContent = total

        tasks.forEach(task => {
            countTasks(task.status)
            let taskDate = new Date(task.dueDate)
            
            if(taskDate == 'Invalid Date'){
                return
            }else{
                task.fDueDate = taskDate?.toISOString().split('T')[0];
            }
        })
    
        slider.innerHTML = '';
    
        let priorityScale = {"high":1, "medium":2,"low":3}
        let highestPriorityTask = tasks.filter(task => task.status === 'pending' || task.status ==='in-progress') .sort((a,b) => Date.parse(a.dueDate) - Date.parse(b.dueDate)).sort((a,b) => priorityScale[a.priority] - priorityScale[b.priority])
        
        if(highestPriorityTask.length !== 0){
            bestTask = [highestPriorityTask[0]]
            window.bestTask = bestTask
        }else{
            bestTask = []
             recommendedTask.innerHTML = 'No recommended task'
        }
        
        if(bestTask.length !== 0 ){
            recommendedTask.innerHTML = 'No recommended task'
            bestTask.forEach(item =>{
                recommendedTask.innerHTML = CreateTask(item, bestTask)
            })
        }else{
             recommendedTask.innerHTML = 'No recommended task'
        }
    
        if(taskview === 'all'){
            tasks.forEach(task =>{
                slider.innerHTML += CreateTask(task,tasks)
             })
        }else{
            const filteredArray = tasks.filter(task => task.status === taskview)
            filteredArray.forEach(item =>{
                slider.innerHTML += CreateTask(item, tasks)
            }) 
        }
        if(tasks.length !== 0){
            loader.style.display ="none"
        }else{
            loader.style.display ="flex"
            loader.innerHTML += `<p>You have no tasks yet</p>`
        }
    }else{
        return
    }
}

const filterTasks = () =>{
    slider.innerHTML = ''
    renderTasks(tasks)
}

viewButtons.forEach(button =>{
    button.onclick = (e) =>{
        switchViewBtn(e)
        taskview = button.id
        filterTasks()
    }
})

function switchViewBtn(event){
    viewButtons.forEach(button=>{
        button.classList.contains('selected-view') && button.classList.remove('selected-view')
        button.id === event.target.id && (button.classList.add('selected-view'))
    })
}

searchBlock.addEventListener('mouseover',()=>{
    overSearch = true
})

searchBlock.addEventListener('mouseout',()=>{
    overSearch = false
})
function searchInputAnim(){
    searchInput.onfocus = () =>{
        searchInput.parentElement.style.width = '350px'
         searchBlock.style.display = 'flex'
    }
    searchInput.onblur = () =>{
        if(!overSearch){
            clearSearch()
        }
     }
}

searchInput.oninput = () =>{
    searchWord = searchInput.value
    searchInput.parentElement.style.width = '350px'
    
    if(searchWord){
        searchBlock.style.display = 'flex'
        if(tasks){
            while(searchList.firstChild){
                searchList.firstChild.remove()
            }

            const searchArray = tasks.filter(task => task.title.toLowerCase().includes(searchWord.toLowerCase()))
            searchArray.sort((a,b)=>a.title.localeCompare(b.title))

            if(searchArray.length !== 0){
                 searchBlock.style.border = 'solid 1px var(--accent)'
            }else{
                searchBlock.style.border = 'none'
            }

            searchArray.forEach(item =>{
                const item2 = document.createElement('div')
                item2.classList.add('item2')
                item2.id = item.id
                item2.textContent = item.title
                searchList.append(item2)
                item2.onclick = (event) => {
                    showSingleTask(event)
                    searchBlock.style.display = 'none'
                    searchInput.value = ''
                    searchInput.parentElement.style.width = '250px'
                }
            })
        }
    }else{
        clearSearch()
    }
}

function clearSearch(){
     searchInput.parentElement.style.width = '250px'
    searchBlock.style.display = 'none'
}

closeMenuBtn.forEach(button => 
    button.onclick = (event) =>{
        event.stopPropagation()
        closeMenu()
    }
)

deleteAll.onclick = () =>{
    showProgress(progress3)
    deleteAllTasks().then(()=>{
        hideProgress(progress3)
        tasks.length = 0
        closeMenu()
        renderTasks(tasks)
    })    
}

user = localStorage.getItem("username")
username.textContent = user

addBtn.onclick = () => toggleAddMenu()
deleteBtn.onclick = () => toggleDeleteMenu()
settingsBtn.onclick = () => toggleSettingsMenu()
profile.onclick = () => toggleProfileMenu()

searchInputAnim()
fetchTasks()

/////////////////// httpRequests //////////////////////

const newTask  = {}

addMenu.onsubmit = (e) =>{
    const myTaskForm = new FormData(addMenu)
    e.preventDefault()
    myTaskForm.forEach((value, key) =>{
        newTask[key] = value
    })

    showProgress(progress4)
    createOneTask(newTask).then(task =>{
        hideProgress(progress4)
        if(task){
            tasks.push(task)
            renderTasks(tasks)
            closeMenu()
        }else{
            return
        }
    })
}

window.renderTasks = renderTasks