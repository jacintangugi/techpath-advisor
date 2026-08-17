// Select form elements

const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");


// Validation function

function showError(input, message){

    const error =
    input.nextElementSibling;

    error.textContent = message;

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

}



// Success function

function showSuccess(input){

    const error =
    input.nextElementSibling;

    error.textContent = "";

    input.classList.add("is-valid");
    input.classList.remove("is-invalid");

}



// Name validation

function validateName(){

    const regex = /^[A-Za-z ]+$/;


    if(nameInput.value.trim() === ""){

        showError(
            nameInput,
            "Name is required"
        );

        return false;

    }


    if(!regex.test(nameInput.value)){

        showError(
            nameInput,
            "Name should contain letters only"
        );

        return false;

    }


    showSuccess(nameInput);

    return true;

}



// Student ID validation

function validateStudentID(){

    const regex = /^BSE\d{4}[A-Z]{4}$/;


    if(!regex.test(studentIdInput.value)){

        showError(
            studentIdInput,
            "Format example: BSE2026ABCD"
        );

        return false;

    }


    showSuccess(studentIdInput);

    return true;

}



// Email validation

function validateEmail(){

    const regex =
    /^[a-zA-Z0-9._%+-]+@alustudent\.com$/;


    if(!regex.test(emailInput.value)){

        showError(
            emailInput,
            "Use your ALU student email"
        );

        return false;

    }


    showSuccess(emailInput);

    return true;

}



// Phone validation

function validatePhone(){

    const regex =
    /^\+230\s?\d{8}$/;


    if(!regex.test(phoneInput.value)){


        showError(
            phoneInput,
            "Format: +230 XXXXXXXX"
        );


        return false;

    }


    showSuccess(phoneInput);

    return true;

}



// Real-time validation

nameInput.addEventListener(
"input",
validateName
);


studentIdInput.addEventListener(
"input",
validateStudentID
);


emailInput.addEventListener(
"input",
validateEmail
);


phoneInput.addEventListener(
"input",
validatePhone
);



// Form submission

form.addEventListener(
"submit",
function(event){

    event.preventDefault();


    const valid =
    validateName() &&
    validateStudentID() &&
    validateEmail() &&
    validatePhone();


    if(valid){

        // Save student info so the quiz/results pages can use it.
        const studentProfile = {
            name: nameInput.value.trim(),
            studentId: studentIdInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        try {
            localStorage.setItem('studentProfile', JSON.stringify(studentProfile));
        } catch (e) {
            // If storage fails, continue without saving.
            console.warn('Could not save student profile to localStorage', e);
        }

        // Navigate to the quiz page after successful validation.
        window.location.href = 'quiz.html';

    }

});