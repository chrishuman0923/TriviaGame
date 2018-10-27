//wait till page is ready
$(document).ready(function () {
    var $mainContent = $(".mainContent"),
    secondsRemaining,
    $timer = $("#timer"),
    $clock = $("#clock"),
    timerInterval,
    $triviaArea = $(".triviaArea"),
    questions = [
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
    totalNum = questions.length,
    $startBtn = $("#startBtn"),
    $restartBtn = $("#restartBtn"),
    correctElem,
    incorrectElem,
    scoreElem;

    //Helper function to convert seconds to milliseconds for intervals
    function secToMs(seconds) {
        return seconds * 1000;
    }

    function resetTimer() {
        //Reset timer to original value
        secondsRemaining = 10;

        //Update DOM
        $timer.text(secondsRemaining);
    }

    function reduceTimer() {
        //Reduce seconds by 1
        secondsRemaining -= 1;

        //Stop interval when the time has hit 0
        if (secondsRemaining <= 0) {
            disableBackgroundProcesses();

            //Is there another question
            if (questionNum < questions.length-1) {
                timesUp();
            } else {
                gameOver();
            }
        } else {
            //Update DOM
            $timer.text(secondsRemaining);
        }
    }

    function gameOver() {
        var incorrectNum = totalNum - correctNum,
            score = ((correctNum / totalNum) * 100).toFixed(2) + "%";

        correctElem = $("<p>").text('Number Correct: ' + correctNum).addClass("correctAnswer");
        incorrectElem = $("<p>").text('Number Incorrect: ' + incorrectNum).addClass("incorrectAnswer");
        scoreElem = $("<p>").text('Score: ' + score);
        
        //Update game area by hiding and updating relevant objects
        $clock.hide();
        $triviaArea.html([correctElem, incorrectElem, scoreElem]);

        $restartBtn.show();
    }

    function createQuestion() {
        var question = $("<h2>").text(questions[questionNum].question),
            form = $("<form>").addClass("answerChoices");

        //Append elements to DOM
        $triviaArea.append([question, form]);
        
        //Loop through, create and append answer choices onto DOM
        for (var i = 0; i < questions[questionNum].choices.length; i++) {
            var choice = $("<input>").attr({
                    "type": "radio",
                    "name": "option",
                    "class": "choice"
                }),
                label = $("<label>").attr("data-choice", [i]);
            
            //Adds attribute to identify which choice is correct and which are wrong
            if (i.toString() === questions[questionNum].correct) {
                label.attr("data-answer", "true");
            } else {
                label.attr("data-answer", "false");
            }

            //Appends the label to the DOM
            $(".answerChoices").append(label);

            //Appends choice within the label that was created
            $('[data-choice=' + [i] + ']').append([choice, questions[questionNum].choices[i]], "<br/>");
        }

        resetTimer();
    }

    function nextQuestion() {
        //if timer is hidden, show it
        if ($clock.not(':visible')) {
            $clock.show();
        }

        //increment question number to keep track of what question to display
        questionNum += 1;

        //clear DOM area
        $triviaArea.empty();

        //Show next question
        createQuestion();
    }

    function userGuessed() {
        var userChoice = $(this).attr("data-choice");

        //Hide timer and stop background processes
        $clock.hide();
        disableBackgroundProcesses();

        if (questions[questionNum].correct === userChoice) {
            //correct guess
            correctUserGuess();
        } else {
            incorrectUserGuess();
        }
    }

    function correctUserGuess() {
        correctElem = $("<p>").text("Correct!").addClass("correctAnswer");

        //increment number of correct answers
        correctNum += 1;
        
        $triviaArea.html(correctElem);

        //Is there another question
        if (questionNum < questions.length-1) {
            //re-enable game
            setTimeout(enableBackgroundProcesses, secToMs(3));
            setTimeout(nextQuestion, secToMs(3));
        } else {
            setTimeout(gameOver, secToMs(3));
        }
    }

    //user doesn't answer in time
    function timesUp() {
        //Hide timer
        $clock.hide();

        incorrectElem = $("<p>").text("Time's Up!").addClass("incorrectAnswer");
        $("[data-answer='true']").addClass("correctAnswer");

        //Prepend message to DOM
        $triviaArea.prepend(incorrectElem);

        //Is there another question
        if (questionNum < questions.length-1) {
            //re-enable game
            setTimeout(enableBackgroundProcesses, secToMs(3));
            setTimeout(nextQuestion, secToMs(3));
        } else {
            setTimeout(gameOver, secToMs(3));
        }
    }

    function incorrectUserGuess() {
        $("[data-answer='true']").addClass("correctAnswer");
        $("input:checked").closest("label").addClass("incorrectAnswer");
        incorrectElem = $("<p>").text("Incorrect!").addClass("incorrectAnswer");

        //Prepend message to DOM
        $triviaArea.prepend(incorrectElem);

        //Is there another question
        if (questionNum < questions.length-1) {
            //re-enable game
            setTimeout(enableBackgroundProcesses, secToMs(3));
            setTimeout(nextQuestion, secToMs(3));
        } else {
            setTimeout(gameOver, secToMs(3));
        }
    }

    function startGame() {
        //if timer is hidden, show it
        if ($clock.not(':visible')) {
            $clock.show();
        }

        enableBackgroundProcesses();

        //clear DOM area
        $triviaArea.empty();

        //hide start button
        $startBtn.hide();
        $restartBtn.hide();

        //show question area
        $mainContent.show();

        //set question
        createQuestion();
    }

    function resetGame() {
        //reset variables
        questionNum = 0;
        correctNum = 0;

        startGame();    
    }

    //starts interval, resets timer and adds click handler
    function enableBackgroundProcesses() {
        $(document).on("click", "label", userGuessed);
        resetTimer();
        timerInterval = setInterval(reduceTimer, secToMs(1));
    }

    //stops interval and removes click handler
    function disableBackgroundProcesses() {
        $(document).off("click", "label", userGuessed);
        clearInterval(timerInterval);
    }

    //set click events
    $startBtn.on("click", startGame);
    $restartBtn.on("click", resetGame);
});