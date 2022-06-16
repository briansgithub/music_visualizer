/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";

/*----- Draw cumulative amplitude by pitch class bars ----- */
function drawCumulativeAmplitudes(){
    /* ----- Sum amplitudes of same pitch classes*/
    let pitchClassVolumes = new Array(12).fill(0);

    for (let i = 0; i <= 87; i++) {
        pitchClassVolumes[conventionalNoteToPitchClass(i + 1)] += currentSpectrum[i];
    }

    let maxCumulativeVolume = max(pitchClassVolumes);

    colorMode(HSB);

    for (let pitchClass = 0; pitchClass < pitchClassVolumes.length; pitchClass++) {
        let pitchClassHue = applyColorScheme(pitchClass);
        let pitchClassSaturation = 100;
        let pitchClassBrightness = 100
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(pitchClass)) {
            pitchClassSaturation = 0;
            alpha = .15;
        }

        let barHeight = map(pitchClassVolumes[pitchClass], 0, maxCumulativeVolume, 0, height / 2);
        barHeight = -barHeight;

        stroke(color(pitchClassHue, pitchClassSaturation, pitchClassBrightness, alpha));
        strokeWeight(5);
        line((width / 2) * (1 + pitchClass / 88), height - 50, (width / 2) * (1 + pitchClass / 88), (height - 50) + barHeight);


        /*--- Draw Pitch Class labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        text(numToSymbol(pitchClass), (width / 2) * (1 + pitchClass / 88), height - 37);
        /*--- End Draw Pitch Class labels ---*/
    }
}