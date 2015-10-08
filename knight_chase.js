var placeCounter = function (player) {
  var myFunction = function () {
    if ($(this).html() !== "&nbsp;") { return };
    if ($(this)[0].id === lastPossibleMove(player)) { return };
    $(this).html("&#x2717");
    addToDeadList($(this)[0].id)
    $(".square").unbind();
    if (player === "white") {
      knightToMove("black");
    } else {
      knightToMove("white");
    };
  };
  return myFunction;
};

var moveKnight = function (player) {
  var myFunction = function () {
    var whichGreen = greenShade(squareColour(player));
    $("." + whichGreen).addClass(squareColour(player));
    $("." + whichGreen).unbind();
    $("." + whichGreen).removeClass(whichGreen);
    $("#" + knightIsAt(player)).html("&#x2717");
    addToDeadList(knightIsAt(player));
    $("#" + player + "_is_at").html($(this)[0].id)
    $("#" + player + "_square_colour").html(squareColour(player));
    if (player === "white") {
      $(this).html("&#9816;");
    } else {
      $(this).html("&#9822;");
    };
    var cappedPlayer = (player === "white") ? "White" : "Black";
    $("#status_message").text(cappedPlayer + " to place a counter...");
    $(".square").click(placeCounter(player));
  };
  return myFunction;
};

var knightToMove = function (player) {
  var cappedPlayer = (player === "white") ? "White" : "Black";
  $("#status_message").text(cappedPlayer + " to move...");
  $("#start_button").hide();
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
  $("#" + knightIsAt("black")).html("&#9822;");
  $("#" + knightIsAt("white")).html("&#9816;");
  knightToMove("black");
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
  var array = knightMoves(knightIsAt(player === "white" ? "black" : "white"));
  if (array.length === 1) {
    return array[0];
  }
  return null;
}

var knightIsAt = function (colour) {
  return $("#" + colour + "_is_at").html();
};

var squareColour = function (player) {
  return $("#" + player + "_square_colour").html() === "white" ? "black" : "white";
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
  console.log(squareString);
  squareString = $("#dead_squares").html() + squareString;
  console.log(squareString);
  $("#dead_squares").html(squareString);
}

$("#start_button").click(initializeBoard);
