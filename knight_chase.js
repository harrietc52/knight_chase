var moveKnight = function(player) {
  var myFunction = function() {
    $("." + greenShade(squareColour(player))).addClass(squareColour(player));
    $("." + greenShade(squareColour(player))).unbind();
    $("." + greenShade(squareColour(player))).removeClass(greenShade(squareColour(player)));
    $("#" + isAt(player)).html("&#x2717");
    $("#" + player + "_is_at").html($(this)[0].id)
    $("#" + player + "_square_colour").html(squareColour(player));
    if (player === "white") {
      $(this).html("&#9816;");
      console.log("help")
      knightToMove("black");
    } else {
      $(this).html("&#9822;");
      knightToMove("white");
    };
  };
  return myFunction;
};

var knightToMove = function (player) {
  $("#status_message").text(player + " to move...");
  $("#start_button").hide();
  var greenSquares = knightMoves(isAt(player));
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
  $("#" + isAt("black")).html("&#9822;");
  $("#" + isAt("white")).html("&#9816;");
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

var isAt = function(colour) {
  return $("#" + colour + "_is_at").html();
};

var squareColour = function(player) {
  return $("#" + player + "_square_colour").html()  === "white" ? "black" : "white";
}

var greenShade = function(colour) {
  return colour === "white" ? "lightgreen" : "green";
}

$("#start_button").click(initializeBoard);

// if (player === "white") {
//   $(this).html("&#9816;");
//   console.log("white knight")
// } else {
//   $(this).html("&#9822;");
// };

// var moveBlackKnight = function() {
//   $(this).html("&#9822;");
//   $("." + greenShade(squareColour(colour))).addClass(otherColour(squareColour(colour)));
//   $("." + greenShade(squareColour(colour))).unbind();
//   $("." + greenShade(squareColour(colour))).removeClass(greenShade(squareColour(colour)));
//   $("#" + isAt("black")).html("&#x2717");
//   $("#black_is_at").html($(this)[0].id);
//   $("#black_square_colour").html(otherColour(squareColour(colour)));
//   whiteToMove();
// };
//
// var moveWhiteKnight = function() {
//   $(this).html("&#9816;");
//   $("." + greenShade(squareColour(colour))).addClass(otherColour(squareColour(colour)));
//   $("." + greenShade(squareColour(colour))).unbind();
//   $("." + greenShade(squareColour(colour))).removeClass(greenShade(squareColour(colour)));
//   $("#" + isAt("white")).html("&#x2717");
//   $("#white_is_at").html($(this)[0].id)
//   $("#white_square_colour").html(otherColour(squareColour(colour)));
//   blackToMove();
// };

// var blackToMove = function () {
//   $("#status_message").text("Black to move...");
//   $("#start_button").hide();
//   var greenSquares = knightMoves(isAt("black"));
//   var square;
//   while (greenSquares.length > 0) {
//     square = greenSquares.pop();
//     $("#" + square).removeClass("white");
//     $("#" + square).removeClass("black");
//     $("#" + square).addClass(greenShade(squareColour("black")));
//     $("#" + square).click(moveKnight("black"));
//   };
// };
//
// var whiteToMove = function () {
//   $("#status_message").text("White to move...");
//   $("#start_button").hide();
//   var greenSquares = knightMoves(isAt("white"));
//   var square;
//   while (greenSquares.length > 0) {
//     square = greenSquares.pop();
//     $("#" + square).removeClass("white");
//     $("#" + square).removeClass("black");
//     $("#" + square).addClass(greenShade(squareColour("white")));
//     $("#" + square).click(moveKnight("white"));
//   };
// };

// var blackIsAt = function() {
//   return $("#black_is_at").html();
// };

// var blackSquareColour = function() {
//   return $("#black_square_colour").html();
// };
//
// var whiteIsAt = function() {
//   return $("#white_is_at").html();
// };

// var whiteSquareColour = function() {
//   return $("#white_square_colour").html();
// };

// var otherColour = function(colour) {
//   return colour === "white" ? "black" : "white";
// }
