/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
"use strict";

/* 
pc := pitch class
https://p5js.org/reference/#/p5/colorMode 
By default, max HSB values are colorMode(HSB, 360, 100, 100, 1).*/

let maxHueValue = 300;
let coloringTable = [];

function HSBObj(hue, saturation, brightness, alpha = 255) {
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.alpha = alpha;
}

/* 0 thru 11 always represent integer notation of C thru B.
The color of the pitch class is changed based on the global Key Sig.
*/
function initColorTable(){
    for(let pitchClass = 0; pitchClass < 12; pitchClass++) {
        let relativeInterval = mod(pitchClass - globalKeySigRoot, 12);
        let hue = applyColorScheme(relativeInterval);

        coloringTable.push(new HSBObj(hue,100,100,1));
    }
}

function updateColors() {

    for (let pitchClass = 0; pitchClass < 12; pitchClass++) {
        
        let relativeInterval = mod(pitchClass - globalKeySigRoot, 12);
        let hue = applyColorScheme(relativeInterval);
        let saturation = 100;
        let brightness = 100;
        let alpha = 1;

        /*
        console.log("Checked?: " + checkbox_dimAccidentals.checked());
        console.log("Relative interval: " + relativeInterval);
        console.log("Accidental?: " + accidentalIntervals.includes(relativeInterval));
        */

        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(relativeInterval)) {
            brightness = 20;
        }

        coloringTable[pitchClass].hue = hue;
        coloringTable[pitchClass].saturation = saturation;
        coloringTable[pitchClass].brightness = brightness;
        coloringTable[pitchClass].alpha = alpha;
    }

}

function colorByLinearChromatic(note) {
    return (maxHueValue / 12) * note; //HSB(0,100,100,1) is red. 
}

function colorByConsonanceOrder(note) {
    let noteSortedIndex = intervalsOrderedByConsonance[note];
    return (maxHueValue / 12) * noteSortedIndex;
}

function colorByCircleOfFifths(note) {
    return maxHueValue;
}

function applyColorScheme(relativeInterval) {
    let returnHue;

    switch (radio_colorScheme.value()) {
        case "linearChromatic":
            returnHue = colorByLinearChromatic(relativeInterval);
            break;
        case "circleOfFifths":
            returnHue = colorByCircleOfFifths(relativeInterval);
            break;
        case "consonanceOrder":
            returnHue = colorByConsonanceOrder(relativeInterval);
            break;
        default:
            returnHue = 0;
    }

    return returnHue;
}