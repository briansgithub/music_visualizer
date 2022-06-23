/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";

function BarObject(pitchClass, amplitude) {
    this.amplitude = amplitude;
    this.pitchClass = pitchClass;
}

function drawCumulativeAmplitudes() {
    let accumulator = new Array(12).fill(0);
    let accumulatorObjs = [];
    for (let note = 1; note <= 88; note++) {
        let pitchClass = conventionalNoteToPitchClass(note);
        accumulator[pitchClass] += currentSpectrum[note - 1];
    }
    let maxCumulativeVolume = max(accumulator);

    if (song.isPlaying()) {
        for (let i = 0; i < accumulator.length; i++) {
            accumulatorObjs.push(new BarObject(i, accumulator[i]));
        }
    }

    const displaySorted = false;
    if (displaySorted) {
        accumulatorObjs.sort(function (a, b) { return b.amplitude - a.amplitude });
    }

    colorMode(HSB);

    for (let i = 0; i < accumulatorObjs.length; i++) {
        let pitchClass = accumulatorObjs[i].pitchClass;
        if (!displaySorted) {
            pitchClass = mod(pitchClass + globalKeySigRoot, 12); //this line actually converts the pitch class to a relative interval
        }

        let amplitude = accumulatorObjs[i].amplitude;

        let HSBObj_pitchClass = coloringTable[pitchClass];

        stroke(color(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, HSBObj_pitchClass.brightness));
        strokeWeight(5);

        let barHeight = map(amplitude, 0, maxCumulativeVolume, 0, height / 2);

        let amplitudeScaled = Math.pow(amplitude, slider_sumBarExaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.

        const maxExaggeration = Math.pow(maxCumulativeVolume, slider_sumBarExaggerationExponent.value());

        barHeight = map(amplitudeScaled, 0, maxExaggeration, 0, height/2);
        barHeight = -barHeight;

        const posX = (width / 2) * (1 + i / 88);
        const posY = height - 50;
        line(posX, posY, posX, (height - 50) + barHeight);


        /*--- Draw Pitch Class labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        let displaySymbol = radio_noteLabelingConvention.value() == 'absolute' ? numToSymbol(pitchClass) : specificIntervalToScaleDegree(mod(pitchClass - globalKeySigRoot, 12));
        text(displaySymbol, posX, height - 37);
        /*--- End Draw Pitch Class labels ---*/
    }
}