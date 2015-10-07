console.log("JS loaded");

var initializeBoard = function () {
  $("#a8").html("&#9822;");
  $("#h1").html("&#9816;");
};

$("#start_button").click(initializeBoard);

var convertToCoords = function (string) {
  return [string.charCodeAt(0)-97, string.charCodeAt(1)-49];
};

var convertToSquareId = function (array) {
  return String.fromCharCode(array[0]+97, array[1]+49);
};

var knightsMoves = function(string) {
  var array = convertToCoords(string);
  var moves = [[2,1],[1,2],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  var outArray = []

  for (var i = 0; i < 8; i++) {
    outArray.push ([array[0]+moves[i][0], array[1]+moves[i][1] ] );
  };
  return outArray;
};

console.log(knightsMoves("g2"));
