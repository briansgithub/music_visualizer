/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";

function drawVolumeGraph() {
    /*--------------------- DRAW AMPLITUDE GRAPH ------------------------*/
    var vol = globalAmplitudeObj.getLevel();
    let currentPixel = floor(width *(song.currentTime()/song.duration()));
    //only log an amplitudeLog entry when the current time/total time has crossed a pixel boundary.
    if (song.isPlaying() && currentPixel >= amplitudeLog.length + 1) {
        amplitudeLog.push(vol);
    }
/*
    fill('white');
    textSize(32);
    text(amplitudeLog[amplitudeLog.length-1], width/2, height/2);
*/
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
        let pointY = map(amplitudeLog[i], 0, max(amplitudeLog), baselineY, 0); //display 2/3 of the way up the screen

        vertex(i, pointY);

        //        bkgrBrightness = map(amplitudeLog[i], 0, 1, 0, 50);
        //        bkgrBrightness = Math.round(bkgrBrightness);
    }
    endShape();

}