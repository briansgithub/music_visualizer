/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";

function drawVolumeGraph() {
    /*--------------------- DRAW AMPLITUDE GRAPH ------------------------*/
    var vol = globalAmplitudeObj.getLevel();
    if (song.isPlaying()) {
        amplitudeLog.push(vol);
    }
    //fill('white');
    noFill();
    stroke('white');
    strokeWeight(2);
    line(0, height / 3, width, height / 3)

    strokeWeight(1);
    beginShape();
    for (let i = 0; i < amplitudeLog.length; i++) {
        var pointHeight = map(amplitudeLog[i], 0, 1, 0, 3 * height / 3); //display 2/3 of the way up the screen
        pointHeight = -pointHeight;
        pointHeight += height / 3;
        vertex(i, pointHeight);

        //        bkgrBrightness = map(amplitudeLog[i], 0, 1, 0, 50);
        //        bkgrBrightness = Math.round(bkgrBrightness);
    }
    endShape();

    if (amplitudeLog.length > width) {
        amplitudeLog.splice(0, 1);
    }

}