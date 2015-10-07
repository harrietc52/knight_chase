var moveBlackKnight = function() {
  $(this).html("&#9822;");
  $(".green").addClass("black");
  $(".green").removeClass("green");
  $("#a8").html("&#x2717");
  whiteToMove();
};

var moveWhiteKnight = function() {
  $(this).html("&#9816;");
  $(".green").addClass("black");
  $(".green").removeClass("green");
  $("#h1").html("&#x2717");
  blackToMove();
};

var blackToMove = function () {
  $("#status_message").text("Black to move...");
  $("#start_button").hide();
  var blackStartsAt = "a8";
  var greenSquares = knightMoves(blackStartsAt);
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass("green");
    $("#" + square).click(moveBlackKnight);
  };
};

var whiteToMove = function () {
  $("#status_message").text("White to move...");
  $("#start_button").hide();
  var whiteStartsAt = "h1";
  var greenSquares = knightMoves(whiteStartsAt);
  var square;
  while (greenSquares.length > 0) {
    square = greenSquares.pop();
    $("#" + square).removeClass("white");
    $("#" + square).removeClass("black");
    $("#" + square).addClass("green");
    $("#" + square).click(moveWhiteKnight);
  };
};

var initializeBoard = function () {
  $("#a8").html("&#9822;");
  $("#h1").html("&#9816;");
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

$("#start_button").click(initializeBoard);
