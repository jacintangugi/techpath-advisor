/* =========================================
   TECHPATH RESULTS ENGINE
   BSE Specialisation Advisor
========================================= */


/* =========================================
   GET SAVED QUIZ RESULTS
========================================= */

// Retrieve the results saved by quiz.js.
const savedResults =
    localStorage.getItem("techPathResults");

// If no quiz has been completed, return to the quiz.
if (!savedResults) {

    window.location.href = "quiz.html";

}


// Convert the saved JSON data back into a JavaScript object.
const resultData =
    JSON.parse(savedResults);


/* =========================================
   GET SCORES
========================================= */

const scores = resultData.scores;


/*
    The quiz gives points rather than percentages.

    We convert the scores into percentages so
    they are easier for the student to understand.
*/

const maximumScore = 30;


const percentages = {

    fullstack:
        Math.min(
            Math.round(
                (scores.fullstack / maximumScore) * 100
            ),
            100
        ),

    machinelearning:
        Math.min(
            Math.round(
                (scores.machinelearning / maximumScore) * 100
            ),
            100
        ),

    arvr:
        Math.min(
            Math.round(
                (scores.arvr / maximumScore) * 100
            ),
            100
        ),

    lowlevel:
        Math.min(
            Math.round(
                (scores.lowlevel / maximumScore) * 100
            ),
            100
        )

};


/* =========================================
   SPECIALISATION INFORMATION
========================================= */

const specialisations = {

    fullstack: {

        name: "Full-Stack Web Development",

        icon: "💻",

        description:
            "You show a strong interest in building websites, applications and interactive digital experiences. You may enjoy combining creativity with programming to create solutions that people can use.",

        nextStep:
            "Start exploring HTML, CSS, JavaScript, APIs and full-stack application development."

    },


    machinelearning: {

        name: "Machine Learning",

        icon: "🤖",

        description:
            "Your answers suggest that you enjoy working with data, patterns, algorithms and intelligent systems. You may enjoy solving problems where software learns from information.",

        nextStep:
            "Start exploring Python, data analysis, machine learning algorithms and artificial intelligence projects."

    },


    arvr: {

        name: "AR / VR",

        icon: "🥽",

        description:
            "You appear interested in immersive experiences, visual technology and interactive environments. You may enjoy creating digital worlds that connect technology with human experience.",

        nextStep:
            "Explore 3D development, spatial computing, game engines and augmented or virtual reality experiences."

    },


    lowlevel: {

        name: "Low-Level Programming",

        icon: "⚙️",

        description:
            "Your answers suggest an interest in understanding how computers work beneath the surface. You may enjoy systems, memory, performance and hardware-level programming.",

        nextStep:
            "Explore C, C++, computer architecture, operating systems and memory management."

    }

};


/* =========================================
   FIND HIGHEST SCORE
========================================= */

let recommendedPath = "fullstack";

Object.keys(percentages).forEach(function(path) {

    if (
        percentages[path] >
        percentages[recommendedPath]
    ) {

        recommendedPath = path;

    }

});


/* =========================================
   DISPLAY RECOMMENDATION
========================================= */

const recommendation =
    specialisations[recommendedPath];


document.getElementById(
    "resultIcon"
).textContent =
    recommendation.icon;


document.getElementById(
    "recommendedPath"
).textContent =
    recommendation.name;


document.getElementById(
    "resultDescription"
).textContent =
    recommendation.description;


document.getElementById(
    "nextStepTitle"
).textContent =
    "Explore " + recommendation.name;


document.getElementById(
    "nextStepDescription"
).textContent =
    recommendation.nextStep;


/* =========================================
   UPDATE SCORE BARS
========================================= */

function updateScoreBar(
    scoreId,
    barId,
    percentage
) {

    const scoreElement =
        document.getElementById(scoreId);

    const barElement =
        document.getElementById(barId);


    scoreElement.textContent =
        percentage + "%";


    /*
        A short delay allows the CSS transition
        to animate the progress bar.
    */

    setTimeout(function() {

        barElement.style.width =
            percentage + "%";

    }, 200);

}


/* Full-Stack */

updateScoreBar(
    "fullstackScore",
    "fullstackBar",
    percentages.fullstack
);


/* Machine Learning */

updateScoreBar(
    "machinelearningScore",
    "machinelearningBar",
    percentages.machinelearning
);


/* AR / VR */

updateScoreBar(
    "arvrScore",
    "arvrBar",
    percentages.arvr
);


/* Low-Level */

updateScoreBar(
    "lowlevelScore",
    "lowlevelBar",
    percentages.lowlevel
);


/* =========================================
   PERFORMANCE STATISTICS
========================================= */

document.getElementById(
    "questionsAnswered"
).textContent =
    resultData.questionsAnswered;


document.getElementById(
    "streakScore"
).textContent =
    resultData.streak;


/*
    Calculate the amount of time used.

    The quiz starts with 300 seconds.
*/

const totalQuizTime = 5 * 60;

const timeUsed =
    totalQuizTime -
    resultData.timeRemaining;


const minutesUsed =
    Math.floor(timeUsed / 60);


const secondsUsed =
    timeUsed % 60;


document.getElementById(
    "timeUsed"
).textContent =
    `${minutesUsed}:${String(secondsUsed).padStart(2, "0")}`;


/* =========================================
   CANVAS SETUP
========================================= */

const canvas =
    document.getElementById(
        "resultsCanvas"
    );


const ctx =
    canvas.getContext("2d");


/*
    Canvas dimensions.

    These values create a consistent drawing
    area for our radar chart.
*/

const centerX = canvas.width / 2;

const centerY = canvas.height / 2;

const radius = 160;


/* =========================================
   CANVAS COORDINATES
========================================= */

const chartLabels = [

    "Full-Stack",

    "Machine Learning",

    "AR / VR",

    "Low-Level"

];


const chartValues = [

    percentages.fullstack,

    percentages.machinelearning,

    percentages.arvr,

    percentages.lowlevel

];


/*
    Calculate the position of each point
    around the radar chart.
*/

function getPoint(
    index,
    value,
    maxRadius
) {

    const angle =
        (Math.PI * 2 / chartLabels.length)
        * index
        - Math.PI / 2;


    const distance =
        (value / 100) * maxRadius;


    return {

        x:
            centerX +
            Math.cos(angle) * distance,

        y:
            centerY +
            Math.sin(angle) * distance

    };

}


/* =========================================
   DRAW CANVAS BACKGROUND
========================================= */

function drawBackground() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Create several radar grid levels.
    */

    for (
        let level = 1;
        level <= 4;
        level++
    ) {

        const levelRadius =
            (radius / 4) * level;


        ctx.beginPath();


        for (
            let i = 0;
            i < chartLabels.length;
            i++
        ) {

            const point =
                getPoint(
                    i,
                    100,
                    levelRadius
                );


            if (i === 0) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }


        ctx.closePath();


        ctx.strokeStyle =
            "#334155";

        ctx.lineWidth = 1;

        ctx.stroke();

    }

}


/* =========================================
   DRAW AXIS LINES
========================================= */

function drawAxes() {

    for (
        let i = 0;
        i < chartLabels.length;
        i++
    ) {

        const point =
            getPoint(
                i,
                100,
                radius
            );


        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.lineTo(
            point.x,
            point.y
        );

        ctx.strokeStyle =
            "#334155";

        ctx.lineWidth = 1;

        ctx.stroke();

    }

}


/* =========================================
   DRAW LABELS
========================================= */

function drawLabels() {

    ctx.font =
        "bold 14px Arial";

    ctx.fillStyle =
        "#cbd5e1";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    chartLabels.forEach(
        function(label, index) {

            const point =
                getPoint(
                    index,
                    120,
                    radius
                );


            ctx.fillText(
                label,
                point.x,
                point.y
            );

        }
    );

}


/* =========================================
   DRAW RESULT AREA
========================================= */

function drawResultArea() {

    ctx.beginPath();


    chartValues.forEach(
        function(value, index) {

            const point =
                getPoint(
                    index,
                    value,
                    radius
                );


            if (index === 0) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }
    );


    ctx.closePath();


    /*
        Fill the student's result area.
    */

    ctx.fillStyle =
        "rgba(56, 189, 248, 0.25)";

    ctx.fill();


    /*
        Draw the outline.
    */

    ctx.strokeStyle =
        "#38bdf8";

    ctx.lineWidth = 3;

    ctx.stroke();


    /*
        Draw points at each score.
    */

    chartValues.forEach(
        function(value, index) {

            const point =
                getPoint(
                    index,
                    value,
                    radius
                );


            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                6,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#38bdf8";

            ctx.fill();


            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 2;

            ctx.stroke();

        }
    );

}


/* =========================================
   DRAW CANVAS CHART
========================================= */

function drawChart() {

    drawBackground();

    drawAxes();

    drawLabels();

    drawResultArea();

}


/* =========================================
   START CANVAS
========================================= */

drawChart();