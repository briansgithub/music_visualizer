/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
/// <reference path="barObject.js" />
"use strict";

//stores BarObjectsi indexed by relative interval
let accumulatorObjs = [];

function logCumulativeAmplitudes() {
    let accumulator = new Array(12).fill(0);
    for (let conventionalNote = 1; conventionalNote <= 88; conventionalNote++) {
        let pitchClass = conventionalNoteToPitchClass(conventionalNote);
        accumulator[pitchClass] += currentSpectrum[conventionalNote - 1];
    }
    let maxCumulativeVolume = max(accumulator);

    //accumulator indexed by pitch class, 0-12 C-B
    for (let i = 0; i < accumulator.length; i++) {

        //apply amplitude scale bar
        let amplitude = accumulator[i];
        let barHeight = map(amplitude, 0, maxCumulativeVolume, 0, height / 2);
        let amplitudeScaled = Math.pow(amplitude, slider_sumBarExaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.
        const maxExaggeration = Math.pow(maxCumulativeVolume, slider_sumBarExaggerationExponent.value());
        barHeight = map(amplitudeScaled, 0, maxExaggeration, 0, height / 2);

        let relativeInterval = pitchClassToRelativeInterval(i);
        let brightness = 100;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(relativeInterval)) {
            brightness = 20;
        }

        const posX = (width / 2) * (1 + relativeInterval / 88);
        const posY = height - 50;

        accumulatorObjs[relativeInterval] = new BarObject(i, barHeight, posX, posY, brightness);
    }
}

function drawCumulativeAmplitudes() {
    const displaySorted = false;
    if (displaySorted) {
        accumulatorObjs.sort(function (a, b) { return b.magnitude - a.magnitude });
    } 

    for (let i = 0; i < accumulatorObjs.length; i++) {
        accumulatorObjs[i].display();

        /*--- Draw Pitch Class labels ---*/
        textFont(projectFont);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        let pitchClass = accumulatorObjs[i].pitchClass;
        let displaySymbol = radio_noteLabelingConvention.value() == 'absolute' ? numToSymbol(pitchClass) : specificIntervalToScaleDegree(mod(pitchClass - globalKeySigRoot, 12));
        text(displaySymbol, accumulatorObjs[i].posX, height - 37);
        /*--- End Draw Pitch Class labels ---*/
    }
}
