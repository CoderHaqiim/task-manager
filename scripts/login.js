const signBtn = document.querySelector("#sign")
const logBtn = document.querySelector("#log")
const loginForm = document.querySelector(".login")
const signupForm = document.querySelector(".signup")
const messages = document.querySelector('.messages')
const httpMessage = document.querySelector('.http-message')
const signupPassword = document.querySelector("#signup-password")
const inputs = document.querySelectorAll('input')
const confirmInput = document.querySelector('#confirm')
const progress1 = document.querySelector('#progress1')
const progress2 = document.querySelector('#progress2')
let matchError;

signBtn.onclick = () =>{
    loginForm.style.display="none"
    signupForm.style.display="flex"
    inputs.forEach(input =>{
        clearErrors(input)
    })
}

const goLogIn = () =>{
    loginForm.style.display="flex"
    signupForm.style.display="none"
    inputs.forEach(input =>{
        clearErrors(input)
    })
} 

logBtn.onclick = () =>{
    goLogIn()
    inputs.forEach(input =>{
        clearErrors(input)
    })
}

signupPassword.onblur = () =>{
    comparePasswords()
}

confirmInput.onblur = () =>{
    comparePasswords()
}

const checkErrors = (errors) =>{
    if(errors){
        errors.forEach(error=>{
            let path = error.path
            let message = error.message
                    inputs.forEach(input => {
                        if(input.name === path){
                           inputError(input,message)
                        }
                    })
        })
    }
}

function inputError (input,message){
    input.style.border = '2px solid red'
    input.nextElementSibling.style.color = `red`
    input.nextElementSibling.textContent = message
}

function comparePasswords(){
    if(confirmInput.value && signupPassword.value){
        if(confirmInput.value !== signupPassword.value){
            matchError = true
            inputError(confirmInput,"passwords don't match")
            inputError(signupPassword,"passwords don't match")
        }
    }
}

inputs.forEach(input => {
    input.oninput = () =>{
        clearErrors(input)
    }
})

signupPassword.oninput = ()=>{
    matchError = false
    clearErrors(confirmInput)
    clearErrors(signupPassword)
}

confirmInput.oninput = ()=>{
    matchError = false
    clearErrors(confirmInput)
    clearErrors(signupPassword)
}

function clearErrors(input){
    input.style.border = '1px solid var(--liner)'
    input.nextElementSibling.style.color = `black`
    if(input.id === "signup-password"){
          input.nextElementSibling.textContent = 'Password must contain 6 -32 characters, at least one uppercase letter, one lowercase letter, one digit and one special character'
    }else{
       input.nextElementSibling.textContent = ''
    }
}

const clearMessage = () =>{
    messages.textContent =''
    while(messages.firstChild){
        messages.firstChild.remove()
    }
    httpMessage.style.display ='none'
}

const showSuccessMessage = (response) => {
    httpMessage.style.display = "flex"
    httpMessage.style.backgroundColor = "var(--success)"
    messages.textContent = response.message
    messages.style.color ="var(--success-text)"
    setTimeout(()=>{
        clearMessage()
    },5000)
}

const showErrorMessage = (response) => {
    httpMessage.style.display = "flex"
    httpMessage.style.backgroundColor = "var(--error)"
    messages.textContent = response.message
    messages.style.color ="var(--error-text)"
    setTimeout(()=>{
        clearMessage()
    },5000)
}

signupForm.onsubmit = (event) => {
    event.preventDefault()
    if(!navigator.onLine){
        let response = {message: "Connection error, check your network"}
        showErrorMessage(response)
    }

    if(matchError){
        return 
    }

    let data = {}
    const signUpData = new FormData(signupForm)
    signUpData.forEach((value,key) => {
        data[key] = value
    })

    showProgress(progress2)
    signupRequest(data).then(errors =>{
        hideProgress(progress2)
        checkErrors(errors)
    })
}

function showProgress (item){
    item.style.display = "flex"
    item.parentElement.style.gap = "7px"
}

function hideProgress (item){
    item.style.display = "none"
    item.parentElement.style.gap = "none"
}

loginForm.onsubmit = (event) => {
    event.preventDefault()
    if(!navigator.onLine){
        let response = {message: "Connection error, check your network"}
        showErrorMessage(response)
    }
    let data = {}
    const loginData = new FormData(loginForm)
    loginData.forEach((value,key) => {
        data[key] = value
    })
    showProgress(progress1)
    loginRequest(data).then(errors =>{
        hideProgress(progress1)
        checkErrors(errors)
    })
}


const loginRequest = async(data) =>{
    const URL = "https://task-manager-app-kf76.onrender.com/api/auth/login"
    try{
        const res = await fetch(URL,{
            method:"POST",
            body: JSON.stringify(data),
            headers:{
                'content-type':'application/json'
            }
        })

        if(res.ok){
            const response = await res.json()
            window.localStorage.setItem('authtoken',response.token)
            window.localStorage.setItem('username',response.username)
            showSuccessMessage(response)
            window.location.href = './app.html'
            return null
        }else{
            const response = await res.json()
            console.log(response)
            showErrorMessage(response)
            return null
        }
    }catch(error){
        showErrorMessage(error)
    }
}

const signupRequest = async(data) =>{
    const URL = "https://task-manager-app-kf76.onrender.com/api/auth/signup"
    try{
        const res = await fetch(URL,{
            method:"POST",
            body: JSON.stringify(data),
            headers:{
                'content-type':'application/json'
            }
        })

        if(res.ok){
            const response = await res.json()
            showSuccessMessage(response)
            goLogIn()
            return null
        }else{
            const response = await res.json()
            if(Array.isArray(response)){
                let errors = [...response]
                return errors
            }else{
                showErrorMessage(response)
                return null
            }
        }
    }catch(error){
        showErrorMessage(response)
    }
}