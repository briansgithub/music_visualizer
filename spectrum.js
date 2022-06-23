/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";
"use strict";

function drawSpectrum() {
    for (let conventionalNoteNum = 1; conventionalNoteNum <= 88; conventionalNoteNum++) { //note will conventionally always assume starting indexing at 1 in this block. 
        let noteFreq = noteToFreq_(conventionalNoteNum); //Math.pow(Math.pow(2, 1 / 12), note - 49) * 440; underscore b/c "noteToFreq" is alrady defined somewhere in backend library code
        /*
        1 semitone = 100 cents ; 50 cents = 1/2 semitone
        2 root 12 divides the octave into 12 semitones. 
        2 root 1200 divides octave into 1200 tones (each semitone is divided into 100 smaller tones, so +/-50 1200-tones is +/-50 cents)
        (2-root-120)^(# of 1200-tones)
        */
        let noteSub50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (conventionalNoteNum - 49) - 50); //Hz
        let notePlus50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (conventionalNoteNum - 49) + 50); //Hz

        let freqVol = globalFFTObj.getEnergy(noteSub50Cents, notePlus50Cents); // get the total energy +/- 50 cents around desired note
        currentSpectrum[conventionalNoteNum - 1] = freqVol;


        let freqVolScaled = freqVol;
        const maxEnergy = 255;
        freqVolScaled = Math.pow(freqVol, slider_exaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.

        const maxExaggeration = Math.pow(255, slider_exaggerationExponent.value());
        let barHeight = map(freqVolScaled, 0, maxExaggeration, 0, height / 2); //exponentially exaggerate differences between bars

        const scaleFactor = Math.pow(slider_barScale.value(),slider_exaggerationExponent.value()); 
        // scale factor increases more with larger exaggeration exponent
        // linearly scale up bar heights by scale factor and exaggerationExponent
        barHeight *= scaleFactor; 
        barHeight = -barHeight;


        colorMode(HSB);

        let pitchClass = conventionalNoteToPitchClass(conventionalNoteNum);
        let relativeInterval = mod(pitchClass - globalKeySigRoot, 12);
        let HSBObj_pitchClass = coloringTable[pitchClass];

        let noteBrightness = map(Math.log2(freqVol), 0, 8, 0, 100); //freqVol ranges from 0 to 255
        
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(relativeInterval)) {
            noteBrightness = 20;
        }

        stroke(color(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, noteBrightness));
        //stroke(strokeColor(note));
        strokeWeight(5);

        const posX = (width / 2 - 20) / 88 * conventionalNoteNum;
        const posY = height - 50;
        line(posX, posY, posX, (height - 50) + barHeight);

        /*--- Draw the note labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        text(numToSymbol(conventionalNoteToPitchClass(conventionalNoteNum)), posX, height - 37);
        /*--- End Draw the note labels ---*/
    }
}