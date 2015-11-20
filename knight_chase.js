// fundamental game logic

var placeMarker = function (player) {
  return function () {
    if ($(this).text() !== "") { return };
    if ($(this).attr("id") === lastPossibleMove(player)) { return };
    $(this).html("&#x2717");
    addToDeadList($(this).attr("id"))
    $(".square").unbind();
    if (knightIsBlocked(player)) {
      declareWinner(capped(player) + " is blocked. BLACK WINS!");
      return;
    };
    knightToMove(other(player));
  };
};

var moveKnight = function (player) {
  return function () {
    var greenClass = "." + greenShade(player);
    $(greenClass).addClass(squareColour(player));
    $(greenClass).unbind();
    $(greenClass).removeClass(greenShade(player));
    if (anyMarkersLeft()) {
      $("#" + knightIsAt(player)).html("&#x2717");
      addToDeadList(knightIsAt(player));
    } else {
      $("#" + knightIsAt(player)).text("");
      addToEndOfGame();
    };
    $("#" + player + "_is_at").text($(this).attr("id"))
    $("#" + player + "_square_colour").text(squareColour(player));
    $(this).html(knightChar(player));
    if (whiteCapturesBlack()) {
      declareWinner("White has captured the black knight. WHITE WINS!");
      return;
    };
    if (noMovesLeft()) {
      declareWinner("Black has evaded capture. BLACK WINS!");
      return;
    };
    if (knightIsBlocked(player)) {
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
  if (knightIsBlocked(player)) {
    declareWinner(capped(player) + " is blocked. BLACK WINS!");
    return;
  };
  var greenSquares = possKnightMoves(knightIsAt(player));
  while (greenSquares.length > 0) {
    var square = "#" + greenSquares.pop();
    $(square).removeClass("white");
    $(square).removeClass("black");
    $(square).addClass(greenShade(player));
    $(square).click(moveKnight(player));
  };
};

// starting, ending, resetting the game

var initialiseBoard = function () {
  $(".square").each(function () { $(this).text("") });
  $("#a8").html(knightChar("black"));
  $("#h1").html(knightChar("white"));
  hideRules();
  $("#black_is_at").text("a8");
  $("#black_square_colour").text("white");
  $("#white_is_at").text("h1");
  $("#white_square_colour").text("white");
  $("#dead_squares").text("");
  $("#end_of_game").text("");
  $("#start_button").text("RESET GAME");
  $("#start_button").unbind();
  $("#start_button").click(resetGame);
  knightToMove("black");
};

var declareWinner = function (message) {
  $("#status_message").text(message);
  $("#start_button").text("START GAME");
  $("#start_button").unbind();
  $("#start_button").click(initialiseBoard);
};

var resetGame = function () {
  location.reload();
};

// status box management

var updateMarkerCount = function () {
  var marksLeft = 30 - $("#dead_squares").text().length/2;
  var message = " " + marksLeft.toString();
  message += (marksLeft === 1) ? " marker left." : " markers left.";
  $("#status_message").append(message);
};

var updateEndOfGame = function () {
  var movesLeft = Math.floor(10 - $("#end_of_game").text().length/2);
  var message = " White has " + movesLeft.toString();
  message += (movesLeft === 1) ? " move left." : " moves left.";
  $("#status_message").append(message);
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
  var deadList = $("#dead_squares").text();
  while (deadList.length > 0) {
    if (deadList.slice(0,2) === convertToSquareId(xy)) { return false }
    deadList = deadList.slice(2);
  }
  return true;
};

// miscellaneous helper functions

var knightIsBlocked = function (player) {
  return (possKnightMoves(knightIsAt(player)).length === 0);
};

var whiteCapturesBlack = function () {
  return (knightIsAt("white") === knightIsAt("black"));
}

var addToDeadList = function (squareString) {
  $("#dead_squares").append(squareString);
};

var anyMarkersLeft = function () {
  return $("#dead_squares").text().length < 60;
};

var addToEndOfGame = function () {
  $("#end_of_game").append("X");
};

var noMovesLeft = function () {
  return $("#end_of_game").text().length === 19;
};

var knightIsAt = function (player) {
  return $("#" + player + "_is_at").text();
};

var greenShade = function (player) {
  return (squareColour(player) === "white") ? "lightgreen" : "green";
};

var squareColour = function (player) {
  return other($("#" + player + "_square_colour").text());
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
