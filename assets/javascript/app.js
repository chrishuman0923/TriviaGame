var $mainContentArea = $(".mainContent"),
    secondsRemaining,
    $timerElem = $("#timer"),
    $clockElem = $("#clock"),
    timerInterval,
    $triviaAreaElem = $(".triviaArea"),
    triviaQuestions = [
        {
            question: "Who is the main protagonist in \"The Legend of Zelda\"?",
            choices: ["Ganon", "Link", "Sara", "Zelda"],
            correct: "1"
        },
        {
            question: "What is the maximum number of controllers supported by the PS3 game console?",
            choices: ["2", "4", "7", "9"],
            correct: "2"
        },
        {
            question: "What does NES stand for?",
            choices: ["Nintendo Engagement System", "Nintendo Electronic System", "Nintendo Excellence System", "Nintendo Entertainment System"],
            correct: "3"
        },
        {
            question: "What is the name of the princess whom Mario repeatedly stops Bowser from kidnapping?",
            choices: ["Princess Pear", "Princess Daisy", "Princess Peach", "Princess Rose"],
            correct: "2"
        },
        {
            question: "\"Black Ops\" is a subtitle for what video game series?",
            choices: ["Call of Duty", "Battlefield", "Halo", "Fable"],
            correct: "0"
        },
        {
            question: "What are the objects being sought after in the \"Assassins Creed\" games?",
            choices: ["Gems of Knowledge", "Pieces of Eden", "Tokens of the Sages", "Pieces of Heart"],
            correct: "1"
        },
        {
            question: "Which system was infamous for its \"Red Ring of Death\" (RRoD)?",
            choices: ["Xbox 360", "Playstation 2", "Nintendo Wii", "Sega Saturn"],
            correct: "0"
        }
    ],
    questionNum = 0,
    correctNum = 0,
    totalNum = triviaQuestions.length,
    $startBtn = $("#startBtn"),
    $restartBtn = $("#restartBtn"),
    correctElem,
    incorrectElem;

//Helper function to convert seconds to milliseconds for intervals
function secToMs(seconds) {
    return seconds * 1000;
}

function resetTimer() {
    //Reset timer to original value
    secondsRemaining = 10;

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
    var incorrectNum = totalNum - correctNum;

    correctElem = $("<p>").text(`Number Correct: ${correctNum}`);
    incorrectElem = $("<p>").text(`Number Incorrect: ${incorrectNum}`);
    
    clearInterval(timerInterval);
    $timerElem.text("0");
    $triviaAreaElem.html([correctElem, incorrectElem]);

    $restartBtn.show();
}

function createQuestion() {
    var question = $("<h2>").text(triviaQuestions[questionNum].question),
        form = $("<form>").addClass("answerChoices");

    //Append elements to DOM
    $triviaAreaElem.append([question, form]);
    
    //Loop through, create and append answer choices onto DOM
    for (var i = 0; i < triviaQuestions[questionNum].choices.length; i++) {
        var choice = $("<input>").attr({
                "type": "radio",
                "name": "option",
                "class": "choice"
            }),
            label = $("<label>").attr("data-choice", [i]);
        
        if (i.toString() === triviaQuestions[questionNum].correct) {
            label.attr("data-answer", "true");
        } else {
            label.attr("data-answer", "false");
        }

        //Appends the label to the DOM
        $(".answerChoices").append(label);

        //Appends choice within the label that was created
        $(`[data-choice=${[i]}]`).append([choice, triviaQuestions[questionNum].choices[i]], "<br/>");
    }

    resetTimer();
}

function nextQuestion() {
    //if timer is hidden, show it
    if ($clockElem.not(':visible')) {
        $clockElem.show();
     }

    //increment question number to keep track of what question to display
    questionNum += 1;

    //clear DOM area
    $triviaAreaElem.empty();

    //Show next question
    createQuestion();
}

function userGuessed() {
    var userChoice = $(this).attr("data-choice");

    if (triviaQuestions[questionNum].correct === userChoice) {
        //correct guess
        correctUserGuess();
    } else {
        incorrectUserGuess();
    }

    //Hide timer
    $clockElem.hide();
}

function correctUserGuess() {
    correctElem = $("<p>").text("Correct!");

    //increment number of correct answers
    correctNum += 1;
    
    $triviaAreaElem.html(correctElem);

    //Is there another question
    if (questionNum < triviaQuestions.length-1) {
        setTimeout(nextQuestion, secToMs(3));
    } else {
        setTimeout(gameOver, secToMs(3));
    }
}

function incorrectUserGuess() {
    $("[data-answer='true']").addClass("correctAnswer");
    $("input:checked").closest("label").addClass("incorrectAnswer");

    //Is there another question
    if (questionNum < triviaQuestions.length-1) {
        setTimeout(nextQuestion, secToMs(3));
    } else {
        setTimeout(gameOver, secToMs(3));
    }
}

function startGame() {
    //clear DOM area
    $triviaAreaElem.empty();

    //hide start button
    $startBtn.hide();
    $restartBtn.hide();

    //show question area
    $mainContentArea.show();

    //set interval and question
    createQuestion();
    timerInterval = setInterval(reduceTimer, secToMs(1));
}

function resetGame() {
    //reset variables
    questionNum = 0;
    correctNum = 0;

    startGame();    
}

//set click events
$(document).on("click", "label", userGuessed);
$startBtn.on("click", startGame);
$restartBtn.on("click", resetGame);