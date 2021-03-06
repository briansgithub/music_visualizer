/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversions_constants_helper_funcs.js" />
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
        if ((mouseX >= (this.posX - (this.width + 1) / 2)) &&
            (mouseX <= (this.posX + (this.width + 1) / 2)) &&
            (mouseY <= posY) &&
            (mouseY >= (this.posY - this.magnitude)) &&
            ((this.posY - this.magnitude) >= height / 3)
        ) { 

            stroke('gray');
            strokeWeight(2);
            fill('white');
            rectMode(CENTER);
            rect(boxCenterX, boxCenterY, boxSize);

            displaySymbol(this.pitchClass, boxCenterX, boxCenterY, 16);
        }
    }

    this.clicked = function () {
        if ((mouseX >= (this.posX-(this.width+1)/2)) && 
            (mouseX <= (this.posX + (this.width+1)/2)) && 
            (mouseY >= (this.posY - this.magnitude)) && 
            (mouseY <= posY )) {
            setGlobalKeySigRoot(this.pitchClass);
        }
    }

    this.display = function () {
        let pitchClass = this.pitchClass;
        let magnitude = this.magnitude;
        let posX = this.posX;
        let posY = this.posY;
        let brightness = this.brightness;

        let HSBObj_pitchClass = coloringTable[pitchClass];
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(pitchClassToRelativeInterval(pitchClass))) {
            brightness = 20;
        }

        colorMode(HSB);
        stroke(color(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, brightness));
        strokeWeight(this.width);
        line(posX, posY, posX, posY - magnitude);
    }
}