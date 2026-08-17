/* =========================================
   TECHPATH QUIZ ENGINE
   BSE Specialisation Advisor
========================================= */


/* =========================================
   QUIZ STATE
========================================= */

// Store the current question number.
let currentQuestion = 0;

// Store the scores for each specialisation.
const scores = {
    fullstack: 0,
    machinelearning: 0,
    arvr: 0,
    lowlevel: 0
};

// Store the answer selected for each question.
const selectedAnswers = {};

// Track consecutive correct/selected answers for the streak bonus.
let streak = 0;

// Quiz duration: 5 minutes.
const quizDuration = 5 * 60;

// Remaining time in seconds.
let timeRemaining = quizDuration;

// Store the timer interval.
let timerInterval;


/* =========================================
   GET HTML ELEMENTS
========================================= */

const questions = document.querySelectorAll(".question-card");

const nextButton = document.getElementById("nextButton");

const previousButton =
    document.getElementById("previousButton");

const submitButton =
    document.getElementById("submitQuiz");

const timerDisplay =
    document.getElementById("timer");

const questionNumber =
    document.getElementById("questionNumber");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressFill =
    document.getElementById("progressFill");


/* =========================================
   DISPLAY CURRENT QUESTION
========================================= */

function showQuestion(index) {

    // Hide every question.
    questions.forEach(function(question) {

        question.classList.remove("active");

    });


    // Show the current question.
    questions[index].classList.add("active");


    // Update question number.
    questionNumber.textContent =
        `Question ${index + 1} of ${questions.length}`;


    // Calculate progress percentage.
    const progress =
        ((index + 1) / questions.length) * 100;


    progressPercentage.textContent =
        `${Math.round(progress)}%`;


    // Update progress bar width.
    progressFill.style.width =
        `${progress}%`;


    // Disable Previous button on first question.
    if (index === 0) {

        previousButton.disabled = true;

    } else {

        previousButton.disabled = false;

    }


    // Show Submit button on final question.
    if (index === questions.length - 1) {

        nextButton.hidden = true;

        submitButton.hidden = false;

    } else {

        nextButton.hidden = false;

        submitButton.hidden = true;

    }

}


/* =========================================
   ANSWER SELECTION
========================================= */

const answerOptions =
    document.querySelectorAll(
        ".answer-option, .hotspot, .hotspot-area"
    );


answerOptions.forEach(function(option) {

    option.addEventListener("click", function() {

        // Find the question containing this answer.
        const question =
            option.closest(".question-card");


        // Get the question number.
        const questionIndex =
            Number(question.dataset.question) - 1;


        // Get the selected specialisation.
        const selectedPath =
            option.dataset.path;


        // Get the points.
        const points =
            Number(option.dataset.points);


        /*
            If the student previously answered this
            question, remove the old score first.
        */

        if (selectedAnswers[questionIndex]) {

            const previousAnswer =
                selectedAnswers[questionIndex];

            scores[previousAnswer.path] -=
                previousAnswer.points;

        }


        // Add the new score.
        scores[selectedPath] += points;


        // Save the selected answer.
        selectedAnswers[questionIndex] = {

            path: selectedPath,

            points: points

        };


        // Remove selection from other answers.
        question
            .querySelectorAll(
                ".answer-option, .hotspot"
            )
            .forEach(function(item) {

                item.classList.remove(
                    "selected"
                );

            });


        // Highlight selected answer.
        option.classList.add("selected");

        // If this is the hotspot question, show feedback text.
        const feedbackEl = question.querySelector('#hotspotFeedback');
        if (feedbackEl) {
            const spec = option.dataset.specialisation || option.dataset.path || '';
            feedbackEl.textContent = `Selected: ${spec}`;
        }


        /*
            Increase streak.

            A streak rewards the student for
            answering questions consistently.
        */

        streak++;


        // Give a small bonus after 3 consecutive answers.
        if (streak >= 3) {

            scores[selectedPath] += 1;

        }

    });

});


/* =========================================
   NEXT QUESTION
========================================= */

nextButton.addEventListener(
    "click",
    function() {

        // Check whether an answer was selected.
        if (!selectedAnswers[currentQuestion]) {

            alert(
                "Please select an answer before continuing."
            );

            return;

        }


        // Move to next question.
        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            showQuestion(currentQuestion);

        }

    }
);


/* =========================================
   PREVIOUS QUESTION
========================================= */

previousButton.addEventListener(
    "click",
    function() {

        if (currentQuestion > 0) {

            currentQuestion--;

            showQuestion(currentQuestion);

        }

    }
);


/* =========================================
   COUNTDOWN TIMER
========================================= */

function updateTimer() {

    // Calculate minutes.
    const minutes =
        Math.floor(timeRemaining / 60);


    // Calculate seconds.
    const seconds =
        timeRemaining % 60;


    // Display timer as MM:SS.
    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    // Add warning when less than one minute remains.
    if (timeRemaining <= 60) {

        timerDisplay.classList.add("timer-warning");

    }


    // When time reaches zero.
    if (timeRemaining <= 0) {

        clearInterval(timerInterval);

        endQuiz(true);

        return;

    }


    // Decrease remaining time.
    timeRemaining--;

}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    // Update display immediately.
    updateTimer();


    // Run once every second.
    timerInterval = setInterval(
        updateTimer,
        1000
    );

}


/* =========================================
   FINISH QUIZ
========================================= */

function endQuiz(timedOut = false) {

    // Stop the timer.
    clearInterval(timerInterval);


    // Disable all answer buttons.
    answerOptions.forEach(function(option) {

        option.disabled = true;

    });


    // Disable navigation.
    nextButton.disabled = true;

    previousButton.disabled = true;


    /*
        If time expired, tell the student.
    */

    if (timedOut) {

        alert(
            "Time is up! Your current answers have been submitted."
        );

    }


    /*
        Calculate the final result.
    */

    const result =
        calculateResult();


    /*
        Save the results in browser storage.

        results.js will read this information
        on the Results page.
    */

    localStorage.setItem(
        "techPathResults",
        JSON.stringify(result)
    );


    // Move to Results page.
    window.location.href =
        "results.html";

}


/* =========================================
   CALCULATE RESULT
========================================= */

function calculateResult() {

    let highestPath = "fullstack";


    /*
        Find the specialisation with
        the highest score.
    */

    Object.keys(scores).forEach(function(path) {

        if (
            scores[path] >
            scores[highestPath]
        ) {

            highestPath = path;

        }

    });


    return {

        scores: scores,

        recommendedPath: highestPath,

        questionsAnswered:
            Object.keys(selectedAnswers).length,

        timeRemaining: timeRemaining,

        streak: streak

    };

}


/* =========================================
   SUBMIT QUIZ BUTTON
========================================= */

submitButton.addEventListener(
    "click",
    function() {

        // Make sure the final question has an answer.
        if (!selectedAnswers[currentQuestion]) {

            alert(
                "Please select an answer before finishing."
            );

            return;

        }


        endQuiz(false);

    }
);


/* =========================================
   INITIALISE QUIZ
========================================= */

// Display first question.
showQuestion(currentQuestion);

// Start countdown.
startTimer();
/* =========================================
   IMAGE HOTSPOT INTERACTION
========================================= */

const hotspotAreas =
    document.querySelectorAll(".hotspot-area");

const hotspotFeedback =
    document.getElementById("hotspotFeedback");


hotspotAreas.forEach(function(area) {

    area.addEventListener("click", function() {

        /*
            Remove the selected state
            from all hotspot areas.
        */

        hotspotAreas.forEach(function(item) {

            item.classList.remove("selected");

        });


        /*
            Highlight the selected area.
        */

        area.classList.add("selected");


        /*
            Get the specialisation stored
            inside the data attribute.
        */

        const selectedSpecialisation =
            area.dataset.specialisation;


        /*
            Display feedback to the student.
        */

        hotspotFeedback.textContent =
            `You selected ${selectedSpecialisation}.`;

    });

});

/*
    Make the hotspot image itself clickable by mapping
    image click coordinates to the four hotspot quadrants.
*/
const hotspotImage = document.getElementById('hotspotImage');
if (hotspotImage) {
    hotspotImage.style.cursor = 'pointer';
    hotspotImage.addEventListener('click', function (e) {
        const rect = hotspotImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1

        let selector = null;

        if (x < 0.5 && y < 0.5) selector = '.hotspot-fullstack';
        else if (x >= 0.5 && y < 0.5) selector = '.hotspot-ml';
        else if (x < 0.5 && y >= 0.5) selector = '.hotspot-arvr';
        else selector = '.hotspot-lowlevel';

        const btn = document.querySelector(selector);
        if (btn) btn.click();
    });
}