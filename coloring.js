/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
"use strict";
//HSB Defaults: colorMode(HSB, hue=360, saturation=100, brightness=100, alpha=1)
let maxHSBValue = 300;

function colorByLinearChromatic(note) {
    return (maxHSBValue / 12) * note; //HSB(0,100,100,1) is red. 
}

function colorByConsonanceOrder(note) {
    let noteSortedIndex = intervalsOrderedByConsonance[note];
    return (maxHSBValue / 12) * noteSortedIndex;
}

function colorByCircleOfFifths(note) {
    return maxHSBValue;
}

function applyColorScheme(pitchClass) {
    let noteHue;

    switch (radio_colorScheme.value()) {
        case "linearChromatic":
            noteHue = colorByLinearChromatic(pitchClass);
            break;
        case "circleOfFifths":
            noteHue = colorByCircleOfFifths(pitchClass);
            break;
        case "consonanceOrder":
            noteHue = colorByConsonanceOrder(pitchClass);
            break;
        default:
            noteHue = 0;
    }

    return noteHue;
}