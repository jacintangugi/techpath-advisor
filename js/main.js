// Select form elements

const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
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


// Student ID removed — no event listener


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
    validateEmail() &&
    validatePhone();


    if(valid){

        // Save student info so the quiz/results pages can use it.
        const studentProfile = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        try {
            localStorage.setItem('studentProfile', JSON.stringify(studentProfile));
        } catch (e) {
            // If storage fails, continue without saving.
            console.warn('Could not save student profile to localStorage', e);
        }

        // Open user's email client with a pre-filled message to notify you.
        const recipient = 'ngugijacinta07@gmail.com';
        const subject = `TechPath submission from ${studentProfile.name}`;
        const body = `Name: ${studentProfile.name}\nEmail: ${studentProfile.email}\nPhone: ${studentProfile.phone}\n\nThis student started the TechPath quiz.`;

        const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open mail client (user may need to send the email). Then redirect to quiz.
        window.location.href = mailto;

        // Redirect to quiz shortly after opening mail client.
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 700);

    }

});