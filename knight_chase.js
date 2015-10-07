var moveBlackKnight = function() {
  $(this).html("&#9822;");
  $("." + greenShade(blackSquareColour())).addClass(otherColour(blackSquareColour()));
  $("." + greenShade(blackSquareColour())).unbind();
  $("." + greenShade(blackSquareColour())).removeClass(greenShade(blackSquareColour()));
  $("#" + blackIsAt()).html("&#x2717");
  $("#black_is_at").html($(this)[0].id);
  $("#black_square_colour").html(otherColour(blackSquareColour()));
  whiteToMove();
};

var moveWhiteKnight = function() {
  $(this).html("&#9816;");
  $("." + greenShade(whiteSquareColour())).addClass(otherColour(whiteSquareColour()));
  $("." + greenShade(whiteSquareColour())).unbind();
  $("." + greenShade(whiteSquareColour())).removeClass(greenShade(whiteSquareColour()));
  $("#" + whiteIsAt()).html("&#x2717");
  $("#white_is_at").html($(this)[0].id)
  $("#white_square_colour").html(otherColour(whiteSquareColour()));
  blackToMove();
};

var blackToMove = function () {
  $("#status_message").text("Black to move...");
  $("#start_button").hide();
  var greenSquares = knightMoves(blackIsAt());
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass(greenShade(blackSquareColour()));
    $("#" + square).click(moveBlackKnight);
  };
};

var whiteToMove = function () {
  $("#status_message").text("White to move...");
  $("#start_button").hide();
  var greenSquares = knightMoves(whiteIsAt());
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass(greenShade(whiteSquareColour()));
    $("#" + square).click(moveWhiteKnight);
  };
};

var initializeBoard = function () {
  $("#" + blackIsAt()).html("&#9822;");
  $("#" + whiteIsAt()).html("&#9816;");
  blackToMove();
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

var knightMoves = function(string) {
  var array = convertToCoords(string);
  var moves = [[2,1],[1,2],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  var outArray = [];
  var candidate = [];
  for (var i = 0; i < 8; i++) {
    candidate = [array[0]+moves[i][0], array[1]+moves[i][1]];
    if (isInRange(candidate)) { outArray.push(convertToSquareId(candidate)) }
  };
  return outArray;
};

var blackIsAt = function() {
  return $("#black_is_at").html();
};

var blackSquareColour = function() {
  return $("#black_square_colour").html();
};

var whiteIsAt = function() {
  return $("#white_is_at").html();
};

var whiteSquareColour = function() {
  return $("#white_square_colour").html();
};

var otherColour = function(colour) {
  return colour === "white" ? "black" : "white";
}

var greenShade = function(colour) {
  return colour === "black" ? "lightgreen" : "green";
}

$("#start_button").click(initializeBoard);
