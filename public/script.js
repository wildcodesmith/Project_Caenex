const tabletDisplay = document.querySelector("#tablet-display")
const signInNavBtn = document.querySelector('#signInNavBtn')
const getStartedBtn = document.querySelector("#getStartedBtn")
const tabletDisplayContent = document.querySelector('#tablet-display-content')
const signInLink = document.querySelector("#signInLink")
const signUpLink = document.querySelector("#signUpLink")
const signInContainer = document.querySelector("#signInContainer")
const signUpContainer = document.querySelector("#signUpContainer")
const userEmail = document.querySelector('#email')
const newUserName = document.querySelector("#new-user-name")
const newPassword = document.querySelector("#new-password")
const newCPassword = document.querySelector("#new-c-password")
const signUpForm = document.querySelector("#signUpForm")
const userName = document.querySelector("#username")
const password = document.querySelector("#password")
const logInButton = document.querySelector("#logInButton")
const createAccountBtn = document.querySelector('#createAccountBtn')

//error handling message function
function showErrorMessage(message) {
    const toastMessage = document.getElementById("toastMessage")
    toastMessage.innerText = message

  
        toastMessage.classList.remove("opacity-0")
        toastMessage.classList.add("translate-y-10", "opacity-100")
        setTimeout(() => {
            toastMessage.classList.remove("translate-y-10", "opacity-100")
            toastMessage.classList.add("opacity-0")

        }, 4000);
   
}


//tablet screen turning on screen logic
const observer = new IntersectionObserver((enteries) => {
    enteries.forEach((entry) => {

        if (entry.isIntersecting) {


            tabletDisplayContent.classList.remove('opacity-0', 'pointer-events-none')
            tabletDisplayContent.classList.add('opacity-100', 'pointer-events-auto')
        } else {
            tabletDisplay.classList.remove('bg-white')
            tabletDisplay.classList.add('bg-neutral-900')


            tabletDisplayContent.classList.add('opacity-0', 'pointer-events-none')
            tabletDisplayContent.classList.remove('opacity-100', 'pointer-events-auto')
        }
    })
},
    {
        threshold: 0.7
    })


observer.observe(tabletDisplay)

signInNavBtn.addEventListener('click', () => {
    tabletDisplay.scrollIntoView({
        behavior: "smooth",
        block: "center"
    })
})

getStartedBtn.addEventListener('click', () => {
    tabletDisplay.scrollIntoView({
        behavior: "smooth",
        block: "center"
    })
})

signUpLink.addEventListener('click', () => {
    signUpContainer.classList.remove("opacity-0", "z-10", "pointer-events-none")
    signUpContainer.classList.add("opacity-100", "z-10", "pointer-events-auto")

    signInContainer.classList.add("opacity-0", "z-0", "pointer-events-none")
    signInContainer.classList.remove("opacity-100", "z-10", "pointer-events-auto")
})


signInLink.addEventListener('click', () => {
    signUpContainer.classList.add("opacity-0", "z-10", "pointer-events-none")
    signUpContainer.classList.remove("opacity-100", "z-10", "pointer-events-auto")

    signInContainer.classList.remove("opacity-0", "z-0", "pointer-events-none")
    signInContainer.classList.add("opacity-100", "z-10", "pointer-events-auto")

})

//error handling functions 
function inputErrorWarning(error, inputElement) {
    let mssg = document.createElement('div')
    mssg.innerText = error
    mssg.classList.add('absolute', 'text-red-600', 'text-sm', 'px-4')
    mssg.setAttribute("id", `mssgAfter${inputElement.id}`)
    inputElement.after(mssg)
}
function inputFiredOnNullValue(mssg, inputElement) {
    inputElement.addEventListener('input', () => {
        if (inputElement.value) {
            try {
                inputElement.classList.add('border-transparent')
                inputElement.classList.remove('border-red-600')
                document.querySelector(`#mssgAfter${inputElement.id}`).remove()
            } catch (error) {

            }

        } else {
            try {
                inputElement.classList.remove('border-transparent')
                inputElement.classList.add('border-red-600')
                inputErrorWarning(mssg, inputElement)
            } catch (error) {

            }
        }
    })
}

//signUp post request
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // error handling



    if (!userEmail.value) {
        userEmail.classList.remove('border-transparent')
        userEmail.classList.add('border-red-600')

        inputErrorWarning("enter email", userEmail)
        inputFiredOnNullValue('enter email', userEmail)

    }
    if (!newUserName.value) {
        newUserName.classList.remove('border-transparent')
        newUserName.classList.add('border-red-600')

        inputErrorWarning("enter username", newUserName)
        inputFiredOnNullValue('enter username', newUserName)


    }
    if (!newPassword.value) {
        newPassword.classList.remove('border-transparent')
        newPassword.classList.add('border-red-600')

        inputErrorWarning("enter password", newPassword)
        inputFiredOnNullValue('enter password', newPassword)


    }
    if (!newCPassword.value) {
        newCPassword.classList.remove('border-transparent')
        newCPassword.classList.add('border-red-600')

        inputErrorWarning("enter password", newCPassword)
        inputFiredOnNullValue('enter password', newCPassword)

    }

    if (newPassword.value != newCPassword.value && newCPassword.value && newPassword.value) {

        newCPassword.classList.remove('border-transparent')
        newCPassword.classList.add('border-red-600')


        inputErrorWarning("password didn't match", newCPassword)



    }

    //post request
    if (userEmail.value && newUserName.value && newPassword.value && newCPassword.value && newCPassword.value === newPassword.value) {

        createAccountBtn.disabled = true;
        createAccountBtn.value = "Creating Account..."
        createAccountBtn.classList.remove("cursor-[url('/images/cursor3.png'),default]")
        createAccountBtn.classList.add('cursor-progress')

        //sending data
        async function postInfo() {
            let userInfo = {
                email: userEmail.value,
                userName: newUserName.value,
                password: newPassword.value
            }
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            }
            let data = await fetch('/signUp', options)
            let response = await data.json();

            createAccountBtn.classList.add("cursor-[url('/images/cursor3.png'),default]")
            createAccountBtn.classList.remove('cursor-progress')
            if (data.ok) {
                createAccountBtn.value = "Account Created"
              
            } else {
                createAccountBtn.value = "Create Account"
                createAccountBtn.disabled = false
                showErrorMessage(response.error)
                
                
            }

            console.log(response)
            createAccountBtn.value = "Create Account"

            if (data.status == 201) {
                tabletDisplayContent.classList.add("-translate-x-full")

            }
        }
        postInfo();
    }



})



//sign in post request 
signInContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    // error handling
    if (!userName.value) {
        userName.classList.remove('border-transparent')
        userName.classList.add('border-red-600', 'border')
        inputErrorWarning('enter username', userName)
        inputFiredOnNullValue('enter username', userName)
    }
    if (!password.value) {
        password.classList.remove('border-transparent')
        password.classList.add('border-red-600', 'border')
        inputErrorWarning('enter passoword', password)
        inputFiredOnNullValue('enter passoword', password)
    }
    if (userName.value && password.value) {
        let userLoginDetails = {
            "loginUserName": userName.value,
            "loginPassword": password.value
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userLoginDetails)
        }

        try {

            async function postuserLoginDetails() {

                let data = await fetch('userLogInPostEndPoint', options)
                let response = await data.json()
                if(!data.ok){
                    console.log(response)
                    showErrorMessage(response.message)
                }
                if (response.token) {
                    localStorage.setItem("CaenexToken", response.token)
                    window.location.href = response.redirect
                }
            }
            postuserLoginDetails();
        } catch (error) {
            console.log("failed to post", error)
        }
    }
})
