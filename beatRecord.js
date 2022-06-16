/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";


let prevBeatNo = 0;
let beatNo = 0;
let beatRecord = []; // log of all the beatRectangle objects

/* Beat rectangle constructor */
function BeatRectangle(xPosition, loudestPitchClass) {
    this.xPosition = xPosition;
    this.loudestPitchClass = loudestPitchClass;

    this.displayBeat = function () {
        let specificInterval = mod(this.loudestPitchClass - globalKeySigRoot, 12) //no +kbShift because "loudestPitchClass" normalized for C = 0
        colorMode(HSB);
        noStroke();

        let updatedColorHue = applyColorScheme(specificInterval); //marker
        let noteSaturation = 100;
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(specificInterval)) {
            noteSaturation = 0;
            alpha = .15;
        }
        fill(updatedColorHue, noteSaturation, 100, alpha);
        rect(this.xPosition, 7, width / (songDuration / (60 / globalBPM)), height / 3 - 7);
    }
}

function logBeat() {
    beatNo = Math.trunc(song.currentTime() / (60 / globalBPM));
    let songXPos = map(song.currentTime(), 0, song.buffer.duration, 0, width);

    let spectrumMax = max(currentSpectrum); //loudest volume at this istant
    let loudestPitchClass;
    for (let i = 0; i <= 87; i++) {
        if (currentSpectrum[i] == spectrumMax) {
            loudestPitchClass = conventionalNoteToPitchClass(i + 1);
            break;
        }
    }
    if (beatNo != prevBeatNo) {
        beatRecord.push(new BeatRectangle(songXPos, loudestPitchClass));
    }
    prevBeatNo = beatNo;
}

function drawBeats() {
    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].displayBeat();
    }
}
