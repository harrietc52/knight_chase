console.log("JS loaded");

var initializeBoard = function () {
  $("#a8").html("&#9822;");
  $("#h1").html("&#9816;");
  console.log("hello");
};

$("#start_button").click(initializeBoard);
