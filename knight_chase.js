// fundamental game logic

var placeMarker = function (player) {
  return function () {
    if ($(this).html() !== "") { return };
    if ($(this).attr("id") === lastPossibleMove(player)) { return };
    $(this).html("&#x2717");
    addToDeadList($(this).attr("id"))
    $(".square").unbind();
    if (possKnightMoves(knightIsAt(player)).length === 0) {
      declareWinner(capped(player) + " is blocked. BLACK WINS!");
      return;
    };
    knightToMove(other(player));
  };
};

var moveKnight = function (player) {
  return function () {
    var whichGreen = greenShade(player);
    $("." + whichGreen).addClass(squareColour(player));
    $("." + whichGreen).unbind();
    $("." + whichGreen).removeClass(whichGreen);
    if (anyMarkersLeft()) {
      $("#" + knightIsAt(player)).html("&#x2717");
      addToDeadList(knightIsAt(player));
    } else {
      $("#" + knightIsAt(player)).html("");
      addToEndOfGame();
    };
    $("#" + player + "_is_at").html($(this).attr("id"))
    $("#" + player + "_square_colour").html(squareColour(player));
    $(this).html(knightChar(player));
    if (knightIsAt("white") === knightIsAt("black")) {
      declareWinner("White has captured the black knight. WHITE WINS!");
      return;
    };
    if (noMovesLeft()) {
      declareWinner("Black has evaded capture. BLACK WINS!");
      return;
    };
    if (possKnightMoves(knightIsAt(player)).length === 0) {
      declareWinner(capped(player) + " is blocked. BLACK WINS!");
      return;
    };
    if (anyMarkersLeft()) {
      $("#status_message").text(capped(player) + " to place a marker...");
      updateMarkerCount();
      $(".square").click(placeMarker(player));
    } else {
      knightToMove(other(player));
    };
  };
};

var knightToMove = function (player) {
  $("#status_message").text(capped(player) + " to move...");
  if (anyMarkersLeft()) {
    updateMarkerCount();
  } else {
    updateEndOfGame();
  };
  var greenSquares = possKnightMoves(knightIsAt(player));
  if (greenSquares.length === 0) {
    declareWinner(capped(player) + " is blocked. BLACK WINS!");
    return;
  };
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass(greenShade(player));
    $("#" + square).click(moveKnight(player));
  };
};

// starting, ending, resetting the game

var initialiseBoard = function () {
  $(".square").each(function () { $(this).html("") });
  $("#a8").html(knightChar("black"));
  $("#h1").html(knightChar("white"));
  hideRules();
  $("#black_is_at").html("a8");
  $("#black_square_colour").html("white");
  $("#white_is_at").html("h1");
  $("#white_square_colour").html("white");
  $("#dead_squares").html("");
  $("#end_of_game").html("");
  $("#start_button").html("RESET GAME");
  $("#start_button").unbind();
  $("#start_button").click(resetGame);
  knightToMove("black");
};

var declareWinner = function (message) {
  $("#status_message").text(message);
  $("#start_button").html("START GAME");
  $("#start_button").unbind();
  $("#start_button").click(initialiseBoard);
};

var resetGame = function () {
  location.reload();
};

// status box management

var updateMarkerCount = function () {
  var message = $("#status_message").text() + " ";
  var marksLeft = 30 - $("#dead_squares").html().length/2;
  message += marksLeft.toString();
  message += (marksLeft === 1) ? " marker left." : " markers left.";
  $("#status_message").text(message);
};

var updateEndOfGame = function () {
  var message = $("#status_message").text() + " White has ";
  var movesLeft = Math.floor(10 - $("#end_of_game").html().length/2);
  message += movesLeft.toString();
  message += (movesLeft === 1) ? " move left." : " moves left.";
  $("#status_message").text(message);
};

var showRules = function() {
  $("#board").hide();
  $("#rules_button").text("HIDE RULES");
  $("#rules_button").unbind();
  $("#rules_button").click(hideRules);
  $("#rules").show();
}

var hideRules = function() {
  $("#rules").hide();
  $("#rules_button").text("SHOW RULES");
  $("#rules_button").unbind();
  $("#rules_button").click(showRules);
  $("#board").show();
}

// calculating possible knight moves

var possKnightMoves = function (string) {
  var xy = convertToCoords(string);
  var moves = [[2,1],[1,2],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  var outArray = [];
  var candidate = [];
  for (var i = 0; i < 8; i++) {
    candidate = [xy[0]+moves[i][0], xy[1]+moves[i][1]];
    if (isInRange(candidate) && notOnDeadList(candidate))
      { outArray.push(convertToSquareId(candidate)) }
  };
  return outArray;
};

var convertToCoords = function (string) {
  return [string.charCodeAt(0)-97, string.charCodeAt(1)-49];
};

var convertToSquareId = function (xy) {
  return String.fromCharCode(xy[0]+97, xy[1]+49);
};

var isInRange = function (xy) {
  return((xy[0] >= 0) && (xy[0] <= 7) && (xy[1] >= 0) && (xy[1] <= 7))
};

var lastPossibleMove = function (player) {
  var array = possKnightMoves(knightIsAt(other(player)));
  return (array.length === 1) ? array[0] : null;
}

var notOnDeadList = function (xy) {
  var deadList = $("#dead_squares").html();
  while (deadList.length > 0) {
    if (deadList.slice(0,2) === convertToSquareId(xy)) { return false }
    deadList = deadList.slice(2);
  }
  return true;
};

// miscellaneous helper functions

var addToDeadList = function (squareString) {
  $("#dead_squares").append(squareString);
};

var anyMarkersLeft = function () {
  return $("#dead_squares").html().length < 60;
};

var addToEndOfGame = function () {
  $("#end_of_game").append("X");
};

var noMovesLeft = function () {
  return $("#end_of_game").html().length === 19;
};

var knightIsAt = function (player) {
  return $("#" + player + "_is_at").html();
};

var greenShade = function (player) {
  return (squareColour(player) === "white") ? "lightgreen" : "green";
};

var squareColour = function (player) {
  return other($("#" + player + "_square_colour").html());
};

var knightChar = function (player) {
  return (player === "white") ? "&#9816;" : "&#9822;";
};

var capped = function (player) {
  return (player === "white") ? "White" : "Black";
};

var other = function (colour) {
  return (colour === "white") ? "black" : "white";
};

// initialise game controller

$(document).ready(function () {
  $("#start_button").click(initialiseBoard);
  $("#rules_button").click(showRules);
  $("#done_button").click(hideRules);
});
