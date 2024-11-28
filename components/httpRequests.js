const token = localStorage.getItem('authtoken')
const httpMessage = document.querySelector('.http-message')
const messages = document.querySelector('.messages')


const showSuccessMessage = (response) => {
    httpMessage.style.display = "flex"
    httpMessage.style.backgroundColor = "var(--success)"
    httpMessage.style.border ='1px var(--success-text) solid'
    messages.textContent = response.message
    messages.style.color ="var(--success-text)"
    setTimeout(()=>{
        clearMessage()
    },4000)
}

const clearMessage = () =>{
    messages.textContent =''
    while(messages.firstChild){
        messages.firstChild.remove()
    }
    httpMessage.style.display ='none'
}

window.showErrorMessage = (response) => {
    httpMessage.style.display = "flex"
    httpMessage.style.backgroundColor = "var(--error)"
    httpMessage.style.border ='1px var(--error-text) solid'
    messages.textContent = response.message
    messages.style.color ="var(--error-text)"
    setTimeout(()=>{
        clearMessage()
    },4000)
}



async function getAllTasks(){
    const URL = `http://localhost:8081/api/tasks/all`
    try{
        const res = await fetch(URL,{
            method:"GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        })

        if(!res.ok){
            const response = await res.json()
            showErrorMessage(response)
            return null
        }else{
            const response = await res.json()
            showSuccessMessage(response)
            return response.tasks
        }
    }catch(error){
        showErrorMessage(error)
        return null
    }
}

async function createOneTask(body){
    const URL = `http://localhost:8081/api/tasks/create`
    try{
        const res = await fetch(URL,{
            method:"POST",
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        })

        if(!res.ok){
            const response = await res.json()
            console.log(response[0].message)
            showErrorMessage(response[0])
            return null
        }else{
            const response = await res.json()
            showSuccessMessage(response)
            return response.myTask
        }
    }catch(error){
        showErrorMessage(error)
        return null
    }
}

async function deleteOneTask(taskId){
    const URL = `http://localhost:8081/api/tasks/dropone/${taskId}`
    try{
        const res = await fetch(URL,{
            method:"DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        })

        if(!res.ok){
            const response = await res.json()
            showErrorMessage(response)
        }else{
            const response = await res.json()
            showSuccessMessage(response)
        }
    }catch(error){
        showErrorMessage(error)
    }
}

async function deleteAllTasks(){
    const URL = `http://localhost:8081/api/tasks/dropall`
    try{
        const res = await fetch(URL,{
            method:"DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        })

        if(!res.ok){
            const response = await res.json()
            showErrorMessage(response)
        }else{
            const response = await res.json()
            showSuccessMessage(response)
        }
    }catch(error){
        showErrorMessage(error)
    }
}

async function editOneTask(taskId,body){
    const URL = `http://localhost:8081/api/tasks/edit/${taskId}`
    try{
        const res = await fetch(URL,{
            method:"PATCH",
            body:JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })

        if(!res.ok){
            const response = await res.json()
            showErrorMessage(response[0])
            return null
        }else{
            const response = await res.json()
            showSuccessMessage(response)
            return response.item
        }
    }catch(error){
        showErrorMessage(error)
        return null
    }
}


export {getAllTasks, createOneTask, deleteAllTasks,editOneTask, deleteOneTask}