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
    document.querySelector(".code-reader__status").classList.add("active");

    handIn = true;

    // recongize dash and dot based on duration
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      // console.log(hand.timeVisible);

      // read the pattern
      if (hand.timeVisible > 0.5 && hand.grabStrength > 0) {
        morse = "-";
      } else if (hand.timeVisible < 0.5 && hand.grabStrength > 0) {
        morse = ".";
      } else if (hand.timeVisible > 0.5 && hand.grabStrength == 0) {
        // separate word
        morse = "/";
      } else if (hand.timeVisible < 0.5 && hand.grabStrength == 0) {
        // separate letter
        morse = " ";
      }
    }
  } else if (frame.hand.length > 0 && handIn) {
    // print your code when your hand is in AND out
    // and make sure toggle handIn to false for next input
    document.querySelector(".code-reader__display").innerHTML += morse;
    handIn = false;
  } else {
    document.querySelector(".code-reader__status").classList.remove("active");
  }
});
