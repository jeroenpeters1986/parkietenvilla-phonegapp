var totalquestions = 10;
var actualchoices = new Array();
var incorrect_overall = 0;

// De juiste antwoorden
var correctchoices = new Array();
    correctchoices[1] = 'c';
    correctchoices[2] = 'a';
    correctchoices[3] = 'b';
    correctchoices[4] = 'b';
    correctchoices[5] = 'a';
    correctchoices[6] = 'b';
    correctchoices[7] = 'a';
    correctchoices[8] = 'b';
    correctchoices[9] = 'c';
    correctchoices[10] ='b';

function count_questions()
{
    return $$(".qselections").length;
}

function parkietenquiz()
{
    totalquestions = count_questions();
    var incorrect = null;
    for(q=1; q<=totalquestions; q++)
    {
	    var thequestion = eval("document.parkietenquizform.question"+q);

	    for(c=0; c<thequestion.length; c++)
        {
            if (thequestion[c].checked==true)
            {
                actualchoices[q] = thequestion[c].value;
            }
		}
		
        if (actualchoices[q] != correctchoices[q])
        { //process an incorrect choice
		    if (incorrect==null)
            {
		        incorrect=q;
            } else {
                incorrect+="/"+q;
            }
		}
	}

    if (incorrect==null)
    {
        incorrect = "a/b";
    }

    localStorage.setItem('quizantwoorden', 'q='+incorrect);
    $$(".deparkietenquiz").hide();
    showscore();
}

function showscore()
{
    $$(".generalquizresult").hide();
    $$("#parkieten-quiz-results").show();
    var wrong = 0;
    var results = localStorage.getItem('quizantwoorden').split(";");
    for(n=0; n<=results.length-1; n++)
    {
        if (results[n].charAt(0) == 'q')
        {
            parse = n;
        }
    }

    var incorrect = results[parse].split("=");
    incorrect=incorrect[1].split("/");
    if (incorrect[incorrect.length-1]=='b')
    {
        incorrect = "";
    }

    incorrect_overall = incorrect;
    var correct_answers = (totalquestions-incorrect.length);

    $$("#quiz-text-result").html("Je hebt " + correct_answers + " van de " + totalquestions + " vragen goed!");
    $$(".result" + correct_answers).show();
    var percentage_correct = correct_answers/totalquestions*100+"%";

    if(correct_answers < 10)
    {
        var question_nrs_incorrect = "";
        for(temp=0; temp<incorrect.length; temp++)
        {
            question_nrs_incorrect += incorrect[temp]+", ";
        }
        question_nrs_incorrect = question_nrs_incorrect.slice(0, -2);
        $$("#quiz-result-wrongs").html("De vragen die je fout had waren: " + question_nrs_incorrect);
    }
    else if(correct_answers == 10)
    {
        $$("#quiz-result-wrongs").hide();
    }

    setTimeout(
        function() {
            $$("#quiz-percentage").attr('data-progress', percentage_correct);
            $$("#quiz-percentage .progress .bar .value").css('width', percentage_correct);
    }, 700);
}

function showQuiz()
{
    $$("#parkieten-quiz-results").hide();
    $$(".deparkietenquiz").show();
}


//function showsolution()
//{
//    var wrong = null;
//    var win2 = window.open("", "win2", "width=200,height=350, scrollbars");
//    win2.focus();
//    win2.document.open();
//    win2.document.write('<title>Solution</title>');
//    win2.document.write('<body bgcolor="#FFFFFF">');
//    win2.document.write('<center><h3>Solution to Quiz</h3></center>');
//    win2.document.write('<center><font face="Arial">');
//    for (i = 1; i <= totalquestions; i++)
//    {
//        for (temp = 0; temp < incorrect_overall.length; temp++)
//        {
//            if (i == incorrect_overall[temp])
//            {
//                wrong = 1;
//            }
//        }
//        if (wrong == 1)
//        {
//            win2.document.write("Question " + i + "=" + correctchoices[i].fontcolor("red") + "<br>");
//            wrong = 0;
//        }
//        else
//        {
//            win2.document.write("Question " + i + "=" + correctchoices[i] + "<br>");
//        }
//    }
//    win2.document.write('</center></font>');
//    win2.document.write("<h5>Note: The solutions in red are the ones to the questions you had incorrectly answered.</h5><p align='center'><small><a href='http://www.javascriptkit.com' target='_new'>JavaScript Kit quiz script</a></small>");
//    win2.document.close();
//}
