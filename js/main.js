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

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
var currTime = audioCtx.currentTime;
const dot = 1.2 / 15; //length of one signal

var oscillator = audioCtx.createOscillator();
oscillator.frequency.value = 600;

var gainNode = audioCtx.createGain();
gainNode.gain.setValueAtTime(0, currTime);

// Setup Leap loop with frame callback function
var controllerOptions = { enableGestures: false };

// Store morse code peice (dot or dash) to be printed
var handIn = false;
var signal = ""; // such as - . /
var morse = ""; // morse code for each letter/number
var completeMorse = "";
var translation = ""; // complete translation of input

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
    completeMorse += signal;
    $(".code-reader__display").html(completeMorse);

    if (signal === "/" || signal === " ") {
      let translatedMorse = translate(morse);
      $(".code-translator__display").append(translatedMorse);

      translation += translatedMorse;
    } else {
      morse += signal;
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
    return morseGuide[morseCode];
  } else {
    return " ";
  }
}

/**
 * Function to read morse code with audio API
 *
 * gainNode.gain.setValueAtTime(volumn,duration) controls the volume
 * so, in each case, volumn controlled (turned on/off) to
 * create the signal sound
 */
function readMorse(completeMorseCode) {
  completeMorseCode.split("").forEach(function(letter) {
    switch (letter) {
      case ".":
        gainNode.gain.setValueAtTime(1, currTime);
        currTime += dot;
        gainNode.gain.setValueAtTime(0, currTime);
        currTime += dot;
        break;
      case "-":
        gainNode.gain.setValueAtTime(1, currTime);
        currTime += 3 * dot;
        gainNode.gain.setValueAtTime(0, currTime);
        currTime += dot;
        break;
      case " ":
        currTime += 3 * dot;
        break;
      case "/":
        currTime += 7 * dot;
        break;
    }
  });

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();

  return false;
}

/**
 * Read button event handler
 */
$("#readButton--morse").on("click", function() {
  readMorse(completeMorse);
});

$("#readButton--translation").on("click", function() {
  VoiceRSS.speech({
    key: voiceRSSKey,
    src: translation,
    hl: "en-us",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false
  });
});
