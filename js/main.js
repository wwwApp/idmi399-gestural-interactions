// Setup Leap loop with frame callback function
var controllerOptions = { enableGestures: true };

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

// Store morse code peice (dot or dash) to be printed
var handIn = false;
var morse = "";

// Store the duration of last hand in
// for translation/rendering
var lastHandIn = 0;

Leap.loop(controllerOptions, function(frame) {
  if (frame.hands.length > 0) {
    var dataString = "";
    $(".code-reader__status").addClass("active");

    handIn = true;

    // recongize dash and dot based on duration
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      // console.log(hand.timeVisible);

      // read the pattern
      if (hand.timeVisible > 1 && hand.grabStrength > 0.5) {
        morse = "-";
        $(".legend__status").removeClass("active");
        $(".legend--dash .legend__status").addClass("active");
      } else if (hand.timeVisible < 1 && hand.grabStrength > 0.5) {
        morse = ".";
        $(".legend__status").removeClass("active");
        $(".legend--dot .legend__status").addClass("active");
      } else if (hand.timeVisible > 1 && hand.grabStrength < 0.5) {
        // separate word
        morse = "/";
        $(".legend__status").removeClass("active");
        $(".legend--word .legend__status").addClass("active");
      } else if (hand.timeVisible < 1 && hand.grabStrength < 0.5) {
        // separate letter
        morse = " ";
        $(".legend__status").removeClass("active");
        $(".legend--letter .legend__status").addClass("active");
      }
    }

    // update data value displayed in the interface
    // dataString +=
    //   "Hand Grabbed: <span class='data-partial'>" + hand.grabStrength > 0
    //     ? "TRUE"
    //     : "FALSE" + "</span><br />";
    // dataString +=
    //   "Hand Visible Time: <span class='data-partial'>" +
    //   hand.timeVisible +
    //   "</span>";
  } else if (frame.hand.length > 0 && handIn) {
    // print your code when your hand is in AND out
    // and make sure toggle handIn to false for next input
    $(".code-reader__display").append(morse);
    handIn = false;
  } else {
    $(".code-reader__status").removeClass("active");
    $(".legend__status").removeClass("active");
  }
});
