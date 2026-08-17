/* =========================================
   TECHPATH CONTACT FORM
   Real-Time Validation
========================================= */


/* =========================================
   GET FORM ELEMENTS
========================================= */

const contactForm =
    document.getElementById("contactForm");

const nameInput =
    document.getElementById("contactName");

const emailInput =
    document.getElementById("contactEmail");

const subjectInput =
    document.getElementById("contactSubject");

const messageInput =
    document.getElementById("contactMessage");

const successMessage =
    document.getElementById("formSuccess");


/* =========================================
   REGEX PATTERNS
========================================= */

/*
    Name:
    Allows letters, spaces, apostrophes and hyphens.
*/

const nameRegex =
    /^[A-Za-zÀ-ÿ]+(?:[\s'-][A-Za-zÀ-ÿ]+)*$/;


/*
    School email.

    This pattern requires:
    student ID + @alustudent.com
*/

const emailRegex =
    /^[A-Za-z0-9._%+-]+@alustudent\.com$/;


/* =========================================
   VALIDATION FUNCTIONS
========================================= */

function validateName() {

    const value =
        nameInput.value.trim();

    if (value === "") {

        showError(
            nameInput,
            "Please enter your full name."
        );

        return false;

    }


    if (!nameRegex.test(value)) {

        showError(
            nameInput,
            "Name can only contain letters, spaces, apostrophes or hyphens."
        );

        return false;

    }


    showSuccess(nameInput);

    return true;

}


function validateEmail() {

    const value =
        emailInput.value.trim();


    if (value === "") {

        showError(
            emailInput,
            "Please enter your school email."
        );

        return false;

    }


    if (!emailRegex.test(value)) {

        showError(
            emailInput,
            "Use a valid school email such as j.ngugi@alustudent.com."
        );

        return false;

    }


    showSuccess(emailInput);

    return true;

}


function validateSubject() {

    if (subjectInput.value === "") {

        showError(
            subjectInput,
            "Please select a subject."
        );

        return false;

    }


    showSuccess(subjectInput);

    return true;

}


function validateMessage() {

    const value =
        messageInput.value.trim();


    if (value === "") {

        showError(
            messageInput,
            "Please enter your message."
        );

        return false;

    }


    if (value.length < 10) {

        showError(
            messageInput,
            "Your message should contain at least 10 characters."
        );

        return false;

    }


    showSuccess(messageInput);

    return true;

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(
    input,
    message
) {

    input.classList.remove("is-valid");

    input.classList.add("is-invalid");


    const errorElement =
        document.getElementById(
            input.id + "Error"
        );


    errorElement.textContent =
        message;

}


/* =========================================
   SHOW SUCCESS
========================================= */

function showSuccess(input) {

    input.classList.remove("is-invalid");

    input.classList.add("is-valid");


    const errorElement =
        document.getElementById(
            input.id + "Error"
        );


    errorElement.textContent = "";

}


/* =========================================
   REAL-TIME VALIDATION
========================================= */

nameInput.addEventListener(
    "input",
    validateName
);

emailInput.addEventListener(
    "input",
    validateEmail
);

/*
    Auto-append school domain on blur when user
    only types their student id (no '@').
*/
// Removed auto-append on blur; users should enter full school email.

subjectInput.addEventListener(
    "change",
    validateSubject
);

messageInput.addEventListener(
    "input",
    validateMessage
);


/* =========================================
   FORM SUBMISSION
========================================= */

contactForm.addEventListener(
    "submit",
    function(event) {

        /*
            Prevent the browser from refreshing
            the page automatically.
        */

        event.preventDefault();


        /*
            Validate every field before submission.
        */

        const nameValid =
            validateName();

        const emailValid =
            validateEmail();

        const subjectValid =
            validateSubject();

        const messageValid =
            validateMessage();


        /*
            Stop submission if any field is invalid.
        */

        if (
            !nameValid ||
            !emailValid ||
            !subjectValid ||
            !messageValid
        ) {

            return;

        }


        /*
            Show successful submission message.
        */

        successMessage.textContent =
            "✓ Thank you! Your feedback has been submitted successfully.";

        successMessage.style.display =
            "block";


        /*
            Reset the form after successful submission.
        */

        contactForm.reset();


        /*
            Remove validation styling after reset.
        */

        [
            nameInput,
            emailInput,
            subjectInput,
            messageInput
        ].forEach(function(input) {

            input.classList.remove(
                "is-valid",
                "is-invalid"
            );

        });

    }
);