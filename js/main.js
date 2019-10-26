const morseGuide = {
  ".-": "a",
  "-...": "b",
  "-.-.": "c",
  "-..": "d",
  ".": "e",
  "..-.": "f",
  "--.": "g",
  "....": "h",
  "..": "i",
  ".---": "j",
  "-.-": "k",
  ".-..": "l",
  "--": "m",
  "-.": "n",
  "---": "o",
  ".--.": "p",
  "--.-": "q",
  ".-.": "r",
  "...": "s",
  "-": "t",
  "..-": "u",
  "...-": "v",
  ".--": "w",
  "-..-": "x",
  "-.--": "y",
  "--..": "z",
  ".----": "1",
  "..---": "2",
  "...--": "3",
  "....-": "4",
  ".....": "5",
  "-....": "6",
  "--...": "7",
  "---..": "8",
  "----.": "9",
  "-----": "0"
};

// Setup Leap loop with frame callback function
var controllerOptions = { enableGestures: false };

// Store morse code peice (dot or dash) to be printed
var handIn = false;
var signal = ""; // such as - . /
var morse = ""; // morse code for each letter/number
var translation = ""; // complete translation of input

// Store the duration of last hand in
// for translation/rendering
var lastHandIn = 0;

/**
 * Leap Loop to process data
 */
Leap.loop(controllerOptions, function(frame) {
  if (frame.hands.length > 0) {
    var dataString = "";
    $(".code-reader__status").addClass("active");

    handIn = true;

    // recongize dash and dot based on duration
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];

      // read the pattern
      if (hand.timeVisible > 1 && hand.grabStrength > 0.5) {
        signal = "-";
        $(".legend__status").removeClass("active");
        $(".legend--dash .legend__status").addClass("active");
      } else if (hand.timeVisible < 1 && hand.grabStrength > 0.5) {
        signal = ".";
        $(".legend__status").removeClass("active");
        $(".legend--dot .legend__status").addClass("active");
      } else if (hand.timeVisible > 1 && hand.grabStrength < 0.5) {
        // separate word
        signal = "/";
        $(".legend__status").removeClass("active");
        $(".legend--word .legend__status").addClass("active");
      } else if (hand.timeVisible < 1 && hand.grabStrength < 0.5) {
        // separate letter
        signal = " ";
        $(".legend__status").removeClass("active");
        $(".legend--letter .legend__status").addClass("active");
      }
    }
  } else if (frame.hand.length > 0 && handIn) {
    // print your code when your hand is in AND out
    // and make sure toggle handIn to false for next input
    $(".code-reader__display").append(signal);
    morse += signal;

    if (signal === "/" || signal === " ") {
      let translatedMorse = translate(morse);
      $(".code-translator__display").append(translatedMorse);

      translation += translatedMorse;
    }

    handIn = false;
  } else {
    $(".code-reader__status").removeClass("active");
    $(".legend__status").removeClass("active");
  }
});

/**
 * Function to translate morse code
 */
function translate(morseCode) {
  // reset current morse piece for next letter
  morse = "";

  // if input is '/', simply add space to separate translated words
  // otherwise, translate
  if (morseCode != "/") {
    // make sure to remove ' ' at the end for translation
    let processedMorseCode = morseCode.slice(0, -1);
    return morseGuide[processedMorseCode];
  } else {
    return " ";
  }
}

$("#readButton").on("click", function() {
  VoiceRSS.speech({
    key: "b712c895b8fa4d2baedbdca044d05f6c",
    src: translation,
    hl: "en-us",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false
  });
});
