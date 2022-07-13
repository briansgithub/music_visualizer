/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversions_constants_helper_funcs.js" />
"use strict";

/* 
pc := pitch class
https://p5js.org/reference/#/p5/colorMode 
By default, max HSB values are colorMode(HSB, 360, 100, 100, 1).*/

let maxHueValue = 300;
let coloringTable = [];

function HSBObj(hue = 0, saturation = 100, brightness = 100, alpha = 1) {
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

        let HSBObj_color = applyColorScheme(relativeInterval);

        coloringTable.push(HSBObj_color);
    }
}

function updateColors() {

    for (let pitchClass = 0; pitchClass < 12; pitchClass++) {
        
        let relativeInterval = mod(pitchClass - globalKeySigRoot, 12);
        let HSBObj_color = applyColorScheme(relativeInterval);
        let brightness = HSBObj_color.brightness;

        /*
        console.log("Checked?: " + checkbox_dimAccidentals.checked());
        console.log("Relative interval: " + relativeInterval);
        console.log("Accidental?: " + accidentalIntervals.includes(relativeInterval));
        */

        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(relativeInterval)) {
            brightness = 20;
        }

        coloringTable[pitchClass].hue = HSBObj_color.hue;
        coloringTable[pitchClass].saturation = HSBObj_color.saturation;
        coloringTable[pitchClass].brightness = brightness;
        coloringTable[pitchClass].alpha = HSBObj_color.alpha;
    }

}

function colorByLinearChromatic(note) {
    
    return new HSBObj((maxHueValue / 12) * note); //HSB(0,100,100,1) is red. 
}

function colorByConsonanceOrder(note) {
    let noteSortedIndex = intervalsOrderedByConsonance[note];
    return new HSBObj((maxHueValue / 12) * noteSortedIndex);
}

function colorByCircleOfFifths(relativeInterval) {

    //hardcode the sharps and flats in circle of fifths instead of solving linear congruence
    //indexed by pitch class
    let hardcodedCOFAccidentals = [0, -5, 2, -3, 4, -1, -6, 1, -4, 3, -2, 5];
    let currentAccidentals = hardcodedCOFAccidentals[0];
    let targetAccidentals = hardcodedCOFAccidentals[relativeInterval];
    let red = 0
    let blue = 240;
    let magenta = 300;
    let returnHue;
    let returnSaturation = 100;
    let returnBrightness = 100; 

    const cmpVal = mod(targetAccidentals-currentAccidentals,12);
    if(cmpVal == 0 ){
        returnHue = red;
        returnSaturation = 0;
    } else if (cmpVal > 6) {
        returnHue = red;
        returnSaturation = abs(100*((cmpVal-6)/5));
    } else if (cmpVal < 6) {
        returnHue = blue;
        returnSaturation = abs(100*(cmpVal/5));

    } else {
        returnHue = magenta; 
        returnSaturation = 100;
    }
    
    /*
    returnBrightness = 100-returnSaturation;
    returnSaturation = 0;
    */

    let HSBObj_returncolor = new HSBObj();
    HSBObj_returncolor.hue = returnHue;
    HSBObj_returncolor.saturation = returnSaturation;
    HSBObj_returncolor.brightness = returnBrightness;

    return HSBObj_returncolor;
}

function applyColorScheme(relativeInterval) {
    let HSBObj_returnColor;

    switch (radio_colorScheme.value()) {
        case "linearChromatic":
            HSBObj_returnColor = colorByLinearChromatic(relativeInterval);
            break;
        case "consonanceOrder":
            HSBObj_returnColor = colorByConsonanceOrder(relativeInterval);
            break;
        case "circleOfFifths":
            HSBObj_returnColor = colorByCircleOfFifths(relativeInterval);
            break;
        default:
            HSBObj_returnColor = 0;
    }

    return HSBObj_returnColor;
}