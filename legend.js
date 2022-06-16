/// <reference path="./lib/p5.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="coloring.js" />
"use strict";
"use strict";

let swatchesArray = [];
let colorLegend = [];
function ColorSwatch(xPosition, initKeySig) {
    this.xPosition = xPosition;
    this.keySig = initKeySig;

    this.updateLegendColors = function(){

    }
}

function drawLegend() {
    colorMode(HSB);

    stroke('black');
    strokeWeight(2);
    fill('white');
    const legendXPos = width / 6;
    const legendYPos = (19 / 20) * height;
    const legendWidth = width / 6;
    const legendHeight = height / 20;
    rectMode(CORNER);
    let legendBackground = rect(legendXPos, legendYPos, legendWidth, legendHeight);

    /*----- Draw Key Signature Label -----*/
    const keySigXPos = legendXPos - legendHeight;
    rect(keySigXPos, legendYPos, legendHeight); 
    textSize(.5 * legendHeight);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    fill('black');
    text(rootToKeySigSymbol(globalKeySigRoot), keySigXPos + legendHeight / 2, legendYPos + legendHeight / 2); 
    /*----- End Draw Key Signature Label -----*/

    stroke('black');
    strokeWeight(1);

    let swatchSize = legendHeight / 3;
    textSize(swatchSize - .5);
    let numTones = 12;
    for (let i = 0; i < numTones; i++) {
        let swatchXPos = legendXPos + i * legendWidth / (numTones) + legendWidth / (numTones * 2);
        let swatchYPos = legendYPos + (2 / 3) * legendHeight;

        let noteHue = applyColorScheme(i);
        let noteSaturation = 100;
        let noteBrightness = 100;
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(i)) {
            noteSaturation = 0;
            noteBrightness = 25;
        }

        fill(noteHue, noteSaturation, noteBrightness, alpha);
        rectMode(CENTER);
        rect(swatchXPos, swatchYPos, swatchSize);

        fill('black');
        textAlign(CENTER, CENTER);
        const textHeight = swatchYPos - 1.25 * swatchSize;

        if (radio_noteLabelingConvention.value() == 'absolute') {
            text(numToSymbol(mod(i + globalKeySigRoot, 12)), swatchXPos, textHeight);
        }
        else if (radio_noteLabelingConvention.value() == 'relative') {
            const scaleDegree = specificIntervalToScaleDegree(mod(i, 12));
            if (scaleDegree) {
                text(scaleDegree, swatchXPos, textHeight + 1.5);
                textAlign(CENTER, BASELINE);
                text('^', swatchXPos, textHeight);
            }
        }

    }
    rectMode(CORNER);

}