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

    this.hover = function (mouseX, mouseY) {
        let boxCenterX = mouseX;
        let boxCenterY = moouseY;
        let boxSize = 25;
        if ((mouseX >= this.posX) && (mouseX <= this.posX + this.width)
            && (mouseY >= this.posY) && (mouseY <= this.posY + this.height)) {

            stroke('gray');
            strokeWeight(2);
            fill('white');
            rectMode(CENTER);
            rect(boxCenterX, boxCenterY, boxSize);

            displaySymbol(this.loudestPitchClass, boxCenterX, boxCenterY + .1 * boxSize, 16);
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
        strokeWeight(5);
        line(posX, posY, posX, (height - 50) - magnitude);
    }
}