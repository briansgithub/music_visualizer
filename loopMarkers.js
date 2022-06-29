/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="main.js" />

"use strict";

let loopMarkerState = 0;
let loopMark1, loopMark2;

function loopMarker(){
    console.log(loopMarkerState);
    let currentTime = song.currentTime();
    switch(loopMarkerState){
        case 0:
            loopMark1 = currentTime;
            break;

        case 1:
            loopMark2 = currentTime;
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

function drawLoopMarkers(){

    let marker1X = map(loopMark1, 0, song.duration(), 0, width);
    let marker2X = map(loopMark2, 0, song.duration(), 0, width);
    noStroke();
    rectMode(CORNER);
    fill('white');
    rect(marker1X, height / 3, 2, 15);
    rect(marker2X, height / 3, 2, 15);
} 