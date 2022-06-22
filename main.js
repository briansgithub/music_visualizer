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


//TSDef provides typescript definitions for intellisense (function documentation, autocompletion)
"use strict";


//-----------------------------------------------------------------------------
let defaultBPM = 190;
let globalKeySigRoot = 4;
let globalBPM = defaultBPM;

let globalFFTObj;
let globalAmplitudeObj;

let prevKeySig = 0;
let firstBeatDelay;
let bkgrBrightness = 0;
let smoothVal = 0.01; //replaces slider_smoothVal.value() - Number between 0 and 1 for visual damping of spectrum

let currentSpectrum = []; //88 notes with freq values of notes being played right now.
let amplitudeLog = [];
let beatRecord = []; // log of all the beatRectangle objects

let button_Cb, button_Gb, button_Db, button_Ab, button_Eb, button_Bb, button_F, button_C, button_G, button_D, button_A, button_E, button_B, button_Cs;

let projectFont;




function preload() {
    //song = loadSound(songName);
    // song.reversed = true;
    projectFont = loadFont('Calibri.ttf');
}

let bpmPromptText;
let button_BPMEnter;
let checkbox_beatDetect;

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

let checkbox_dimAccidentals;

let input_BPM;
function updateBPM() {
    restartSong();
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

let song;
let songName = "@angelDream.mp3";
let songDuration;

function loadDefaultSong(){
    song = loadSound(songName);
    defaultBPM = 190;
    globalKeySigRoot = 4;
}

let button_loadDefault;
let audioIsLoaded = false;
function setup() {

   /* Load sound from file */
    createFileInput(file => {
        song = loadSound(file.data, _ => {
            globalFFTObj = new p5.FFT(smoothVal, Math.pow(2, 12));
            globalAmplitudeObj = new p5.Amplitude();
            songDuration = song.duration();
            console.log(song);
            audioIsLoaded = true;
        });
    });

    /*
    button_loadDefault = createButton("Load default song");
    button_loadDefault.mousePressed(loadDefaultSong);
    */

    createCanvas(1200, 600);
    background(bkgrBrightness);

    createElement('p');

    button_togglePlayback = createButton("play/pause");
    button_togglePlayback.mousePressed(toggleSong);

    button_restart = createButton("restart song");
    button_restart.mousePressed(restartSong);
    createElement('p');
    createA('https://github.com/briansgithub/music_visualizer/blob/main/README.md', 'Instructions in the Readme', '_blank');;

    createElement('h4', 'Amplitude Difference Exaggeration and Linear Scaling sliders:');
    slider_exaggerationExponent = createSlider(0, 7, 6, 0.01);
    slider_barScale = createSlider(0, 4, 1, 0.01);

    createElement('h4', 'Enter BPM: ');
    checkbox_beatDetect = createCheckbox('automatic beat detection (not yet implemented)', false);
    checkbox_beatDetect.changed(toggleBeatDetection);

    input_BPM = createInput(globalBPM);
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
    radio_noteLabelingConvention.option('absolute', 'Note names')
    radio_noteLabelingConvention.option('relative', 'Scale Degrees')
    radio_noteLabelingConvention.selected('relative');

    createElement('h4', 'Color Scheme:');
    const radioParent_colorSchemes = createDiv();
    radioParent_colorSchemes.id = "radioParent_colorSchemes";
    radio_colorScheme = createRadio('radioParent_colorSchemes');
    radio_colorScheme.option('linearChromatic', 'Linear, chromatic');
    radio_colorScheme.option('consonanceOrder', 'Consonance order');
    radio_colorScheme.option('circleOfFifths', 'Circle of 5ths (not implemented)');
    radio_colorScheme.selected('consonanceOrder');
    checkbox_dimAccidentals = createCheckbox('Dim accidentals', true);

    //    createElement('h4', 'Smoothing slider (broken): ');
    //    slider_smoothVal = createSlider(0, 1, 0.65, 0.01);     

    if (volumeSlider) { slider_Volume = createSlider(0, 2, 1, 0.01); }
    //    slider_Speed = createSlider(0, 3, 1, 0.01);



}


function draw() {
    if (audioIsLoaded) {
        if (song.isPlaying()) {
            background(bkgrBrightness);
        }
        let spectrum = globalFFTObj.analyze();
        if (volumeSlider) { song.setVolume(slider_Volume.value()); }
        //    song.rate(slider_Speed.value());
        //    song.pan(slider_Pan.value());

        drawLegend();
        drawSpectrum();
        drawCumulativeAmplitudes();
        logBeat();
        drawBeats();
        drawVolumeGraph();
    }
}

//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12
function keySig0() { globalKeySigRoot = 0; }//C
function keySig1() { globalKeySigRoot = 1; }//C#/Db
function keySig2() { globalKeySigRoot = 2; }//D
function keySig3() { globalKeySigRoot = 3; }//Eb
function keySig4() { globalKeySigRoot = 4; }//E
function keySig5() { globalKeySigRoot = 5; }//F
function keySig6() { globalKeySigRoot = 6; }//F#/Gb
function keySig7() { globalKeySigRoot = 7; }//G
function keySig8() { globalKeySigRoot = 8; }//G#/Ab
function keySig9() { globalKeySigRoot = 9; }//A
function keySig10() { globalKeySigRoot = 10; }//Bb
function keySig11() { globalKeySigRoot = 11; }// B/Cb

function toggleBeatDetection() {
    if (checkbox_beatDetect.checked()) {
    } else {
    }
}

