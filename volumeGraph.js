/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversions_constants_helper_funcs.js" />
/// <reference path="coloring.js" />
"use strict";

let maxVol = 0;
let amplitudeLog = [];
let prevPixel = 0;
let currentPixel = 0;

function logVolumePoints() {
    var vol = globalAmplitudeObj.getLevel();
    if (volumeSlider) { vol /= slider_Volume.value() };
    //only log an amplitudeLog entry when the current time/total time has crossed a pixel boundary.
    let currentPixel = floor(width * (song.currentTime() / song.duration()));
    amplitudeLog[currentPixel] = vol;
    //mitigate against volume spikes due to sudden volume slider changes.
    //by checking previous pixel instead of continuously updating maxVol to the rolling all-time maximum.
    if (amplitudeLog[currentPixel - 1] > maxVol) {
        maxVol = amplitudeLog[currentPixel - 1];
    }
}

function drawVolumeGraph() {

    let baselineY = height / 3;
    //horizontal line
    stroke('white');
    strokeWeight(2);
    line(0, baselineY, width, baselineY)

    /*volume graph*/
    noFill();
    stroke('black');
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < amplitudeLog.length; i++) {
        let pointY = map(amplitudeLog[i], 0, maxVol, baselineY, 0); //display 2/3 of the way up the screen

        vertex(i, pointY);

        //        bkgrBrightness = map(amplitudeLog[i], 0, 1, 0, 50);
        //        bkgrBrightness = Math.round(bkgrBrightness);
    }
    endShape();

}