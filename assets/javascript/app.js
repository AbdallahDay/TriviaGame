var game = {
    questionsArr: [],
    currentQuestion: {},
    secondsRemaining: 30,
    countdownTimer: null,

    AddQAObject: function (nameStr, questionStr, trueAnswerStr, falseAnswersArr) {
        var obj = {
            name: "",
            question: "",
            trueAnswer: "",
            falseAnswers: [],
            shuffledAnswers: []
        };

        obj.name = nameStr;
        obj.question = questionStr;
        obj.trueAnswer = trueAnswerStr;
        obj.falseAnswers = falseAnswersArr;
        
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
        game.AddQAObject("question1", "question1", "answer", ["not answer", "not answer", "not answer"]);
        game.AddQAObject("question2", "question2", "answer", ["not answer", "not answer", "not answer"]);
        game.AddQAObject("question3", "question3", "answer", ["not answer", "not answer", "not answer"]);
        game.AddQAObject("question4", "question4", "answer", ["not answer", "not answer", "not answer"]);
        game.AddQAObject("question5", "question5", "answer", ["not answer", "not answer", "not answer"]);
        //...
    },

    NextQuestion: function () {
        //get a random question for the user to answer next
        const rnd = Math.floor(Math.random() * this.questionsArr.length);
        this.currentQuestion = this.questionsArr[rnd];
        this.questionsArr.splice(rnd, 1);

        //display question
        $("#Question").text(this.currentQuestion.question);

        console.log(this.currentQuestion);//DEBUG
        //display answer options
        $("#Options").empty();
        for (var i = 0; i < this.currentQuestion.shuffledAnswers.length; i++) {
            var li = $(`<li class="answer-option">${this.currentQuestion.shuffledAnswers[i]}</li>`);
            $("#Options").append(li);
        }

        //start countdownTimer
        this.secondsRemaining = 30;
        $("#TimeRemaining").text(this.secondsRemaining);
        
        this.countdownTimer = setInterval(function () {
            game.secondsRemaining--;
            console.log(game.secondsRemaining);//DEBUG
            $("#TimeRemaining").text(game.secondsRemaining);
    
            if (game.secondsRemaining <= 0) {
                //Time's up
                game.secondsRemaining = 0;
                $("#TimeRemaining").text(game.secondsRemaining);
    
                clearInterval(game.countdownTimer);
                game.NextQuestion();
            }
        }, 1000);
    }
};

$(document).ready(function() {

    game.Initialize();

    $("#Options").on("click", ".answer-option", function() {
        console.log(`${$(this).text()} clicked`);
        $(".answer-option").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#ClickStart").on("click", function() {
        $("#ClickStart").hide();
        game.NextQuestion();
    });

});