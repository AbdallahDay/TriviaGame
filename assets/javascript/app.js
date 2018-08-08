var game = {
    questionsArr: [],
    currentQuestion: {},
    secondsRemaining: 30,
    countdownTimer: null,
    correct: 0,
    incorrect: 0,
    missed: 0,

    AddQAObject: function (questionStr, trueAnswerStr, falseAnswersArr, imageUrl) {
        var obj = {
            question: "",
            trueAnswer: "",
            falseAnswers: [],
            shuffledAnswers: [],
            img_url: ""
        };

        obj.question = questionStr;
        obj.trueAnswer = trueAnswerStr;
        obj.falseAnswers = falseAnswersArr;
        obj.img_url = imageUrl;
        
        var arr = Array.from(falseAnswersArr);
        arr.push(obj.trueAnswer);
        
        console.log(`arr: ${arr}`);//DEBUG

        var newArr = [];

        console.log(`newArr: ${newArr}`)//DEBUG
        count = 0;//DEBUG
        while (arr.length > 0) {
            count++;//DEBUG
            console.log(`attempt #${count}`);//DEBUG
            var i = Math.floor(Math.random() * arr.length);
            console.log(`chosen arr[${i}/${arr.length}]: ${arr[i]}`);//DEBUG
            
            newArr.push(arr[i]);
            arr.splice(i, 1);

            console.log(`arr: ${arr}`);//DEBUG
            console.log(`newArr: ${newArr}`);//DEBUG
        }

        obj.shuffledAnswers = Array.from(newArr);

        this.questionsArr.push(obj);
    },

    Initialize: function () {

        game.questionsArr = [];
        //Add all Q/A objects here using AddQAObject function

        game.AddQAObject(
            "What does Rick use to travel between dimensions and universes?",
            "Portal Gun",
            ["Space Laser", "Tardis", "Universe Key"],
            "./assets/images/portal-gun.gif");
        
        game.AddQAObject(
            "Who is Morty based on?",
            "Marty from \"Back To The Future\"",
            ["Frankenstein", "Hugo Strange", "Adam Webber from \"Blast From The Past\""],
            "./assets/images/rickandmorty-backtothefuture.jpg");
        
        game.AddQAObject(
            "Who are Rick's two best friends?",
            "Birdperson and Squanchy",
            ["Eagleperson and Scrunchy", "Beakperson and Squinchy", "Hawkperson and Sqelchy"],
            "./assets/images/ricks-bff.gif");
        
        game.AddQAObject(
            "What non-human species makes up half of Morty's son?",
            "Gazorpazorp",
            ["Gatarama", "Gurglenstein", "Gaflumarorp"],
            "./assets/images/morty-jr.gif");

    },

    NextQuestion: function () {
        $("#answerDisplay").hide();
        if (game.questionsArr.length) {
            //get a random question for the user to answer next
            const rnd = Math.floor(Math.random() * game.questionsArr.length);
            game.currentQuestion = game.questionsArr[rnd];
            game.questionsArr.splice(rnd, 1);

            $("#resultAnswer").text(`The correct answer was: ${game.currentQuestion.trueAnswer}`);
            $("#resultImage").attr({
                src: game.currentQuestion.img_url,//TODO
                alt: game.currentQuestion.trueAnswer
            });

            //display question
            $("#Question").text(game.currentQuestion.question);

            console.log(game.currentQuestion);//DEBUG
            //display answer options
            $("#Options").empty();
            for (var i = 0; i < game.currentQuestion.shuffledAnswers.length; i++) {
                var li = $(`<li class="answer-option">${game.currentQuestion.shuffledAnswers[i]}</li>`);
                $("#Options").append(li);
            }

            $("#btnSubmit").removeClass("disabled");

            //start countdownTimer
            game.secondsRemaining = 30;
            $("#TimeRemaining").text(game.secondsRemaining);
            
            game.countdownTimer = setInterval(function () {
                game.secondsRemaining--;
                console.log(game.secondsRemaining);//DEBUG
                $("#TimeRemaining").text(game.secondsRemaining);
        
                if (game.secondsRemaining <= 0) {
                    //Time's up
                    game.secondsRemaining = 0;
                    $("#TimeRemaining").text(game.secondsRemaining);

                    //not submitted = missed
                    game.missed++;
                    $("#resultTitle").text("Out of Time!");
                    $("#answerDisplay").show();
        
                    clearInterval(game.countdownTimer);
                    game.NextQuestion();
                }
            }, 1000);
        } else {
            //no questions left
            clearInterval(game.countdownTimer);
            
            //correctAnswers
            $("#correctAnswers").text(game.correct);
            //incorrectAnswers
            $("#incorrectAnswers").text(game.incorrect);
            //unanswered
            $("#unanswered").text(game.missed);

            $("#game").hide();
            $("#gameOver").show();
        }
    }
};

$(document).ready(function() {

    $("#answerDisplay").hide();
    $("#gameOver").hide();
    $("#game").show();

    game.Initialize();

    $("#ClickStart").on("click", function() {
        $("#ClickStart").hide();
        game.NextQuestion();
    });

    $("#Options").on("click", ".answer-option", function() {
        console.log(`${$(this).text()} clicked`);
        $(".answer-option").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#btnSubmit").on("click", function() {
        if (!$("#btnSubmit").hasClass("disabled")) {
            $("#btnSubmit").addClass("disabled");
            clearInterval(game.countdownTimer);
            if ($(".answer-option.selected").length) {
                var answerStr = $(".answer-option.selected").text();

                if (game.currentQuestion.trueAnswer === answerStr) {
                    //correct
                    game.correct++;
                    $("#resultTitle").text("Correct!");
                } else {
                    //incorrect
                    game.incorrect++;
                    $("#resultTitle").text("Wrong!");
                }
            } else {
                //missed
                game.missed++;
            }

            //display result for 5 seconds
            $("#answerDisplay").show();

            setTimeout(game.NextQuestion, 5000);
        }
    });

    $("#btnStartOver").on("click", function() {
        $("#gameOver").hide();
        $("#game").show();

        game.correct = 0;
        game.incorrect = 0;
        game.missed = 0;
        game.Initialize();
        game.NextQuestion();
    });

});