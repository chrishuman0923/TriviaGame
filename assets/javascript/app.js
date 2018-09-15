var secondsRemaining,
    $timerElem = $("#timer"),
    $clockElem = $("#clock"),
    timerInterval,
    $triviaAreaElem = $(".triviaArea"),
    triviaQuestions = [
        {
            question: "Who is the main protagonist in \"The Legend of Zelda\"?",
            choices: ["Ganon", "Link", "Sara", "Zelda"],
            correct: "Link"
        },
        {
            question: "What is the maximum number of controllers supported by the PS3 game console??",
            choices: ["2", "4", "7", "9"],
            correct: "7"
        },
        {
            question: "What does NES stand for?",
            choices: ["Nintendo Engagement System", "Nintendo Electronic System", "Nintendo Excellence System", "Nintendo Entertainment System"],
            correct: "Nintendo Entertainment System"
        },
        {
            question: "What is the name of the princess whom Mario repeatedly stops Bowser from kidnapping?",
            choices: ["Princess Pear", "Princess Daisy", "Princess Peach", "Princess Rose"],
            correct: "Princess Peach"
        },
        {
            question: "\"Black Ops\" is a subtitle for what video game series?",
            choices: ["Call of Duty", "Battlefield", "Halo", "Fable"],
            correct: "Call of Duty"
        },
        {
            question: "What are the objects being sought after in the \"Assassins Creed\" games?",
            choices: ["Gems of Knowledge", "Pieces of Eden", "Tokens of the Sages", "Pieces of Heart"],
            correct: "Pieces of Eden"
        },
        {
            question: "Which system was infamous for its \"Red Ring of Death\" (RRoD)?",
            choices: ["Xbox 360", "Playstation 2", "Nintendo Wii", "Sega Saturn"],
            correct: "Xbox 360"
        }
    ],
    questionNum = 0;

//Helper function to convert seconds to milliseconds for intervals
function secToMs(seconds) {
    return seconds * 1000;
}

function resetTimer() {
    //Reset timer to original value
    secondsRemaining = 2;

    //Update DOM
    $timerElem.text(secondsRemaining);
}

function reduceTimer() {
    //Reduce seconds by 1
    secondsRemaining -= 1;

    //Stop interval when the time has hit 0
    if (secondsRemaining <= 0) {
        //Is there another question
        if (questionNum < triviaQuestions.length-1) {
            nextQuestion();
        } else {
            gameOver();
        }
    } else {
        //Update DOM
        $timerElem.text(secondsRemaining);
    }
}

function gameOver() {
    //Done
    clearInterval(timerInterval);
    $timerElem.text("0");
    $triviaAreaElem.text("Done");
}

function createQuestion() {
    var container = $("<div>").addClass("question"),
        question = $("<h3>").text(triviaQuestions[questionNum].question),
        form = $("<form>").addClass("answerChoices");

    //Append elements to DOM
    $triviaAreaElem.append(container).append(question).append(form);
    
    //Loop through, create and append answer choices onto DOM
    for (var i = 0; i < triviaQuestions[questionNum].choices.length; i++) {
        var choice = $("<input>").attr({
                "type": "radio",
                "name": "option",
                "class": "choice"
            }),
            label = $("<label>").text(triviaQuestions[questionNum].choices[i]);

        $(".answerChoices").append(choice).append(label);
    }

    resetTimer();
}

function nextQuestion() {
    //increment question number to keep track of what question to display
    questionNum += 1;

    //clear DOM area
    $triviaAreaElem.empty();

    //Show next question
    createQuestion();
}

//Start Game
createQuestion();
timerInterval = setInterval(reduceTimer, secToMs(1));