/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
"use strict";

function BarObject(pitchClass, magnitude, posX, posY, brightness = 100) {
    this.pitchClass = pitchClass;
    this.magnitude = magnitude;
    this.posX = posX;
    this.posY = posY;
    this.brightness = brightness;
    this.width = 5;

    this.hover = function (mouseX, mouseY) {
        let boxSize = 25;
        let boxCenterX = mouseX;
        let boxCenterY = mouseY - boxSize;
        if ((mouseX >= (this.posX-this.width/2)) && 
            (mouseX <= (this.posX + this.width/2)) && 
            (mouseY >= (this.posY - this.magnitude)) && 
            (mouseY <= posY )) {

            stroke('gray');
            strokeWeight(2);
            fill('white');
            rectMode(CENTER);
            rect(boxCenterX, boxCenterY, boxSize);

            displaySymbol(this.pitchClass, boxCenterX, boxCenterY + .1 * boxSize, 16);
        }
    }

    this.display = function () {
        let pitchClass = this.pitchClass;
        let magnitude = this.magnitude;
        let posX = this.posX;
        let posY = this.posY;
        let brightness = this.brightness;

        let HSBObj_pitchClass = coloringTable[pitchClass];

        colorMode(HSB);
        stroke(color(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, brightness));
        strokeWeight(this.width);
        line(posX, posY, posX, posY - magnitude);
    }
}