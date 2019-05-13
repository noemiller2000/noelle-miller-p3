//Declaring global variables
var magicBall = document.getElementById("magicBall");
var isQuestionAsked = false;
var responseTypes = {
  standard: ["Try asking again", "Not a chance", "No", "Unlikely", "Maybe", "Likely", "For sure", "Definitely"],
  indecisive: ["Maybe?", "No... wait, yes", "Yes... wait, no", "I mean, sure"],
  positive: ["Of course!", "Yes!", "Definitely!", "Without fail!", "You bet!", "Undoubtedly!"],
  sarcastic: ["When Hell freezes over", "But of course!", "For suuuure", "Oh, definitely not", "That's impossible"],
  apathetic: ["I guess", "Nah", "Meh", "Whatever", "Who cares?", "*shrug*"]
};
var prevQuestions = [];
var rowLimit = 5;

// Functions for dragging Magic 8 Ball
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    if (magicBall.classList.contains("draggable") === true) {
      e = e || window.event;
      e.preventDefault();
      // Calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.removeProperty("top");
    elmnt.style.removeProperty("left");
  }
}

// Adds class that allows magicBall to be dragged
function setDraggability() {
  if (magicBall.classList.contains("draggable") !== true) {
    magicBall.classList.remove("stationary");
    magicBall.classList.add("draggable");
  }
}

// Removes class that allows magicBall to be dragged
function removeDraggability () {
  if (magicBall.classList.contains("draggable") === true) {
    magicBall.classList.remove("draggable");
    magicBall.classList.add("stationary");
  }
}

// Changes the visibility of an jQuery element
function changeVisibility($elem) {
  if ($elem.hasClass("hidden")) {
    $elem.removeClass("hidden");
  } else {
    $elem.addClass("hidden");
  }
}

// Takes a jQuery element and disables it
function disableElem($elem) {
  $elem.attr("disabled", "");
}

// Takes a jQuery element and enables it
function enableElem($elem) {
  if ($elem.attr("disabled")) {
    $elem.removeAttr("disabled");
  }
}

// Creates and adds all the options to the vertical menu
function createMenu() {
  let keys = Object.keys(responseTypes);
  let $items = ""
  for (var i = 0; i < keys.length; i++) {
    let label = keys[i];
    // Returns string with first letter captialized
    label = label.substring(0,1).toUpperCase() + label.substring(1).toLowerCase();
    switch (i) {
      case 0:
        $items = $items + "<a class='active'>" + label + "</a>";
        break;
      default:
        $items = $items + "<a>" + label + "</a>";
    }
  }
  $(".dropdownContent").append($items);
}

// Selects the correct assortment of responses based on vertical menu's active item
function setResponseType() {
  let $activeItem = $(".active").text()
  $activeItem = $activeItem.toLowerCase();
  let array = responseTypes[$activeItem];
  return array;
}

// Records question and answer as an object in the array prevQuestions
function recordQuestion() {
  let $question = $("#questionInput").val();
  let $answer = $("#magicBallAnswer").text();
  prevQuestions.push({question: $question, answer: $answer});
}

// Updates the table with the latest question/answer pair
function updateQuestionsTable() {
  let $numOfQuestionRows = $(".prevQuestionsTable > tbody > tr").length - 1;
  if ($numOfQuestionRows === 0) {
    changeVisibility($(".prevQuestionsTable"))
    changeVisibility($(".pageButtonDiv"))
    changeVisibility($("#pageNumDisplay"))
  }
  if ($numOfQuestionRows < rowLimit) {
    makeTableRow(prevQuestions.length - 1);
  } else {
    let int = (parseInt($("#pageNumber").text()) + 1);
    $("#pageTotal").text(int.toString());
    newPage(int);
  }
}

// Makes a new question/answer table row
function makeTableRow(num) {
  let object = prevQuestions[num];
  let openingTag = "";
  let altColorBefore = $("td").last().hasClass("altColor");
  if (altColorBefore === true) {
    openingTag = "<td>";
  } else {
    openingTag = "<td class='altColor'>";
  }
  let questionItem = openingTag + (num + 1) + ". " + object["question"] + "</td>";
  let answerItem = openingTag + object["answer"] + "</td>";
  $(".prevQuestionsTable").append("<tr>" + questionItem + answerItem + "</tr>");
}

// Removes all table rows except the first row
function resetTable() {
  $(".prevQuestionsTable > tbody > tr:not(:first)").remove();
}

// Loads a new page at pageNum number
function newPage(pageNum) {
  resetTable();
  let newPageNum = pageNum;
  let startVal = (newPageNum - 1) * rowLimit;
  let endVal;
  // If there are not enough rows to fill entire page
  if (prevQuestions.length < (rowLimit * newPageNum)) {
    endVal = prevQuestions.length - 1;
  } else {
    endVal = newPageNum * rowLimit - 1;
  }
  for (var i = startVal; i <= endVal; i++) {
    makeTableRow(i);
  }
  $("#pageNumber").text(newPageNum.toString());
}

// Passes the question along for evaluation
function askQuestion() {
  if (document.getElementById("questionInput").value == false) {
    alert("Please enter a question before clicking the button.");
    return("Alert: No question entered");
  }
  // Show space behind magicBall to keep layout the same
  if ($("#magicBallSpace").hasClass("hidden")){
    changeVisibility($("#magicBallSpace"));
  }
  $("#magicBallAnswer").text("Shake (drag) around the 8-Ball!");
  setDraggability();
  disableElem($("#askButton"));
  disableElem($("#questionInput"));
  // Adds an event listener that triggers when user moves magicBall on page
  magicBall.addEventListener("click", shakeBall);
}

// After ball is shook, answers question
function shakeBall () {
  answerQuestion();
  removeDraggability();
  enableElem($("#askButton"));
  enableElem($("#questionInput"));
  changeVisibility($("#magicBallSpace"));
  // Removes event listener after ball is shook
  document.getElementById("magicBall").removeEventListener("click", shakeBall);
}

// Gets and returns a response from the selected array of possible responses
function answerQuestion() {
  let answer = "";
  let array = setResponseType();
  // Selects a random item in the array
  answer = array[Math.floor(Math.random()*array.length)];
  let answerDiv = document.getElementById("magicBallAnswer")
  answerDiv.innerText = answer;
  // Ensure table is on last page before updating table
  if ($("#pageNumber").text() != $("#pageTotal").text()) {
    newPage(parseInt($("#pageTotal").text()));
  }
  recordQuestion();
  updateQuestionsTable();
}

function init() {
  createMenu();
  // Make the image draggable
  dragElement(magicBall);
  // Add event listeners
  $("#questionInput").keypress(function(e) {
    var code = e.keyCode || e.which;
    if(code == 13) {
      askQuestion();
    }
  });
  $("#askButton").click(askQuestion);
  $("a").click(function() {
    $("a.active").removeClass("active");
    $(this).addClass("active");
  });
  $("#prevPageButton").click(function() {
    if ($("#pageNumber").text() != "1") {
      let pageNum = parseInt($("#pageNumber").text()) - 1;
      newPage(pageNum);
    }
  });
  $("#nextPageButton").click(function() {
    if ($("#pageNumber").text() != $("#pageTotal").text()) {
      let pageNum = parseInt($("#pageNumber").text()) + 1;
      newPage(pageNum);
    }
  });
  jQuery($("#nextPageButton")).mousedown(function(e){e.preventDefault();});
  jQuery($("#prevPageButton")).mousedown(function(e){e.preventDefault();});
}

// Initializing page
init();
