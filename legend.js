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
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    fill('black');
    text(rootToKeySigSymbol(globalKeySigRoot), keySigXPos + legendHeight / 2, legendYPos + legendHeight / 2); 
    /*----- End Draw Key Signature Label -----*/

    stroke('black');
    strokeWeight(1);

    let swatchSize = legendHeight / 3;
    textSize(swatchSize - .5);
    let numTones = 12;
    for (let relativeInterval = 0; relativeInterval < numTones; relativeInterval++) {

        let pitchClass = mod(relativeInterval + globalKeySigRoot, 12);
        let HSBObj_pitchClass = coloringTable[pitchClass];
        fill(HSBObj_pitchClass.hue, HSBObj_pitchClass.saturation, HSBObj_pitchClass.brightness);

        let swatchXPos = legendXPos + relativeInterval * legendWidth / (numTones) + legendWidth / (numTones * 2);
        let swatchYPos = legendYPos + (2 / 3) * legendHeight;

        rectMode(CENTER);
        rect(swatchXPos, swatchYPos, swatchSize);

        fill('black');
        textAlign(CENTER, CENTER);
        const textY = swatchYPos - 1.25 * swatchSize;

        if (radio_noteLabelingConvention.value() == 'absolute') {
            text(numToSymbol(pitchClass), swatchXPos, textY);
        }
        else if (radio_noteLabelingConvention.value() == 'relative') {
            const scaleDegree = specificIntervalToScaleDegree(mod(relativeInterval, 12));
            if (scaleDegree) {
                text(scaleDegree, swatchXPos, textY + 1.5);
                textAlign(CENTER, BASELINE);
                text('^', swatchXPos, textY);
            }
        }

    }
    rectMode(CORNER);

}