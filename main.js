/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="volumeGraph.js" />
/// <reference path="coloring.js" />
/// <reference path="legend.js" />
/// <reference path="spectrum.js" />
/// <reference path="cumulativeAmplitudes.js" />
/// <reference path="beatRecord.js" />
/// <reference path="controls.js" />
/// <reference path="loopMarkers.js" />



//TSDef provides typescript definitions for intellisense (function documentation, autocompletion)
"use strict";

let fromFile = true; 

//-----------------------------------------------------------------------------
let defaultBPM = 88;
let globalKeySigRoot = 3;
function setGlobalKeySigRoot(n){
    globalKeySigRoot = n;
    updateColors();
}
let globalBPM = defaultBPM;

let globalFFTObj;
let globalAmplitudeObj;

let prevKeySig = 0;
let firstBeatDelay;
let bkgrBrightness = 0;
let smoothVal = 0.01; //replaces slider_smoothVal.value() - Number between 0 and 1 for visual damping of spectrum

let beatRecord = []; // log of all the beatRectangle objects

let button_Cb, button_Gb, button_Db, button_Ab, button_Eb, button_Bb, button_F, button_C, button_G, button_D, button_A, button_E, button_B, button_Cs;

let projectFont;

let song;
let songName = "Hikoukigumo.mp3";
let songDuration;

function preload() {
    if (!fromFile) { song = loadSound(songName); }
    // song.reversed = true;
    projectFont = loadFont('Calibri.ttf');
}

let bpmPromptText;
let button_BPMEnter;
let checkbox_beatDetect;
let checkbox_hoverScrub;

let radio_noteLabelingConvention;
let radio_colorScheme;

let volumeSlider = true;
if (volumeSlider) { var slider_Volume; }
//let slider_Speed;
//let slider_Pan;
let slider_smoothVal;

let button_togglePlayback;
let button_restart;
let slider_barScale; // used to linearly scale bars
let slider_exaggerationExponent; //used as a power to make tall bars taller and short bars shorter.

//let slider_sumBarScale; 
let slider_sumBarExaggerationExponent; 

const colorSchemes = ['linearChromatic', 'consonanceOrder', 'circleOfFifths'];
let checkbox_dimAccidentals;

let input_BPM;
function updateBPM() {
    restartSong();
    maxVol = 0;
    globalBPM = input_BPM.value();
    console.log("BPM: " + globalBPM)
}

function restartSong() {
    background(0);
    song.jump(0); //doesn't work when the song is paused
    beatRecord = [];
    amplitudeLog = [];
}

function toggleSong() { song.isPlaying() ? song.pause() : song.play(); }



function loadDefaultSong() {
    song = loadSound(songName, songInit);
    defaultBPM = 88;
    globalKeySigRoot = 3;
}

function songInit() {
    globalFFTObj = new p5.FFT(smoothVal, Math.pow(2, 12));
    globalAmplitudeObj = new p5.Amplitude();
    songDuration = song.duration();
    console.log(song);
    audioIsLoaded = true;
    song.play();

    button_fileInput.remove();
    button_loadDefault.remove();
}

let button_fileInput;
let button_loadDefault;
let audioIsLoaded = false;
//let checkbox_leftHandMode;
function setup() {

    createCanvas(1200, 600);
    background(bkgrBrightness);

    button_fileInput = createFileInput(file => {
        song = loadSound(file.data, _ => {
            songInit();
        });
    });

    button_loadDefault = createButton("Default Song");
    button_loadDefault.mousePressed(loadDefaultSong);
    
    createElement('p');

    button_togglePlayback = createButton("Play/Pause");
    button_togglePlayback.mousePressed(toggleSong);

    button_restart = createButton("Restart Song");
    button_restart.mousePressed(restartSong);
//    checkbox_leftHandMode = createCheckbox('Left-handed Mode');

    createElement('p');
    createA('https://github.com/briansgithub/music_visualizer/blob/main/README.md', 'Instructions in the Readme', '_blank');;

    createElement('h4', 'Amplitude Difference Exaggeration and Linear Scaling sliders:');
    createElement('plaintext', 'Spectrum bars');
    slider_exaggerationExponent = createSlider(0, 12, 6, 0.01);
    slider_barScale = createSlider(0, 4, 1.1, 0.01);
    createElement('p');
    createElement('plaintext', 'Cumulative bars');
    slider_sumBarExaggerationExponent = createSlider(0, 7, 2, 0.01);
//    slider_sumBarScale = createSlider(0, 4, 1, 0.01);

    createElement('h4', 'Enter BPM: ');

    input_BPM = createInput(str(globalBPM));
    input_BPM.changed(updateBPM);

    button_BPMEnter = createButton('Enter');
    button_BPMEnter.mousePressed('updateBPM');

    createElement('h4', 'Select a key signature:');
    //button_Cb = createButton("Cb");
    button_Gb = createButton("Gb");
    button_Db = createButton("Db");
    button_Ab = createButton("Ab");
    button_Eb = createButton("Eb");
    button_Bb = createButton("Bb");
    button_F = createButton("F");
    button_C = createButton("C");
    button_G = createButton("G");
    button_D = createButton("D");
    button_A = createButton("A");
    button_E = createButton("E");
    button_B = createButton("B");
    //button_Cs = createButton("C#");

    //button_Cb.mousePressed(keySig11);
    button_Gb.mousePressed(keySig6);
    button_Db.mousePressed(keySig1);
    button_Ab.mousePressed(keySig8);
    button_Eb.mousePressed(keySig3);
    button_Bb.mousePressed(keySig10);
    button_F.mousePressed(keySig5);
    button_C.mousePressed(keySig0);
    button_G.mousePressed(keySig7);
    button_D.mousePressed(keySig2);
    button_A.mousePressed(keySig9);
    button_E.mousePressed(keySig4);
    button_B.mousePressed(keySig11);
    //button_Cs.mousePressed(keySig1);

    createElement('plaintext', 'Legend Labels:');
    const radioParent_noteLabelingConventions = createDiv();
    radioParent_noteLabelingConventions.id = "radioParent_noteLabelingConventions";
    radio_noteLabelingConvention = createRadio('radioParent_noteLabelingConventions');
    fixRadio(radio_noteLabelingConvention); //can remove this on p5.js versions >v1.4.1
    radio_noteLabelingConvention.option('absolute', 'Note names')
    radio_noteLabelingConvention.option('relative', 'Scale Degrees')
    radio_noteLabelingConvention.selected('relative');

    createElement('h4', 'Color Scheme:');

    checkbox_dimAccidentals = createCheckbox('Dim accidentals', true);
    checkbox_dimAccidentals.changed(updateColors);

    const radioParent_colorSchemes = createDiv();
    radioParent_colorSchemes.id = "radioParent_colorSchemes";
    radio_colorScheme = createRadio('radioParent_colorSchemes');
    fixRadio(radio_colorScheme); //can remove this on p5.js versions >v1.4.1
    radio_colorScheme.option('consonanceOrder', 'Consonance Order');
    radio_colorScheme.option('linearChromatic', 'Linear, chromatic');
    radio_colorScheme.option('circleOfFifths', 'Circle of Fifths');
    radio_colorScheme.selected('consonanceOrder');
    radio_colorScheme.changed(updateColors);

    createElement('h3', 'Experimental:');
    checkbox_hoverScrub = createCheckbox('Hover Scrub (Danger! Will break audio object, use CPU, and require refresh)', false);
    if (volumeSlider) {
        createElement('plaintext', 'Volume (adjust if spectrum bars are clipping):');
        slider_Volume = createSlider(.01, 1, 1, 0.01);
    }

    checkbox_beatDetect = createCheckbox('automatic beat detection (not yet implemented)', false);
    checkbox_beatDetect.changed(toggleBeatDetection);


    //    createElement('h4', 'Smoothing slider (broken): ');
    //    slider_smoothVal = createSlider(0, 1, 0.65, 0.01);     


    //    slider_Speed = createSlider(0, 3, 1, 0.01);

    initColorTable();
    updateColors();

}


function draw() {
    if (audioIsLoaded) {
        background(bkgrBrightness);

        drawLoopMarkers();
        if (loopMarkerState == 2) {
            let currentTimeStamp = song.currentTime();
            if (currentTimeStamp > loopMark2 && currentTimeStamp < loopMark2 + .1) {
                song.jump(loopMark1);
            }
        }

        let spectrum = globalFFTObj.analyze();
        if (volumeSlider) { song.setVolume(slider_Volume.value()); }
        //    song.rate(slider_Speed.value());
        //    song.pan(slider_Pan.value());

        if(checkbox_hoverScrub.checked()){
            hoverScrub();
        }

        if (song.isPlaying()) {
            logSpectrum();
            logCumulativeAmplitudes();
            logBeat(); 
            logVolumePoints();
        }
        drawSpectrum();
        drawCumulativeAmplitudes();
        drawBeats();
        drawLegend();
        drawVolumeGraph();

        hoverText(mouseX, mouseY);

        /* Draw progress bar */
        let tickerX = map(song.currentTime(), 0, song.duration(), 0, width);
        noStroke();
        rectMode(CORNER);
        fill('white');
        rect(tickerX, height / 3, 2, 15);
        /* End draw progress indicator */
    }
}

function hoverScrub() {
    let timestamp = map(mouseX, 0, width, 0, song.duration());
    if (timestamp > 0 && timestamp < song.duration()) {
        song.jump(timestamp);
    }
}

function hoverText(mouseX, mouseY) {
    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].hover(mouseX, mouseY);
    }
    for (let i = 0; i < currentSpectrumBarObjs.length; i++) {
        currentSpectrumBarObjs[i].hover(mouseX, mouseY);
    }
    for (let i = 0; i < accumulatorObjs.length; i++) {
        accumulatorObjs[i].hover(mouseX, mouseY);
    }
    return;
}

//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12
function keySig0() { setGlobalKeySigRoot(0); }//C
function keySig1() { setGlobalKeySigRoot(1); }//C#/Db
function keySig2() { setGlobalKeySigRoot(2); }//D
function keySig3() { setGlobalKeySigRoot(3); }//Eb
function keySig4() { setGlobalKeySigRoot(4); }//E
function keySig5() { setGlobalKeySigRoot(5); }//F
function keySig6() { setGlobalKeySigRoot(6); }//F#/Gb
function keySig7() { setGlobalKeySigRoot(7); }//G
function keySig8() { setGlobalKeySigRoot(8); }//G#/Ab
function keySig9() { setGlobalKeySigRoot(9); }//A
function keySig10() { setGlobalKeySigRoot(10); }//Bb
function keySig11() { setGlobalKeySigRoot(11); }// B/Cb

function toggleBeatDetection() {
    if (checkbox_beatDetect.checked()) {
    } else {
    }
}

function displaySymbol(pitchClass, xPos, yPos, size, color = 'black'){
    textAlign(CENTER,CENTER);
    textSize(size);
    noStroke();
    fill(color);
    let relativeInterval = pitchClassToRelativeInterval(pitchClass);

    if (radio_noteLabelingConvention.value() == 'absolute') {
        textAlign(CENTER, CENTER);
        text(numToSymbol(pitchClass), xPos, yPos);
    }
    else if (radio_noteLabelingConvention.value() == 'relative') {
        const scaleDegree = specificIntervalToScaleDegree(mod(relativeInterval, 12));
        if (scaleDegree) {
            text(scaleDegree, xPos, yPos + .16 * size);
            textAlign(CENTER, BASELINE);
            text('^', xPos, yPos);
        }
    }
}

/*Patch code from:
https://discourse.processing.org/t/calling-selected-value-multiple-times-on-a-radio-button-does-not-change-the-selected-option/35194
*/
function fixRadio(radio) {
    let self = radio;
    self.selected = function (value) {
        let result = null;
        if (value === undefined) {
            for (const option of self._getOptionsArray()) {
                if (option.checked) {
                    result = option;
                    break;
                }
            }
        } else {
            // deselect all first (Google Chrome wigs out when multiple options have the checked attribute set to true)
            self._getOptionsArray().forEach(option => {
                option.checked = false;
                option.removeAttribute("checked");
            });
            for (const option of self._getOptionsArray()) {
                if (option.value === value) {
                    option.setAttribute("checked", true);
                    option.checked = true;
                    result = option;
                    break;
                }
            }
        }
        return result;
    };
}


