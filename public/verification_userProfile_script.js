const facultyInfoForm = document.querySelector("#facultyInfoForm")
const studentInfoForm = document.querySelector("#studentInfoForm")
const infoForm = document.querySelector("#infoForm")
const studentRadio = document.querySelector("#studentRadio")
const facultyRadio = document.querySelector("#facultyRadio")
const continueToProfileBtn = document.querySelector('#continueToProfileBtn')
const tabletDisplayContent = document.querySelector('#tablet-display-content')
const emailVerificationPage = document.querySelector("#emailVerificationPage")
const userProfilePage = document.querySelector('#userProfilePage')
const userProfileForm = document.querySelector("#userProfileForm")
const studentName = document.querySelector('#studentName')
const maleRadio = document.querySelector('#maleRadio')
const femaleRadio = document.querySelector('#femaleRadio')
const otherRadio = document.querySelector('#otherRadio')
const rollNumber = document.querySelector('#rollNumber')
const branch = document.querySelector('#branch')
const academicYear = document.querySelector('#academicYear')
const studentPhone = document.querySelector('#studentPhone')
const saveProfileBtn = document.querySelector("#saveProfileBtn")

const facultyName = document.querySelector("#facultyName")
const title = document.querySelector("#title")
const facultyID = document.querySelector("#facultyID")
const department = document.querySelector("#department")
const designation = document.querySelector("#designation")
const facultyPhone = document.querySelector("#facultyPhone")




//error handling functions 
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

//bug fixing for asking gender selection even on selecting faculty option as role
studentRadio.addEventListener('input', () => {
    maleRadio.required = true
    femaleRadio.required = true
    otherRadio.required = true
    console.log('student radio')
})
facultyRadio.addEventListener('input', () => {
    maleRadio.required = false
    femaleRadio.required = false
    otherRadio.required = false

    console.log("faculty radio")
})


//userProfile form post request
userProfileForm.addEventListener("submit", (e) => {
    e.preventDefault()


    //student account
    if (studentRadio.checked) {

        //error handling
        if (!studentName.value) {
            studentName.classList.remove('border-transparent')
            studentName.classList.add('border-red-600')

            inputFiredOnNullValue('enter name', studentName)
        }
        if (!rollNumber.value) {
            rollNumber.classList.remove('border-transparent')
            rollNumber.classList.add('border-red-600')

            inputFiredOnNullValue('enter roll number', rollNumber)
        }
        if (!branch.value) {
            branch.classList.remove('border-transparent')
            branch.classList.add('border-red-600')

            inputFiredOnNullValue('enter branch', branch)
        }
        if (!studentPhone.value) {
            studentPhone.classList.remove('border-transparent')
            studentPhone.classList.add('border-red-600')

            inputFiredOnNullValue('enter studentPhone number', studentPhone)
        }

        if (studentName.value && rollNumber.value && branch.value && studentPhone.value) {

            saveProfileBtn.disabled = true;
            saveProfileBtn.classList.add("cursor-progress")
            saveProfileBtn.value = "Saving Profile..."

            let gender;
            if (maleRadio.checked) gender = "male";
            else if (femaleRadio.checked) gender = "female";
            else if (otherRadio.checked) gender = "other"

            let userProfileInfo = {
                "role": "student",
                "name": studentName.value,
                "gender": gender,
                "rollNumber": rollNumber.value,
                "branch": branch.value,
                "academicYear": academicYear.value,
                "studentPhoneNumber": studentPhone.value,
                "linkingToken": document.getElementById("secretLinkingToken").value
            }

            async function postUserProfileInfo() {
                let options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userProfileInfo)
                }
                let data = await fetch('/studentProfileInfoEndpoint', options)
                if (data.ok) {
                    saveProfileBtn.value = "Profile Saved"
                    saveProfileBtn.classList.remove("cursor-progress")

                      document.getElementById("toastMessageArticle").classList.remove('hidden')
                    document.getElementById("toastMessageArticle").classList.add('flex')

                    
                    setTimeout(() => {
                        window.location.href = "/#tablet-display"
                    }, 3000);

                } else {
                    saveProfileBtn.value = "Save Profile"
                    saveProfileBtn.classList.remove("cursor-progress")
                    saveProfileBtn.disabled = false
                }
                let response = await data.json();


                console.log(response)
            }
            postUserProfileInfo();

        }


    }

    //faculty account
    if (facultyRadio.checked) {
        //error handling
        if (!facultyName.value) {
            facultyName.classList.remove('border-transparent')
            facultyName.classList.add('border-red-600')

            inputFiredOnNullValue('enter name', facultyName)
        }
        if (!facultyID.value) {
            facultyID.classList.remove('border-transparent')
            facultyID.classList.add('border-red-600')

            inputFiredOnNullValue('enter name', facultyID)
        }
        if (!department.value) {
            department.classList.remove('border-transparent')
            department.classList.add('border-red-600')

            inputFiredOnNullValue('enter name', department)
        }
        if (!facultyPhone.value) {
            facultyPhone.classList.remove('border-transparent')
            facultyPhone.classList.add('border-red-600')

            inputFiredOnNullValue('enter name', facultyPhone)
        }

        // posting faculty profile info
        if (facultyName.value && facultyID.value && department.value && facultyPhone.value) {

            saveProfileBtn.disabled = true;
            saveProfileBtn.classList.add("cursor-progress")
            saveProfileBtn.value = "Saving Profile..."


            let userProfileInfo = {
                'role': 'faculty',
                "title": title.value,
                'name': facultyName.value,
                'facultyID': facultyID.value,
                'department': department.value,
                'designation': designation.value,
                'facultyPhoneNumber': facultyPhone.value,
                "linkingToken": document.getElementById("secretLinkingToken").value
            }

            async function postUserProfileInfo() {
                let options = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userProfileInfo)
                }
                let data = await fetch('/facultyProfileInfoEndpoint', options)
                console.log(data.ok)
                if (data.ok) {
                    saveProfileBtn.value = "Profile Saved"
                    saveProfileBtn.classList.remove("cursor-progress")

                    document.getElementById("toastMessageArticle").classList.remove('hidden')
                    document.getElementById("toastMessageArticle").classList.add('flex')

                    setTimeout(() => {
                        window.location.href = "/#tablet-display"
                    }, 3000);

                } else {
                    saveProfileBtn.value = "Save Profile"
                    saveProfileBtn.classList.remove("cursor-progress")
                    saveProfileBtn.disabled = false
                }
                let response = await data.json()
                console.log(response)
            }
            postUserProfileInfo()
        }


    }
})


facultyRadio.addEventListener('click', () => {
    infoForm.classList.add('-translate-x-full')
    studentInfoForm.classList.add('opacity-0')
    studentInfoForm.classList.remove('opacity-100')
    facultyInfoForm.classList.remove('opacity-0')
    facultyInfoForm.classList.add('opacity-100')
})

studentRadio.addEventListener('click', () => {
    infoForm.classList.remove('-translate-x-full')
    studentInfoForm.classList.remove('opacity-0')
    studentInfoForm.classList.add('opacity-100')
    facultyInfoForm.classList.add('opacity-0')
    facultyInfoForm.classList.remove('opacity-100')

})

continueToProfileBtn.addEventListener('click', () => {
    tabletDisplayContent.classList.add('-translate-x-full')
    emailVerificationPage.classList.add('opacity-0')

    userProfilePage.classList.remove('opacity-0')
    userProfilePage.classList.add('opacity-100')

})