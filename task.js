$(document).ready(function() {

  function GameDrawer() {
    var startOffsetX = 33;
    var startOffsetY = 130;
    var stepLength = 35.6;
    var radiusStepY = 6;
    var textBoxShiftX = -10;
    var textBoxShiftY = -22;
    var elementIdIndex = 0;

    var generateArcString = function(startX, startY, xr, yr, xrot, lArcFlag, sweepFlag, x, y) {
      return "M" + startX + " " + startY + " " + "a" + xr + "," + yr + " " + xrot + " " + lArcFlag + " " + sweepFlag  + " " + x + " " + y;
    }.bind(this);

    this.drawArc = function(x1, x2) {
      var offset = x1 * stepLength;
      var endPoint = (x2 - x1) * stepLength;
      var xr = endPoint / 2;
      var yr = radiusStepY * (x2 - x1);

      var str = generateArcString(startOffsetX + offset, startOffsetY, xr, yr, 0, 0, 1, endPoint, 0);

      draw.path(str).attr({ stroke: "red", fill: "none", width: 3 });
    };

    var calcTextboxTopLeft = function(x1, x2) {
      var offset = x1 * stepLength;
      var x = startOffsetX + offset + (x2 - x1) * stepLength / 2 + textBoxShiftX;
      var y = startOffsetY - radiusStepY * (x2 - x1) + textBoxShiftY;
      return { x: x, y: y };
    }.bind(this);

    var applyStyle = function(el, coord) {
      $(el)
        .css("position", "absolute")
        .css("top", coord.y)
        .css("left", coord.x)
        .css("width", "20")
        .css("text-align", "center");

    }.bind(this);

    this.placeElementAboveArc = function(x1, x2, type, number) {
      var coord = calcTextboxTopLeft(x1, x2);
      var container = $("#drawing");

      if (type == "input") {
        container.append("<input type='text' id='el" + elementIdIndex + "' />");
      } else {
        container.append("<span id='el" + elementIdIndex + "'>" + number + "</span>");
      }

      var el = $("#el" + elementIdIndex);
      applyStyle(el, coord);
      elementIdIndex++;

      return el;
    };

    this.drawProblem = function(left, right, result) {
      var container = $("#drawing");
      container.append("<div id='problem' style='font-size: 18px'>" + 
          "<span id='left'>" + left + "</span> + <span id='right'>" + right + "</span>" + 
          " = <span id='result'>?</span></div>");
      var tb = $("#problem");
      $(tb)
        .css("position", "absolute")
        .css("top", 20)
        .css("left", 360)
    };
  };

  function Game() {
    var MIN_A = 6;
    var MAX_A = 9;
    var MIN_RESULT = 11;
    var MAX_RESULT = 14;

    this.drawer = new GameDrawer();
    var container = $("#drawing");
    var gameParams;
    var self = this;

    var create = function() {
      var a = Math.floor(Math.random() * (MAX_A - MIN_A + 1)) + MIN_A; 
      var result = Math.floor(Math.random() * (MAX_RESULT - MIN_RESULT + 1)) + MIN_RESULT; 
      var b = result - a;

      gameParams = {a: a, b: b, result: result};
    };

    this.start = function() {
      step1();
    };

    var setTextboxHandler = function(tb, segment, number, taskElement, successCallback) {
      tb.change(function() {
        var val = $(this).val();
        if (+val === number) {
          var tb = self.drawer.placeElementAboveArc(segment.x1, segment.x2, "label", number);
          taskElement.css("background", "white");
          $(this).remove();
          successCallback();
        } else {
          $(this).css("color", "red");
          taskElement.css("background", "orange");
        }
      });
    }.bind(this);

    var step1 = function() {
      create();
      this.drawer.drawProblem(gameParams.a, gameParams.b, 0);
      this.drawer.drawArc(0, gameParams.a);
      var tb = this.drawer.placeElementAboveArc(0, gameParams.a, "input");
      setTextboxHandler(tb, {x1: 0, x2: gameParams.a}, gameParams.a, $("#left"), step2);
    }.bind(this);

    var step2 = function() {
      this.drawer.drawArc(gameParams.a, gameParams.result);
      var tb = this.drawer.placeElementAboveArc(gameParams.a, gameParams.result, "input");
      setTextboxHandler(tb, {x1: gameParams.a, x2: gameParams.result}, gameParams.b, $("#right"), step3);
    }.bind(this);

    var step3 = function() {
      var html = "<input id='resultTb' type='text' style='width: 30px;' />";
      $("#result").html(html);
      $("#resultTb").change(function() {
        var val = $(this).val();
        
        if (+val === gameParams.result) {
          $("#result").html(+gameParams.result);
        } else {
          $("#resultTb").css("color", "red");
        }
      });
    };
  };

  var draw = SVG("drawing").size(800, 300);;

  var img = draw.image("sprite.png");
  img.size(800, 300);

  var game = new Game();
  game.start();
});
