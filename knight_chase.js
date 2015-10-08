var placeMarker = function (player) {
  return function () {
    if ($(this).html() !== "&nbsp;") { return };
    if ($(this).attr("id") === lastPossibleMove(player)) { return };
    $(this).html("&#x2717");
    addToDeadList($(this).attr("id"))
    $(".square").unbind();
    knightToMove(otherPlayer(player));
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
      $("#" + knightIsAt(player)).html("&nbsp;");
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
    if (anyMarkersLeft()) {
      $("#status_message").text(cappedPlayer(player) + " to place a marker...");
      updateMarkerCount();
      $(".square").click(placeMarker(player));
    } else {
      knightToMove(otherPlayer(player));
    };
  };
};

var knightToMove = function (player) {
  $("#status_message").text(cappedPlayer(player) + " to move...");
  if (anyMarkersLeft()) {
    updateMarkerCount();
  } else {
    updateEndOfGame();
  };
  var greenSquares = knightMoves(knightIsAt(player));
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
  cleanBoard();
  $("#" + knightIsAt("black")).html(knightChar("black"));
  $("#" + knightIsAt("white")).html(knightChar("white"));
  $("#start_button").hide();
  $("#markers_left").show();
  knightToMove("black");
};

var cleanBoard = function () {
  $(".square").each(function () {
    $(this).html("&nbsp;");
  });
  $("#black_is_at").html("a8");
  $("#black_square_colour").html("white");
  $("#white_is_at").html("h1");
  $("#white_square_colour").html("white");
  $("#dead_squares").html("");
  $("#end_of_game").html("");
};

var declareWinner = function (winner) {
  if (winner === "black") {
    $("#status_message").text("Black has evaded capture. BLACK WINS!");
  } else {
    $("#status_message").text("White has captured the black knight. WHITE WINS!");
  };
  $("#start_button").show();
  $("#markers_left").hide();
};

// helper functions

var updateMarkerCount = function () {
  $("#markers_left").text((30 - $("#dead_squares").html().length/2) + " markers left");
};

var updateEndOfGame = function () {
  $("#markers_left").text(Math.floor(10 - $("#end_of_game").html().length/2) + " moves left");
};

var anyMarkersLeft = function () {
  return $("#dead_squares").html().length < 10;
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
  var array = knightMoves(knightIsAt(otherPlayer(player)));
  if (array.length === 1) {
    return array[0];
  }
  return null;
}

var knightIsAt = function (colour) {
  return $("#" + colour + "_is_at").html();
};

var squareColour = function (player) {
  return otherPlayer($("#" + player + "_square_colour").html());
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

var cappedPlayer = function (player) {
  return (player === "white") ? "White" : "Black";
}

var otherPlayer = function (player) {
  return (player === "white") ? "black" : "white";
}

$("#start_button").click(initializeBoard);
