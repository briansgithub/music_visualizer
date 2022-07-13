/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversions_constants_helper_funcs.js" />
/// <reference path="main.js" />

"use strict";

let loopMarkerState = 0;
let loopMark1 = -1;
let loopMark2 = -1;

function loopMarker(){
    console.log(loopMarkerState);
    let currentTimestamp = song.currentTime();
    switch(loopMarkerState){
        case 0:
            loopMark1 = currentTimestamp;
            break;

        case 1:
            loopMark2 = currentTimestamp;
            if(loopMark2 < loopMark1){
                let tmp = loopMark1;
                loopMark1 = loopMark2;
                loopMark2 = tmp;
            }
            break;
        case 2:
            loopMark1 = -1;
            loopMark2 = -1;
            break;
        default:
            break;
    }
    
    loopMarkerState = mod(++loopMarkerState, 3);
    
}

function drawLoopMarkers() {
    let marker1X = map(loopMark1, 0, song.duration(), 0, width);
    let marker2X = map(loopMark2, 0, song.duration(), 0, width);
    noStroke();
    rectMode(CORNER);
    fill('white');
    if (loopMark1 > 0) {
        rect(marker1X, height / 3, 2, 15);
    }
    if (loopMark2 > 0) {
        rect(marker2X, height / 3, 2, 15);
    }
} 