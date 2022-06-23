/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";


let prevBeatNo = 0;
let beatNo = 0;

/* Beat rectangle constructor */
function BeatRectangle(beatNo, loudestPitchClass, timestamp) {
    this.beatNo = beatNo;
    this.x1Position = map(timestamp, 0, song.buffer.duration, 0, width);
    this.y1Position = 7;
    this.width = width / (songDuration / (60 / globalBPM));
    this.height = height / 3 - 7;
    this.loudestPitchClass = loudestPitchClass;
    this.timestamp = timestamp;
    this.clicked = function () {
        if ((mouseX >= this.x1Position) && (mouseX <= this.x1Position + this.width)
            && (mouseY >= this.y1Position) && (mouseY <= this.y1Position + this.height)) {
            song.jump(this.timestamp);
        }
    }


    this.displayBeat = function () {
        noStroke();
        colorMode(HSB);

        let HSBObj_pitchClass = coloringTable[this.loudestPitchClass];
        fill(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, HSBObj_pitchClass.brightness);

        rect(this.x1Position, this.y1Position, this.width, this.height);
    }
}

function logBeat() {
    let currentTime = song.currentTime();
    beatNo = Math.trunc(currentTime / (60 / globalBPM));

    if (beatNo != prevBeatNo && //prevents an initial box when song not playing and a residual box when song restarted. 
        !beatRecord.some(BeatRectangle => BeatRectangle.beatNo === beatNo)) {//check if object doesn't already exist in array

        let spectrumMax = max(currentSpectrum); //loudest volume at this istant
        let loudestPitchClass;
        for (let i = 0; i <= 87; i++) {
            if (currentSpectrum[i] == spectrumMax) {
                loudestPitchClass = conventionalNoteToPitchClass(i + 1);
                break;
            }
        }

        beatRecord.splice(beatNo, 0, new BeatRectangle(beatNo, loudestPitchClass, currentTime));
    }

    prevBeatNo = beatNo;
}

function drawBeats() {
    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].displayBeat();
    }
}
