var placeMarker = function (player) {
  return function () {
    if ($(this).html() !== "") { return };
    if ($(this).attr("id") === lastPossibleMove(player)) { return };
    $(this).html("&#x2717");
    addToDeadList($(this).attr("id"))
    $(".square").unbind();
    if (knightMoves(knightIsAt(player)).length === 0) {
      declareWinner("stalemate " + player);
      return;
    };
    knightToMove(other(player));
  };
};

var moveKnight = function (player) {
  return function () {
    var whichGreen = greenShade(squareColour(player));
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
      declareWinner("white");
      return;
    };
    if (noMovesLeft()) {
      declareWinner("black");
      return;
    };
    if (knightMoves(knightIsAt(player)).length === 0) {
      declareWinner("stalemate " + player);
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
  var greenSquares = knightMoves(knightIsAt(player));
  if (greenSquares.length === 0) {
    declareWinner("stalemate " + player);
    return;
  };
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass(greenShade(squareColour(player)));
    $("#" + square).click(moveKnight(player));
  };
};

var initializeBoard = function () {
  $(".square").each(function () { $(this).html("") });
  $("#a8").html(knightChar("black"));
  $("#h1").html(knightChar("white"));
  $("#black_is_at").html("a8");
  $("#black_square_colour").html("white");
  $("#white_is_at").html("h1");
  $("#white_square_colour").html("white");
  $("#dead_squares").html("");
  $("#end_of_game").html("");
  $("#start_button").hide();
  $("#markers_left").show();
  knightToMove("black");
};

var declareWinner = function (winner) {
  if (winner === "black") {
    $("#status_message").text("Black has evaded capture. BLACK WINS!");
  };
  if (winner === "white"){
    $("#status_message").text("White has captured the black knight. WHITE WINS!");
  };
  if (winner[0] === 's') {
    var player = capped(winner.slice(10))
    $("#status_message").text(player + " is blocked. BLACK WINS!");
  };
  $("#start_button").show();
  $("#markers_left").hide();
};

// helper functions

var updateMarkerCount = function () {
  $("#markers_left").text((30 - $("#dead_squares").html().length/2) + " markers left");
};

var updateEndOfGame = function () {
  $("#markers_left").text("White has " + Math.floor(10 - $("#end_of_game").html().length/2) + " moves left");
};

var anyMarkersLeft = function () {
  return $("#dead_squares").html().length < 60;
};

var noMovesLeft = function () {
  return $("#end_of_game").html().length === 19;
};

var convertToCoords = function (string) {
  return [string.charCodeAt(0)-97, string.charCodeAt(1)-49];
};

var convertToSquareId = function (array) {
  return String.fromCharCode(array[0]+97, array[1]+49);
};

var isInRange = function (array) {
  return((array[0] >= 0) && (array[0] <= 7) && (array[1] >= 0) && (array[1] <= 7))
};

var knightMoves = function (string) {
  var array = convertToCoords(string);
  var moves = [[2,1],[1,2],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  var outArray = [];
  var candidate = [];
  for (var i = 0; i < 8; i++) {
    candidate = [array[0]+moves[i][0], array[1]+moves[i][1]];
    if (isInRange(candidate) && notOnDeadList(candidate))
      { outArray.push(convertToSquareId(candidate)) }
  };
  return outArray;
};

var lastPossibleMove = function (player) {
  var array = knightMoves(knightIsAt(other(player)));
  if (array.length === 1) {
    return array[0];
  }
  return null;
}

var knightIsAt = function (colour) {
  return $("#" + colour + "_is_at").html();
};

var squareColour = function (player) {
  return other($("#" + player + "_square_colour").html());
}

var greenShade = function (colour) {
  return colour === "white" ? "lightgreen" : "green";
}

var notOnDeadList = function (coords) {
  var deadList = $("#dead_squares").html();
  while (deadList.length > 0) {
    if (deadList.slice(0,2) === convertToSquareId(coords)) {
      return false;
    };
    deadList = deadList.slice(2);
  }
  return true;
}

var addToDeadList = function (squareString) {
  squareString = $("#dead_squares").html() + squareString;
  $("#dead_squares").html(squareString);
}

var addToEndOfGame = function () {
  $("#end_of_game").html($("#end_of_game").html() + "X");
}

var knightChar = function (player) {
  return (player === "white") ? "&#9816;" : "&#9822;";
}

var capped = function (player) {
  return (player === "white") ? "White" : "Black";
}

var other = function (player) {
  return (player === "white") ? "black" : "white";
}

$(document).ready(function () {
  $("#start_button").click(initializeBoard);
});
